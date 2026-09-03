const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsView.tsx', 'utf-8');

// 1. Add new lucide-react icons
code = code.replace(
  "  History",
  "  History,\n  Star,\n  Upload,\n  CheckCircle"
);

// 2. Add State variables
const stateInjection = `
  const [showTheListFlow, setShowTheListFlow] = useState(false);
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const proofInputRef = useRef<HTMLInputElement>(null);

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofOfPayment(e.target.files[0]);
    }
  };

  const handleSubmitTheList = () => {
    if (!proofOfPayment) return;
    setShowTheListFlow(false);
    setShowSuccessToast(true);
    setProofOfPayment(null);
    logActivity('Submitted proof of payment for TheList subscription');
    setTimeout(() => setShowSuccessToast(false), 5000);
  };
`;

code = code.replace(
  "const fileInputRef = useRef<HTMLInputElement>(null);",
  stateInjection + "\n  const fileInputRef = useRef<HTMLInputElement>(null);"
);

// 3. Replace the subscription feature block
const oldSubscriptionBlock = `{/* Subscription Feature */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="px-4 py-3 bg-neutral-50/50 border-b border-neutral-100 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Subscription
            </span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900">{subscription}</p>
                <p className="text-xs text-neutral-500">Renews on Oct 3, 2026</p>
              </div>
            </div>
            <button className="px-4 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-full hover:bg-neutral-800 transition-colors">
              Manage
            </button>
          </div>
        </div>`;

const newSubscriptionBlock = `{/* Subscription Feature */}
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
          </div>

          <div className="p-4 bg-emerald-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 flex-shrink-0 mt-0.5">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-emerald-950">TheList Package</p>
                  <span className="px-2 py-0.5 bg-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wide rounded-full">Pro</span>
                </div>
                <p className="text-xs text-emerald-700 mt-1 max-w-xs">Get added to the exclusive list for employers to view and employ you.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowTheListFlow(true)}
              className="px-5 py-2 whitespace-nowrap bg-emerald-600 text-white text-xs font-bold rounded-full hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Subscribe for R49,99
            </button>
          </div>
        </div>`;

code = code.replace(oldSubscriptionBlock, newSubscriptionBlock);

// 4. Add Modals (TheList Flow Modal + Success Toast)
const theListModals = `
      {/* TheList Subscription Flow Modal */}
      {showTheListFlow && (
        <div className="fixed inset-0 z-[70] bg-white flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          <header className="px-6 py-4 border-b border-neutral-200 bg-white flex items-center justify-between shadow-sm sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setShowTheListFlow(false);
                  setProofOfPayment(null);
                }}
                className="p-2 -ml-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-neutral-900">Subscribe to TheList</h2>
            </div>
          </header>
          
          <div className="flex-1 overflow-y-auto p-6 bg-neutral-50">
            <div className="max-w-xl mx-auto space-y-6">
              
              {/* Payment Instructions */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                  <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">TheList Package</h3>
                    <p className="text-sm text-neutral-500">Pay R49,99 to join the priority list</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <p className="text-sm font-medium text-neutral-700">Please make a bank transfer to the following account:</p>
                  
                  <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-500">Bank</span>
                      <span className="font-bold text-neutral-900">Capitec</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-500">Account Name</span>
                      <span className="font-bold text-neutral-900">Matthews</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-500">Account Number</span>
                      <span className="font-bold text-neutral-900 tracking-wider">1334067366</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-500">Amount</span>
                      <span className="font-bold text-emerald-600">R49,99</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-3 border-t border-neutral-200">
                      <span className="text-neutral-500">Reference <span className="text-[10px] text-rose-500 font-bold uppercase ml-1">(Required)</span></span>
                      <span className="font-bold text-neutral-900 bg-neutral-200 px-2 py-0.5 rounded-md">Promotion</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Proof */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-neutral-900">Upload Proof of Payment</h3>
                <p className="text-sm text-neutral-500">After completing the transfer, upload your payment receipt or screenshot here.</p>
                
                <div 
                  onClick={() => proofInputRef.current?.click()}
                  className={\`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors \${proofOfPayment ? 'border-emerald-400 bg-emerald-50' : 'border-neutral-300 hover:border-emerald-400 hover:bg-neutral-50'}\`}
                >
                  <input 
                    type="file" 
                    ref={proofInputRef}
                    onChange={handleProofUpload}
                    className="hidden" 
                    accept="image/*,.pdf"
                  />
                  {proofOfPayment ? (
                    <>
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-emerald-900">{proofOfPayment.name}</p>
                      <p className="text-xs text-emerald-600 mt-1">Tap to change document</p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mb-3">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-neutral-700">Tap to browse files</p>
                      <p className="text-xs text-neutral-500 mt-1">Accepts PDF, JPG, PNG</p>
                    </>
                  )}
                </div>

                <button 
                  disabled={!proofOfPayment}
                  onClick={handleSubmitTheList}
                  className={\`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all \${proofOfPayment ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg translate-y-0' : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'}\`}
                >
                  Submit Payment for Review
                </button>
              </div>
              
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed inset-x-4 top-6 z-[80] flex justify-center animate-in slide-in-from-top-10 fade-in duration-300">
          <div className="bg-neutral-900 text-white rounded-2xl shadow-2xl p-4 flex gap-4 items-start max-w-md w-full border border-neutral-700">
            <div className="p-1 bg-emerald-500/20 text-emerald-400 rounded-full flex-shrink-0 mt-0.5">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 pr-2">
              <p className="font-bold text-sm mb-1 text-emerald-50">Congratulations!</p>
              <p className="text-sm text-neutral-300 leading-relaxed">Your proof of payment has been submitted successfully. Review takes 15 to 35 minutes.</p>
            </div>
            <button 
              onClick={() => setShowSuccessToast(false)}
              className="p-1 text-neutral-400 hover:text-white transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
`;

code = code.replace(/    <\/div>\n  \);\n};\n?$/, theListModals + "\n    </div>\n  );\n};\n");

fs.writeFileSync('src/components/SettingsView.tsx', code);
console.log('patched thelist feature');
