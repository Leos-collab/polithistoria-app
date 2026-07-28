import React, { useState } from 'react';
import { Question, UserAnswer } from '../types';
import { CheckCircle2, ChevronRight, RefreshCw, Home } from 'lucide-react';

interface QuestionScreenProps {
  userName: string;
  userBirthDate: string;
  questions: Question[];
  onComplete: (answers: UserAnswer[]) => void;
  onCancel: () => void;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  userName,
  userBirthDate,
  questions,
  onComplete,
  onCancel
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#632023] via-[#a35638] to-[#e09f67] flex flex-col items-center justify-center p-6 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Nenhuma pergunta cadastrada.</h2>
        <p className="mb-6 opacity-80">Por favor, acesse a área ADM para adicionar perguntas.</p>
        <button
          onClick={onCancel}
          className="bg-white text-zinc-900 font-bold px-6 py-3 rounded-2xl shadow-lg hover:bg-zinc-100"
        >
          Voltar para a Página Inicial
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const correctOptionIndex = currentQuestion.correctOptionIndex ?? -1;
    const correctOption = correctOptionIndex >= 0 ? currentQuestion.options[correctOptionIndex] : '';
    const isCorrect = selectedOption === correctOption;

    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      selectedOption: selectedOption,
      correctOption,
      isCorrect,
      answeredAt: new Date().toISOString()
    };

    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);
    setSelectedOption(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Finished all questions
      onComplete(updatedAnswers);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 font-sans select-none overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-indigo-900/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Bar / Metadata */}
      <div className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between text-slate-300 text-sm mb-2">
        <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-800 shadow-md">
          <span className="font-semibold text-blue-400">{userName}</span>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-400 font-mono">{userBirthDate}</span>
        </div>

        <button
          onClick={onCancel}
          className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-slate-800 shadow-md transition-all cursor-pointer"
        >
          <Home className="w-4 h-4 text-blue-400" /> Início
        </button>
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto flex-1 flex flex-col justify-center my-auto space-y-6 py-4">
        {/* Top Box: Pergunta / Question Text */}
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 text-center shadow-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-950/80 border border-blue-800/60 px-3.5 py-1 rounded-full inline-block mb-3">
            Pergunta {currentIndex + 1} de {questions.length}
          </span>
          <h2 className="text-slate-100 font-medium text-lg md:text-2xl leading-relaxed">
            {currentQuestion.text || 'Pergunta'}
          </h2>
        </div>

        {/* Center Box: Image */}
        <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl p-2.5 shadow-2xl max-w-xs md:max-w-sm w-full mx-auto border border-slate-800 overflow-hidden">
          <div className="bg-slate-950 rounded-2xl overflow-hidden aspect-square flex items-center justify-center relative group">
            {currentQuestion.imageUrl ? (
              <img
                src={currentQuestion.imageUrl}
                alt="Pergunta"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80';
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-blue-500 p-6">
                <svg
                  className="w-24 h-24 stroke-current opacity-80"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.5"
                >
                  <path d="M12 3v2m0 14v2M3 12h2m14 0h2" />
                  <circle cx="12" cy="12" r="8" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Options 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full mx-auto">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                className={`p-4 md:p-5 rounded-2xl font-medium text-base md:text-lg border transition-all text-center flex items-center justify-center relative cursor-pointer shadow-lg ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold border-blue-400 ring-2 ring-blue-400/50 shadow-blue-600/40 scale-[1.01]'
                    : 'bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 border-slate-800 active:scale-98'
                }`}
              >
                <span>{opt || `Resposta ${idx + 1}`}</span>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 absolute right-4 text-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation Action */}
      <div className="relative z-10 max-w-5xl w-full mx-auto pt-2 flex justify-end">
        <button
          onClick={handleNext}
          disabled={!selectedOption}
          className={`px-8 py-3.5 rounded-2xl font-bold text-base md:text-lg flex items-center gap-2 shadow-xl transition-all ${
            selectedOption
              ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-blue-600/30 scale-100 border border-blue-400/30'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50 border border-slate-800'
          }`}
        >
          {currentIndex + 1 < questions.length ? 'Próxima Pergunta' : 'Finalizar Questionário'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
