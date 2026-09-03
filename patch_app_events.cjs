const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const oldEffect = `  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => setShowSplash(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);`;

const newEffect = `  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => setShowSplash(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  useEffect(() => {
    const handleNotify = (e: CustomEvent) => {
      addNotification(e.detail);
    };
    window.addEventListener('timegig_notify' as any, handleNotify);
    return () => window.removeEventListener('timegig_notify' as any, handleNotify);
  }, []);`;

code = code.replace(oldEffect, newEffect);
fs.writeFileSync('src/App.tsx', code);
console.log("app event patched");
