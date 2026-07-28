import React, { useState } from 'react';
import { UserRegistration, Question } from '../types';
import { SplitBackground } from './SplitBackground';
import {
  Users,
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Database,
  Award
} from 'lucide-react';

interface AdmResponsesViewProps {
  userRegistrations: UserRegistration[];
  questions?: Question[];
  onBack: () => void;
}

export const AdmResponsesView: React.FC<AdmResponsesViewProps> = ({
  userRegistrations,
  questions = [],
  onBack
}) => {
  // State to track which user card is expanded (by user id). Can expand multiple or toggle single.
  const [expandedUserIds, setExpandedUserIds] = useState<Record<string, boolean>>({});

  const toggleUserExpand = (userId: string) => {
    setExpandedUserIds((prev) => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Helper to calculate score and question evaluation for a user registration
  const evaluateUserAnswers = (user: UserRegistration) => {
    let correctCount = 0;

    const evaluatedList = user.answers.map((ans) => {
      // Find matching question
      const q = questions.find((item) => item.id === ans.questionId) ||
                questions.find((item) => item.text.trim().toLowerCase() === ans.questionText.trim().toLowerCase());

      if (!q) {
        return {
          ...ans,
          isKnown: false,
          isCorrect: false,
          correctOption: ''
        };
      }

      const correctIndex = q.correctOptionIndex ?? 0;
      const correctOption = q.options[correctIndex] || '';
      const isCorrect = ans.selectedOption.trim().toLowerCase() === correctOption.trim().toLowerCase();

      if (isCorrect) {
        correctCount++;
      }

      return {
        ...ans,
        isKnown: true,
        isCorrect,
        correctOption
      };
    });

    return {
      evaluatedList,
      correctCount,
      totalCount: user.answers.length
    };
  };

  return (
    <SplitBackground>
      {/* Top Red ADM Pill Badge */}
      <div className="pt-4 flex justify-center">
        <div className="bg-rose-600/90 text-white font-extrabold text-base md:text-lg px-8 py-2 rounded-full shadow-xl shadow-rose-950/60 border border-rose-400/40 tracking-widest select-none flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-200 animate-pulse" /> ADM PAINEL
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto my-auto py-4">
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-slate-950/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" /> Respostas dos Usuários ({userRegistrations.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Clique no nome do usuário para ver as questões que ele errou e acertou
              </p>
            </div>
            <span className="text-xs bg-emerald-950/80 text-emerald-400 font-mono px-3 py-1 rounded-full border border-emerald-800/80 flex items-center gap-1.5 shrink-0">
              <Database className="w-3.5 h-3.5" /> Firebase Firestore
            </span>
          </div>

          {userRegistrations.length === 0 ? (
            <p className="text-center py-10 text-slate-400 font-medium text-sm">
              Nenhum usuário respondeu ao questionário ainda.
            </p>
          ) : (
            <div className="space-y-3.5 max-h-[58vh] overflow-y-auto pr-1">
              {userRegistrations.map((user) => {
                const isExpanded = !!expandedUserIds[user.id];
                const { evaluatedList, correctCount, totalCount } = evaluateUserAnswers(user);

                return (
                  <div
                    key={user.id}
                    className="bg-slate-950/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-md transition-all"
                  >
                    {/* User Card Header - Clickable */}
                    <button
                      type="button"
                      onClick={() => toggleUserExpand(user.id)}
                      id={`user-card-${user.id}`}
                      className="w-full p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left hover:bg-slate-900/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-950/90 border border-blue-800/60 flex items-center justify-center text-blue-400 font-bold text-lg shrink-0">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-100 text-base md:text-lg">
                              {user.name}
                            </h3>
                            <span className="text-[11px] bg-slate-900 text-slate-400 font-mono px-2 py-0.5 rounded-md border border-slate-800 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-blue-400" /> {user.birthDate}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> {new Date(user.createdAt).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>

                      {/* Score Badge and Toggle Arrow */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
                          <Award className="w-4 h-4 text-emerald-400" />
                          <span className="text-slate-300">Acertos:</span>
                          <span className="text-emerald-400 font-bold">
                            {correctCount} / {totalCount}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-blue-400 font-medium bg-blue-950/50 px-3 py-1.5 rounded-xl border border-blue-900/60">
                          <span>{isExpanded ? 'Ocultar' : 'Ver Detalhes'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-blue-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expandable Answers Details */}
                    {isExpanded && (
                      <div className="p-4 pt-2 border-t border-slate-800/80 bg-slate-900/40 space-y-2.5 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-widest pb-1">
                          <span>Desempenho por Questão:</span>
                          <span className="text-emerald-400 font-normal normal-case">
                            {correctCount} acerto(s) e {totalCount - correctCount} erro(s)
                          </span>
                        </div>

                        {evaluatedList.map((ans, idx) => {
                          return (
                            <div
                              key={idx}
                              className={`p-3.5 rounded-xl border text-xs flex flex-col gap-1.5 transition-all ${
                                ans.isCorrect
                                  ? 'bg-emerald-950/20 border-emerald-900/60 text-slate-200'
                                  : 'bg-rose-950/20 border-rose-900/60 text-slate-200'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-semibold text-slate-100 text-sm">
                                  {idx + 1}. {ans.questionText}
                                </span>
                                {ans.isCorrect ? (
                                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 shrink-0 text-[11px]">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ACERTOU
                                  </span>
                                ) : (
                                  <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 shrink-0 text-[11px]">
                                    <XCircle className="w-3.5 h-3.5 text-rose-400" /> ERROU
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1 font-sans">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-400">Resposta do usuário:</span>
                                  <span
                                    className={`font-bold px-2 py-0.5 rounded ${
                                      ans.isCorrect
                                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                                    }`}
                                  >
                                    {ans.selectedOption}
                                  </span>
                                </div>

                                {!ans.isCorrect && ans.correctOption && (
                                  <div className="flex items-center gap-1.5 sm:ml-auto">
                                    <span className="text-slate-400">Gabarito correto:</span>
                                    <span className="font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                                      {ans.correctOption}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
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

