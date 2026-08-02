import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB22FJDnxyDzpEpH3Dkhjv5ucF6PWcVRw8',
  authDomain: 'sakumind-85706.firebaseapp.com',
  projectId: 'sakumind-85706',
  storageBucket: 'sakumind-85706.appspot.com',
  messagingSenderId: '681478928936',
  appId: '1:681478928936:web:3fb59f48b8756d3d4e931d'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
  const snapshot = await getDocs(collection(db, 'activitiestwo'));
  console.log(`\nTotal activities: ${snapshot.size}\n`);
  console.log('ID | Title | Category (raw)');
  console.log('-'.repeat(80));
  snapshot.docs.forEach(doc => {
    const d = doc.data();
    console.log(`${doc.id} | ${d.title || '(no title)'} | ${JSON.stringify(d.category)}`);
  });
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
