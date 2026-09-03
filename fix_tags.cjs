const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsView.tsx', 'utf-8');

// The main div is missing a closing tag, and the inner div is missing one too.
// Let's insert them right before "{/* Full screen Profile Editor */}"
const target = "{/* Full screen Profile Editor */}";
code = code.replace(target, "      </div>\n    </div>\n\n      " + target);

fs.writeFileSync('src/components/SettingsView.tsx', code);
console.log("fixed tags");
