const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf-8');

// Imports
code = code.replace(
  "import { ShieldAlert, Users, Server, Activity, Settings, BarChart2 } from 'lucide-react';",
  "import { ShieldAlert, Users, Server, Activity, Settings, BarChart2, FileText, CheckCircle, X, Eye } from 'lucide-react';"
);

// State & Logic
const logicInject = `  const [pendingProofs, setPendingProofs] = useState<any[]>([]);
  const [viewingProof, setViewingProof] = useState<any | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('timegig_activities');
    if (saved) {
      try { setActivities(JSON.parse(saved)); } catch(e) {}
    }
    
    // Check for pending proofs every second (since it might be uploaded from settings)
    const checkProofs = () => {
      const proofs = localStorage.getItem('timegig_pending_proofs');
      if (proofs) {
        try { setPendingProofs(JSON.parse(proofs)); } catch(e) {}
      }
    };
    checkProofs();
    const interval = setInterval(checkProofs, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = (proof: any) => {
    const updated = pendingProofs.filter(p => p.id !== proof.id);
    setPendingProofs(updated);
    localStorage.setItem('timegig_pending_proofs', JSON.stringify(updated));
    logActivity(\`Approved TheList subscription for \${proof.userName}\`);
    window.dispatchEvent(new CustomEvent('timegig_notify', { 
      detail: { type: 'info', title: 'Subscription Approved 😀', message: 'Your proof of payment has been verified. Welcome to TheList!' } 
    }));
    setViewingProof(null);
  };

  const handleReject = (proof: any) => {
    const updated = pendingProofs.filter(p => p.id !== proof.id);
    setPendingProofs(updated);
    localStorage.setItem('timegig_pending_proofs', JSON.stringify(updated));
    logActivity(\`Rejected TheList subscription for \${proof.userName}\`);
    window.dispatchEvent(new CustomEvent('timegig_notify', { 
      detail: { type: 'alert', title: 'Payment Rejected', message: 'Your proof of payment could not be verified. Please try again.' } 
    }));
    setViewingProof(null);
  };

  const logActivity = (text: string) => {`;

code = code.replace(
  /  useEffect\(\(\) => {[\s\S]*?  }, \[\]\);\n\n  const logActivity = \(text: string\) => {/,
  logicInject
);

// Update Analytics UI
code = code.replace(
  `                  <p className="text-2xl font-black text-neutral-900">8.4k</p>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mt-1">Active Calls</p>`,
  `                  <p className="text-2xl font-black text-emerald-600">R24,500</p>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mt-1">Sub Profit</p>`
);

code = code.replace(
  `                  <p className="text-2xl font-black text-neutral-900">45k</p>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mt-1">Messages</p>`,
  `                  <p className="text-2xl font-black text-indigo-600">1,204</p>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mt-1">Online Users</p>`
);

code = code.replace(
  `                  <p className="text-2xl font-black text-neutral-900">$12k</p>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mt-1">Market Vol</p>`,
  `                  <p className="text-2xl font-black text-rose-600">84.2k</p>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mt-1">Online Visits</p>`
);

// Add Pending Approvals section above Recent Activity
const pendingSection = `            {/* Pending Approvals */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-neutral-400" />
                  <h3 className="font-bold text-neutral-900">Pending Approvals</h3>
                </div>
                {pendingProofs.length > 0 && (
                  <span className="px-2.5 py-0.5 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">
                    {pendingProofs.length} New
                  </span>
                )}
              </div>
              <div className="divide-y divide-neutral-100 max-h-64 overflow-y-auto">
                {pendingProofs.length > 0 ? (
                  pendingProofs.map(proof => (
                    <div key={proof.id} className="p-5 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900">{proof.userName} <span className="text-neutral-500 font-normal">({proof.userHandle})</span></p>
                          <p className="text-xs text-neutral-500 mt-0.5">TheList Subscription • {new Date(proof.date).toLocaleString()}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setViewingProof(proof)}
                        className="px-3 py-1.5 bg-neutral-100 text-neutral-900 text-xs font-semibold rounded-full hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Proof
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-sm text-neutral-500">No pending approvals.</div>
                )}
              </div>
            </div>

            {/* Recent Activity Log */}`;

code = code.replace(
  "{/* Recent Activity Log */}",
  pendingSection
);

// Add Full Screen Viewer Modal at the end
const viewerModal = `
      {/* Proof Viewer Modal */}
      {viewingProof && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-in fade-in duration-200">
          <header className="px-6 py-4 border-b border-neutral-800 bg-black/50 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3 text-white">
              <button 
                onClick={() => setViewingProof(null)}
                className="p-2 -ml-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-lg font-bold">Payment Proof</h2>
                <p className="text-xs text-neutral-400">{viewingProof.userName} • {viewingProof.fileName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleReject(viewingProof)}
                className="px-4 py-2 bg-neutral-800 text-white text-sm font-semibold rounded-full hover:bg-neutral-700 transition-colors"
              >
                Reject
              </button>
              <button 
                onClick={() => handleApprove(viewingProof)}
                className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-full hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
            {viewingProof.fileData.startsWith('data:application/pdf') ? (
              <iframe src={viewingProof.fileData} className="w-full max-w-4xl h-[80vh] bg-white rounded-xl" />
            ) : (
              <img src={viewingProof.fileData} alt="Proof of payment" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
            )}
          </div>
        </div>
      )}
`;

code = code.replace(/    <\/div>\n  \);\n};\n?$/, viewerModal + "\n    </div>\n  );\n};\n");

fs.writeFileSync('src/components/AdminView.tsx', code);
console.log("patched admin view");
