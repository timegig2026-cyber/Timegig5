const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsView.tsx', 'utf-8');

// Remove unused state
code = code.replace(/  const \[notifications, setNotifications\] = useState\(true\);\n/g, "");
code = code.replace(/  const \[callSounds, setCallSounds\] = useState\(true\);\n/g, "");
code = code.replace(/  const \[hdVideo, setHdVideo\] = useState\(true\);\n/g, "");

// Modify handleSubmitTheList to save to localStorage
const oldSubmit = `  const handleSubmitTheList = () => {
    if (!proofOfPayment) return;
    setShowTheListFlow(false);
    setShowSuccessToast(true);
    setProofOfPayment(null);
    logActivity('Submitted proof of payment for TheList subscription');
    setTimeout(() => setShowSuccessToast(false), 5000);
  };`;

const newSubmit = `  const handleSubmitTheList = () => {
    if (!proofOfPayment) return;
    
    // Save to local storage for Admin to review
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const pending = JSON.parse(localStorage.getItem('timegig_pending_proofs') || '[]');
      pending.push({
        id: Math.random().toString(36).substring(2, 9),
        userName: userInfo.name,
        userHandle: userInfo.handle,
        fileName: proofOfPayment.name,
        fileData: dataUrl,
        date: new Date().toISOString(),
        status: 'pending'
      });
      localStorage.setItem('timegig_pending_proofs', JSON.stringify(pending));
      
      setShowTheListFlow(false);
      setShowSuccessToast(true);
      setProofOfPayment(null);
      logActivity('Submitted proof of payment for TheList subscription');
      setTimeout(() => setShowSuccessToast(false), 5000);
    };
    reader.readAsDataURL(proofOfPayment);
  };`;

code = code.replace(oldSubmit, newSubmit);

// Remove "Audio & Video Calls" block
const audioVideoRegex = /{\/\* Call & Video Preferences \*\/}[\s\S]*?(?={\/\* Notifications & Privacy \*\/})/;
code = code.replace(audioVideoRegex, "");

// Remove "Notifications & Privacy" block
const notifRegex = /{\/\* Notifications & Privacy \*\/}[\s\S]*?<\/div>(\s*<\/div>\s*<\/div>\s*<\/div>\s*{\/\* Full screen Profile Editor \*\/)/;
code = code.replace(notifRegex, "$1");

fs.writeFileSync('src/components/SettingsView.tsx', code);
console.log("updated settings view");
