import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Code, Key, Globe, RefreshCw, CheckCircle2, ShieldCheck, Copy, Check, Terminal, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ApiSettingsModal: React.FC = () => {
  const { isApiSettingsOpen, closeApiSettingsModal, reloadServices, showToast } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'myKey' | 'provider'>('myKey');

  // User's Reseller API Key State
  const [userApiKey, setUserApiKey] = useState<string>('smmx_live_8f7a912e340b12cd567a');
  const [copied, setCopied] = useState(false);

  // Upstream Provider State
  const [apiUrl, setApiUrl] = useState<string>(import.meta.env.VITE_SMM_API_URL || 'https://alsharq-world.com/api/v2');
  const [providerApiKey, setProviderApiKey] = useState<string>(import.meta.env.VITE_SMM_API_KEY || '');
  const [isTesting, setIsTesting] = useState(false);

  if (!isApiSettingsOpen) return null;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(userApiKey);
    setCopied(true);
    showToast('تم نسخ مفتاح الـ API الخاص بك بنجاح', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateKey = () => {
    const newKey = 'smmx_live_' + Array.from({ length: 20 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setUserApiKey(newKey);
    showToast('تمت إعادة توليد مفتاح الـ API بنجاح! احتفظ بالمفتاح الجديد', 'info');
  };

  const handleTestAndSaveProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);

    try {
      await reloadServices();
      showToast('تم الاتصال بنجاح وتحديث خدمات المزود!', 'success');
      closeApiSettingsModal();
    } catch {
      showToast('تعذر الاتصال بالمزود، يرجى التأكد من البيانات', 'error');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#141414] border border-[#262626] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 border-b border-[#262626] flex items-center justify-between bg-[#1a1a1a]">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-[#E31E24]" />
              إعدادات API وربط الموزعين (SMM Reseller API)
            </h3>
            <button
              onClick={closeApiSettingsModal}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#262626]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center border-b border-[#262626] bg-[#0A0A0A]">
            <button
              onClick={() => setActiveSubTab('myKey')}
              className={`flex-1 py-3 text-xs font-bold transition-colors border-b-2 text-center ${
                activeSubTab === 'myKey'
                  ? 'border-[#E31E24] text-[#E31E24] bg-[#E31E24]/5'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              مفتاح الـ API الخاص بك وإعادة البيع
            </button>
            <button
              onClick={() => setActiveSubTab('provider')}
              className={`flex-1 py-3 text-xs font-bold transition-colors border-b-2 text-center ${
                activeSubTab === 'provider'
                  ? 'border-[#E31E24] text-[#E31E24] bg-[#E31E24]/5'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              إعدادات ربط المزود الخارجي
            </button>
          </div>

          <div className="p-5 space-y-4 overflow-y-auto text-right">
            {activeSubTab === 'myKey' ? (
              <div className="space-y-4">
                {/* Explanation Banner */}
                <div className="p-3.5 bg-[#0A0A0A] border border-[#E31E24]/30 rounded-xl space-y-1.5 text-xs text-gray-300">
                  <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-[#E31E24]" />
                    استخدم هذا المفتاح لربط موقعك الخاص بخدماتنا وبيعها لعملائك
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    يوفر لك عالم الشرق الأوسط واجهة برمجة تطبيقات (API) قياسية تتيح لك سحب جميع خدماتنا وعرضها على متجرك أو بانلك الخاص وتنفيذ الطلبات أوتوماتيكياً ورسومات أرباحك مباشرة!
                  </p>
                </div>

                {/* API Key Box */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white block flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-[#E31E24]" />
                      مفتاح الـ API الشخصي (Your Reseller API Key)
                    </span>
                    <button
                      onClick={handleRegenerateKey}
                      className="text-[10px] text-[#E31E24] hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      إعادة توليد المفتاح
                    </button>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={userApiKey}
                      className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-white dir-ltr text-left font-mono focus:outline-none"
                    />
                    <button
                      onClick={handleCopyKey}
                      className="px-4 py-2.5 rounded-xl bg-[#E31E24] hover:bg-[#c11319] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'تم النسخ' : 'نسخ المفتاح'}
                    </button>
                  </div>
                </div>

                {/* API Documentation Specs Summary */}
                <div className="space-y-2 pt-2 border-t border-[#262626]">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#E31E24]" />
                    توثيق واجهة API (API Endpoint Specs)
                  </h4>
                  <div className="p-3 bg-[#0A0A0A] border border-[#262626] rounded-xl text-xs space-y-2 font-mono">
                    <div className="flex items-center justify-between text-gray-300">
                      <span className="text-gray-500 font-sans">رابط الخدمة:</span>
                      <span className="text-green-400 dir-ltr">POST https://alsharq-world.com/api/v2</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="p-2.5 bg-[#1a1a1a] rounded-lg border border-[#262626] flex items-center justify-between">
                      <span className="font-mono text-gray-300 dir-ltr text-left">action = "services"</span>
                      <span className="text-gray-400">جلب قائمة جميع الخدمات مع الأسعار</span>
                    </div>
                    <div className="p-2.5 bg-[#1a1a1a] rounded-lg border border-[#262626] flex items-center justify-between">
                      <span className="font-mono text-gray-300 dir-ltr text-left">action = "add"</span>
                      <span className="text-gray-400">إنشاء طلب جديد (service, link, quantity)</span>
                    </div>
                    <div className="p-2.5 bg-[#1a1a1a] rounded-lg border border-[#262626] flex items-center justify-between">
                      <span className="font-mono text-gray-300 dir-ltr text-left">action = "status"</span>
                      <span className="text-gray-400">الاستعلام عن حالة طلب بالرقم المعرف</span>
                    </div>
                    <div className="p-2.5 bg-[#1a1a1a] rounded-lg border border-[#262626] flex items-center justify-between">
                      <span className="font-mono text-gray-300 dir-ltr text-left">action = "balance"</span>
                      <span className="text-gray-400">جلب رصيد حسابك الحالي والعملة</span>
                    </div>
                    <div className="p-2.5 bg-[#1a1a1a] rounded-lg border border-[#262626] flex items-center justify-between">
                      <span className="font-mono text-gray-300 dir-ltr text-left">action = "refill" / "cancel"</span>
                      <span className="text-gray-400">طلب إعادة التعبئة أو الإلغاء</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleTestAndSaveProvider} className="space-y-4">
                <div className="p-3 bg-[#0A0A0A] border border-[#262626] rounded-xl space-y-2 text-xs text-gray-300">
                  <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <Globe className="w-4 h-4 text-[#E31E24]" />
                    ربط الموقع بمزود خدمة خارجي (Upstream Provider)
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    يمكنك تغيير المزود الرئيسي عبر إدخال رابط الـ API للبانل الرئيسي ومفتاحك، وسيتم سحب كافة الأسعار وتحديث الطلبات فورياً.
                  </p>
                </div>

                {/* API URL */}
                <div>
                  <label className="text-xs font-bold text-white block mb-1.5">
                    رابط الـ API للمزود (API URL)
                  </label>
                  <input
                    type="url"
                    value={apiUrl}
                    onChange={e => setApiUrl(e.target.value)}
                    placeholder="https://alsharq-world.com/api/v2"
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E31E24] dir-ltr text-left font-sans"
                  />
                </div>

                {/* Provider API Key */}
                <div>
                  <label className="text-xs font-bold text-white block mb-1.5">
                    مفتاح المزود الخارجي (Provider API Key)
                  </label>
                  <input
                    type="password"
                    value={providerApiKey}
                    onChange={e => setProviderApiKey(e.target.value)}
                    placeholder="ضع مفتاح API هنا..."
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E31E24] dir-ltr text-left font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isTesting}
                  className="w-full py-3 rounded-xl bg-[#E31E24] hover:bg-[#c11319] text-white font-bold text-sm shadow-lg red-glow transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
                  {isTesting ? 'جاري اختبار الاتصال...' : 'حفظ واختبار جلب الخدمات'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
