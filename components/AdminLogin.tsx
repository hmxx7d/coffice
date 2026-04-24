import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Lock, Mail, Loader2, Coffee, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4E9E4] flex items-center justify-center p-4 font-sans text-right" dir="rtl">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-8 border border-[#E8E2DE] relative">
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 right-6 p-2 text-[#6E6E6E] hover:text-[#2C2A3A] bg-[#F4E9E4]/50 hover:bg-[#F4E9E4] rounded-full transition-all"
        >
          <ArrowRight size={20} />
        </button>
        
        <div className="flex flex-col items-center mb-8 mt-2">
          <div className="w-16 h-16 bg-[#2C2A3A] text-[#D8A08A] rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Coffee size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black font-serif text-[#2C2A3A]">تسجيل دخول الإدارة</h1>
          <p className="text-sm text-[#6E6E6E] mt-2">مرحباً بك في نظام إدارة كوفيكس</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold mb-6 border border-rose-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">البريد الإلكتروني</label>
            <div className="relative">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D8A08A]">
                <Mail size={20} />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-4 pr-12 py-4 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-2xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold text-sm text-left"
                dir="ltr"
                placeholder="admin@cofix.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">كلمة المرور</label>
            <div className="relative">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D8A08A]">
                <Lock size={20} />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-12 py-4 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-2xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold text-sm text-left"
                dir="ltr"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 bg-[#2C2A3A] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#D8A08A] transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
