import React, { useState, useRef, useEffect } from 'react';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { 
  Bell,
  Video,
  Shield,
  Smartphone,
  HelpCircle,
  ChevronRight,
  User,
  Volume2,
  Check,
  FileText,
  UploadCloud,
  X,
  File,
  MapPin,
  Link2,
  Phone,
  Briefcase,
  Camera,
  ChevronLeft,
  Image as ImageIcon,
  Trash2,
  Activity,
  CreditCard,
  ShieldAlert,
  Edit2,
  Save,
  History,
  Star,
  Upload,
  CheckCircle,
  LogOut
} from 'lucide-react';

interface SettingsViewProps {
  onResetData?: () => void;
  forceEditProfile?: boolean;
  onProfileDone?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetData, forceEditProfile, onProfileDone }) => {
  const [copied, setCopied] = useState(false);
  
  const [documents, setDocuments] = useState<{file: File, url: string}[]>([]);
  const [viewingDocument, setViewingDocument] = useState<{file: File, url: string} | null>(null);
  
  const [profileImage, setProfileImage] = useState<string>("https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1064&auto=format&fit=crop");
  const [coverImage, setCoverImage] = useState<string>("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop");
  

  useEffect(() => {
    if (forceEditProfile) {
      setIsEditingProfile(true);
    }
  }, [forceEditProfile]);

  const [userInfo, setUserInfo] = useState({
    name: "Alex Morgan",
    handle: "@alexmorgan",
    jobTitle: "Senior Product Designer",
    company: "Workspace Inc.",
    location: "San Francisco, CA",
    phone: "+1 (555) 123-4567",
    website: "alexmorgan.design",
    email: "alex.morgan@workspace.io"
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activities, setActivities] = useState<{id: string, text: string, date: string}[]>([]);
  const [subscription, setSubscription] = useState('Pro Tier');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('timegig_activities');
    if (saved) {
      try { setActivities(JSON.parse(saved)); } catch(e) {}
    } else {
      setActivities([{ id: 'init', text: 'Joined TimeGiG', date: new Date().toISOString() }]);
    }
    
    const loadProfile = async () => {
      // Try Firestore first
      if (auth.currentUser) {
        const docRef = doc(db, 'profiles', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserInfo(prev => ({ ...prev, ...data }));
          if (data.profileImage) setProfileImage(data.profileImage);
          if (data.coverImage) setCoverImage(data.coverImage);
          return;
        }
      }

      // Fallback to localStorage
      const savedInfo = localStorage.getItem('timegig_userinfo');
      if (savedInfo) {
        try { setUserInfo(JSON.parse(savedInfo)); } catch(e) {}
      }
    };
    loadProfile();
  }, []);

  const logActivity = (text: string) => {
    setActivities(prev => {
      const newActivities = [{ id: Math.random().toString(), text, date: new Date().toISOString() }, ...prev].slice(0, 50);
      localStorage.setItem('timegig_activities', JSON.stringify(newActivities));
      return newActivities;
    });
  };

  const saveProfile = async () => {
    try {
      localStorage.setItem('timegig_userinfo', JSON.stringify(userInfo));
      
      // Save to Firestore if user is logged in
      if (auth.currentUser) {
        await setDoc(doc(db, 'profiles', auth.currentUser.uid), {
          ...userInfo,
          profileImage,
          coverImage,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      setIsEditingProfile(false);
      logActivity('Updated personal information');
      
      // Show congratulatory toast
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
      
      if (onProfileDone) {
        onProfileDone();
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const [galleryImages, setGalleryImages] = useState<{file: File, url: string}[]>([]);
  const [viewingGalleryIndex, setViewingGalleryIndex] = useState<number | null>(null);

  
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
    reader.readAsDataURL(proofOfPayment as Blob);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newDocs = Array.from(e.target.files as FileList).map(file => ({
        file,
        url: URL.createObjectURL(file)
      }));
      setDocuments(prev => [...prev, ...newDocs]);
      logActivity(`Uploaded ${newDocs.length} document(s)`);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
      logActivity('Updated profile picture');
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(URL.createObjectURL(e.target.files[0]));
      logActivity('Updated cover photo');
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files as FileList).map(file => ({
        file,
        url: URL.createObjectURL(file)
      }));
      setGalleryImages(prev => [...prev, ...newImages]);
      logActivity(`Added ${newImages.length} photo(s) to gallery`);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  return (
    <>
    <div id="settings-view-container" className="flex-1 flex flex-col bg-neutral-50 overflow-y-auto">
      {/* Header */}
      <header className="px-6 pt-6 pb-4 border-b border-neutral-200 bg-white">
        <h1 id="settings-title" className="text-xl font-bold text-neutral-900 tracking-tight">
          Settings
        </h1>
      </header>

      <div className="p-6 space-y-6 max-w-lg mx-auto w-full">
        {/* User Profile Card */}
        <div
          id="user-profile-card"
          className="rounded-2xl bg-white border border-neutral-200 shadow-xs overflow-hidden"
        >
          {/* Cover Photo */}
          <div 
            className="h-28 sm:h-32 bg-neutral-200 relative w-full overflow-hidden cursor-pointer group"
            onClick={() => coverInputRef.current?.click()}
          >
            <img 
              src={coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <input type="file" ref={coverInputRef} onChange={handleCoverUpload} accept="image/*" className="hidden" />
          </div>
          
          <div className="px-5 pb-5 relative">
            <div className="flex items-end justify-between -mt-10 mb-3">
              {/* Profile Picture */}
              <div 
                className="w-20 h-20 rounded-full border-4 border-white bg-emerald-700 text-white flex items-center justify-center text-xl font-bold overflow-hidden shadow-sm relative z-10 flex-shrink-0 cursor-pointer group"
                onClick={() => profileInputRef.current?.click()}
              >
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <input type="file" ref={profileInputRef} onChange={handleProfileUpload} accept="image/*" className="hidden" />
              </div>
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-1.5 bg-neutral-100 text-neutral-900 text-xs font-semibold rounded-full hover:bg-neutral-200 transition-colors border border-neutral-200 flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5"/> Edit
                </button>
                <button 
                  type="button" 
                  onClick={handleLogout}
                  className="px-4 py-1.5 bg-rose-50 text-rose-600 text-xs font-semibold rounded-full hover:bg-rose-100 transition-colors border border-rose-100 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5"/> Logout
                </button>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-neutral-900 truncate">Alex Morgan</h2>
              <p className="text-sm text-neutral-500 font-medium mt-0.5">@alexmorgan</p>
              
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
                  <span className="font-medium text-neutral-900">Senior Product Designer</span> at Workspace Inc.
                </p>
                <p className="text-xs text-neutral-600 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  San Francisco, CA
                </p>
                <p className="text-xs text-neutral-600 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  +1 (555) 123-4567
                </p>
                <p className="text-xs text-neutral-600 flex items-center gap-2">
                  <Link2 className="w-3.5 h-3.5 text-neutral-400" />
                  <a href="#" className="text-emerald-600 hover:underline">alexmorgan.design</a>
                </p>
                <p className="text-xs text-neutral-600 flex items-center gap-2">
                  <span className="w-3.5 h-3.5 flex-shrink-0 text-neutral-400">✉</span>
                  alex.morgan@workspace.io
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Gallery Upload */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="px-4 py-3 bg-neutral-50/50 border-b border-neutral-100 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Photo Gallery
            </span>
            <span className="text-xs text-neutral-400 font-medium">{galleryImages.length} photos</span>
          </div>
          <div className="p-4">
            <div 
              onClick={() => galleryInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-200 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-neutral-50 hover:border-emerald-300 transition-colors group mb-4"
            >
              <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-neutral-900">Add photos</p>
              <input 
                type="file" 
                ref={galleryInputRef}
                onChange={handleGalleryUpload}
                accept="image/*"
                className="hidden" 
                multiple
              />
            </div>

            {galleryImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-neutral-200 shadow-sm cursor-pointer" onClick={() => setViewingGalleryIndex(idx)}>
                    <img 
                      src={img.url} 
                      alt={`Gallery ${idx}`} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeGalleryImage(idx); }}
                        className="p-1.5 bg-white/20 hover:bg-rose-500 rounded-full text-white backdrop-blur-sm transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Professional Documents Upload */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="px-4 py-3 bg-neutral-50/50 border-b border-neutral-100 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Professional Documents
            </span>
            <span className="text-xs text-neutral-400 font-medium">{documents.length} uploaded</span>
          </div>
          <div className="p-4">
            <p className="text-sm text-neutral-600 mb-4">
              Upload your CV, certifications, and portfolio PDFs. All file sizes and formats are supported.
            </p>
            
            {/* Upload Zone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-neutral-50 hover:border-emerald-300 transition-colors group"
            >
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-neutral-900">Click to upload documents</p>
              <p className="text-xs text-neutral-500 mt-1">PDF, DOCX, TXT, Images</p>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden" 
                multiple
              />
            </div>

            {/* Uploaded Documents List */}
            {documents.length > 0 && (
              <div className="mt-4 space-y-2">
                {documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-white hover:border-neutral-300 transition-colors cursor-pointer group" onClick={() => setViewingDocument(doc)}>
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 bg-white rounded-lg border border-neutral-200 text-emerald-600 flex-shrink-0 shadow-sm group-hover:bg-emerald-50 transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate pr-2 group-hover:text-emerald-700 transition-colors">{doc.file.name}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{formatFileSize(doc.file.size)}</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeDocument(idx); }}
                      className="p-2 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
                      title="Remove document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        
        {/* Subscription Feature */}
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
        </div>

        {/* User Activities Log */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="px-4 py-3 bg-neutral-50/50 border-b border-neutral-100 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Activity Log
            </span>
            <History className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="p-0">
            {activities.length > 0 ? (
              <div className="divide-y divide-neutral-100 max-h-48 overflow-y-auto">
                {activities.map(act => (
                  <div key={act.id} className="px-4 py-3 flex flex-col hover:bg-neutral-50">
                    <p className="text-sm text-neutral-900">{act.text}</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">{new Date(act.date).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-neutral-500">No recent activity.</div>
            )}
          </div>
        </div>

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
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${proofOfPayment ? 'border-emerald-400 bg-emerald-50' : 'border-neutral-300 hover:border-emerald-400 hover:bg-neutral-50'}`}
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
                  className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${proofOfPayment ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg translate-y-0' : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'}`}
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
              <p className="font-bold text-sm mb-1 text-emerald-50">Congratulations! 🎉</p>
              <p className="text-sm text-neutral-300 leading-relaxed">Your profile has been saved successfully. You're all set to explore TimeGiG!</p>
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

      </div>
    </div>
    </>
  );
};
