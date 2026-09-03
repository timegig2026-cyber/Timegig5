const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsView.tsx', 'utf-8');

// The main return
code = code.replace(/  return \(\n    <div id="settings-view-container"/, "  return (\n    <>\n    <div id=\"settings-view-container\"");

// At the end
code = code.replace(/      <\/div>\n    <\/div>\n    <\/div>\n  \);\n};\n?$/, "      </div>\n    </div>\n    </>\n  );\n};\n");
fs.writeFileSync('src/components/SettingsView.tsx', code);
console.log("fixed wrapper 2");
