
import React, { useRef, useState, useCallback } from 'react';

interface PhotoCaptureProps {
  onPhotoSelect: (base64: string) => void;
  currentPhoto: string | null;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({ onPhotoSelect, currentPhoto }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (err) {
      alert("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const base64 = canvasRef.current.toDataURL('image/jpeg');
        onPhotoSelect(base64);
        stopCamera();
      }
    }
  };

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
        <i className="fas fa-user-graduate mr-2"></i> Bước 1: Chọn ảnh học sinh
      </label>

      {currentPhoto && !isCameraOpen ? (
        <div className="relative group">
          <img 
            src={currentPhoto} 
            alt="Original" 
            className="w-full h-64 object-cover rounded-xl border-2 border-dashed border-gray-300 shadow-sm"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
            <button 
              onClick={() => onPhotoSelect("")}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <i className="fas fa-trash mr-2"></i> Xóa ảnh
            </button>
          </div>
        </div>
      ) : isCameraOpen ? (
        <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
            <button 
              onClick={capturePhoto}
              className="bg-white text-gray-900 p-4 rounded-full shadow-lg hover:bg-blue-50 transition-colors"
            >
              <i className="fas fa-camera text-xl"></i>
            </button>
            <button 
              onClick={stopCamera}
              className="bg-gray-800/80 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={startCamera}
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-600 group"
          >
            <i className="fas fa-camera text-3xl mb-3 group-hover:text-blue-500"></i>
            <span className="text-sm font-medium">Chụp ảnh mới</span>
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-600 group"
          >
            <i className="fas fa-upload text-3xl mb-3 group-hover:text-blue-500"></i>
            <span className="text-sm font-medium">Tải ảnh lên</span>
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
        </div>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PhotoCapture;
