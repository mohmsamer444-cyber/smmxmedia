import React, { useEffect, useState } from 'react';
import { Users, Wallet, CheckCircle2, XCircle, RefreshCw, Search, Settings, Tag, Plus, Trash2, FileText } from 'lucide-react';
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
  proof_image_url: string | null;
  status: string;
  created_at: string;
  profiles?: { full_name: string | null; email: string | null } | null;
}

interface SettingRow {
  key: string;
  value: string;
}

interface PackageRow {
  id: string;
  game: string;
  amount: number;
  unit: string;
  price_usd: number;
  label: string | null;
}

interface PostRow {
  id: string;
  content: string;
  image_url: string | null;
  video_url: string | null;
  game_tag: string | null;
  price_tag: string | null;
  hashtags: string[] | null;
  created_at: string;
}

const GAME_LABELS: Record<string, string> = {
  pubg: 'ببجي (PUBG)',
  freefire: 'فري فاير',
  efootball: 'إيفوتبول',
  tiktok: 'تيك توك',
  ai: 'اشتراكات AI',
};

export const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<'users' | 'deposits' | 'settings' | 'packages' | 'posts'>('users');
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [deposits, setDeposits] = useState<DepositRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [balanceEdits, setBalanceEdits] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  // Settings (payment numbers/addresses) state
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [settingEdits, setSettingEdits] = useState<Record<string, string>>({});

  // Packages (game top-ups / AI subscriptions) state
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [packageEdits, setPackageEdits] = useState<Record<string, string>>({});
  const [newPkg, setNewPkg] = useState({ id: '', game: 'pubg', amount: '', unit: '', price_usd: '', label: '' });

  // Catalog posts (admin-only storefront posts) state
  const [catalogPosts, setCatalogPosts] = useState<PostRow[]>([]);
  const [newPost, setNewPost] = useState({ content: '', image_url: '', video_url: '', game_tag: '', price_tag: '', hashtags: '' });

  const loadData = async () => {
    setLoading(true);
    const { data: usersData } = await supabase
      .from('profiles')
      .select('id, email, phone, full_name, balance, is_admin, created_at')
      .order('created_at', { ascending: false });
    setUsers(usersData || []);

    const { data: depositsData } = await supabase
      .from('deposit_requests')
      .select('id, user_id, amount, method, note, proof_image_url, status, created_at, profiles(full_name, email)')
      .order('created_at', { ascending: false });
    setDeposits((depositsData as any) || []);

    const { data: settingsData } = await supabase.from('site_settings').select('key, value');
    setSettings(settingsData || []);

    const { data: packagesData } = await supabase
      .from('game_packages')
      .select('id, game, amount, unit, price_usd, label')
      .order('game', { ascending: true });
    setPackages((packagesData as any) || []);

    const { data: postsData } = await supabase
      .from('posts')
      .select('id, content, image_url, video_url, game_tag, price_tag, hashtags, created_at')
      .order('created_at', { ascending: false });
    setCatalogPosts((postsData as any) || []);

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

  const getSetting = (key: string) => settings.find((s) => s.key === key)?.value || '';

  const saveSetting = async (key: string) => {
    const value = settingEdits[key];
    if (value === undefined) return;
    const { error } = await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' });
    if (!error) {
      showMsg('تم تحديث الإعداد بنجاح');
      loadData();
    } else {
      showMsg('حصل خطأ: ' + error.message);
    }
  };

  const savePackagePrice = async (pkgId: string) => {
    const value = packageEdits[pkgId];
    if (value === undefined || value === '') return;
    const numeric = parseFloat(value);
    if (isNaN(numeric)) return;
    const { error } = await supabase.from('game_packages').update({ price_usd: numeric }).eq('id', pkgId);
    if (!error) {
      showMsg('تم تحديث السعر بنجاح');
      loadData();
    } else {
      showMsg('حصل خطأ: ' + error.message);
    }
  };

  const deletePackage = async (pkgId: string) => {
    const { error } = await supabase.from('game_packages').delete().eq('id', pkgId);
    if (!error) {
      showMsg('تم حذف الباقة');
      loadData();
    } else {
      showMsg('حصل خطأ: ' + error.message);
    }
  };

  const addPackage = async () => {
    if (!newPkg.id.trim() || !newPkg.amount || !newPkg.unit.trim() || !newPkg.price_usd) {
      showMsg('من فضلك املأ كل الحقول (الكود، الكمية، الوحدة، السعر)');
      return;
    }
    const { error } = await supabase.from('game_packages').insert({
      id: newPkg.id.trim(),
      game: newPkg.game,
      amount: parseFloat(newPkg.amount),
      unit: newPkg.unit.trim(),
      price_usd: parseFloat(newPkg.price_usd),
      label: newPkg.label.trim() || null,
    });
    if (!error) {
      showMsg('تمت إضافة الباقة بنجاح');
      setNewPkg({ id: '', game: 'pubg', amount: '', unit: '', price_usd: '', label: '' });
      loadData();
    } else {
      showMsg('حصل خطأ: ' + error.message);
    }
  };

  const addCatalogPost = async () => {
    if (!newPost.content.trim()) {
      showMsg('اكتب وصف المنشور الأول');
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData?.user?.id;
    if (!uid) {
      showMsg('تعذر التأكد من حساب الأدمن، سجل دخول تاني');
      return;
    }
    const hashtagsArr = newPost.hashtags
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);
    const { error } = await supabase.from('posts').insert({
      user_id: uid,
      content: newPost.content.trim(),
      image_url: newPost.image_url.trim() || null,
      video_url: newPost.video_url.trim() || null,
      game_tag: newPost.game_tag.trim() || null,
      price_tag: newPost.price_tag.trim() || null,
      hashtags: hashtagsArr.length > 0 ? hashtagsArr : null,
    });
    if (!error) {
      showMsg('تم نشر المنشور في الكتالوج بنجاح');
      setNewPost({ content: '', image_url: '', video_url: '', game_tag: '', price_tag: '', hashtags: '' });
      loadData();
    } else {
      showMsg('حصل خطأ: ' + error.message);
    }
  };

  const deleteCatalogPost = async (postId: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (!error) {
      showMsg('تم حذف المنشور');
      loadData();
    } else {
      showMsg('حصل خطأ: ' + error.message);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen w-full bg-[#0A0A0A] text-white">
      <div className="sticky top-0 z-10 bg-[#121212] border-b border-[#262626] px-4 py-3 flex items-center justify-between">
        <h1 className="font-extrabold text-lg text-[#E8123D]">لوحة تحكم الأدمن</h1>
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

      <div className="px-4 pt-4 flex gap-2 max-w-2xl mx-auto flex-wrap">
        <button
          onClick={() => setTab('users')}
          className={`flex-1 min-w-[45%] py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            tab === 'users' ? 'bg-[#E8123D] text-white' : 'bg-[#141414] text-gray-400 border border-[#262626]'
          }`}
        >
          <Users className="w-4 h-4" />
          المستخدمين ({users.length})
        </button>
        <button
          onClick={() => setTab('deposits')}
          className={`flex-1 min-w-[45%] py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            tab === 'deposits' ? 'bg-[#E8123D] text-white' : 'bg-[#141414] text-gray-400 border border-[#262626]'
          }`}
        >
          <Wallet className="w-4 h-4" />
          طلبات الشحن ({deposits.filter((d) => d.status === 'pending').length})
        </button>
        <button
          onClick={() => setTab('settings')}
          className={`flex-1 min-w-[45%] py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            tab === 'settings' ? 'bg-[#E8123D] text-white' : 'bg-[#141414] text-gray-400 border border-[#262626]'
          }`}
        >
          <Settings className="w-4 h-4" />
          إعدادات الدفع
        </button>
        <button
          onClick={() => setTab('packages')}
          className={`flex-1 min-w-[45%] py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            tab === 'packages' ? 'bg-[#E8123D] text-white' : 'bg-[#141414] text-gray-400 border border-[#262626]'
          }`}
        >
          <Tag className="w-4 h-4" />
          الأسعار ({packages.length})
        </button>
        <button
          onClick={() => setTab('posts')}
          className={`flex-1 min-w-[45%] py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            tab === 'posts' ? 'bg-[#E8123D] text-white' : 'bg-[#141414] text-gray-400 border border-[#262626]'
          }`}
        >
          <FileText className="w-4 h-4" />
          المنشورات ({catalogPosts.length})
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
              className="w-full bg-[#141414] border border-[#262626] rounded-xl py-2.5 pr-10 pl-3 text-sm outline-none focus:border-[#E8123D]"
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
                  <span className="text-[10px] bg-[#E8123D]/20 text-[#E8123D] px-2 py-1 rounded-full font-bold">
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
                  className="flex-1 bg-[#0A0A0A] border border-[#262626] rounded-lg py-2 px-3 text-xs outline-none focus:border-[#E8123D]"
                />
                <button
                  onClick={() => updateBalance(u.id)}
                  className="px-3 py-2 rounded-lg bg-[#E8123D] text-white text-xs font-bold"
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
              {d.proof_image_url && (
                <a
                  href={d.proof_image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-1"
                >
                  <img
                    src={d.proof_image_url}
                    alt="إثبات الدفع"
                    className="w-full max-h-48 object-cover rounded-lg border border-[#262626]"
                  />
                </a>
              )}

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
      {tab === 'settings' && (
        <div className="p-4 space-y-3 max-w-2xl mx-auto">
          <p className="text-xs text-gray-400 leading-relaxed">
            الأرقام والعناوين دي بتظهر مباشرة للمستخدمين في صفحة "شحن الرصيد". أي تعديل هنا يتحدث على الموقع فورًا.
          </p>

          {[
            { key: 'vodafone_cash_number', label: 'رقم فودافون كاش', placeholder: '01xxxxxxxxx' },
            { key: 'binance_address', label: 'عنوان محفظة Binance (USDT)', placeholder: '0x...' },
            { key: 'binance_pay_id', label: 'Binance Pay ID', placeholder: '123456789' },
            { key: 'instapay_address', label: 'عنوان إنستا باي', placeholder: 'name@instapay' },
          ].map((field) => (
            <div key={field.key} className="bg-[#141414] border border-[#262626] rounded-xl p-3.5 space-y-2">
              <p className="text-xs font-bold text-gray-300">{field.label}</p>
              <p className="text-[11px] text-gray-500 dir-ltr">
                الحالي: {getSetting(field.key) || '(غير محدد بعد)'}
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  dir="ltr"
                  placeholder={field.placeholder}
                  value={settingEdits[field.key] ?? getSetting(field.key)}
                  onChange={(e) => setSettingEdits({ ...settingEdits, [field.key]: e.target.value })}
                  className="flex-1 bg-[#0A0A0A] border border-[#262626] rounded-lg py-2 px-3 text-xs outline-none focus:border-[#E8123D] dir-ltr text-left"
                />
                <button
                  onClick={() => saveSetting(field.key)}
                  className="px-3 py-2 rounded-lg bg-[#E8123D] text-white text-xs font-bold shrink-0"
                >
                  حفظ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'packages' && (
        <div className="p-4 space-y-3 max-w-2xl mx-auto">
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-3.5 space-y-2">
            <p className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              إضافة باقة جديدة
            </p>
            <select
              value={newPkg.game}
              onChange={(e) => setNewPkg({ ...newPkg, game: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg py-2 px-3 text-xs outline-none focus:border-[#E8123D]"
            >
              <option value="pubg">ببجي (PUBG)</option>
              <option value="freefire">فري فاير</option>
              <option value="efootball">إيفوتبول</option>
              <option value="tiktok">تيك توك</option>
              <option value="ai">اشتراكات AI</option>
            </select>
            <input
              type="text"
              placeholder="كود الباقة (مثال: pubg-7)"
              value={newPkg.id}
              onChange={(e) => setNewPkg({ ...newPkg, id: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg py-2 px-3 text-xs outline-none focus:border-[#E8123D]"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="الكمية"
                value={newPkg.amount}
                onChange={(e) => setNewPkg({ ...newPkg, amount: e.target.value })}
                className="bg-[#0A0A0A] border border-[#262626] rounded-lg py-2 px-3 text-xs outline-none focus:border-[#E8123D]"
              />
              <input
                type="text"
                placeholder="الوحدة (UC / شهر)"
                value={newPkg.unit}
                onChange={(e) => setNewPkg({ ...newPkg, unit: e.target.value })}
                className="bg-[#0A0A0A] border border-[#262626] rounded-lg py-2 px-3 text-xs outline-none focus:border-[#E8123D]"
              />
            </div>
            <input
              type="number"
              step="0.01"
              placeholder="السعر بالدولار"
              value={newPkg.price_usd}
              onChange={(e) => setNewPkg({ ...newPkg, price_usd: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg py-2 px-3 text-xs outline-none focus:border-[#E8123D]"
            />
            <input
              type="text"
              placeholder="اسم مخصص (اختياري - لاشتراكات AI مثلاً)"
              value={newPkg.label}
              onChange={(e) => setNewPkg({ ...newPkg, label: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg py-2 px-3 text-xs outline-none focus:border-[#E8123D]"
            />
            <button
              onClick={addPackage}
              className="w-full py-2 rounded-lg bg-[#E8123D] text-white text-xs font-bold"
            >
              إضافة الباقة
            </button>
          </div>

          {packages.map((p) => (
            <div key={p.id} className="bg-[#141414] border border-[#262626] rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">{p.label || `${p.amount} ${p.unit}`}</p>
                  <p className="text-[11px] text-gray-500">{GAME_LABELS[p.game] || p.game} — كود: {p.id}</p>
                </div>
                <button
                  onClick={() => deletePackage(p.id)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">السعر الحالي:</span>
                <span className="text-sm font-black text-emerald-400">${p.price_usd}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  placeholder="سعر جديد"
                  value={packageEdits[p.id] ?? ''}
                  onChange={(e) => setPackageEdits({ ...packageEdits, [p.id]: e.target.value })}
                  className="flex-1 bg-[#0A0A0A] border border-[#262626] rounded-lg py-2 px-3 text-xs outline-none focus:border-[#E8123D]"
                />
                <button
                  onClick={() => savePackagePrice(p.id)}
                  className="px-3 py-2 rounded-lg bg-[#E8123D] text-white text-xs font-bold"
                >
                  تحديث
                </button>
              </div>
            </div>
          ))}

          {!loading && packages.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-8">
              لسه مفيش باقات في قاعدة البيانات — الموقع بيعرض الأسعار الافتراضية. أضف باقة من الفورم فوق عشان تبدأ التحكم من هنا.
            </p>
          )}
        </div>
      )}

      {tab === 'posts' && (
        <div className="p-4 space-y-3 max-w-2xl mx-auto">
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-3.5 space-y-2">
            <p className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              إضافة منشور جديد للكتالوج
            </p>
            <textarea
              placeholder="وصف العرض..."
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              rows={3}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg py-2 px-3 text-xs outline-none focus:border-[#E8123D] resize-none"
            />
            <input
              type="text"
              dir="ltr"
              placeholder="رابط الصورة (image URL)"
              value={newPost.image_url}
              onChange={(e) => setNewPost({ ...newPost, image_url: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg py-2 px-3 text-xs outline-none focus:border-[#E8123D] text-left"
            />
            <input
              type="text"
              dir="ltr"
              placeholder="رابط الفيديو (video URL — اختياري)"
              value={newPost.video_url}
              onChange={(e) => setNewPost({ ...newPost, video_url: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg py-2 px-3 text-xs outline-none focus:border-[#E8123D] text-left"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="تصنيف (مثال: تيك توك)"
                value={newPost.game_tag}
                onChange={(e) => setNewPost({ ...newPost, game_tag: e.target.value })}
                className="bg-[#0A0A0A] border border-[#262626] rounded-lg py-2 px-3 text-xs outline-none focus:border-[#E8123D]"
              />
              <input
                type="text"
                placeholder="السعر (مثال: 10$)"
                value={newPost.price_tag}
                onChange={(e) => setNewPost({ ...newPost, price_tag: e.target.value })}
                className="bg-[#0A0A0A] border border-[#262626] rounded-lg py-2 px-3 text-xs outline-none focus:border-[#E8123D]"
              />
            </div>
            <input
              type="text"
              placeholder="وسوم مفصولة بفاصلة (اختياري)"
              value={newPost.hashtags}
              onChange={(e) => setNewPost({ ...newPost, hashtags: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg py-2 px-3 text-xs outline-none focus:border-[#E8123D]"
            />
            <button
              onClick={addCatalogPost}
              className="w-full py-2 rounded-lg bg-[#E8123D] text-white text-xs font-bold"
            >
              نشر في الكتالوج
            </button>
            <p className="text-[10px] text-gray-500">
              الفيديو والصورة اختياريين — تقدر تحط واحد بس أو الاتنين أو تسيبهم فاضيين.
            </p>
          </div>

          {catalogPosts.map((p) => (
            <div key={p.id} className="bg-[#141414] border border-[#262626] rounded-xl p-3.5 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-gray-200 leading-relaxed flex-1">{p.content}</p>
                <button
                  onClick={() => deleteCatalogPost(p.id)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {p.image_url && (
                <img src={p.image_url} alt="" className="w-full h-32 object-cover rounded-lg" />
              )}
              {p.video_url && (
                <video src={p.video_url} controls className="w-full h-32 object-cover rounded-lg bg-black" />
              )}
              <div className="flex items-center gap-2 flex-wrap text-[10px] text-gray-500">
                {p.game_tag && <span className="px-2 py-0.5 rounded bg-[#0A0A0A] border border-[#262626]">{p.game_tag}</span>}
                {p.price_tag && <span className="px-2 py-0.5 rounded bg-[#0A0A0A] border border-[#262626]">{p.price_tag}</span>}
                <span>{new Date(p.created_at).toLocaleString('ar-EG')}</span>
              </div>
            </div>
          ))}

          {!loading && catalogPosts.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-8">
              لسه مفيش منشورات في الكتالوج. أضف أول عرض من الفورم فوق.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
