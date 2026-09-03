import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Server, Activity, Settings, BarChart2, FileText, CheckCircle, X, Eye, Download, Image as ImageIcon, Sliders, ShieldCheck } from 'lucide-react';
import { collection, onSnapshot, query, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const AdminView: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activities, setActivities] = useState<{id: string, text: string, date: string}[]>([]);

  const [agreements, setAgreements] = useState<any[]>([]);
  const [viewingAgreement, setViewingAgreement] = useState<any | null>(null);
  const [sellerAgreements, setSellerAgreements] = useState<any[]>([]);
  const [activeAdminTab, setActiveAdminTab] = useState<'general' | 'seller'>('general');

  // Wallpaper settings
  const [wallpaperUrl, setWallpaperUrl] = useState('');
  const [blurAmount, setBlurAmount] = useState(0);
  const [isSavingWallpaper, setIsSavingWallpaper] = useState(false);

  useEffect(() => {
    // Load current wallpaper settings
    const loadWallpaper = async () => {
      const configDoc = await getDoc(doc(db, 'configs', 'global'));
      if (configDoc.exists()) {
        const data = configDoc.data();
        setWallpaperUrl(data.wallpaperUrl || '');
        setBlurAmount(data.blurAmount || 0);
      }
    };
    loadWallpaper();
  }, []);

  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas for resizing
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimension for wallpaper to keep size low
          const MAX_DIM = 1200;
          if (width > height) {
            if (width > MAX_DIM) {
              height *= MAX_DIM / width;
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width *= MAX_DIM / height;
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.6 quality to stay well under 1MB
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setWallpaperUrl(compressedDataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const saveWallpaperSettings = async () => {
    setIsSavingWallpaper(true);
    try {
      await setDoc(doc(db, 'configs', 'global'), {
        wallpaperUrl,
        blurAmount,
        updatedAt: new Date()
      }, { merge: true });
      logActivity('Updated global wallpaper settings');
      alert('Wallpaper settings saved successfully!');
    } catch (err) {
      console.error("Failed to save wallpaper:", err);
    } finally {
      setIsSavingWallpaper(false);
    }
  };

  const clearWallpaper = async () => {
    setWallpaperUrl('');
    setBlurAmount(0);
    await setDoc(doc(db, 'configs', 'global'), {
      wallpaperUrl: '',
      blurAmount: 0,
      updatedAt: new Date()
    }, { merge: true });
    logActivity('Cleared global wallpaper');
  };

  useEffect(() => {
    const q = query(collection(db, 'agreements'));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setAgreements(docs);
    }, (err) => console.error("Failed to load agreements:", err));
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'sellerAgreements'));
    const unsub = onSnapshot(q, (snapshot) => {
      setSellerAgreements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handleDownloadAgreement = (agreement: any) => {
    // Generate a simple text file representing the signed agreement
    const content = `TERMS AND CONDITIONS AGREEMENT\n\nUser ID: ${agreement.userId}\nEmail: ${agreement.userEmail}\nStatus: ${agreement.status}\nAccepted At: ${new Date(agreement.acceptedAt?.seconds ? agreement.acceptedAt.seconds * 1000 : Date.now()).toLocaleString()}\n\nDigitally signed by the user.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agreement_${agreement.userId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [pendingProofs, setPendingProofs] = useState<any[]>([]);
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
    logActivity(`Approved TheList subscription for ${proof.userName}`);
    window.dispatchEvent(new CustomEvent('timegig_notify', { 
      detail: { type: 'info', title: 'Subscription Approved 😀', message: 'Your proof of payment has been verified. Welcome to TheList!' } 
    }));
    setViewingProof(null);
  };

  const handleReject = (proof: any) => {
    const updated = pendingProofs.filter(p => p.id !== proof.id);
    setPendingProofs(updated);
    localStorage.setItem('timegig_pending_proofs', JSON.stringify(updated));
    logActivity(`Rejected TheList subscription for ${proof.userName}`);
    window.dispatchEvent(new CustomEvent('timegig_notify', { 
      detail: { type: 'alert', title: 'Payment Rejected', message: 'Your proof of payment could not be verified. Please try again.' } 
    }));
    setViewingProof(null);
  };

  const logActivity = (text: string) => {
    setActivities(prev => {
      const newActivities = [{ id: Math.random().toString(), text, date: new Date().toISOString() }, ...prev].slice(0, 50);
      localStorage.setItem('timegig_activities', JSON.stringify(newActivities));
      return newActivities;
    });
  };

  return (
    <div id="admin-view-container" className="flex-1 flex flex-col bg-neutral-50 overflow-y-auto">
      {/* Header */}
      <header className="px-6 pt-6 pb-4 border-b border-neutral-200 bg-white shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-rose-600" />
          Admin Dashboard
        </h1>
        <div className="flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200">
          <div className={`w-2 h-2 rounded-full \${isAdmin ? 'bg-rose-500' : 'bg-neutral-300'}`}></div>
          <span className="text-xs font-semibold text-rose-700">{isAdmin ? 'System Active' : 'Restricted Mode'}</span>
        </div>
      </header>

      <div className="p-6 space-y-6 max-w-2xl mx-auto w-full pb-20">
        
        {/* Developer Mode Toggle */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl \${isAdmin ? 'bg-rose-100 text-rose-600' : 'bg-neutral-100 text-neutral-500'} transition-colors`}>
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <p className="text-base font-bold text-neutral-900">Developer Mode</p>
                <p className="text-sm text-neutral-500 mt-0.5">Enable advanced system controls and elevated access</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isAdmin}
                onChange={(e) => {
                  setIsAdmin(e.target.checked);
                  logActivity(e.target.checked ? 'Enabled Admin Mode' : 'Disabled Admin Mode');
                }}
              />
              <div className="w-11 h-6 bg-neutral-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-rose-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>
        </div>

        {isAdmin ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Admin Tabs */}
            <div className="flex gap-2 p-1 bg-neutral-100 rounded-xl">
              <button 
                onClick={() => setActiveAdminTab('general')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeAdminTab === 'general' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
              >
                General Console
              </button>
              <button 
                onClick={() => setActiveAdminTab('seller')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeAdminTab === 'seller' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
              >
                Seller Agreements ({sellerAgreements.length})
              </button>
            </div>

            {activeAdminTab === 'general' ? (
              <>
            {/* Wallpaper Management */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-neutral-400" />
                  Background Wallpaper
                </h3>
              </div>
              <div className="p-5 space-y-6">
                <div className="flex flex-col gap-4">
                  <label className="text-sm font-semibold text-neutral-700">Upload Wallpaper</label>
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-24 h-24 rounded-xl border-2 border-dashed border-neutral-200 flex items-center justify-center bg-neutral-50 overflow-hidden relative group cursor-pointer"
                      onClick={() => document.getElementById('wallpaper-upload')?.click()}
                    >
                      {wallpaperUrl ? (
                        <img src={wallpaperUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-neutral-300" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold uppercase">Change</span>
                      </div>
                      <input 
                        id="wallpaper-upload"
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleWallpaperUpload}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-neutral-500 mb-2">Upload a background image from your device. This will be applied globally to all users.</p>
                      <button 
                        onClick={clearWallpaper}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
                      >
                        Clear Current Wallpaper
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                      <Sliders className="w-4 h-4" />
                      Blur Effect
                    </label>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{blurAmount}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="20" 
                    step="1"
                    value={blurAmount}
                    onChange={(e) => setBlurAmount(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                <button 
                  onClick={saveWallpaperSettings}
                  disabled={isSavingWallpaper}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:bg-emerald-700 transition-all disabled:opacity-50"
                >
                  {isSavingWallpaper ? 'Saving...' : 'Apply Wallpaper Settings'}
                </button>
              </div>
            </div>
            </>
            ) : (
              /* Seller Agreements List */
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                    <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      Marketplace Seller Agreements
                    </h3>
                    <span className="text-xs font-bold text-neutral-400">{sellerAgreements.length} Signed</span>
                  </div>
                  <div className="divide-y divide-neutral-100">
                    {sellerAgreements.length === 0 ? (
                      <div className="p-10 text-center text-neutral-500">
                        <FileText className="w-10 h-10 mx-auto text-neutral-200 mb-2" />
                        <p className="text-sm">No seller agreements signed yet.</p>
                      </div>
                    ) : (
                      sellerAgreements.map((agreement) => (
                        <div key={agreement.id} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                              {agreement.userEmail?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-neutral-900">{agreement.userEmail}</p>
                              <p className="text-[10px] text-neutral-500">Signed {agreement.signedAt?.toDate ? new Date(agreement.signedAt.toDate()).toLocaleString() : 'Recently'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100 uppercase tracking-wider">
                              Approved
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-neutral-200 hover:border-rose-300 hover:shadow-md transition-all group">
                <div className="p-3 bg-rose-50 rounded-full text-rose-600 group-hover:bg-rose-100 mb-3 transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <span className="font-semibold text-neutral-900">Manage Users</span>
                <span className="text-xs text-neutral-500 mt-1">1,204 active</span>
              </button>
              
              <button className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-neutral-200 hover:border-rose-300 hover:shadow-md transition-all group">
                <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 group-hover:bg-indigo-100 mb-3 transition-colors">
                  <Server className="w-6 h-6" />
                </div>
                <span className="font-semibold text-neutral-900">System Logs</span>
                <span className="text-xs text-neutral-500 mt-1">All systems nominal</span>
              </button>
            </div>

            {/* Analytics Overview */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-neutral-400" />
                  Platform Analytics
                </h3>
                <select className="text-xs font-medium text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1 outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>All Time</option>
                </select>
              </div>
              <div className="p-5 grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  <p className="text-2xl font-black text-emerald-600">R24,500</p>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mt-1">Sub Profit</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  <p className="text-2xl font-black text-indigo-600">1,204</p>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mt-1">Online Users</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  <p className="text-2xl font-black text-rose-600">84.2k</p>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mt-1">Online Visits</p>
                </div>
              </div>
            </div>

                        
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

            {/* Pending Approvals */}
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

            {/* Recent Activity Log */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-neutral-400" />
                <h3 className="font-bold text-neutral-900">Recent Admin Activity</h3>
              </div>
              <div className="divide-y divide-neutral-100 max-h-64 overflow-y-auto">
                {activities.length > 0 ? (
                  activities.map(act => (
                    <div key={act.id} className="px-5 py-3 hover:bg-neutral-50 transition-colors">
                      <p className="text-sm font-medium text-neutral-900">{act.text}</p>
                      <p className="text-xs text-neutral-500 mt-1">{new Date(act.date).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-sm text-neutral-500">No recent activity found.</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
              <ShieldAlert className="w-10 h-10 text-neutral-300" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Access Restricted</h2>
            <p className="text-neutral-500 max-w-xs">Enable Developer Mode to access system controls, user management, and platform analytics.</p>
          </div>
        )}
      </div>


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

    </div>
  );
};
