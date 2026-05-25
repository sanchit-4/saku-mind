const fs = require('fs');

async function fetchFigma() {
  const token = process.env.FIGMA_API;
  const fileKey = 'juj0O3xpivEOuwUo4TEdi5';
  
  try {
    const res = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: { 'X-Figma-Token': token }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    fs.writeFileSync('full_figma.json', JSON.stringify(data, null, 2));
    console.log('Saved full_figma.json');
  } catch (e) {
    console.error('Error fetching Figma:', e);
  }
}

fetchFigma();
