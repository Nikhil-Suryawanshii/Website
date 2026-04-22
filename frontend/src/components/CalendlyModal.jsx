import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function CalendlyModal({ url, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-2xl h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 shrink-0">
          <span className="text-gray-800 font-semibold text-sm">Schedule Your Session</span>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <iframe
          src={url}
          title="Calendly Scheduling"
          className="flex-1 w-full border-0"
          allow="camera; microphone; payment"
        />
      </div>
    </div>
  );
}
