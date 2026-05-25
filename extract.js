const fs = require('fs');

function extract() {
  const data = JSON.parse(fs.readFileSync('full_figma.json', 'utf8'));
  let markdown = '# Figma Design Summary\n\n';

  function traverse(node, depth) {
    if (!node) return;
    
    // Skip very deeply nested invisible layers if needed, but let's keep it simple
    if (node.visible === false) return;
    
    const indent = '  '.repeat(depth);
    markdown += `${indent}- **${node.name}** (${node.type})\n`;
    
    if (node.type === 'TEXT') {
      const text = node.characters.replace(/\n/g, '\\n').substring(0, 100);
      markdown += `${indent}  - Text: "${text}${node.characters.length > 100 ? '...' : ''}"\n`;
      if (node.style) {
        markdown += `${indent}  - Font: ${node.style.fontFamily} ${node.style.fontWeight} ${node.style.fontSize}px\n`;
      }
    }
    
    if (node.fills && node.fills.length > 0) {
      const solidFills = node.fills.filter(f => f.type === 'SOLID' && f.visible !== false);
      if (solidFills.length > 0) {
        const f = solidFills[0].color;
        if (f) {
           markdown += `${indent}  - Fill: rgba(${Math.round(f.r*255)}, ${Math.round(f.g*255)}, ${Math.round(f.b*255)}, ${f.a})\n`;
        }
      }
    }
    
    if (node.absoluteBoundingBox) {
      const b = node.absoluteBoundingBox;
      markdown += `${indent}  - Box: [${Math.round(b.x)}, ${Math.round(b.y)}, ${Math.round(b.width)}x${Math.round(b.height)}]\n`;
    }

    if (node.children) {
      node.children.forEach(child => traverse(child, depth + 1));
    }
  }

  traverse(data.document, 0);
  fs.writeFileSync('figma_summary.md', markdown);
  console.log('Saved figma_summary.md');
}

extract();
