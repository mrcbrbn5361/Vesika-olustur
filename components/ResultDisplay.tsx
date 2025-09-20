import React from 'react';
import Loader from './Loader';
import { DownloadIcon } from './icons/DownloadIcon';
import { PhotoIcon } from './icons/PhotoIcon';

interface ResultDisplayProps {
  originalImageUrl: string | null;
  imageUrl: string | null;
  isLoading: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ originalImageUrl, imageUrl, isLoading }) => {
  const Placeholder = () => (
    <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center p-4">
        <PhotoIcon className="w-16 h-16 mb-4" />
        <p className="text-lg font-medium">Your generated passport photo sheet will appear here.</p>
        <p className="text-sm">Upload a photo and click "Generate" to start.</p>
    </div>
  );

  return (
    <div className="w-full aspect-square bg-slate-800 rounded-lg flex items-center justify-center p-2 relative overflow-hidden shadow-inner border border-slate-700">
      {isLoading && <Loader />}
      
      {!isLoading && !imageUrl && <Placeholder />}

      {!isLoading && imageUrl && (
        <div className="w-full h-full p-2">
            <div className="relative group w-full h-full">
                <img 
                    src={imageUrl} 
                    alt="Generated passport photo sheet" 
                    className="w-full h-full object-contain rounded-md"
                />
                <a
                    href={imageUrl}
                    download={`passport-photo-sheet.png`}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"
                    aria-label="Download photo sheet"
                >
                    <DownloadIcon className="w-10 h-10 text-white" />
                </a>
            </div>
      </div>
      )}
    </div>
  );
};

export default ResultDisplay;