const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsView.tsx', 'utf-8');

// 1. Remove admin dashboard
const adminSectionRegex = /{\/\* Admin Feature \*\/}[\s\S]*?{\/\* Call & Video Preferences \*\/}/;
code = code.replace(adminSectionRegex, "{/* Call & Video Preferences */}");

// 2. Adjust Profile editing to use a full screen modal.
// In the current code, editing is conditional inline: `{!isEditingProfile ? (...) : (...)}`
// We will change it back to the view-only mode, and put the editing form in a full screen modal at the end.

const oldProfileSectionRegex = /{!isEditingProfile \? \([\s\S]*?\) : \([\s\S]*?\)}[\s\S]*?<\/div>/;

const viewOnlyProfile = `<>
                  <h2 className="text-xl font-bold text-neutral-900 truncate">{userInfo.name}</h2>
                  <p className="text-sm text-neutral-500 font-medium mt-0.5">{userInfo.handle}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-3.5 mb-4">
                    <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full w-max border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Available
                    </p>
                  </div>

                  {/* Extended Contact Information */}
                  <div className="space-y-2 mt-4 bg-neutral-50/50 p-3 rounded-xl border border-neutral-100">
                    <p className="text-xs text-neutral-600 flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="font-medium text-neutral-900">{userInfo.jobTitle}</span> at {userInfo.company}
                    </p>
                    <p className="text-xs text-neutral-600 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      {userInfo.location}
                    </p>
                    <p className="text-xs text-neutral-600 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      {userInfo.phone}
                    </p>
                    <p className="text-xs text-neutral-600 flex items-center gap-2">
                      <Link2 className="w-3.5 h-3.5 text-neutral-400" />
                      <a href="#" className="text-emerald-600 hover:underline">{userInfo.website}</a>
                    </p>
                    <p className="text-xs text-neutral-600 flex items-center gap-2">
                      <span className="w-3.5 h-3.5 flex-shrink-0 text-neutral-400">✉</span>
                      {userInfo.email}
                    </p>
                  </div>
                </>
              </div>`;

code = code.replace(oldProfileSectionRegex, viewOnlyProfile);

// Change edit button behavior
const oldEditButtonRegex = /<button[\s\S]*?onClick=\{\(\) => isEditingProfile \? saveProfile\(\) : setIsEditingProfile\(true\)\}[\s\S]*?<\/button>/;
const newEditButton = `<button 
                type="button" 
                onClick={() => setIsEditingProfile(true)}
                className="px-4 py-1.5 bg-neutral-100 text-neutral-900 text-xs font-semibold rounded-full hover:bg-neutral-200 transition-colors border border-neutral-200 flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5"/> Edit
              </button>`;
code = code.replace(oldEditButtonRegex, newEditButton);

// 3. Add full screen editing modal at the end of the file
const editingModal = `
      {/* Full screen Profile Editor */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[70] bg-white flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          <header className="px-6 py-4 border-b border-neutral-200 bg-white flex items-center justify-between shadow-sm sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="p-2 -ml-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-neutral-900">Edit Profile</h2>
            </div>
            <button 
              onClick={saveProfile}
              className="px-5 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-full hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </header>
          
          <div className="flex-1 overflow-y-auto p-6 bg-neutral-50">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
                <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3">Basic Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Full Name</label>
                    <input type="text" value={userInfo.name} onChange={e => setUserInfo({...userInfo, name: e.target.value})} className="w-full text-base p-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Username Handle</label>
                    <input type="text" value={userInfo.handle} onChange={e => setUserInfo({...userInfo, handle: e.target.value})} className="w-full text-base p-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Job Title</label>
                    <input type="text" value={userInfo.jobTitle} onChange={e => setUserInfo({...userInfo, jobTitle: e.target.value})} className="w-full text-base p-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Company</label>
                    <input type="text" value={userInfo.company} onChange={e => setUserInfo({...userInfo, company: e.target.value})} className="w-full text-base p-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Location</label>
                  <input type="text" value={userInfo.location} onChange={e => setUserInfo({...userInfo, location: e.target.value})} className="w-full text-base p-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
                <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3">Contact Details</h3>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Phone Number</label>
                  <input type="tel" value={userInfo.phone} onChange={e => setUserInfo({...userInfo, phone: e.target.value})} className="w-full text-base p-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Email Address</label>
                  <input type="email" value={userInfo.email} onChange={e => setUserInfo({...userInfo, email: e.target.value})} className="w-full text-base p-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Website URL</label>
                  <input type="url" value={userInfo.website} onChange={e => setUserInfo({...userInfo, website: e.target.value})} className="w-full text-base p-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(/    <\/div>\n  \);\n};\n?$/, editingModal + "\n    </div>\n  );\n};\n");

fs.writeFileSync('src/components/SettingsView.tsx', code);
console.log('patched settings modal');
