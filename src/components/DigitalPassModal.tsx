import React from 'react';
import { X, CheckCircle2, QrCode, Shield, Download, Printer } from 'lucide-react';

interface DigitalPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  planName: string;
}

export const DigitalPassModal: React.FC<DigitalPassModalProps> = ({
  isOpen,
  onClose,
  memberName,
  planName,
}) => {
  if (!isOpen) return null;

  const passId = 'FF-' + Math.abs((memberName || 'MEMBER').split('').reduce((acc, char) => acc * 31 + char.charCodeAt(0), 7)).toString().slice(0, 8);
  const expiryYear = new Date().getFullYear() + 1;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 text-white shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="text-xs uppercase font-bold tracking-widest text-[#FFFF00] block mb-1">
            FitFlex Facility Credential
          </span>
          <h3 className="text-2xl font-extrabold uppercase tracking-tight text-white">
            Digital Member Pass
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Scan at front biometric turnstiles for automatic 24/7 door unlocking.
          </p>
        </div>

        {/* Digital Card Preview */}
        <div className="relative bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border-2 border-[#FFFF00] p-6 shadow-2xl overflow-hidden mb-6">
          {/* Subtle watermark logo in background */}
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
            <img src="/assets/img/mark.png" alt="" className="w-48 h-48" />
          </div>

          <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
            <img
              src="/assets/img/FitFlex.png"
              alt="FitFlex"
              className="h-8 w-auto object-contain"
            />
            <span className="bg-[#FFFF00] text-black text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5">
              Verified Active
            </span>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                Member Name
              </span>
              <span className="text-lg font-bold uppercase text-white tracking-wide">
                {memberName || 'Jordan Hayes'}
              </span>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                  Membership Tier
                </span>
                <span className="text-sm font-bold text-[#FFFF00] uppercase">
                  {planName || 'Black Card Elite 24/7'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                  Valid Through
                </span>
                <span className="text-xs font-mono text-neutral-300">
                  DEC {expiryYear}
                </span>
              </div>
            </div>
          </div>

          {/* Barcode & Pass ID */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase font-mono text-neutral-500 block">
                Pass ID Token
              </span>
              <span className="text-sm font-mono font-bold tracking-widest text-white">
                {passId}
              </span>
            </div>

            {/* Simulated Barcode */}
            <div className="flex items-center gap-0.5 h-7">
              {[4, 2, 5, 2, 6, 3, 2, 5, 3, 2, 6, 2, 4, 3, 5, 2, 4].map((h, i) => (
                <div
                  key={i}
                  className="bg-white"
                  style={{ width: i % 3 === 0 ? '3px' : '1.5px', height: `${h * 4}px` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handlePrint}
            className="py-3 bg-neutral-900 border border-neutral-700 hover:border-white text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4 text-[#FFFF00]" />
            <span>Print Pass</span>
          </button>
          <button
            onClick={onClose}
            className="py-3 bg-[#FFFF00] hover:bg-[#E6E600] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
