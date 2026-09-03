const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf-8');

code = code.replace(
  /\\`/g,
  "\`"
);
fs.writeFileSync('src/components/AdminView.tsx', code);
