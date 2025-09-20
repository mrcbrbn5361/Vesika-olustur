import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageUploader from './components/ImageUploader';
import GenerationControls from './components/PromptControls';
import ResultDisplay from './components/ResultDisplay';
import { editImageWithGemini } from './services/geminiService';
import { fileToBase64, fileToDataUrl, createImageSheet } from './fileUtils';

// Component for selecting the number of images to generate
const ImageCountSelector: React.FC<{ count: number; setCount: (count: number) => void; disabled: boolean; }> = ({ count, setCount, disabled }) => (
  <div className="w-full flex flex-col items-center gap-3 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
    <label htmlFor="image-count-slider" className="font-medium text-slate-300">
      Number of Photos on Sheet: <span className="font-bold text-violet-400 text-lg">{count}</span>
    </label>
    <input
      id="image-count-slider"
      type="range"
      min="1"
      max="16"
      value={count}
      onChange={(e) => setCount(Number(e.target.value))}
      disabled={disabled}
      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
    />
  </div>
);

const App: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [finalImageSheet, setFinalImageSheet] = useState<string | null>(null);
  const [numberOfImages, setNumberOfImages] = useState<number>(8);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    setOriginalFile(file);
    setFinalImageSheet(null);
    setError(null);
    try {
      const dataUrl = await fileToDataUrl(file);
      setOriginalImagePreview(dataUrl);
    } catch (err) {
      setError('Could not create image preview.');
      setOriginalImagePreview(null);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!originalFile) {
      setError('Please upload an image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFinalImageSheet(null);

    try {
      const base64Image = await fileToBase64(originalFile);
      const mimeType = originalFile.type;
      
      const singleImageBase64 = await editImageWithGemini(base64Image, mimeType);

      if (singleImageBase64) {
        const singleImageDataUrl = `data:${mimeType};base64,${singleImageBase64}`;
        const sheetDataUrl = await createImageSheet(singleImageDataUrl, numberOfImages);
        setFinalImageSheet(sheetDataUrl);
      } else {
        setError('The model did not return an image. Please try again.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate images: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [originalFile, numberOfImages]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Uploader and Controls */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-center text-violet-400">1. Upload Your Photo</h2>
              <ImageUploader onImageUpload={handleImageUpload} imagePreviewUrl={originalImagePreview} />
            </div>
            
            {originalFile && (
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-center text-violet-400">2. Select Quantity</h2>
                <ImageCountSelector count={numberOfImages} setCount={setNumberOfImages} disabled={isLoading} />
                <h2 className="text-2xl font-bold text-center text-violet-400">3. Generate Photo Sheet</h2>
                <GenerationControls
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  isReady={!!originalFile}
                />
              </div>
            )}
          </div>

          {/* Right Column: Result Display */}
          <div className="flex flex-col gap-6">
             <h2 className="text-2xl font-bold text-center text-violet-400">Your Results</h2>
             <ResultDisplay
              originalImageUrl={originalImagePreview}
              imageUrl={finalImageSheet}
              isLoading={isLoading}
            />
          </div>
        </div>
        {error && (
          <div className="mt-8 text-center bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;