import React, { useState } from 'react';
import { Lock, AtSign, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginProps {
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await signIn(identifier.trim(), password);
    setSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    setTimeout(() => {
      onSuccess();
    }, 300);
  };

  return (
    <div dir="rtl" className="min-h-screen w-full bg-[#0A0A0A] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[#141414] border border-[#262626] rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-xl font-extrabold text-[#E31E24]">لوحة تحكم الإدارة</h1>
          <p className="text-xs text-gray-500 mt-1">دخول مخصص للمشرفين فقط</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <AtSign className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="اسم المستخدم"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
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
              className="w-full bg-[#0A0A0A] border border-[#262626] focus:border-[#E31E24] rounded-xl py-3 pr-10 pl-3 text-sm outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-[#E31E24] hover:bg-[#c81920] disabled:opacity-60 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            دخول
          </button>
        </form>
      </div>
    </div>
  );
};
