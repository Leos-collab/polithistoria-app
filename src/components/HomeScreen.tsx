import React, { useState } from 'react';
import { SplitBackground } from './SplitBackground';
import { InteractiveCalendar } from './InteractiveCalendar';

interface HomeScreenProps {
  siteTitle: string;
  onStart: (name: string, birthDate: string) => void;
  onGoToAdm: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ siteTitle, onStart, onGoToAdm }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('00/00/0000');
  const [error, setError] = useState('');

  const handleStart = () => {
    if (!name.trim()) {
      setError('Por favor, informe seu nome para continuar.');
      return;
    }
    if (!birthDate || birthDate === '00/00/0000' || birthDate.length < 10) {
      setError('Por favor, selecione uma data de nascimento válida (00/00/0000).');
      return;
    }

    setError('');
    onStart(name.trim(), birthDate);
  };

  return (
    <SplitBackground>
      {/* Top Title: Nome do site */}
      <div className="pt-4 text-center">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-blue-200 to-amber-300 bg-clip-text text-transparent drop-shadow-lg">
          {siteTitle || 'POLITHISTÓRIA'}
        </h1>
        <p className="text-xs md:text-sm text-slate-300 mt-1.5 font-semibold tracking-wide drop-shadow-sm">
          A Jornada do Conhecimento entre História & Política
        </p>
      </div>

      {/* Main Form Card */}
      <div className="w-full flex flex-col items-center justify-center my-auto py-6">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl shadow-slate-950/80 space-y-5">
          {/* Input 1: Nome */}
          <div className="w-full space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-blue-400 ml-1 block text-left">
              Nome Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                const onlyLetters = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
                setName(onlyLetters);
                if (error) setError('');
              }}
              placeholder="Nome"
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl py-3.5 px-4 text-slate-100 placeholder-slate-600 font-medium text-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center"
              id="input-name"
            />
          </div>

          {/* Input 2: Data de nascimento */}
          <div className="w-full space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-blue-400 ml-1 block text-left">
              Data de Nascimento
            </label>
            <InteractiveCalendar
              value={birthDate}
              onChange={(val) => {
                setBirthDate(val);
                if (error) setError('');
              }}
            />
          </div>

          {error && (
            <p className="text-rose-300 bg-rose-950/70 border border-rose-800 rounded-xl p-2.5 text-center text-xs font-medium">
              {error}
            </p>
          )}
        </div>

        {/* Start Button: Vamos Começar? */}
        <div className="mt-8 md:mt-10 w-full max-w-md">
          <button
            onClick={handleStart}
            id="btn-vamos-comecar"
            className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold text-lg md:text-xl border border-blue-400/30 rounded-2xl py-4 px-8 shadow-xl shadow-blue-600/30 transition-all duration-200 cursor-pointer tracking-wider"
          >
            Vamos Começar?
          </button>
        </div>
      </div>

      {/* Bottom Left ADM Button - Camouflaged & Subtle */}
      <div className="w-full flex items-center justify-start pb-1 pl-1">
        <button
          onClick={onGoToAdm}
          id="btn-adm-home"
          className="bg-slate-950/40 hover:bg-slate-900/90 text-slate-500/60 hover:text-slate-300 font-mono text-[10px] px-2.5 py-1 rounded-lg border border-slate-800/30 hover:border-slate-700/60 opacity-40 hover:opacity-100 backdrop-blur-xs transition-all duration-300 cursor-pointer flex items-center gap-1 select-none"
          title="Painel Administrativo"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600/50" /> adm
        </button>
      </div>
    </SplitBackground>
  );
};
