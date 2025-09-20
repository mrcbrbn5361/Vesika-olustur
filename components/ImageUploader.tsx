import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imagePreviewUrl: string | null;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imagePreviewUrl }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setError(`Invalid file type. Please upload a JPG, PNG, or WEBP image.`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      onImageUpload(file);
    }
    event.target.value = ''; // Reset input
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      onImageUpload(file);
    }
  }, [onImageUpload]);
  
  const handleDragEvents = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setIsDragging(true);
    } else if (event.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const uploaderClasses = `
    relative flex flex-col items-center justify-center w-full h-64
    border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200
    ${isDragging ? 'border-blue-400 bg-blue-900/30' : 'border-slate-600 bg-slate-800 hover:bg-slate-700/50 hover:border-slate-500'}
  `;

  return (
    <div className="w-full">
      {imagePreviewUrl ? (
        <div className="relative group">
          <img src={imagePreviewUrl} alt="Preview" className="w-full h-auto max-h-96 object-contain rounded-lg shadow-lg" />
          <div 
            className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
          >
             <label htmlFor="file-upload" className="flex flex-col items-center text-center p-4 cursor-pointer">
                <UploadIcon className="w-10 h-10 mb-2 text-blue-300" />
                <span className="font-semibold text-lg">Change Photo</span>
                <span className="text-sm text-slate-300">Click or drag a new image here</span>
             </label>
            <input id="file-upload" type="file" className="hidden" accept={ACCEPTED_FILE_TYPES.join(',')} onChange={handleFileChange} />
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragEvents}
          onDragEnter={handleDragEvents}
          onDragLeave={handleDragEvents}
          className={uploaderClasses}
        >
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center pt-5 pb-6 w-full h-full">
            <UploadIcon className="w-10 h-10 mb-3 text-slate-400" />
            <p className="mb-2 text-sm text-slate-300">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-400">JPG, PNG, or WEBP (MAX. {MAX_FILE_SIZE_MB}MB)</p>
            <input id="file-upload" type="file" className="hidden" accept={ACCEPTED_FILE_TYPES.join(',')} onChange={handleFileChange} />
          </label>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-400 text-center">{error}</p>}
    </div>
  );
};

export default ImageUploader;