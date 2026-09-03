const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf-8');

// Add Firebase imports
code = code.replace(
  "import { ShieldAlert, Users, Server, Activity, Settings, BarChart2, FileText, CheckCircle, X, Eye } from 'lucide-react';",
  "import { ShieldAlert, Users, Server, Activity, Settings, BarChart2, FileText, CheckCircle, X, Eye, Download } from 'lucide-react';\nimport { collection, onSnapshot, query, doc, updateDoc } from 'firebase/firestore';\nimport { db } from '../firebase';"
);

// Add state for agreements
const injectAgreementsState = `  const [agreements, setAgreements] = useState<any[]>([]);
  const [viewingAgreement, setViewingAgreement] = useState<any | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'agreements'));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setAgreements(docs);
    }, (err) => console.error("Failed to load agreements:", err));
    return () => unsub();
  }, []);

  const handleDownloadAgreement = (agreement: any) => {
    // Generate a simple text file representing the signed agreement
    const content = \`TERMS AND CONDITIONS AGREEMENT\\n\\nUser ID: \${agreement.userId}\\nEmail: \${agreement.userEmail}\\nStatus: \${agreement.status}\\nAccepted At: \${new Date(agreement.acceptedAt?.seconds ? agreement.acceptedAt.seconds * 1000 : Date.now()).toLocaleString()}\\n\\nDigitally signed by the user.\`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`agreement_\${agreement.userId}.txt\`;
    a.click();
    URL.revokeObjectURL(url);
  };
`;

code = code.replace(
  "  const [pendingProofs, setPendingProofs] = useState<any[]>([]);",
  injectAgreementsState + "\n  const [pendingProofs, setPendingProofs] = useState<any[]>([]);"
);

// Add Agreements section in UI
const agreementsSection = `
            {/* Signed Agreements */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-neutral-400" />
                  <h3 className="font-bold text-neutral-900">Signed Agreements (T&C)</h3>
                </div>
                <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-600 text-xs font-bold rounded-full">
                  {agreements.length} Total
                </span>
              </div>
              <div className="divide-y divide-neutral-100 max-h-64 overflow-y-auto">
                {agreements.length > 0 ? (
                  agreements.map(agr => (
                    <div key={agr.id} className="p-5 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900">{agr.userEmail}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">Signed • {agr.acceptedAt?.seconds ? new Date(agr.acceptedAt.seconds * 1000).toLocaleString() : 'Just now'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setViewingAgreement(agr)}
                        className="px-3 py-1.5 bg-neutral-100 text-neutral-900 text-xs font-semibold rounded-full hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-sm text-neutral-500">No agreements signed yet.</div>
                )}
              </div>
            </div>
`;

code = code.replace("{/* Pending Approvals */}", agreementsSection + "\n            {/* Pending Approvals */}");

// Add Agreement Viewer Modal
const agreementViewerModal = `
      {/* Agreement Viewer Modal */}
      {viewingAgreement && (
        <div className="fixed inset-0 z-[100] bg-neutral-900/95 flex flex-col animate-in fade-in duration-200 backdrop-blur-sm p-4 sm:p-10">
          <div className="flex-1 w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <header className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Terms & Conditions Agreement</h2>
                <p className="text-sm text-neutral-500">{viewingAgreement.userEmail}</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleDownloadAgreement(viewingAgreement)}
                  className="px-4 py-2 bg-neutral-100 text-neutral-900 text-sm font-semibold rounded-full hover:bg-neutral-200 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button 
                  onClick={() => setViewingAgreement(null)}
                  className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </header>
            
            <div className="flex-1 overflow-auto p-8 lg:p-12 bg-white">
              <div className="prose prose-sm max-w-none text-neutral-600">
                <div className="flex items-center gap-3 mb-8 pb-8 border-b border-neutral-100">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 m-0">Digitally Signed</h3>
                    <p className="text-sm text-neutral-500 m-0">This document acts as proof of acceptance.</p>
                  </div>
                </div>
                
                <h4 className="text-base font-bold text-neutral-900 uppercase tracking-wider mb-4">Record Details</h4>
                <div className="grid grid-cols-2 gap-4 mb-8 bg-neutral-50 p-6 rounded-xl border border-neutral-100">
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">User ID</p>
                    <p className="font-mono text-sm text-neutral-900">{viewingAgreement.userId}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Email</p>
                    <p className="font-medium text-sm text-neutral-900">{viewingAgreement.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Status</p>
                    <p className="font-medium text-sm text-emerald-600 capitalize">{viewingAgreement.status}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Timestamp</p>
                    <p className="font-medium text-sm text-neutral-900">{viewingAgreement.acceptedAt?.seconds ? new Date(viewingAgreement.acceptedAt.seconds * 1000).toLocaleString() : 'Unknown'}</p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-neutral-600">
                  By executing this digital signature, the user listed above has acknowledged and agreed to the Platform Terms of Service, Privacy Policy, and Data Processing Addendum. This record is immutably stored in the platform's secure database.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(/      \{\/\* Proof Viewer Modal \*\/\}/, agreementViewerModal + "\n      {/* Proof Viewer Modal */}");

fs.writeFileSync('src/components/AdminView.tsx', code);
console.log('patched admin fb');
