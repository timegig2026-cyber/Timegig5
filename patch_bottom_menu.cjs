const fs = require('fs');
let code = fs.readFileSync('src/components/BottomMenuBar.tsx', 'utf-8');

code = code.replace(
  "import { MessageCircleMore, Bell, Store, User } from 'lucide-react';",
  "import { MessageCircleMore, Bell, Store, User, ShieldAlert } from 'lucide-react';"
);

code = code.replace(
  "const isSettingsActive = activeTab === 'settings';",
  "const isSettingsActive = activeTab === 'settings';\n  const isAdminActive = activeTab === 'admin';"
);

const adminButton = `
        {/* Admin Icon */}
        <button
          id="bottom-tab-admin"
          type="button"
          onClick={() => onSelectTab('admin')}
          aria-label="Admin"
          aria-current={isAdminActive ? 'page' : undefined}
          title="Admin"
          className="relative p-2 rounded-full text-black hover:bg-neutral-100/80 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
        >
          <ShieldAlert
            className={\`w-5 h-5 text-rose-600 transition-transform \${
              isAdminActive ? 'scale-110 stroke-[2.4px]' : 'stroke-[1.9px] hover:scale-105'
            }\`}
          />
        </button>
`;

code = code.replace(
  "        {/* User / Profile Icon */}",
  adminButton + "\n        {/* User / Profile Icon */}"
);

fs.writeFileSync('src/components/BottomMenuBar.tsx', code);
console.log('patched');
