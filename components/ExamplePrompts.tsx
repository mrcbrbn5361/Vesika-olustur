
import React from 'react';

interface ExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const prompts = [
  "Short pixie cut, vibrant purple",
  "Long wavy hair, rainbow highlights",
  "Icy platinum blonde bob",
  "Fiery red, curly style",
  "Pastel pink space buns",
  "Emerald green ombre",
  "Silver and blue braids",
  "Give me a classic mullet",
];

const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ onSelectPrompt }) => {
  return (
    <div className="w-full">
      <p className="text-sm text-center text-slate-400 mb-3">Need inspiration? Try one of these:</p>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4" role="toolbar" aria-label="Example prompts">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelectPrompt(prompt)}
            className="flex-shrink-0 px-4 py-2 text-sm font-medium text-violet-300 bg-slate-800 border border-slate-700 rounded-full
                       hover:bg-slate-700/50 hover:border-violet-500 hover:text-white transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500"
            aria-label={`Use prompt: ${prompt}`}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamplePrompts;
