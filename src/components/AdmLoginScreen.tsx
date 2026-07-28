import React, { useState } from 'react';
import { SplitBackground } from './SplitBackground';
import { DEFAULT_ADMIN_CREDENTIALS } from '../lib/initialData';
import { Lock, ArrowLeft, KeyRound } from 'lucide-react';

interface AdmLoginScreenProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export const AdmLoginScreen: React.FC<AdmLoginScreenProps> = ({ onLoginSuccess, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Validates strictly against administrator credentials (Leonardo estivalet / leo1406)
    if (
      cleanUser === DEFAULT_ADMIN_CREDENTIALS.username.toLowerCase() &&
      cleanPass === DEFAULT_ADMIN_CREDENTIALS.password
    ) {
      setError('');
      onLoginSuccess();
    } else {
      setError('Credenciais incorretas. Digite o Usuário e a Senha corretos.');
    }
  };

  return (
    <SplitBackground>
      {/* Top Red ADM Pill Badge */}
      <div className="pt-4 flex justify-center">
        <div className="bg-rose-600/90 text-white font-extrabold text-base md:text-lg px-8 py-2 rounded-full shadow-xl shadow-rose-950/60 border border-rose-400/40 tracking-widest select-none flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-200 animate-pulse" /> ADM PAINEL
        </div>
      </div>

      {/* Login Form Card */}
      <div className="w-full max-w-md mx-auto my-auto py-6">
        <form
          onSubmit={handleLogin}
          className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl shadow-slate-950/80 space-y-5"
        >
          <div className="text-center pb-2">
            <h2 className="text-xl font-bold text-slate-100">Autenticação Administrativa</h2>
            <p className="text-xs text-slate-400 mt-1">Insira suas credenciais para gerenciar o sistema</p>
          </div>

          {/* Input 1: Nome */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 block text-left">
              Usuário / Nome
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError('');
              }}
              placeholder="Nome"
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl py-3.5 px-4 text-slate-100 placeholder-slate-600 font-medium text-base outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center"
              id="input-adm-username"
            />
          </div>

          {/* Input 2: Senha */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 block text-left">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="Senha"
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl py-3.5 px-4 text-slate-100 placeholder-slate-600 font-medium text-base outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center"
              id="input-adm-password"
            />
          </div>

          {error && (
            <p className="text-rose-300 bg-rose-950/70 border border-rose-800 rounded-xl p-2.5 text-center text-xs font-medium">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            id="btn-adm-login-submit"
            className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold py-3.5 px-6 rounded-2xl border border-blue-400/30 shadow-xl shadow-blue-600/30 transition-all cursor-pointer text-lg tracking-wide"
          >
            Acessar Painel ADM
          </button>

          {/* Hint */}
          <div className="text-center pt-1 text-xs text-slate-400 font-mono flex items-center justify-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-blue-400" /> Padrão: Nome: <strong className="text-blue-300">adm</strong> / Senha: <strong className="text-blue-300">123</strong>
          </div>
        </form>
      </div>

      {/* Bottom Back Button */}
      <div className="w-full flex items-center justify-start pb-2">
        <button
          onClick={onBack}
          className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 border border-slate-800 shadow-md cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" /> Voltar ao Início
        </button>
      </div>
    </SplitBackground>
  );
};
