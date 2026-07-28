import React from 'react';

interface SplitBackgroundProps {
  children: React.ReactNode;
}

export const SplitBackground: React.FC<SplitBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-slate-950 text-slate-100 font-sans select-none">
      {/* Atmospheric Background Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-900/25 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Background Split */}
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 z-0 pointer-events-none opacity-80">
        {/* Left Side: Pyramids Sunset (History) */}
        <div className="relative h-1/2 md:h-full w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80"
            alt="História - Pirâmides"
            className="w-full h-full object-cover object-center filter brightness-85 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />
        </div>

        {/* Right Side: Parliament / Political Dome (Politics) */}
        <div className="relative h-1/2 md:h-full w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80"
            alt="Política - Parlamento"
            className="w-full h-full object-cover object-center filter brightness-85 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-between p-4 md:p-8 max-w-6xl w-full mx-auto">
        {children}
      </div>
    </div>
  );
};
