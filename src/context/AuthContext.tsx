import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, supabaseConfigMissing } from '../lib/supabaseClient';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (identifier: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (identifier: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabaseConfigMissing) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (identifier: string, password: string, fullName: string) => {
    const isPhone = isPhoneNumber(identifier);
    const email = isPhone ? phoneToInternalEmail(identifier) : identifier;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone: isPhone ? identifier : null } },
    });

    if (error) {
      return { error: translateAuthError(error.message) };
    }

    // Safety net: make sure a profile row exists for this new user with a
    // fresh balance of 0, in case the DB trigger hasn't created it yet.
    if (data.user?.id) {
      await supabase.from('profiles').upsert(
        {
          id: data.user.id,
          email: isPhone ? null : email,
          phone: isPhone ? identifier : null,
          full_name: fullName,
          balance: 0,
        },
        { onConflict: 'id', ignoreDuplicates: true }
      );
    }

    return { error: null };
  };

  const signIn = async (identifier: string, password: string) => {
    const isPhone = isPhoneNumber(identifier);
    const email = isPhone ? phoneToInternalEmail(identifier) : identifier;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? translateAuthError(error.message) : null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, loading, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

function isPhoneNumber(value: string): boolean {
  return /^[0-9+][0-9\s-]{6,}$/.test(value.trim()) && !value.includes('@');
}

function phoneToInternalEmail(phone: string): string {
  const digits = phone.trim().replace(/[^0-9]/g, '');
  return `phone_${digits}@smmxmedia.local`;
}

function translateAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) return 'البيانات غير صحيحة';
  if (message.includes('User already registered')) return 'الحساب ده مسجل بالفعل';
  if (message.includes('Password should be at least')) return 'كلمة المرور لازم تكون 6 أحرف على الأقل';
  if (message.includes('Unable to validate email')) return 'صيغة البريد أو الرقم غير صحيحة';
  return message;
}
