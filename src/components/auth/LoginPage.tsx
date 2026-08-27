import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } else {
      if (!fullName.trim()) {
        setError('من فضلك اكتب اسمك');
        setSubmitting(false);
        return;
      }
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setError(error);
      } else {
        setInfo('تم إنشاء الحساب! تحقق من إيميلك لتأكيد الحساب قبل تسجيل الدخول.');
        setMode('login');
      }
    }
    setSubmitting(false);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full bg-[#0A0A0A] text-white flex items-center justify-center px-4 py-10"
    >
      <div className="w-full max-w-sm bg-[#141414] border border-[#262626] rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-[#E31E24]">عالم الشرق الأوسط</h1>
          <p className="text-sm text-gray-400 mt-1">
            {mode === 'login' ? 'سجّل دخولك للمتابعة' : 'أنشئ حسابك الجديد'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="relative">
              <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="الاسم الكامل"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-[#0A0A0A] border border-[#262626] focus:border-[#E31E24] rounded-xl py-3 pr-10 pl-3 text-sm outline-none transition-colors"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0A0A0A] border border-[#262626] focus:border-[#E31E24] rounded-xl py-3 pr-10 pl-3 text-sm outline-none transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-[#0A0A0A] border border-[#262626] focus:border-[#E31E24] rounded-xl py-3 pr-10 pl-3 text-sm outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          {info && (
            <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
              {info}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-[#E31E24] hover:bg-[#c81920] disabled:opacity-60 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
          </button>
        </form>

        <div className="text-center mt-5 text-xs text-gray-400">
          {mode === 'login' ? (
            <>
              مفيش حساب؟{' '}
              <button
                onClick={() => {
                  setMode('signup');
                  setError(null);
                  setInfo(null);
                }}
                className="text-[#E31E24] font-bold"
              >
                سجّل دلوقتي
              </button>
            </>
          ) : (
            <>
              عندك حساب بالفعل؟{' '}
              <button
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setInfo(null);
                }}
                className="text-[#E31E24] font-bold"
              >
                تسجيل الدخول
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
