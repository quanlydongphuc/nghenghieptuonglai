
import React, { useRef } from 'react';

interface PhotoUploadProps {
  onPhotoSelect: (base64: string) => void;
  currentPhoto: string | null;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoSelect, currentPhoto }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotoSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        <i className="fas fa-file-image mr-2"></i> Bước 1: Chọn ảnh học sinh
      </label>

      {currentPhoto ? (
        <div className="relative group">
          <img 
            src={currentPhoto} 
            alt="Original" 
            className="w-full h-64 object-cover rounded-xl border-2 border-dashed border-gray-300 shadow-sm transition-all group-hover:brightness-90"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
            <button 
              onClick={() => onPhotoSelect("")}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-lg"
            >
              <i className="fas fa-sync-alt mr-2"></i> Chọn ảnh khác
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-500 group bg-gray-50"
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
            <i className="fas fa-cloud-upload-alt text-2xl text-blue-500"></i>
          </div>
          <span className="text-sm font-semibold">Tải ảnh học sinh lên từ thiết bị</span>
          <p className="text-xs text-gray-400 mt-2">Hỗ trợ JPG, PNG, WEBP</p>
        </button>
      )}
      
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />
    </div>
  );
};

export default PhotoUpload;
