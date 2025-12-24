
import React, { useState } from 'react';
import { AspectRatio, GenerationState } from './types';
import PhotoUpload from './components/PhotoUpload';
import { generateFutureCareerImage } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<GenerationState>({
    originalImage: null,
    career: '',
    ratio: AspectRatio.SQUARE,
    resultImage: null,
    isGenerating: false,
    error: null,
  });

  const handlePhotoSelect = (base64: string) => {
    setState(prev => ({ ...prev, originalImage: base64, resultImage: null, error: null }));
  };

  const handleRatioSelect = (ratio: AspectRatio) => {
    setState(prev => ({ ...prev, ratio, error: null }));
  };

  const handleGenerate = async () => {
    if (!state.originalImage) {
      setState(prev => ({ ...prev, error: "Bạn chưa chọn ảnh học sinh kìa!" }));
      return;
    }
    if (!state.career.trim()) {
      setState(prev => ({ ...prev, error: "Hãy nhập nghề nghiệp mà em mơ ước nhé." }));
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const result = await generateFutureCareerImage(
        state.originalImage,
        state.career,
        state.ratio
      );
      setState(prev => ({ ...prev, resultImage: result, isGenerating: false }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: err.message 
      }));
    }
  };

  const handleDownload = () => {
    if (!state.resultImage) return;
    const link = document.createElement('a');
    link.href = state.resultImage;
    link.download = `uoc-mo-${state.career.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] pb-12">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <i className="fas fa-palette text-lg"></i>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-none">Ước Mơ Học Trò</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">AI Future Vision</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Gemini AI Miễn Phí</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Control Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3 text-sm">1</span>
                Thiết lập ước mơ
              </h2>
              
              <div className="space-y-6">
                <PhotoUpload 
                  onPhotoSelect={handlePhotoSelect} 
                  currentPhoto={state.originalImage} 
                />

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center">
                    Nghề nghiệp em chọn
                  </label>
                  <input 
                    type="text"
                    placeholder="Ví dụ: Bác sĩ, Giáo viên, Họa sĩ..."
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50"
                    value={state.career}
                    onChange={(e) => setState(prev => ({ ...prev, career: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Khung hình</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: AspectRatio.SQUARE, label: 'Vuông', icon: 'fa-square' },
                      { id: AspectRatio.LANDSCAPE, label: 'Ngang', icon: 'fa-rectangle-landscape' },
                      { id: AspectRatio.PORTRAIT, label: 'Đứng', icon: 'fa-mobile-screen-button' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleRatioSelect(item.id)}
                        className={`py-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${
                          state.ratio === item.id 
                            ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-inner' 
                            : 'border-gray-50 bg-gray-50 hover:border-gray-200 text-gray-400'
                        }`}
                      >
                        <i className={`fas ${item.icon} text-lg mb-1`}></i>
                        <span className="text-[10px] font-bold uppercase">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {state.error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-start">
                    <i className="fas fa-circle-exclamation mt-0.5 mr-3"></i>
                    <span>{state.error}</span>
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={state.isGenerating}
                  className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg shadow-blue-200 flex items-center justify-center space-x-3 ${
                    state.isGenerating 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  }`}
                >
                  {state.isGenerating ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Đang vẽ ước mơ cho em...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magic"></i>
                      <span>Bắt đầu vẽ ngay</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Result Display */}
          <div className="lg:col-span-7 flex flex-col">
            <div className={`flex-1 bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col relative min-h-[500px] ${
              state.isGenerating ? 'bg-gray-50' : ''
            }`}>
              {state.resultImage ? (
                <>
                  <div className="flex-1 relative flex items-center justify-center bg-[#1a1c1e] p-6">
                    <img 
                      src={state.resultImage} 
                      alt="Future Career" 
                      className="max-w-full max-h-[600px] object-contain rounded-xl shadow-2xl"
                    />
                  </div>
                  <div className="p-6 bg-white flex items-center justify-between border-t border-gray-100">
                    <div>
                      <h3 className="text-xl font-extrabold text-gray-900 leading-tight">
                        Tương lai: {state.career}
                      </h3>
                      <p className="text-sm text-green-600 font-medium mt-1 flex items-center">
                        <i className="fas fa-face-smile mr-2"></i>
                        Đã giữ nguyên nét mặt học sinh
                      </p>
                    </div>
                    <button 
                      onClick={handleDownload}
                      className="w-14 h-14 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg shadow-blue-100 active:scale-90"
                      title="Lưu ảnh về máy"
                    >
                      <i className="fas fa-download text-xl"></i>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-8">
                    <i className="fas fa-image text-5xl text-blue-200"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Tác phẩm sẽ hiện ở đây</h3>
                  <p className="text-gray-500 max-w-sm leading-relaxed">
                    Em hãy chọn một bức ảnh thật tươi tắn và nhập nghề nghiệp mình thích nhé! AI sẽ giúp em hiện thực hóa ước mơ đó.
                  </p>
                </div>
              )}

              {state.isGenerating && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-8 text-center">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-blue-600 animate-[loading_1.5s_ease-in-out_infinite]"></div>
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">Đang xử lý bằng AI Miễn Phí</h3>
                  <p className="text-sm text-gray-500 italic">
                    "Đang khéo léo giữ lại nụ cười của em và thêm bộ trang phục {state.career}..."
                  </p>
                  <style>{`
                    @keyframes loading {
                      0% { width: 0%; transform: translateX(-100%); }
                      50% { width: 100%; transform: translateX(0); }
                      100% { width: 0%; transform: translateX(100%); }
                    }
                  `}</style>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <footer className="mt-16 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
            <i className="fas fa-bolt mr-2 text-yellow-500"></i> Siêu Nhanh
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
            <i className="fas fa-lock mr-2 text-green-500"></i> Bảo Mật
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
            <i className="fas fa-gift mr-2 text-pink-500"></i> Miễn Phí
          </span>
        </div>
        <p className="text-gray-400 text-[11px] font-medium">© 2024 Dự án Giáo dục AI. Phát triển bởi Công nghệ Gemini 2.5 Flash.</p>
      </footer>
    </div>
  );
};

export default App;
