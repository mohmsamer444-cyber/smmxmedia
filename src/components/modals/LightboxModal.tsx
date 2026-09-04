import React from 'react';
import { useApp } from '../../context/AppContext';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LightboxModal: React.FC = () => {
  const { lightboxImage, closeLightbox } = useApp();

  if (!lightboxImage) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
        <button
          onClick={closeLightbox}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#141414] text-white hover:bg-[#E8123D] transition-colors z-50"
        >
          <X className="w-6 h-6" />
        </button>

        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          src={lightboxImage}
          alt="صورة المعرض"
          className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-[#262626]"
        />
      </div>
    </AnimatePresence>
  );
};
