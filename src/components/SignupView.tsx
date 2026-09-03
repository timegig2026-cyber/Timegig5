import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Shield, Mail, Lock, CheckCircle, LogIn } from 'lucide-react';

interface SignupViewProps {
  onSuccess: () => void;
}

export const SignupView: React.FC<SignupViewProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && !termsAccepted) {
      setError('You must accept the terms and conditions.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        onSuccess();
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        
        // Save agreement
        await setDoc(doc(db, 'agreements', userCred.user.uid), {
          userId: userCred.user.uid,
          userEmail: email,
          acceptedAt: serverTimestamp(),
          status: 'signed'
        });

        setShowSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || `Failed to ${isLogin ? 'log in' : 'sign up'}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-xl font-black text-neutral-900 tracking-tight">TimeGiG</h1>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Connect • Market</p>
          </div>
          
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm text-neutral-500 mb-8">
            {isLogin ? 'Log in to your account to continue.' : 'Register to access the market and your profile.'}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 text-rose-700 text-sm font-semibold rounded-xl border border-rose-200">
              {error}
            </div>
          )}

          {showSuccess ? (
            <div className="text-center py-8 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 mb-2">Congratulations!</h2>
              <p className="text-sm text-neutral-500">Your account has been created successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-neutral-900">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium text-neutral-900"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-neutral-900">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium text-neutral-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="flex items-start gap-3 pt-2">
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <div className="w-5 h-5 border-2 border-neutral-300 rounded bg-white peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center transition-colors">
                      <CheckCircle className={`w-3.5 h-3.5 text-white ${termsAccepted ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                  </label>
                  <p className="text-sm font-medium text-neutral-600 leading-tight">
                    I accept the <a href="#" className="text-emerald-600 hover:underline font-bold">Terms and Conditions</a> and acknowledge that I have read the privacy policy.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:bg-emerald-700 transition-all active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (isLogin ? 'Logging in...' : 'Creating Account...') : (isLogin ? 'Log In' : 'Sign Up')}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
