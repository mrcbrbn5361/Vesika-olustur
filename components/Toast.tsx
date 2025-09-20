import React, { useEffect, useState } from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { InfoCircleIcon } from './icons/InfoCircleIcon';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const icons = {
  success: <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />,
  error: <XCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />,
  info: <InfoCircleIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />,
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Mount animation
        const enterTimeout = setTimeout(() => setIsVisible(true), 50);
        
        // Auto-close timer
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade-out animation
        }, 5000);

        return () => {
            clearTimeout(enterTimeout);
            clearTimeout(timer);
        }
    }, [onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const baseClasses = "max-w-sm w-full bg-slate-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300 ease-in-out";
    const visibilityClasses = isVisible ? 'transform opacity-100 translate-y-0 sm:translate-x-0' : 'transform opacity-0 translate-y-2 sm:translate-y-0 sm:translate-x-2';

    return (
        <div className={`${baseClasses} ${visibilityClasses}`}>
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">{icons[type]}</div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-slate-100">{message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            type="button"
                            className="inline-flex text-slate-400 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-800 rounded-md"
                            onClick={handleClose}
                        >
                            <span className="sr-only">Close</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Toast;