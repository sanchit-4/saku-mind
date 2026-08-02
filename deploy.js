const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  host: '87.106.74.147',
  port: 22,
  username: 'root',
  password: 'Pq2on8zK7a4dghV',
  readyTimeout: 30000,
};

const DIST_DIR = path.join(__dirname, 'frontend', 'dist');
const REMOTE_DIR = '/var/www/saku-mind';

// ── helpers ──────────────────────────────────────────────────────
function runRemote(conn, cmd) {
  return new Promise((resolve, reject) => {
    let out = '';
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      stream
        .on('data', d => { out += d; process.stdout.write(d.toString()); })
        .stderr.on('data', d => { out += d; process.stderr.write(d.toString()); });
      stream.on('close', (code) => {
        if (code !== 0) return reject(new Error(`Command "${cmd}" exited with code ${code}`));
        resolve(out);
      });
    });
  });
}

function uploadDir(sftp, localDir, remoteDir) {
  return new Promise(async (resolve, reject) => {
    try {
      // Create remote dir
      await new Promise((res, rej) => sftp.mkdir(remoteDir, err => {
        if (err && err.code !== 4) rej(err); else res();
      }));

      const entries = fs.readdirSync(localDir, { withFileTypes: true });
      for (const entry of entries) {
        const localPath = path.join(localDir, entry.name);
        const remotePath = `${remoteDir}/${entry.name}`;
        if (entry.isDirectory()) {
          await uploadDir(sftp, localPath, remotePath);
        } else {
          await new Promise((res, rej) => {
            console.log(`  uploading ${remotePath}`);
            sftp.fastPut(localPath, remotePath, err => err ? rej(err) : res());
          });
        }
      }
      resolve();
    } catch (e) { reject(e); }
  });
}

// ── main ─────────────────────────────────────────────────────────
async function deploy() {
  const conn = new Client();

  await new Promise((resolve, reject) => {
    conn.on('ready', resolve).on('error', reject).connect(CONFIG);
  });

  console.log('\n✅ SSH connected\n');

  // 1. Install & configure nginx
  console.log('📦 Installing nginx...');
  await runRemote(conn, 'apt-get update -y');
  await runRemote(conn, 'apt-get install -y nginx');
  await runRemote(conn, 'systemctl enable nginx');
  await runRemote(conn, 'systemctl start nginx');

  // 2. Create web root
  console.log('\n📁 Creating web root...');
  await runRemote(conn, `rm -rf ${REMOTE_DIR} && mkdir -p ${REMOTE_DIR}`);

  // 3. Upload dist/
  console.log('\n⬆️  Uploading dist/ ...');
  const sftp = await new Promise((res, rej) => conn.sftp((err, s) => err ? rej(err) : res(s)));
  await uploadDir(sftp, DIST_DIR, REMOTE_DIR);
  sftp.end();

  // 4. Clean up any previous sakumind configs
  console.log('\n🧹 Cleaning up old nginx configs...');
  await runRemote(conn, 'rm -f /etc/nginx/sites-enabled/sakumind /etc/nginx/sites-available/sakumind');

  // 5. Test & reload nginx
  console.log('\n🔄 Testing & reloading nginx...');
  await runRemote(conn, 'nginx -t');
  await runRemote(conn, 'systemctl reload nginx');

  // 6. Set permissions
  await runRemote(conn, `chmod -R 755 ${REMOTE_DIR}`);
  await runRemote(conn, `chown -R www-data:www-data ${REMOTE_DIR}`);

  conn.end();

  console.log('\n🚀 Deployment complete!');
  console.log(`   → http://87.106.74.147`);
}

deploy().catch(err => {
  console.error('\n❌ Deployment failed:', err.message);
  process.exit(1);
});
