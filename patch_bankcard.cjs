const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsView.tsx', 'utf-8');

const oldSubscriptionBlock = `{/* Subscription Feature */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="px-4 py-3 bg-neutral-50/50 border-b border-neutral-100 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Subscription
            </span>
          </div>
          
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900">{subscription}</p>
                <p className="text-xs text-neutral-500">Renews on Oct 3, 2026</p>
              </div>
            </div>
            <button className="px-4 py-1.5 bg-neutral-100 text-neutral-900 text-xs font-semibold rounded-full hover:bg-neutral-200 transition-colors">
              Manage
            </button>
          </div>`;

const newSubscriptionBlock = `{/* Subscription Feature */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="px-4 py-3 bg-neutral-50/50 border-b border-neutral-100 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Subscription Details
            </span>
            <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">Manage</button>
          </div>
          
          <div className="p-6 border-b border-neutral-100 flex justify-center bg-neutral-50/30">
            {/* Realistic Bank Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-950 text-white shadow-xl shadow-emerald-900/10 w-full max-w-[340px] aspect-[1.586/1] p-6 flex flex-col justify-between border border-emerald-600/30">
              {/* Decorative elements */}
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl"></div>
              <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
              
              <div className="relative z-10 flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-emerald-200/80 font-semibold mb-1">Current Plan</span>
                  <span className="text-lg font-black tracking-wider text-white">{subscription}</span>
                </div>
                <div className="flex gap-1.5 items-center">
                  <div className="w-7 h-7 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-auto flex flex-col gap-5">
                <div className="flex gap-4 text-emerald-100/80 text-lg font-mono tracking-widest">
                  <span>****</span>
                  <span>****</span>
                  <span>****</span>
                  <span>4092</span>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-widest text-emerald-200/70 mb-1">Cardholder</span>
                    <span className="text-sm font-bold tracking-widest text-emerald-50 uppercase">{userInfo.name}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] uppercase tracking-widest text-emerald-200/70 mb-1">Renews</span>
                    <span className="text-sm font-bold tracking-widest text-emerald-50">10/26</span>
                  </div>
                </div>
              </div>
            </div>
          </div>`;

code = code.replace(oldSubscriptionBlock, newSubscriptionBlock);

fs.writeFileSync('src/components/SettingsView.tsx', code);
console.log('patched');
