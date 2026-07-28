import React, { useState } from 'react';
import { Question } from '../types';
import { SplitBackground } from './SplitBackground';
import { Save, ArrowLeft, Image as ImageIcon, Sparkles, Plus, Trash2 } from 'lucide-react';

interface AdmQuestionFormProps {
  initialQuestion?: Question | null;
  onSave: (q: Question) => void;
  onCancel: () => void;
}

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
];

export const AdmQuestionForm: React.FC<AdmQuestionFormProps> = ({
  initialQuestion,
  onSave,
  onCancel
}) => {
  const [text, setText] = useState(initialQuestion?.text || '');
  const [imageUrl, setImageUrl] = useState(initialQuestion?.imageUrl || SAMPLE_IMAGES[0]);
  const [options, setOptions] = useState<string[]>(
    initialQuestion?.options || ['Resposta 1', 'Resposta 2', 'Resposta 3', 'Resposta 4']
  );
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(
    initialQuestion?.correctOptionIndex ?? 0
  );
  const [error, setError] = useState('');

  const handleOptionChange = (idx: number, value: string) => {
    const updated = [...options];
    updated[idx] = value;
    setOptions(updated);
  };

  const handleAddOption = () => {
    if (options.length >= 8) {
      setError('O limite máximo é de 8 opções por pergunta.');
      return;
    }
    setError('');
    setOptions([...options, `Resposta ${options.length + 1}`]);
  };

  const handleRemoveOption = (idxToRemove: number) => {
    if (options.length <= 2) {
      setError('A pergunta deve ter pelo menos 2 opções de resposta.');
      return;
    }
    setError('');
    const updated = options.filter((_, idx) => idx !== idxToRemove);
    setOptions(updated);

    // Adjust correct option index if needed
    if (correctOptionIndex === idxToRemove) {
      setCorrectOptionIndex(0);
    } else if (correctOptionIndex > idxToRemove) {
      setCorrectOptionIndex(correctOptionIndex - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError('Por favor, digite o texto da pergunta.');
      return;
    }

    if (options.length < 2) {
      setError('A pergunta precisa ter no mínimo 2 opções.');
      return;
    }

    if (options.some((opt) => !opt.trim())) {
      setError('Todas as opções de resposta devem estar preenchidas.');
      return;
    }

    const questionToSave: Question = {
      id: initialQuestion?.id || `q_${Date.now()}`,
      text: text.trim(),
      imageUrl: imageUrl.trim(),
      options: options.map((o) => o.trim()),
      correctOptionIndex,
      createdAt: initialQuestion?.createdAt || Date.now()
    };

    onSave(questionToSave);
  };

  return (
    <SplitBackground>
      {/* Top Red ADM Pill Badge */}
      <div className="pt-4 flex justify-center">
        <div className="bg-rose-600/90 text-white font-extrabold text-base md:text-lg px-8 py-2 rounded-full shadow-xl shadow-rose-950/60 border border-rose-400/40 tracking-widest select-none flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-200 animate-pulse" /> ADM PAINEL
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto my-auto py-4">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl shadow-slate-950/80 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-3 text-center">
            {initialQuestion ? 'Alterar Pergunta' : 'Criar Nova Pergunta'}
          </h2>

          {error && (
            <p className="text-rose-300 bg-rose-950/70 border border-rose-800 rounded-xl p-2.5 text-center text-xs font-medium">
              {error}
            </p>
          )}

          {/* Question Text */}
          <div className="space-y-1">
            <label className="block text-slate-300 text-xs font-bold uppercase tracking-widest ml-1">
              Texto da Pergunta:
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Digite a pergunta aqui..."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3.5 text-slate-100 font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-1">
            <label className="block text-slate-300 text-xs font-bold uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-blue-400" /> URL da Imagem:
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3 text-slate-100 text-sm outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />

            {/* Quick Image Presets */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Presets:
              </span>
              {SAMPLE_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(img)}
                  className={`w-10 h-10 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    imageUrl === img ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/30' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Options list */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-slate-300 text-xs font-bold uppercase tracking-widest ml-1">
                Opções de Resposta ({options.length}):
              </label>
              <button
                type="button"
                onClick={handleAddOption}
                id="btn-add-option"
                className="bg-blue-600/90 hover:bg-blue-500 text-white font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-blue-400/30 shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Adicionar Resposta
              </button>
            </div>

            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300 bg-slate-950 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-slate-800">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Resposta ${idx + 1}`}
                  className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-xl p-2.5 text-slate-100 font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setCorrectOptionIndex(idx)}
                  title="Marcar como resposta correta"
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    correctOptionIndex === idx
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {correctOptionIndex === idx ? 'Correta' : 'Marcar'}
                </button>
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    title="Excluir esta resposta"
                    className="p-2.5 bg-rose-950/80 hover:bg-rose-900/90 text-rose-300 hover:text-rose-100 border border-rose-800/80 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold py-3 px-4 rounded-xl border border-slate-800 cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl border border-blue-400/30 shadow-lg shadow-blue-600/30 cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Save className="w-5 h-5" /> Salvar Pergunta
            </button>
          </div>
        </form>
      </div>

      <div className="pb-2">
        <button
          onClick={onCancel}
          className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border border-slate-800 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" /> Voltar ao Painel ADM
        </button>
      </div>
    </SplitBackground>
  );
};
