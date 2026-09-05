import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabaseClient';
import { X, Image, Video, FileText, BarChart2, MapPin, Plus, Trash2, Send, Upload, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MAX_CONTENT_LENGTH = 5000;
const MAX_VIDEO_SECONDS = 60 * 60; // 1 hour

function formatDurationFromSeconds(totalSeconds: number): string {
  const total = Math.round(totalSeconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const ss = String(s).padStart(2, '0');
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${ss}`;
  return `${m}:${ss}`;
}

function getFileExtension(file: File): string {
  const parts = file.name.split('.');
  if (parts.length > 1) return parts[parts.length - 1].toLowerCase();
  return file.type.split('/')[1] || 'bin';
}

export const CreatePostModal: React.FC = () => {
  const { isCreatePostOpen, closeCreatePost, initialPostType, user, createPost, showToast } = useApp();

  const [contentType, setContentType] = useState<string>('text');
  const [text, setText] = useState<string>('');
  const [hashtagsText, setHashtagsText] = useState<string>('#حساب_ببجي_للبيع #وساطة_عالم_الشرق_الأوسط');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [videoDurationSeconds, setVideoDurationSeconds] = useState<number | null>(null);
  const [videoError, setVideoError] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [pollQuestion, setPollQuestion] = useState<string>('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadStage, setUploadStage] = useState<string>('');

  useEffect(() => {
    if (initialPostType) {
      setContentType(initialPostType);
    }
  }, [initialPostType, isCreatePostOpen]);

  if (!isCreatePostOpen) return null;

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      const newUrls = files.map(file => URL.createObjectURL(file as Blob));
      setImagePreviews(prev => [...prev, ...newUrls]);
    }
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    const targetUrl = imagePreviews[index];
    if (targetUrl && targetUrl.startsWith('blob:')) {
      URL.revokeObjectURL(targetUrl);
    }
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoError('');

    const url = URL.createObjectURL(file);
    const probe = document.createElement('video');
    probe.preload = 'metadata';
    probe.onloadedmetadata = () => {
      const duration = probe.duration;
      if (isFinite(duration) && duration > MAX_VIDEO_SECONDS) {
        setVideoError('مدة الفيديو أطول من ساعة، من فضلك اختر فيديو أقصر.');
        URL.revokeObjectURL(url);
        return;
      }
      setVideoDurationSeconds(isFinite(duration) ? duration : null);
      setVideoFile(file);
      setVideoPreviewUrl(url);
    };
    probe.onerror = () => {
      // Couldn't read metadata — allow the file through without a known duration.
      setVideoDurationSeconds(null);
      setVideoFile(file);
      setVideoPreviewUrl(url);
    };
    probe.src = url;
    e.target.value = '';
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoDurationSeconds(null);
    setVideoError('');
    if (videoPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideoPreviewUrl('');
    setVideoUrl('');
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions(prev => [...prev, '']);
    }
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handlePollChange = (index: number, val: string) => {
    setPollOptions(prev => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const uploadFileToMedia = async (file: File, subfolder: string): Promise<string | null> => {
    const ext = getFileExtension(file);
    const path = `posts/${user.id}/${subfolder}-${Date.now()}-${Math.floor(Math.random() * 1e6)}.${ext}`;
    const { error } = await supabase.storage.from('media').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) {
      showToast('تعذر رفع الملف: ' + error.message, 'error');
      return null;
    }
    const { data } = supabase.storage.from('media').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && contentType === 'text') return;
    if (videoError) return;

    if (contentType === 'poll') {
      const filledOptions = pollOptions.filter(o => o.trim().length > 0);
      if (!pollQuestion.trim() || filledOptions.length < 2) {
        showToast('اكتب سؤال الاستطلاع مع خيارين على الأقل', 'error');
        return;
      }
    }

    setIsSubmitting(true);

    const parsedHashtags = hashtagsText
      .split(' ')
      .map(t => t.trim())
      .filter(t => t.startsWith('#'));

    let pollData = undefined;
    if (contentType === 'poll' && pollQuestion.trim()) {
      pollData = {
        question: pollQuestion,
        options: pollOptions
          .filter(o => o.trim().length > 0)
          .map((optText, idx) => ({
            id: `opt-${idx}`,
            text: optText,
            votes: 0,
          })),
        totalVotes: 0,
      };
    }

    // Upload real image files (if any) to Supabase Storage
    let finalImages: string[] | undefined;
    if (imageFiles.length > 0) {
      setUploadStage('جاري رفع الصور...');
      const uploaded: string[] = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const url = await uploadFileToMedia(imageFiles[i], `img-${i}`);
        if (url) uploaded.push(url);
      }
      finalImages = uploaded.length > 0 ? uploaded : undefined;
    } else if (imageUrl) {
      finalImages = [imageUrl];
    } else if (contentType === 'image') {
      finalImages = ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'];
    }

    // Upload the real video file (if any) to Supabase Storage
    let finalVideoUrl = '';
    let finalDurationSeconds: number | undefined;
    if (videoFile) {
      setUploadStage('جاري رفع الفيديو...');
      const url = await uploadFileToMedia(videoFile, 'video');
      if (url) {
        finalVideoUrl = url;
        finalDurationSeconds = videoDurationSeconds ?? undefined;
      }
    } else if (videoUrl) {
      finalVideoUrl = videoUrl;
    }

    setUploadStage('');

    createPost({
      content: text,
      hashtags: parsedHashtags.length ? parsedHashtags : ['عالم_الشرق_الأوسط'],
      images: finalImages,
      video: finalVideoUrl
        ? {
            url: finalVideoUrl,
            duration: finalDurationSeconds ? formatDurationFromSeconds(finalDurationSeconds) : '',
            durationSeconds: finalDurationSeconds,
          }
        : undefined,
      location: location || undefined,
      poll: pollData,
    });

    // Reset and close
    setText('');
    setImageUrl('');
    setImageFiles([]);
    setImagePreviews([]);
    setVideoUrl('');
    setVideoFile(null);
    setVideoPreviewUrl('');
    setVideoDurationSeconds(null);
    setVideoError('');
    setLocation('');
    setPollQuestion('');
    setPollOptions(['', '']);
    setIsSubmitting(false);
    closeCreatePost();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#141414] border border-[#262626] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-4 border-b border-[#262626] flex items-center justify-between bg-[#1a1a1a] shrink-0">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-[#E8123D]" />
              إنشاء منشور جديد
            </h3>
            <button
              onClick={closeCreatePost}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#262626]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
            {/* User row */}
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-[#E8123D]"
              />
              <div>
                <span className="font-bold text-xs text-white block">{user.name}</span>
                <span className="text-[10px] text-gray-400 dir-ltr text-right">@{user.username}</span>
              </div>
            </div>

            {/* Content Input */}
            <div>
              <textarea
                value={text}
                onChange={e => setText(e.target.value.slice(0, MAX_CONTENT_LENGTH))}
                maxLength={MAX_CONTENT_LENGTH}
                placeholder="اكتب وصف حسابك (ببجي / بيس / فري فاير)... اذكر الرتبة، الأسكنات، عدد الشدات/الجواهر، والسعر المطلوب"
                rows={4}
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E8123D] resize-none"
                required={contentType === 'text'}
              />
              <p className="text-[10px] text-gray-500 text-left dir-ltr mt-1">
                {text.length} / {MAX_CONTENT_LENGTH}
              </p>
            </div>

            {/* Hashtags Input */}
            <div>
              <label className="text-[11px] text-gray-400 block mb-1 font-semibold">
                الوسوم (Hashtags)
              </label>
              <input
                type="text"
                value={hashtagsText}
                onChange={e => setHashtagsText(e.target.value)}
                placeholder="#حساب_ببجي_للبيع #وساطة_عالم_الشرق_الأوسط"
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E8123D]"
              />
            </div>

            {/* Dynamic Specific Type Controls */}
            {contentType === 'image' && (
              <div className="p-3.5 bg-[#0A0A0A] border border-[#262626] rounded-xl space-y-3">
                <label className="text-[11px] font-bold text-white block">
                  صور الحساب / المرفقات (رفع مباشر من الجهاز أو رابط)
                </label>

                {/* Local Multi-Image Previews Grid */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {imagePreviews.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[#262626] bg-black group">
                        <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 left-1 p-1 rounded-full bg-black/80 text-white hover:bg-red-600 transition-colors z-10"
                          title="حذف الصورة"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* File Picker Drop Area */}
                <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#262626] hover:border-[#E8123D]/60 rounded-xl cursor-pointer bg-[#141414] hover:bg-[#1f1f1f] transition-all group">
                  <div className="w-10 h-10 rounded-full bg-[#E8123D]/10 text-[#E8123D] flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-white mb-0.5">انقر لاختيار صور الحساب من معرض الصور</span>
                  <span className="text-[10px] text-gray-400">يمكنك تحديد عدة صور (JPG, PNG, WEBP)</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageFileSelect}
                    className="hidden"
                  />
                </label>

                {/* Secondary Link Option */}
                <div className="pt-2 border-t border-[#262626]">
                  <label className="text-[10px] text-gray-400 block mb-1 font-semibold">
                    أو ألصق رابط صورة مباشر
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="https://... رابط صورة مباشر"
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#E8123D]"
                  />
                </div>
              </div>
            )}

            {contentType === 'video' && (
              <div className="p-3.5 bg-[#0A0A0A] border border-[#262626] rounded-xl space-y-3">
                <label className="text-[11px] font-bold text-white block">
                  مقطع الفيديو (رفع مباشر من الجهاز أو رابط) — الحد الأقصى للمدة ساعة
                </label>

                {/* Local Video Preview or File Picker */}
                {videoPreviewUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-[#262626] bg-black">
                    <video src={videoPreviewUrl} controls className="w-full h-48 object-contain rounded-xl" />
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="absolute top-2 left-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors z-10"
                      title="إزالة الفيديو"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {videoDurationSeconds != null && (
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-md font-sans">
                        {formatDurationFromSeconds(videoDurationSeconds)}
                      </span>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#262626] hover:border-[#E8123D]/60 rounded-xl cursor-pointer bg-[#141414] hover:bg-[#1f1f1f] transition-all group">
                    <div className="w-12 h-12 rounded-full bg-[#E8123D]/10 text-[#E8123D] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-white mb-1">انقر لإرفاق فيديو من جهازك</span>
                    <span className="text-[10px] text-gray-400">يدعم صيغ (MP4, MOV, WebM) — حتى ساعة كاملة</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileSelect}
                      className="hidden"
                    />
                  </label>
                )}

                {videoError && (
                  <div className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                    {videoError}
                  </div>
                )}

                {/* Secondary Link Option */}
                <div className="pt-2 border-t border-[#262626]">
                  <label className="text-[10px] text-gray-400 block mb-1 font-semibold">
                    أو ألصق رابط فيديو (يوتيوب / تيك توك)
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... أو تيك توك"
                    disabled={!!videoFile}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E8123D] disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            {contentType === 'poll' && (
              <div className="p-3 bg-[#0A0A0A] border border-[#262626] rounded-xl space-y-2">
                <label className="text-[11px] font-bold text-white block">سؤال الاستطلاع</label>
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={e => setPollQuestion(e.target.value)}
                  placeholder="اكتب سؤال الاستطلاع هنا..."
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E8123D] mb-2"
                />

                <label className="text-[11px] text-gray-400 block font-semibold">خيارات الإجابة</label>
                {pollOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={e => handlePollChange(i, e.target.value)}
                      placeholder={`خيار ${i + 1}`}
                      className="flex-1 bg-[#141414] border border-[#262626] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#E8123D]"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePollOption(i)}
                        className="p-1.5 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                {pollOptions.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddPollOption}
                    className="text-xs text-[#E8123D] font-bold flex items-center gap-1 hover:underline pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    إضافة خيار آخر
                  </button>
                )}
              </div>
            )}

            {contentType === 'location' && (
              <div className="p-3 bg-[#0A0A0A] border border-[#262626] rounded-xl space-y-2">
                <label className="text-[11px] font-bold text-white block">تحديد الموقع الجغرافي</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="مثال: الرياض، المملكة العربية السعودية"
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E8123D]"
                />
              </div>
            )}

            {/* Type Switcher Row */}
            <div className="flex items-center justify-around p-2 bg-[#0A0A0A] border border-[#262626] rounded-xl text-xs text-gray-400">
              <button
                type="button"
                onClick={() => setContentType('text')}
                className={`p-2 rounded-lg flex items-center gap-1 transition-colors ${
                  contentType === 'text' ? 'text-[#E8123D] font-bold bg-[#E8123D]/10' : 'hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                نص
              </button>
              <button
                type="button"
                onClick={() => setContentType('image')}
                className={`p-2 rounded-lg flex items-center gap-1 transition-colors ${
                  contentType === 'image' ? 'text-[#E8123D] font-bold bg-[#E8123D]/10' : 'hover:text-white'
                }`}
              >
                <Image className="w-4 h-4" />
                صورة
              </button>
              <button
                type="button"
                onClick={() => setContentType('video')}
                className={`p-2 rounded-lg flex items-center gap-1 transition-colors ${
                  contentType === 'video' ? 'text-[#E8123D] font-bold bg-[#E8123D]/10' : 'hover:text-white'
                }`}
              >
                <Video className="w-4 h-4" />
                فيديو
              </button>
              <button
                type="button"
                onClick={() => setContentType('poll')}
                className={`p-2 rounded-lg flex items-center gap-1 transition-colors ${
                  contentType === 'poll' ? 'text-[#E8123D] font-bold bg-[#E8123D]/10' : 'hover:text-white'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                استطلاع
              </button>
              <button
                type="button"
                onClick={() => setContentType('location')}
                className={`p-2 rounded-lg flex items-center gap-1 transition-colors ${
                  contentType === 'location' ? 'text-[#E8123D] font-bold bg-[#E8123D]/10' : 'hover:text-white'
                }`}
              >
                <MapPin className="w-4 h-4" />
                موقع
              </button>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#E8123D] hover:bg-[#b10e31] disabled:opacity-60 text-white font-bold text-sm shadow-lg red-glow transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {uploadStage || 'جاري النشر...'}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  نشر الآن
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
