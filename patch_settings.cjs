const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsView.tsx', 'utf-8');

code = code.replace(/interface SettingsViewProps \{[\s\S]*?\}/, `interface SettingsViewProps {\n  onResetData?: () => void;\n  forceEditProfile?: boolean;\n  onProfileDone?: () => void;\n}`);
code = code.replace(/export const SettingsView: React\.FC<SettingsViewProps> = \(\{ onResetData \}\) => \{/, `export const SettingsView: React.FC<SettingsViewProps> = ({ onResetData, forceEditProfile, onProfileDone }) => {`);

const effectInject = `  useEffect(() => {
    if (forceEditProfile) {
      setIsEditingProfile(true);
    }
  }, [forceEditProfile]);`;

code = code.replace(/  const \[userInfo, setUserInfo\] = useState\(\{/, effectInject + "\n\n  const [userInfo, setUserInfo] = useState({");

// Hook into Save Profile button (which sets isEditingProfile(false))
// We'll replace setIsEditingProfile(false) inside the Save button with a custom handler
const saveBtnRegex = /<button[\s\S]*?onClick=\{\(\) => setIsEditingProfile\(false\)\}[\s\S]*?Save Profile[\s\S]*?<\/button>/;
const saveBtnMatch = code.match(saveBtnRegex);
if (saveBtnMatch) {
  const customHandler = `onClick={() => {
                  setIsEditingProfile(false);
                  if (onProfileDone) onProfileDone();
                }}`;
  const newBtn = saveBtnMatch[0].replace(/onClick=\{\(\) => setIsEditingProfile\(false\)\}/, customHandler);
  code = code.replace(saveBtnMatch[0], newBtn);
}

fs.writeFileSync('src/components/SettingsView.tsx', code);
console.log('patched settings view props');
