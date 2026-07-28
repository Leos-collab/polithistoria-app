import React from 'react';
import { UserRegistration } from '../types';
import { SplitBackground } from './SplitBackground';
import { CheckCircle2, XCircle, RotateCcw, Award, Calendar, User, Trophy } from 'lucide-react';

interface CompletionScreenProps {
  userReg: UserRegistration;
  onRestart: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({ userReg, onRestart }) => {
  const totalQuestions = userReg.answers.length;
  const correctCount = userReg.answers.filter((a) => a.isCorrect).length;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const scoreColor =
    scorePercent >= 70
      ? 'text-emerald-400'
      : scorePercent >= 40
      ? 'text-amber-400'
      : 'text-rose-400';

  const scoreBg =
    scorePercent >= 70
      ? 'from-emerald-950/60 to-teal-950/60 border-emerald-800/50'
      : scorePercent >= 40
      ? 'from-amber-950/60 to-yellow-950/60 border-amber-800/50'
      : 'from-rose-950/60 to-red-950/60 border-rose-800/50';

  return (
    <SplitBackground>
      <div className="pt-4 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-blue-400 bg-clip-text text-transparent drop-shadow-sm flex items-center justify-center gap-3">
          <Award className="w-8 h-8 text-emerald-400" /> Questionário Concluído!
        </h1>
      </div>

      <div className="w-full max-w-xl mx-auto my-auto py-6">
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          {/* User info */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-slate-100 font-bold text-lg">
              <User className="w-5 h-5 text-blue-400" />
              <span>{userReg.name}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 font-medium text-xs bg-slate-950 px-3.5 py-1.5 rounded-full border border-slate-800 font-mono">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>{userReg.birthDate}</span>
            </div>
          </div>

          {/* Score Card */}
          <div className={`bg-gradient-to-br ${scoreBg} border rounded-2xl p-4 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <Trophy className={`w-8 h-8 ${scoreColor}`} />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Pontuação Final</p>
                <p className="text-slate-200 font-semibold text-sm">
                  {correctCount} de {totalQuestions} corretas
                </p>
              </div>
            </div>
            <span className={`text-4xl font-black tabular-nums ${scoreColor}`}>
              {scorePercent}%
            </span>
          </div>

          {/* Answer list */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              Resumo das Respostas:
            </h3>
            {userReg.answers.map((ans, idx) => (
              <div
                key={idx}
                className={`border rounded-xl p-3 text-sm shadow-sm flex flex-col gap-1.5 ${
                  ans.isCorrect
                    ? 'bg-emerald-950/40 border-emerald-800/60'
                    : 'bg-rose-950/40 border-rose-800/60'
                }`}
              >
                <span className="font-semibold text-slate-200">
                  {idx + 1}. {ans.questionText}
                </span>

                {/* Selected answer */}
                <span
                  className={`font-medium flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg border w-fit ${
                    ans.isCorrect
                      ? 'text-emerald-300 bg-emerald-950/80 border-emerald-800/80'
                      : 'text-rose-300 bg-rose-950/80 border-rose-800/80'
                  }`}
                >
                  {ans.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                  Sua resposta: {ans.selectedOption}
                </span>

                {/* Show correct answer if wrong */}
                {!ans.isCorrect && ans.correctOption && (
                  <span className="text-emerald-300 font-medium flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg border border-emerald-800/60 bg-emerald-950/50 w-fit">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Correta: {ans.correctOption}
                  </span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={onRestart}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-2xl border border-blue-400/30 shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-lg cursor-pointer active:scale-[0.98]"
          >
            <RotateCcw className="w-5 h-5" /> Responder Novamente
          </button>
        </div>
      </div>

      <div className="pb-2 text-center text-xs text-slate-500 font-mono">
        Dados persistidos via Supabase & Armazenamento Local
      </div>
    </SplitBackground>
  );
};
