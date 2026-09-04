import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed top-20 left-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none dir-rtl">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-center justify-between gap-3 text-sm font-medium backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-[#141414]/95 text-white border-green-500/50 shadow-green-500/10'
                : toast.type === 'error'
                ? 'bg-[#141414]/95 text-white border-[#E8123D]/60 shadow-[#E8123D]/10'
                : 'bg-[#141414]/95 text-white border-blue-500/50 shadow-blue-500/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#E8123D] shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
