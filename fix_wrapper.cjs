const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsView.tsx', 'utf-8');

// Remove the `      </div>\n    </div>\n\n      ` we added
code = code.replace("      </div>\n    </div>\n\n      {/* Full screen Profile Editor */}", "{/* Full screen Profile Editor */}");

// Put the `</div></div>` at the very end before `  );\n};`
code = code.replace(/    <\/div>\n  \);\n};\n?$/, "      </div>\n    </div>\n    </div>\n  );\n};\n");

fs.writeFileSync('src/components/SettingsView.tsx', code);
console.log("fixed wrapper");
