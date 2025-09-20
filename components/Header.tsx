import React from 'react';
import { Logo } from './Logo';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/70 shadow-lg backdrop-blur-md sticky top-0 z-20 border-b border-slate-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <Logo className="w-10 h-10 mr-3" />
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">
          VesikAI V1.0
        </h1>
      </div>
    </header>
  );
};

export default Header;