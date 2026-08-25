import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Camera,
  Upload,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  Move,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AvatarUploadModal: React.FC = () => {
  const {
    user,
    isAvatarModalOpen,
    closeAvatarModal,
    updateUserAvatar,
    removeUserAvatar,
  } = useApp();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset state on modal open
  useEffect(() => {
    if (isAvatarModalOpen) {
      setSelectedImage(null);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isAvatarModalOpen]);

  if (!isAvatarModalOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة صالحة');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setZoom(1);
        setPosition({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleConfirmSave = () => {
    if (!selectedImage) return;

    // Canvas cropping step
    const canvas = document.createElement('canvas');
    const size = 320;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx || !imgRef.current) {
      updateUserAvatar(selectedImage);
      closeAvatarModal();
      return;
    }

    const img = imgRef.current;

    // Fill background
    ctx.fillStyle = '#141414';
    ctx.fillRect(0, 0, size, size);

    // Save state & clip circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Draw image applying zoom and positioning
    const scale = zoom;
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let drawWidth = size * scale;
    let drawHeight = (size / imgAspect) * scale;

    if (imgAspect > 1) {
      drawHeight = size * scale;
      drawWidth = size * imgAspect * scale;
    }

    const drawX = (size - drawWidth) / 2 + position.x;
    const drawY = (size - drawHeight) / 2 + position.y;

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    updateUserAvatar(dataUrl);
    closeAvatarModal();
  };

  const handleRemove = () => {
    removeUserAvatar();
    closeAvatarModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="bg-[#141414] border border-[#262626] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col text-right"
        >
          {/* Header */}
          <div className="p-4 border-b border-[#262626] bg-[#1a1a1a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#E31E24]" />
              <h3 className="font-extrabold text-sm text-white">تغيير الصورة الشخصية</h3>
            </div>
            <button
              onClick={closeAvatarModal}
              className="p-1.5 rounded-lg bg-[#262626] text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {!selectedImage ? (
              /* Initial State: Current Avatar Preview & Options */
              <div className="flex flex-col items-center space-y-5">
                <div className="relative group">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#E31E24] shadow-2xl ring-4 ring-[#E31E24]/20"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]"
                  >
                    <Upload className="w-6 h-6 mb-1 text-[#E31E24]" />
                    <span className="text-[11px] font-bold">رفع صورة جديدة</span>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <h4 className="font-bold text-sm text-white">{user.name}</h4>
                  <p className="text-xs text-gray-400">
                    يمكنك اختيار صورة جديدة لملفك الشخصي واقتطاعها بدقة
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 px-4 rounded-xl bg-[#E31E24] hover:bg-[#c11319] text-white font-bold text-xs flex items-center justify-center gap-2 red-glow transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>تغيير الصورة الشخصية</span>
                  </button>

                  <button
                    onClick={handleRemove}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-[#262626] hover:bg-red-900/30 text-red-400 hover:text-red-300 font-bold text-xs flex items-center justify-center gap-2 border border-red-500/20 transition-all shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>إزالة الصورة</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Interactive Circular Crop & Zoom Step */
              <div className="flex flex-col items-center space-y-5">
                <p className="text-xs text-gray-300 text-center flex items-center gap-1.5 bg-[#0A0A0A] px-3 py-1.5 rounded-xl border border-[#262626]">
                  <Move className="w-3.5 h-3.5 text-[#E31E24]" />
                  <span>اسحب الصورة للتحريك، واستخدم شريط التكبير لضبط الوجه داخل الإطار</span>
                </p>

                {/* Circular Viewport Container */}
                <div
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleMouseUp}
                  className="relative w-52 h-52 rounded-full border-4 border-[#E31E24] shadow-[0_0_25px_rgba(227,30,36,0.5)] overflow-hidden bg-black cursor-grab active:cursor-grabbing select-none"
                >
                  <img
                    ref={imgRef}
                    src={selectedImage}
                    alt="Preview"
                    draggable={false}
                    className="absolute max-w-none transition-transform duration-75 pointer-events-none"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                      transformOrigin: 'center center',
                    }}
                  />
                  {/* Subtle Grid Overlay guide */}
                  <div className="absolute inset-0 border-2 border-white/10 rounded-full pointer-events-none" />
                </div>

                {/* Zoom Controls Bar */}
                <div className="w-full bg-[#0A0A0A] p-3 rounded-xl border border-[#262626] space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <span className="font-bold flex items-center gap-1">
                      <ZoomIn className="w-3.5 h-3.5 text-[#E31E24]" />
                      مستوى التكبير ({zoom.toFixed(1)}x)
                    </span>
                    <button
                      onClick={() => {
                        setZoom(1);
                        setPosition({ x: 0, y: 0 });
                      }}
                      className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 hover:underline"
                    >
                      <RotateCcw className="w-3 h-3" />
                      إعادة ضبط
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setZoom(prev => Math.max(1, prev - 0.2))}
                      className="p-1.5 rounded-lg bg-[#1a1a1a] text-gray-300 hover:text-white hover:bg-[#262626]"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.05"
                      value={zoom}
                      onChange={e => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-[#E31E24] bg-[#262626] h-1.5 rounded-lg cursor-pointer"
                    />
                    <button
                      onClick={() => setZoom(prev => Math.min(3, prev + 0.2))}
                      className="p-1.5 rounded-lg bg-[#1a1a1a] text-gray-300 hover:text-white hover:bg-[#262626]"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 w-full">
                  <button
                    onClick={handleConfirmSave}
                    className="w-full py-3 px-4 rounded-xl bg-[#E31E24] hover:bg-[#c11319] text-white font-bold text-xs flex items-center justify-center gap-2 red-glow transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>حفظ الصورة الشخصية</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setZoom(1);
                      setPosition({ x: 0, y: 0 });
                    }}
                    className="py-3 px-4 rounded-xl bg-[#262626] text-gray-300 hover:text-white font-bold text-xs transition-colors shrink-0"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
