import React from 'react';
import { SplitBackground } from './SplitBackground';
import { PlusCircle, Edit3, Users, LogOut, ArrowLeft } from 'lucide-react';

interface AdmDashboardScreenProps {
  onCreateQuestion: () => void;
  onEditQuestions: () => void;
  onViewResponses: () => void;
  onLogout: () => void;
}

export const AdmDashboardScreen: React.FC<AdmDashboardScreenProps> = ({
  onCreateQuestion,
  onEditQuestions,
  onViewResponses,
  onLogout
}) => {
  return (
    <SplitBackground>
      {/* Top Red ADM Pill Badge */}
      <div className="pt-4 flex justify-center">
        <div className="bg-rose-600/90 text-white font-extrabold text-base md:text-lg px-8 py-2 rounded-full shadow-xl shadow-rose-950/60 border border-rose-400/40 tracking-widest select-none flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-200 animate-pulse" /> ADM PAINEL
        </div>
      </div>

      {/* Admin Action Menu Card */}
      <div className="w-full max-w-lg mx-auto my-auto py-6">
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl shadow-slate-950/80 space-y-4">
          <div className="text-center pb-2">
            <h2 className="text-xl font-bold text-slate-100">Menu Principal ADM</h2>
            <p className="text-xs text-slate-400 mt-1">Selecione uma opção para gerenciar o questionário</p>
          </div>

          {/* Option 1: Criar nova pergunta + respostas */}
          <button
            onClick={onCreateQuestion}
            id="btn-adm-create-question"
            className="w-full bg-slate-950/80 hover:bg-slate-800/90 active:scale-[0.98] text-slate-100 font-medium text-base py-4 px-6 rounded-2xl border border-slate-800 hover:border-slate-700 shadow-lg transition-all text-left flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-800/60 text-blue-400 group-hover:scale-105 transition-transform">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-slate-100">Criar Nova Pergunta</div>
                <div className="text-xs text-slate-400">Adicione título, imagem e 4 opções</div>
              </div>
            </div>
            <span className="text-slate-500 group-hover:text-blue-400 transition-colors">→</span>
          </button>

          {/* Option 2: Alterar alguma Pergunta (ou imagem ou resposta) */}
          <button
            onClick={onEditQuestions}
            id="btn-adm-edit-question"
            className="w-full bg-slate-950/80 hover:bg-slate-800/90 active:scale-[0.98] text-slate-100 font-medium text-base py-4 px-6 rounded-2xl border border-slate-800 hover:border-slate-700 shadow-lg transition-all text-left flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-800/60 text-amber-400 group-hover:scale-105 transition-transform">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-slate-100">Editar Perguntas Existentess</div>
                <div className="text-xs text-slate-400">Modifique textos, imagens e alternativas</div>
              </div>
            </div>
            <span className="text-slate-500 group-hover:text-amber-400 transition-colors">→</span>
          </button>

          {/* Option 3: Ver Cadastros & Respostas */}
          <button
            onClick={onViewResponses}
            id="btn-adm-view-responses"
            className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold text-base py-4 px-6 rounded-2xl border border-blue-400/30 shadow-xl shadow-blue-600/30 transition-all text-left flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/30 border border-blue-300/40 text-white">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white">Ver Usuários & Respostas Salvas</div>
                <div className="text-xs text-blue-200/80">Acesse cadastros e sincronização com Firebase</div>
              </div>
            </div>
            <span className="text-blue-200">→</span>
          </button>
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="w-full flex items-center justify-between pb-2">
        <button
          onClick={onLogout}
          className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-rose-400 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 border border-slate-800 shadow-md cursor-pointer transition-all"
        >
          <LogOut className="w-4 h-4 text-rose-400" /> Sair do ADM
        </button>

        <span className="text-xs text-slate-500 font-mono">
          Painel de Controle Administrador
        </span>
      </div>
    </SplitBackground>
  );
};
