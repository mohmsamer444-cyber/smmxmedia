import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import {
  X,
  Wallet,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Copy,
  Check,
  Upload,
  Building2,
  QrCode,
  Smartphone,
  CreditCard,
  Image as ImageIcon,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface DepositRecord {
  id: string;
  method: string;
  methodName: string;
  amountUSD: number;
  refNumber: string;
  senderInfo: string;
  proofImageName?: string;
  date: string;
  status: 'pending' | 'completed' | 'rejected';
}

export const DepositModal: React.FC = () => {
  const { isDepositModalOpen, closeDepositModal, refreshBalance, formatPrice, showToast } = useApp();
  const { session } = useAuth();

  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('vodafone');
  const [amountUSD, setAmountUSD] = useState<number>(50);

  // Proof of payment fields
  const [refNumber, setRefNumber] = useState<string>('');
  const [senderInfo, setSenderInfo] = useState<string>('');
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);

  // Copy indicator state
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Real deposit history, fetched from Supabase for the logged-in user
  const [depositsHistory, setDepositsHistory] = useState<DepositRecord[]>([]);

  const loadHistory = async () => {
    if (!session?.user?.id) return;
    setIsLoadingHistory(true);
    const { data, error } = await supabase
      .from('deposit_requests')
      .select('id, amount, method, note, status, created_at')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    if (!error && data) {
      const mapped: DepositRecord[] = data.map((row: any) => ({
        id: row.id,
        method: row.method || '',
        methodName: row.method || 'غير محدد',
        amountUSD: Number(row.amount) || 0,
        refNumber: '',
        senderInfo: row.note || '',
        date: new Date(row.created_at).toLocaleDateString('ar-EG') +
          ' ' + new Date(row.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        status: row.status === 'approved' ? 'completed' : row.status === 'rejected' ? 'rejected' : 'pending',
      }));
      setDepositsHistory(mapped);
    }
    setIsLoadingHistory(false);
  };

  // Real payment settings (Vodafone Cash number, Binance address, etc.) — editable from the admin panel
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({
    vodafone_cash_number: '01027804619',
    binance_address: '0xc8138080a061a905de676C3C215Ecd499c72F1E9',
    binance_pay_id: '829104829',
    instapay_address: 'alsharqworld@instapay',
  });

  const loadSiteSettings = async () => {
    const { data, error } = await supabase.from('site_settings').select('key, value');
    if (!error && data && data.length > 0) {
      const map: Record<string, string> = {};
      data.forEach((row: any) => { map[row.key] = row.value; });
      setSiteSettings(prev => ({ ...prev, ...map }));
    }
  };

  useEffect(() => {
    if (isDepositModalOpen) {
      loadHistory();
      refreshBalance();
      loadSiteSettings();
    }
  }, [isDepositModalOpen]);

  if (!isDepositModalOpen) return null;

  const paymentMethods = [
    {
      id: 'binance',
      name: 'Binance Pay',
      sub: 'USDT / Binance Pay ID',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: (
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
          <QrCode className="w-4 h-4" />
        </div>
      ),
      details: {
        payId: siteSettings.binance_pay_id,
        network: 'USDT (TRC20 / BEP20)',
        address: siteSettings.binance_address,
      },
    },
    {
      id: 'vodafone',
      name: 'فودافون كاش (Vodafone Cash)',
      sub: 'تحويل محفظة إلكترونية - مصر',
      badgeBg: 'bg-red-500/10 text-red-400 border-red-500/30',
      icon: (
        <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0">
          <Smartphone className="w-4 h-4" />
        </div>
      ),
      details: {
        phone: siteSettings.vodafone_cash_number,
        name: 'عالم الشرق الأوسط - كاش',
        instruction: 'حول المبلغ المطلوب بالكامل من غير أي خصم أو إضافة',
      },
    },
    {
      id: 'instapay',
      name: 'إنستا باي (InstaPay)',
      sub: 'تحويل بنكي لحظي - مصر',
      badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      icon: (
        <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
          <CreditCard className="w-4 h-4" />
        </div>
      ),
      details: {
        address: siteSettings.instapay_address,
        bankName: 'البنك الأهلي المصري',
        accountName: 'ALSHARQ WORLD SERVICES',
      },
    },
    {
      id: 'bank',
      name: 'تحويل بنكي / إيداع',
      sub: 'Bank Transfer / ATM Deposit',
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      icon: (
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
          <Building2 className="w-4 h-4" />
        </div>
      ),
      details: {
        bankName: 'البنك التجاري الدولي CIB',
        accountNumber: '1000-4829-1092',
        iban: 'EG490010004829109200000000001',
      },
    },
  ];

  const selectedMethodObj = paymentMethods.find(m => m.id === selectedMethod) || paymentMethods[1];
  const presets = [10, 25, 50, 100, 250];

  // Validation
  const isFormValid =
    amountUSD > 0 &&
    refNumber.trim().length > 0 &&
    senderInfo.trim().length > 0 &&
    proofImage !== null;

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    showToast('تم النسخ بنجاح', 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofImage(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setProofImage(null);
    setProofPreview(null);
  };

  const handleSubmitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      showToast('يرجى ملء جميع بيانات إثبات الدفع وإرفاق الصورة أولاً', 'error');
      return;
    }
    if (!session?.user?.id) {
      showToast('يجب تسجيل الدخول أولاً لإرسال طلب الإيداع', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      let proofImageUrl: string | null = null;

      if (proofImage) {
        const fileExt = proofImage.name.split('.').pop() || 'jpg';
        const filePath = `${session.user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('deposit-proofs')
          .upload(filePath, proofImage);

        if (uploadError) {
          showToast('تعذر رفع صورة الإثبات: ' + uploadError.message, 'error');
          setIsSubmitting(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from('deposit-proofs')
          .getPublicUrl(filePath);
        proofImageUrl = publicUrlData.publicUrl;
      }

      const noteText = `مرجع: ${refNumber} | المرسل: ${senderInfo}`;

      const { error: insertError } = await supabase.from('deposit_requests').insert({
        user_id: session.user.id,
        amount: amountUSD,
        method: selectedMethodObj.name,
        note: noteText,
        proof_image_url: proofImageUrl,
        status: 'pending',
      });

      if (insertError) {
        showToast('حصل خطأ أثناء إرسال الطلب: ' + insertError.message, 'error');
        setIsSubmitting(false);
        return;
      }

      showToast('تم استلام طلب الإيداع، سيتم مراجعته من قِبل الإدارة قريبًا', 'success');

      // Reset Form
      setRefNumber('');
      setSenderInfo('');
      setProofImage(null);
      setProofPreview(null);
      setActiveTab('history');
      await loadHistory();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#141414] border border-[#262626] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
          dir="rtl"
        >
          {/* Header */}
          <div className="p-4 border-b border-[#262626] flex items-center justify-between bg-[#1a1a1a]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#E8123D]/10 border border-[#E8123D]/30 text-[#E8123D]">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">إضافة أموال — شحن الرصيد</h3>
                <p className="text-[10px] text-gray-400">اختر طريقة الدفع وأرفق إثبات التحويل لشحن حسابك</p>
              </div>
            </div>
            <button
              onClick={closeDepositModal}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#262626] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#262626] bg-[#0A0A0A]">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 text-center flex items-center justify-center gap-2 ${
                activeTab === 'form'
                  ? 'border-[#E8123D] text-[#E8123D] bg-[#E8123D]/5'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              طلب إيداع جديد
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 text-center flex items-center justify-center gap-2 ${
                activeTab === 'history'
                  ? 'border-[#E8123D] text-[#E8123D] bg-[#E8123D]/5'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              سجل الإيداعات
              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[#262626] text-gray-300">
                {depositsHistory.length}
              </span>
            </button>
          </div>

          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-right">
            {activeTab === 'form' ? (
              <form onSubmit={handleSubmitDeposit} className="space-y-4">
                {/* Step 1: Choose Payment Method */}
                <div>
                  <label className="text-xs font-extrabold text-white block mb-2 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#E8123D] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                    اختر وسيلة الدفع المناسبة
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {paymentMethods.map(m => {
                      const isSelected = selectedMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setSelectedMethod(m.id)}
                          className={`p-3 rounded-xl border text-right flex items-start gap-3 transition-all ${
                            isSelected
                              ? 'bg-[#E8123D]/10 border-[#E8123D] shadow-md ring-1 ring-[#E8123D]/50'
                              : 'bg-[#0A0A0A] border-[#262626] hover:border-gray-600 hover:bg-[#1a1a1a]'
                          }`}
                        >
                          {m.icon}
                          <div className="flex-1 overflow-hidden">
                            <span className="text-xs font-bold text-white block truncate">{m.name}</span>
                            <span className="text-[10px] text-gray-400 block truncate">{m.sub}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Show Instructions for Selected Method */}
                <div className="p-3.5 bg-[#0A0A0A] border border-[#262626] rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between border-b border-[#262626] pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#E8123D] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                      بيانات تحويل الأموال لـ {selectedMethodObj.name}
                    </span>
                    <span className="text-[10px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-md">
                      بيانات رسمية معتمدة
                    </span>
                  </div>

                  {selectedMethod === 'binance' && (
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 bg-[#141414] rounded-lg border border-[#262626]">
                        <span className="text-gray-400">Binance Pay ID:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-amber-400 font-bold">{selectedMethodObj.details.payId}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(selectedMethodObj.details.payId!, 'payId')}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            {copiedField === 'payId' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-[#141414] rounded-lg border border-[#262626]">
                        <span className="text-gray-400">عنون المحفظة (TRC20):</span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-gray-200 text-[10px] dir-ltr truncate max-w-[150px]">
                            {selectedMethodObj.details.address}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(selectedMethodObj.details.address!, 'addr')}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            {copiedField === 'addr' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'vodafone' && (
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 bg-[#141414] rounded-lg border border-[#262626]">
                        <span className="text-gray-400">رقم المحفظة (فودافون كاش):</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-red-400 font-extrabold text-sm dir-ltr">
                            {selectedMethodObj.details.phone}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(selectedMethodObj.details.phone!, 'voda')}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            {copiedField === 'voda' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-normal">
                        ملاحظة: يمكنك التحويل من أي محفظة إلكترونية بمصر (فودافون، اتصالات، أورنج، وي، أو بنكية).
                      </p>
                    </div>
                  )}

                  {selectedMethod === 'instapay' && (
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 bg-[#141414] rounded-lg border border-[#262626]">
                        <span className="text-gray-400">عنوان إنستا باي (IPA):</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-purple-400 font-bold dir-ltr">{selectedMethodObj.details.address}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(selectedMethodObj.details.address!, 'insta')}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            {copiedField === 'insta' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'bank' && (
                    <div className="space-y-2 text-xs">
                      <div className="p-2 bg-[#141414] rounded-lg border border-[#262626] space-y-1">
                        <div className="text-gray-400 text-[11px]">{selectedMethodObj.details.bankName}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">رقم الحساب:</span>
                          <span className="font-mono text-white font-bold">{selectedMethodObj.details.accountNumber}</span>
                        </div>
                        <div className="flex items-center justify-between dir-ltr">
                          <span className="font-mono text-blue-400 text-[10px]">{selectedMethodObj.details.iban}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(selectedMethodObj.details.iban!, 'iban')}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            {copiedField === 'iban' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Amount Selection */}
                <div>
                  <label className="text-xs font-extrabold text-white block mb-1.5 flex items-center justify-between">
                    <span>مبلغ الإيداع المراد شحنه (بالدولار USD)</span>
                    <span className="text-[#E8123D] font-mono">{formatPrice(amountUSD)}</span>
                  </label>
                  <div className="grid grid-cols-5 gap-1.5 mb-2">
                    {presets.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setAmountUSD(p)}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          amountUSD === p
                            ? 'bg-[#E8123D] text-white border-[#E8123D]'
                            : 'bg-[#0A0A0A] text-gray-300 border-[#262626] hover:border-gray-500'
                        }`}
                      >
                        ${p}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    required
                    value={amountUSD}
                    onChange={e => setAmountUSD(Number(e.target.value))}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E8123D] font-mono"
                  />
                </div>

                {/* Step 3: Required Proof of Payment Submission */}
                <div className="p-3.5 bg-[#1a1a1a] border border-[#E8123D]/30 rounded-xl space-y-3">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 border-b border-[#262626] pb-2">
                    <span className="w-4 h-4 rounded-full bg-[#E8123D] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                    تأكيد وإرفاق إثبات الدفع (مطلوب)
                  </div>

                  {/* Ref number */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-300 block mb-1">
                      رقم العملية / رقم التحويل <span className="text-[#E8123D]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: 98124012894 أو Ref ID"
                      value={refNumber}
                      onChange={e => setRefNumber(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E8123D]"
                    />
                  </div>

                  {/* Sender name or phone */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-300 block mb-1">
                      اسم أو رقم المحفظة المُرسِل منها <span className="text-[#E8123D]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: 01012345678 أو اسم المحول"
                      value={senderInfo}
                      onChange={e => setSenderInfo(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E8123D]"
                    />
                  </div>

                  {/* Image Screenshot Upload */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-300 block mb-1">
                      صورة إثبات الدفع (إرفاق سكرين شوت) <span className="text-[#E8123D]">*</span>
                    </label>

                    {proofPreview ? (
                      <div className="relative p-2 bg-[#0A0A0A] border border-[#E8123D] rounded-xl flex items-center gap-3">
                        <img
                          src={proofPreview}
                          alt="إثبات الدفع"
                          className="w-14 h-14 object-cover rounded-lg border border-[#262626]"
                        />
                        <div className="flex-1 overflow-hidden">
                          <span className="text-xs font-bold text-white block truncate">{proofImage?.name}</span>
                          <span className="text-[10px] text-gray-400 block">
                            {(proofImage?.size ? proofImage.size / 1024 : 0).toFixed(1)} KB — تم الرفع
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-4 bg-[#0A0A0A] border-2 border-dashed border-[#262626] hover:border-[#E8123D]/60 rounded-xl cursor-pointer transition-colors text-center">
                        <Upload className="w-6 h-6 text-[#E8123D] mb-1" />
                        <span className="text-xs font-bold text-gray-300">اضغط هنا لإرفاق سكرين شوت التحويل</span>
                        <span className="text-[10px] text-gray-500 mt-0.5">PNG, JPG أو WEBP (بحد أقصى 5MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          required
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Submit button with strict validation state */}
                <div>
                  {!isFormValid && (
                    <div className="p-2 mb-2 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-2 text-[11px] text-amber-300">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>يرجى ملء رقم العملية + معلومات المُرسِل + إرفاق الصورة لتفعيل زر التأكيد.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                      isFormValid && !isSubmitting
                        ? 'bg-[#E8123D] hover:bg-[#b10e31] text-white red-glow cursor-pointer'
                        : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {isSubmitting ? 'جاري الإرسال...' : `تأكيد عملية الإيداع (${formatPrice(amountUSD)})`}
                    </span>
                  </button>
                </div>
              </form>
            ) : (
              /* History List Section */
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400 pb-1 border-b border-[#262626]">
                  <span>طلبات الإيداع السابقة</span>
                  <span>تحديث تلقائي</span>
                </div>

                {depositsHistory.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-xs">لا توجد عمليات إيداع سابقة بعد</div>
                ) : (
                  <div className="space-y-2.5">
                    {depositsHistory.map(item => (
                      <div
                        key={item.id}
                        className="p-3.5 bg-[#0A0A0A] border border-[#262626] rounded-xl space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-white">{formatPrice(item.amountUSD)}</span>
                            <span className="text-xs text-gray-400">({item.methodName})</span>
                          </div>

                          {/* Status Badge */}
                          {item.status === 'pending' && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold flex items-center gap-1 animate-pulse">
                              <Clock className="w-3 h-3" />
                              قيد التنفيذ
                            </span>
                          )}
                          {item.status === 'completed' && (
                            <span className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              مكتمل
                            </span>
                          )}
                          {item.status === 'rejected' && (
                            <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold flex items-center gap-1">
                              <X className="w-3 h-3" />
                              مرفوض
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400 border-t border-[#1a1a1a] pt-2">
                          <div>
                            رقم التحويل: <span className="text-gray-200 font-mono">{item.refNumber}</span>
                          </div>
                          <div className="text-left dir-ltr">
                            {item.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
