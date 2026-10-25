import fs from 'fs';

const pool = JSON.parse(fs.readFileSync('src/data/social/booksPool.json', 'utf8'));
const blacklist = [
  'küçük kara balık',
  'fareler ve insanlar',
  'bilim öyküleri',
  'simyacı',
  'uçan sınıf',
  'kürk mantolu madonna',
  'mo\'nun gizemi',
  'denemeler',
  'momo',
  'dava',
  'bu ülke',
  'sol ayağım',
  'bulantı',
  'satranç',
  'gece yarısı kütüphanesi'
];

function normalize(s) {
  return (s || '')
    .toLowerCase()
    .replace(/['’"`]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .trim();
}

const found = [];
for (const b of [...pool.ortaokul, ...pool.lise]) {
  const normTitle = normalize(b.title);
  for (const bl of blacklist) {
    const normBl = normalize(bl);
    if (normTitle === normBl || normTitle.includes(normBl)) {
      found.push({ level: b.level, id: b.id, title: b.title, matched: bl });
    }
  }
}

console.log('Ortaokul count:', pool.ortaokul.length);
console.log('Lise count:', pool.lise.length);
console.log('Blacklist matches found:', found.length, found);
