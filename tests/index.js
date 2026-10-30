// `node --test tests/` runs this file (Node 22 runs a folder's index.js), and it runs every *.test.js here.
// Older Node finds the *.test.js files in the folder by itself and does not run this one.
const fs = require('fs');
const path = require('path');

for (const f of fs.readdirSync(__dirname).filter((x) => x.endsWith('.test.js')).sort()) require(path.join(__dirname, f));
