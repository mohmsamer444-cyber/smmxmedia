import React, { useEffect, useState } from 'react';
import { Users, Wallet, CheckCircle2, XCircle, RefreshCw, Search } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface ProfileRow {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  balance: number;
  is_admin: boolean;
  created_at: string;
}

interface DepositRow {
  id: string;
  user_id: string;
  amount: number;
  method: string | null;
  note: string | null;
  status: string;
  created_at: string;
  profiles?: { full_name: string | null; email: string | null } | null;
}

export const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<'users' | 'deposits'>('users');
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [deposits, setDeposits] = useState<DepositRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [balanceEdits, setBalanceEdits] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const { data: usersData } = await supabase
      .from('profiles')
      .select('id, email, phone, full_name, balance, is_admin, created_at')
      .order('created_at', { ascending: false });
    setUsers(usersData || []);

    const { data: depositsData } = await supabase
      .from('deposit_requests')
      .select('id, user_id, amount, method, note, status, created_at, profiles(full_name, email)')
      .order('created_at', { ascending: false });
    setDeposits((depositsData as any) || []);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showMsg = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2500);
  };

  const updateBalance = async (userId: string) => {
    const value = balanceEdits[userId];
    if (value === undefined || value === '') return;
    const numeric = parseFloat(value);
    if (isNaN(numeric)) return;
    const { error } = await supabase.from('profiles').update({ balance: numeric }).eq('id', userId);
    if (!error) {
      showMsg('تم تحديث الرصيد بنجاح');
      loadData();
    } else {
      showMsg('حصل خطأ: ' + error.message);
    }
  };

  const addToBalance = async (userId: string, currentBalance: number, amount: number) => {
    const { error } = await supabase
      .from('profiles')
      .update({ balance: currentBalance + amount })
      .eq('id', userId);
    if (!error) {
      showMsg(`تم إضافة ${amount} للرصيد`);
      loadData();
    } else {
      showMsg('حصل خطأ: ' + error.message);
    }
  };

  const handleDepositAction = async (deposit: DepositRow, approve: boolean) => {
    const newStatus = approve ? 'approved' : 'rejected';
    const { error } = await supabase
      .from('deposit_requests')
      .update({ status: newStatus })
      .eq('id', deposit.id);
    if (error) {
      showMsg('حصل خطأ: ' + error.message);
      return;
    }
    if (approve) {
      const target = users.find((u) => u.id === deposit.user_id);
      if (target) {
        await supabase
          .from('profiles')
          .update({ balance: target.balance + deposit.amount })
          .eq('id', deposit.user_id);
      }
    }
    showMsg(approve ? 'تمت الموافقة وإضافة الرصيد' : 'تم رفض الطلب');
    loadData();
  };

  const filteredUsers = users.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (u.full_name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q)
    );
  });

  return (
    <div dir="rtl" className="min-h-screen w-full bg-[#0A0A0A] text-white">
      <div className="sticky top-0 z-10 bg-[#121212] border-b border-[#262626] px-4 py-3 flex items-center justify-between">
        <h1 className="font-extrabold text-lg text-[#E31E24]">لوحة تحكم الأدمن</h1>
        <button
          onClick={loadData}
          className="p-2 rounded-lg bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#262626] transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {message && (
        <div className="mx-4 mt-3 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg px-3 py-2">
          {message}
        </div>
      )}

      <div className="px-4 pt-4 flex gap-2 max-w-2xl mx-auto">
        <button
          onClick={() => setTab('users')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            tab === 'users' ? 'bg-[#E31E24] text-white' : 'bg-[#141414] text-gray-400 border border-[#262626]'
          }`}
        >
          <Users className="w-4 h-4" />
          المستخدمين ({users.length})
        </button>
        <button
          onClick={() => setTab('deposits')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            tab === 'deposits' ? 'bg-[#E31E24] text-white' : 'bg-[#141414] text-gray-400 border border-[#262626]'
          }`}
        >
          <Wallet className="w-4 h-4" />
          طلبات الشحن ({deposits.filter((d) => d.status === 'pending').length})
        </button>
      </div>

      {tab === 'users' && (
        <div className="p-4 space-y-3 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو الإيميل أو الرقم..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#141414] border border-[#262626] rounded-xl py-2.5 pr-10 pl-3 text-sm outline-none focus:border-[#E31E24]"
            />
          </div>

          {filteredUsers.map((u) => (
            <div key={u.id} className="bg-[#141414] border border-[#262626] rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">{u.full_name || 'بدون اسم'}</p>
                  <p className="text-[11px] text-gray-500">{u.email}</p>
                  {u.phone && <p className="text-[11px] text-gray-500">{u.phone}</p>}
                </div>
                {u.is_admin && (
                  <span className="text-[10px] bg-[#E31E24]/20 text-[#E31E24] px-2 py-1 rounded-full font-bold">
                    أدمن
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">الرصيد الحالي:</span>
                <span className="text-sm font-black text-emerald-400">${u.balance.toFixed(2)}</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="رصيد جديد"
                  value={balanceEdits[u.id] ?? ''}
                  onChange={(e) => setBalanceEdits({ ...balanceEdits, [u.id]: e.target.value })}
                  className="flex-1 bg-[#0A0A0A] border border-[#262626] rounded-lg py-2 px-3 text-xs outline-none focus:border-[#E31E24]"
                />
                <button
                  onClick={() => updateBalance(u.id)}
                  className="px-3 py-2 rounded-lg bg-[#E31E24] text-white text-xs font-bold"
                >
                  تعيين
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => addToBalance(u.id, u.balance, 10)}
                  className="flex-1 py-1.5 rounded-lg bg-[#0A0A0A] border border-[#262626] text-emerald-400 text-[11px] font-bold"
                >
                  + $10
                </button>
                <button
                  onClick={() => addToBalance(u.id, u.balance, 50)}
                  className="flex-1 py-1.5 rounded-lg bg-[#0A0A0A] border border-[#262626] text-emerald-400 text-[11px] font-bold"
                >
                  + $50
                </button>
                <button
                  onClick={() => addToBalance(u.id, u.balance, 100)}
                  className="flex-1 py-1.5 rounded-lg bg-[#0A0A0A] border border-[#262626] text-emerald-400 text-[11px] font-bold"
                >
                  + $100
                </button>
              </div>
            </div>
          ))}

          {!loading && filteredUsers.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-8">مفيش مستخدمين</p>
          )}
        </div>
      )}

      {tab === 'deposits' && (
        <div className="p-4 space-y-3 max-w-2xl mx-auto">
          {deposits.map((d) => (
            <div key={d.id} className="bg-[#141414] border border-[#262626] rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">{d.profiles?.full_name || 'مستخدم'}</p>
                  <p className="text-[11px] text-gray-500">{d.profiles?.email}</p>
                </div>
                <span
                  className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                    d.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : d.status === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {d.status === 'pending' ? 'قيد الانتظار' : d.status === 'approved' ? 'تمت الموافقة' : 'مرفوض'}
                </span>
              </div>
              <p className="text-sm font-black text-emerald-400">${d.amount}</p>
              {d.method && <p className="text-xs text-gray-400">طريقة الدفع: {d.method}</p>}
              {d.note && <p className="text-xs text-gray-400">ملاحظة: {d.note}</p>}

              {d.status === 'pending' && (
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleDepositAction(d, true)}
                    className="flex-1 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    موافقة
                  </button>
                  <button
                    onClick={() => handleDepositAction(d, false)}
                    className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    رفض
                  </button>
                </div>
              )}
            </div>
          ))}

          {!loading && deposits.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-8">مفيش طلبات شحن</p>
          )}
        </div>
      )}
    </div>
  );
};
