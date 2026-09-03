const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "import { SettingsView } from './components/SettingsView';",
  "import { SettingsView } from './components/SettingsView';\nimport { AdminView } from './components/AdminView';"
);

const adminRoute = `
            {currentTab === 'settings' && (
              <SettingsView />
            )}
            {currentTab === 'admin' && (
              <AdminView />
            )}`;

code = code.replace(
  `            {currentTab === 'settings' && (
              <SettingsView />
            )}`,
  adminRoute
);

fs.writeFileSync('src/App.tsx', code);
console.log('patched app');
