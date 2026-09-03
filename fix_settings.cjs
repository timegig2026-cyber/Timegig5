const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsView.tsx', 'utf-8');

// Fix TS errors with "unknown" being passed to readAsDataURL
code = code.replace(/reader\.readAsDataURL\(file\);/g, "reader.readAsDataURL(file as Blob);");
code = code.replace(/reader\.readAsDataURL\(proofOfPayment\);/g, "reader.readAsDataURL(proofOfPayment as Blob);");


const notifStart = code.indexOf('{/* Notifications & Privacy */}');
if (notifStart !== -1) {
  // Find the end of this div block
  // We know the end is right before "{/* Full screen Profile Editor */}"
  const notifEnd = code.indexOf('{/* Full screen Profile Editor */}');
  if (notifEnd !== -1) {
    // The div closing the main container is before "Full screen profile editor"
    // So let's replace from notifStart to notifEnd-ish
    // The last div is closed.
    const toRemove = code.substring(notifStart, notifEnd);
    // Actually we just want to replace toRemove with `</div>` (to close the main container if it was part of it)
    // Wait, the main container is `<div className="space-y-6">` inside `<div className="p-6 overflow-y-auto max-w-2xl mx-auto w-full pb-20">`.
    // Let's just remove the exact string.
    code = code.replace(toRemove, "");
  }
}

fs.writeFileSync('src/components/SettingsView.tsx', code);
console.log("fixed settings");
