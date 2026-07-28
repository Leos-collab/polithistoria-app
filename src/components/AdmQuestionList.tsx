import React from 'react';
import { Question } from '../types';
import { SplitBackground } from './SplitBackground';
import { Edit3, Trash2, Plus, ArrowLeft } from 'lucide-react';

interface AdmQuestionListProps {
  questions: Question[];
  onSelectEdit: (q: Question) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
  onBack: () => void;
}

export const AdmQuestionList: React.FC<AdmQuestionListProps> = ({
  questions,
  onSelectEdit,
  onDelete,
  onCreateNew,
  onBack
}) => {
  return (
    <SplitBackground>
      {/* Top Red ADM Pill Badge */}
      <div className="pt-4 flex justify-center">
        <div className="bg-rose-600/90 text-white font-extrabold text-base md:text-lg px-8 py-2 rounded-full shadow-xl shadow-rose-950/60 border border-rose-400/40 tracking-widest select-none flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-200 animate-pulse" /> ADM PAINEL
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto my-auto py-4">
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-slate-950/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-slate-100">
              Gerenciar Perguntas ({questions.length})
            </h2>
            <button
              onClick={onCreateNew}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer border border-blue-400/30"
            >
              <Plus className="w-4 h-4" /> Nova Pergunta
            </button>
          </div>

          {questions.length === 0 ? (
            <p className="text-center py-8 text-slate-400 font-medium text-sm">
              Nenhuma pergunta encontrada. Clique em "Nova Pergunta" para adicionar.
            </p>
          ) : (
            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={q.imageUrl}
                      alt="Thumbnail"
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-800"
                    />
                    <div>
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">
                        Pergunta {idx + 1}
                      </span>
                      <h4 className="font-bold text-slate-100 text-sm md:text-base line-clamp-2">
                        {q.text}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        Opções: {q.options.join(' • ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => onSelectEdit(q)}
                      className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shadow-md transition-all cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" /> Alterar
                    </button>
                    <button
                      onClick={() => onDelete(q.id)}
                      className="bg-rose-600 hover:bg-rose-500 text-white font-bold p-2 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                      title="Excluir Pergunta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pb-2">
        <button
          onClick={onBack}
          className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border border-slate-800 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" /> Voltar ao Painel ADM
        </button>
      </div>
    </SplitBackground>
  );
};
