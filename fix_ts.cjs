const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsView.tsx', 'utf-8');

code = code.replace(/Array\.from\(e\.target\.files\)/g, "Array.from(e.target.files as FileList)");

fs.writeFileSync('src/components/SettingsView.tsx', code);
console.log("fixed ts");
