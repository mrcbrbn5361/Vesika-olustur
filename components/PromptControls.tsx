import React from 'react';
import { PhotoIcon } from './icons/PhotoIcon';

interface GenerationControlsProps {
  onSubmit: () => void;
  isLoading: boolean;
  isReady: boolean;
}

const GenerationControls: React.FC<GenerationControlsProps> = ({ onSubmit, isLoading, isReady }) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <button
        onClick={onSubmit}
        disabled={!isReady || isLoading}
        className="flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-4 rounded-lg
                   hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105
                   disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:scale-100
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <PhotoIcon className="w-5 h-5 mr-2" />
            Generate Photos
          </>
        )}
      </button>
    </div>
  );
};

export default GenerationControls;