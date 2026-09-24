import React from 'react';
import { Wifi, Battery } from 'lucide-react';

export const StatusBar: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-between px-6 pt-3 pb-2 text-[14px] font-semibold text-neutral-200 select-none tracking-tight">
      {/* Time as requested: 3.17 */}
      <span className="font-semibold text-[13px] tracking-normal">3.17</span>

      {/* Notch / Speaker indicator subtle space */}
      <div className="w-16 h-4 bg-neutral-900/60 rounded-full mx-auto opacity-0" />

      {/* Signal, WiFi, Battery icons */}
      <div className="flex items-center gap-1.5 text-neutral-200">
        {/* Cellular 4 bars */}
        <div className="flex items-end gap-[1.5px] h-3 mr-0.5">
          <span className="w-[2.5px] h-[3px] bg-neutral-200 rounded-[0.5px]" />
          <span className="w-[2.5px] h-[5.5px] bg-neutral-200 rounded-[0.5px]" />
          <span className="w-[2.5px] h-[8px] bg-neutral-200 rounded-[0.5px]" />
          <span className="w-[2.5px] h-[11px] bg-neutral-200 rounded-[0.5px]" />
        </div>

        {/* Wifi */}
        <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />

        {/* Battery */}
        <div className="flex items-center gap-0.5 ml-0.5">
          <div className="relative flex items-center">
            <Battery className="w-5 h-5 stroke-[1.8]" />
            <div className="absolute left-[3px] top-[5.5px] w-2.5 h-2 bg-neutral-200 rounded-[0.5px]" />
          </div>
        </div>
      </div>
    </div>
  );
};
