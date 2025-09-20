import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageUploader from './components/ImageUploader';
import GenerationControls from './components/PromptControls';
import ResultDisplay from './components/ResultDisplay';
import ApiKeyInput from './components/ApiKeyInput';
import ToastContainer from './components/ToastContainer';
import { editImageWithGemini } from './services/geminiService';
import { fileToBase64, fileToDataUrl, createImageSheet } from './fileUtils';

// Toast type definition
export interface ToastInfo {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Component for selecting the number of images to generate
const ImageCountSelector: React.FC<{ count: number; setCount: (count: number) => void; disabled: boolean; }> = ({ count, setCount, disabled }) => (
  <div className="w-full flex flex-col items-center gap-3 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
    <label htmlFor="image-count-slider" className="font-medium text-slate-300">
      Number of Photos on Sheet: <span className="font-bold text-blue-400 text-lg">{count}</span>
    </label>
    <input
      id="image-count-slider"
      type="range"
      min="1"
      max="16"
      value={count}
      onChange={(e) => setCount(Number(e.target.value))}
      disabled={disabled}
      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
    />
  </div>
);

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('gemini-api-key') || '');
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [finalImageSheet, setFinalImageSheet] = useState<string | null>(null);
  const [numberOfImages, setNumberOfImages] = useState<number>(8);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Preloader hiding logic
  useEffect(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 500); // Show preloader for at least a moment
    }
  }, []);

  const showToast = useCallback((type: ToastInfo['type'], message: string) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const handleApiKeyChange = useCallback((newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('gemini-api-key', newKey);
    showToast('success', 'API Key saved successfully!');
  }, [showToast]);

  const handleImageUpload = useCallback(async (file: File) => {
    setOriginalFile(file);
    setFinalImageSheet(null);
    try {
      const dataUrl = await fileToDataUrl(file);
      setOriginalImagePreview(dataUrl);
    } catch (err) {
      showToast('error', 'Could not create image preview.');
      setOriginalImagePreview(null);
    }
  }, [showToast]);

  const handleSubmit = useCallback(async () => {
    if (!apiKey) {
      showToast('error', 'Please enter and save your Gemini API key.');
      return;
    }
    if (!originalFile) {
      showToast('error', 'Please upload an image.');
      return;
    }

    setIsLoading(true);
    setFinalImageSheet(null);

    try {
      const base64Image = await fileToBase64(originalFile);
      const mimeType = originalFile.type;
      
      const singleImageBase64 = await editImageWithGemini(base64Image, mimeType, apiKey);

      if (singleImageBase64) {
        const singleImageDataUrl = `data:${mimeType};base64,${singleImageBase64}`;
        const sheetDataUrl = await createImageSheet(singleImageDataUrl, numberOfImages);
        setFinalImageSheet(sheetDataUrl);
        showToast('success', 'Photo sheet generated successfully!');
      } else {
        showToast('error', 'The model did not return an image. Please try again.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      showToast('error', `Failed to generate images: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [originalFile, numberOfImages, apiKey, showToast]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Uploader and Controls */}
          <div className="flex flex-col gap-8">
            <div className="animate-fade-in-up flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-center text-blue-400">1. Enter Your API Key</h2>
              <ApiKeyInput apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
            </div>

            <div className="animate-fade-in-up flex flex-col gap-4" style={{ animationDelay: '100ms' }}>
              <h2 className="text-2xl font-bold text-center text-blue-400">2. Upload Your Photo</h2>
              <ImageUploader onImageUpload={handleImageUpload} imagePreviewUrl={originalImagePreview} />
            </div>
            
            {originalFile && (
              <div className="animate-fade-in-up flex flex-col gap-6" style={{ animationDelay: '200ms' }}>
                <h2 className="text-2xl font-bold text-center text-blue-400">3. Select Quantity</h2>
                <ImageCountSelector count={numberOfImages} setCount={setNumberOfImages} disabled={isLoading} />
                <h2 className="text-2xl font-bold text-center text-blue-400">4. Generate Photo Sheet</h2>
                <GenerationControls
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  isReady={!!originalFile && !!apiKey}
                />
              </div>
            )}
          </div>

          {/* Right Column: Result Display */}
          <div className="animate-fade-in-up flex flex-col gap-6" style={{ animationDelay: '300ms' }}>
             <h2 className="text-2xl font-bold text-center text-blue-400">Your Results</h2>
             <ResultDisplay
              originalImageUrl={originalImagePreview}
              imageUrl={finalImageSheet}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
      <Footer />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default App;