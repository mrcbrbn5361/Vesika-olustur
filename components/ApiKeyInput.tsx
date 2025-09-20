import React, { useState, useEffect } from 'react';
import { KeyIcon } from './icons/KeyIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EyeOffIcon } from './icons/EyeOffIcon';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, onApiKeyChange }) => {
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [isEditing, setIsEditing] = useState(!apiKey);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setLocalApiKey(apiKey);
    setIsEditing(!apiKey);
  }, [apiKey]);

  const handleSave = () => {
    onApiKeyChange(localApiKey);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="w-full flex flex-col items-center gap-3 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
      <div className="w-full flex items-center gap-2">
        <KeyIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
        <div className="relative w-full">
            <input
                type={showKey ? 'text' : 'password'}
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                placeholder="Enter your Gemini API Key"
                disabled={!isEditing}
                className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded-md py-2 pl-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-slate-800 disabled:cursor-not-allowed"
                aria-label="Gemini API Key"
            />
            <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-200"
                aria-label={showKey ? 'Hide API key' : 'Show API key'}
            >
                {showKey ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
        </div>
        {isEditing ? (
          <button onClick={handleSave} disabled={!localApiKey} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition">Save</button>
        ) : (
          <button onClick={handleEdit} className="bg-slate-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-slate-500 transition">Edit</button>
        )}
      </div>
      <p className="text-xs text-slate-400 text-center w-full">
        Your key is stored in your browser's local storage and is not sent anywhere except to Google's API.
        You can get a key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google AI Studio</a>.
      </p>
    </div>
  );
};

export default ApiKeyInput;