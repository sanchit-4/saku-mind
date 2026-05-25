const fs = require('fs');

console.log('Loading full_figma.json...');
const data = JSON.parse(fs.readFileSync('full_figma.json', 'utf8'));
console.log('Loaded.');

// We want to dump the details of these specific frames:
const pageTargets = {
  'what_we_do': '7823:693',
  'about_us': '7621:20766',
  'saku_blog': '7621:20905',
  'saku_ahead': '7985:13090',
  'login': '7623:21169'
};

let output = '';

function getFills(fills) {
  if (!fills || fills.length === 0) return 'none';
  return fills.map(f => {
    if (f.type === 'SOLID' && f.color) {
      return `SOLID rgb(${Math.round(f.color.r*255)}, ${Math.round(f.color.g*255)}, ${Math.round(f.color.b*255)})`;
    }
    if (f.type === 'IMAGE') return `IMAGE`;
    return f.type;
  }).join(', ');
}

function dumpNode(node, depth = 0) {
  const indent = '  '.repeat(depth);
  let line = `${indent}- Name: "${node.name}" | Type: ${node.type} | ID: ${node.id}`;
  if (node.absoluteBoundingBox) {
    const b = node.absoluteBoundingBox;
    line += ` | Box: [x:${Math.round(b.x)}, y:${Math.round(b.y)}, w:${Math.round(b.width)}, h:${Math.round(b.height)}]`;
  }
  if (node.type === 'TEXT') {
    line += ` | Text: "${node.characters.replace(/\n/g, '\\n')}"`;
    if (node.style) {
      line += ` | Font: ${node.style.fontFamily} ${node.style.fontWeight} ${node.style.fontSize}px`;
    }
  }
  if (node.fills) {
    line += ` | Fills: ${getFills(node.fills)}`;
  }
  output += line + '\n';
  
  if (node.children) {
    node.children.forEach(child => dumpNode(child, depth + 1));
  }
}

// Find canvases
data.document.children.forEach(canvas => {
  canvas.children?.forEach(child => {
    Object.entries(pageTargets).forEach(([pageName, targetId]) => {
      if (child.id === targetId) {
        output += `\n======================================================================\n`;
        output += `PAGE: ${pageName.toUpperCase()} | ID: ${child.id} | Canvas: ${canvas.name}\n`;
        output += `======================================================================\n`;
        dumpNode(child);
      }
    });
  });
});

fs.writeFileSync('all_pages_structure.txt', output);
console.log('Saved all_pages_structure.txt');
