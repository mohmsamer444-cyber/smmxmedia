import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Headphones,
  Info,
  FileText,
  Lock,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { openApiSettingsModal, openDepositModal } = useApp();

  return (
    <footer className="mt-12 bg-[#101010] border-t border-[#262626] rounded-t-3xl pt-8 pb-12 px-4 sm:px-8 text-right text-gray-400 text-xs leading-relaxed">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Grid: About, Quick Links, Payment Methods, Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#E31E24] text-white font-black flex items-center justify-center text-sm shadow-md red-glow">
                ع
              </span>
              <span className="font-black text-lg text-white tracking-wider">عالم الشرق الأوسط</span>
            </div>
            <p className="text-gray-400 text-xs leading-normal">
              منصتك العربية الشاملة لخدمات السوشيال ميديا، مشاركة المحتوى، وشحن الألعاب. نقدم أفضل الأسعار مع التسليم الفوري والدعم المستمر على مدار الساعة.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-green-400 font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>خوادم متصلة بالـ API 100%</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#E31E24]" />
              روابط سريعة
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={openDepositModal}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#E31E24]" />
                  <span>شحن الرصيد والوسائل المتاحة</span>
                </button>
              </li>
              <li>
                <button
                  onClick={openApiSettingsModal}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-[#E31E24]" />
                  <span>ربط API الموزعين</span>
                </button>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white cursor-pointer transition-colors flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#E31E24]" />
                  <span>سياسة الخصوصية والشروط</span>
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white cursor-pointer transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E31E24]" />
                  <span>ضمان الاسترجاع والتعبئة</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              <Headphones className="w-4 h-4 text-[#E31E24]" />
              الدعم الفني والاتصال
            </h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4 text-[#E31E24]" />
                <span dir="ltr" className="font-mono">+966 50 123 4567</span>
              </p>
              <p className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 text-[#E31E24]" />
                <span className="font-mono">support@alsharq-world.com</span>
              </p>
              <p className="text-[11px] text-gray-500">
                فريق الدعم متاح 24/7 للرد على التذاكر والطلبات
              </p>
            </div>
          </div>

          {/* Payment Badges */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-white">وسائل الدفع المقبولة</h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {['💳 Visa', '💳 Mastercard', '📱 Apple Pay', '🇸🇦 STC Pay', '📲 Vodafone Cash', '🟡 Binance Pay', '🪙 Crypto (USDT)'].map((pm, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[#1a1a1a] border border-[#333] text-[11px] font-medium text-gray-200 shadow-sm"
                >
                  {pm}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-[#202020] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} عالم الشرق الأوسط. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-300 cursor-pointer">الشروط والأحكام</span>
            <span className="hover:text-gray-300 cursor-pointer">سياسة الخصوصية</span>
            <span className="hover:text-gray-300 cursor-pointer">الدعم الفني</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
