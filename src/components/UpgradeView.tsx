import React, { useState } from 'react';
import { Check, Star, Zap, Sparkles, ShieldCheck } from 'lucide-react';

interface UpgradeViewProps {
  onSuccess?: () => void;
}

export const UpgradeView: React.FC<UpgradeViewProps> = ({ onSuccess }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<'goplus' | 'pro'>('goplus');
  const [upgraded, setUpgraded] = useState(false);

  const handleUpgrade = () => {
    setUpgraded(true);
    setTimeout(() => {
      onSuccess?.();
    }, 1800);
  };

  return (
    <div className="px-4 pt-3 pb-32">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#ff5500] via-[#d43800] to-[#7a1800] p-5 text-white shadow-xl mb-5">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>SoundCloud Premium</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight leading-tight">
            Unlock Full Fidelity. Zero Interruptions.
          </h2>
          <p className="text-xs text-white/90 mt-1 max-w-[280px]">
            Stream in 320kbps AAC, save unlimited tracks offline, and support artists directly.
          </p>
        </div>

        {/* Decorative cloud glow */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Billing Switcher */}
      <div className="flex justify-center mb-5">
        <div className="inline-flex p-1 bg-[#181818] border border-white/[0.08] rounded-xl">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              billingCycle === 'monthly'
                ? 'bg-[#ff5500] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              billingCycle === 'annual'
                ? 'bg-[#ff5500] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Annual</span>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded-full font-bold">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="space-y-3 mb-6">
        {/* SoundCloud Go+ */}
        <div
          onClick={() => setSelectedPlan('goplus')}
          role="button"
          tabIndex={0}
          className={`p-4 rounded-xl border transition cursor-pointer relative ${
            selectedPlan === 'goplus'
              ? 'bg-[#1e1e1e] border-[#ff5500] ring-1 ring-[#ff5500]'
              : 'bg-[#161616] border-white/[0.06] hover:bg-[#1a1a1a]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-bold text-[#ff5500] uppercase tracking-wider block">
                MOST POPULAR
              </span>
              <h3 className="text-base font-bold text-white">SoundCloud Go+</h3>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-white">
                {billingCycle === 'monthly' ? '$9.99' : '$7.99'}
              </span>
              <span className="text-[10px] text-neutral-400">/mo</span>
            </div>
          </div>

          <ul className="space-y-1.5 text-xs text-neutral-300 mt-3 pt-3 border-t border-white/[0.06]">
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#ff5500]" />
              <span>Full catalog access (150M+ premium tracks)</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#ff5500]" />
              <span>No ads or audio sponsor interruptions</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#ff5500]" />
              <span>Save tracks for offline mobile listening</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#ff5500]" />
              <span>High Quality Audio (320kbps AAC)</span>
            </li>
          </ul>
        </div>

        {/* SoundCloud Next Pro */}
        <div
          onClick={() => setSelectedPlan('pro')}
          role="button"
          tabIndex={0}
          className={`p-4 rounded-xl border transition cursor-pointer relative ${
            selectedPlan === 'pro'
              ? 'bg-[#1e1e1e] border-[#ff5500] ring-1 ring-[#ff5500]'
              : 'bg-[#161616] border-white/[0.06] hover:bg-[#1a1a1a]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                FOR CREATORS & ARTISTS
              </span>
              <h3 className="text-base font-bold text-white">Next Pro</h3>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-white">
                {billingCycle === 'monthly' ? '$14.99' : '$11.99'}
              </span>
              <span className="text-[10px] text-neutral-400">/mo</span>
            </div>
          </div>

          <ul className="space-y-1.5 text-xs text-neutral-300 mt-3 pt-3 border-t border-white/[0.06]">
            <li className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Unlimited track uploads & scheduled releases</span>
            </li>
            <li className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Advanced audience analytics & top listener stats</span>
            </li>
            <li className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Global distribution to Spotify & Apple Music</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Upgrade Action CTA */}
      <button
        onClick={handleUpgrade}
        type="button"
        disabled={upgraded}
        className="w-full h-12 rounded-full bg-[#ff5500] hover:bg-[#ff661a] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#ff5500]/30 transition"
      >
        {upgraded ? (
          <>
            <ShieldCheck className="w-5 h-5 text-white" />
            <span>Subscribed! Enjoy High Fidelity</span>
          </>
        ) : (
          <>
            <Star className="w-4 h-4 fill-white text-white" />
            <span>
              Start 30-Day Free Trial · {selectedPlan === 'goplus' ? 'SoundCloud Go+' : 'Next Pro'}
            </span>
          </>
        )}
      </button>

      <p className="text-[11px] text-neutral-500 text-center mt-3">
        Auto-renews monthly. Cancel anytime in your device account settings.
      </p>
    </div>
  );
};
