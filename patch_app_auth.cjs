const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Add Firebase imports
code = code.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';\nimport { auth } from './firebase';\nimport { onAuthStateChanged, User } from 'firebase/auth';\nimport { SignupView } from './components/SignupView';");

// Add auth state
const stateInject = `  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [forceEditProfile, setForceEditProfile] = useState(false);`;
code = code.replace("  const [showSplash, setShowSplash] = useState(true);", stateInject);

const effectInject = `  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthReady(true);
    });
    return () => unsub();
  }, []);`;

code = code.replace(/  useEffect\(\(\) => {\n    if \(showSplash\) {/, effectInject + "\n\n  useEffect(() => {\n    if (showSplash) {");

// Render SignupView if not logged in
const renderInject = `  if (!isAuthReady) return <div className="h-screen w-full bg-neutral-900 flex items-center justify-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;

  if (!user && !showSplash) {
    return <SignupView 
      onSuccess={() => {
        setForceEditProfile(true);
        setCurrentTab('settings');
      }} 
    />;
  }`;

code = code.replace("  return (\n    <div", renderInject + "\n\n  return (\n    <div");

// Pass forceEditProfile to SettingsView
// We need to pass the forceEditProfile state and a way to clear it
code = code.replace(/<SettingsView \/>/, `<SettingsView forceEditProfile={forceEditProfile} onProfileDone={() => {
                setForceEditProfile(false);
                setCurrentTab('market');
              }} />`);


fs.writeFileSync('src/App.tsx', code);
console.log('patched App.tsx');
