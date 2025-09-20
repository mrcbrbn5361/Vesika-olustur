import React from 'react';
import { UserIcon } from './icons/SparklesIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/50 shadow-lg backdrop-blur-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <UserIcon className="w-8 h-8 text-violet-400 mr-3" />
        <h1 className="text-3xl font-bold tracking-tight text-white">
          AI Passport Photo Generator
        </h1>
      </div>
    </header>
  );
};

export default Header;