import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';

interface InteractiveCalendarProps {
  value: string; // DD/MM/YYYY
  onChange: (val: string) => void;
}

export const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Parse current selected or fallback to today/default
  const parseValue = () => {
    if (value && value !== '00/00/0000') {
      const parts = value.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year) && year > 1900 && year < 2100) {
          return new Date(year, month, day);
        }
      }
    }
    return new Date(2000, 0, 1); // Default reference year 2000
  };

  const [currentViewDate, setCurrentViewDate] = useState<Date>(parseValue());
  const [selectedDay, setSelectedDay] = useState<Date>(parseValue());

  const currentYear = currentViewDate.getFullYear();
  const currentMonth = currentViewDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const yearsList = Array.from({ length: 110 }, (_, i) => 2026 - i);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleSelectDay = (dayNum: number) => {
    const picked = new Date(currentYear, currentMonth, dayNum);
    setSelectedDay(picked);

    const formattedDay = String(dayNum).padStart(2, '0');
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedYear = String(currentYear);

    onChange(`${formattedDay}/${formattedMonth}/${formattedYear}`);
    setIsOpen(false);
  };

  // Mask input handler for direct typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 8) raw = raw.slice(0, 8);

    let formatted = '';
    if (raw.length === 0) {
      formatted = '';
    } else if (raw.length <= 2) {
      formatted = raw;
    } else if (raw.length <= 4) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    } else {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2, 4)}/${raw.slice(4)}`;
    }

    onChange(formatted);
  };

  return (
    <div className="relative w-full">
      {/* Formatted Input Container */}
      <div className="relative flex items-center bg-slate-950/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-3.5 bg-slate-800/80 hover:bg-slate-700 text-blue-400 transition-colors flex items-center justify-center border-r border-slate-700/80 cursor-pointer"
          title="Abrir calendário interativo"
          id="btn-open-calendar"
        >
          <CalendarIcon className="w-5 h-5 text-blue-400" />
        </button>

        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder="00/00/0000"
          className="w-full bg-transparent py-3.5 px-4 text-slate-100 placeholder-slate-600 font-mono text-base outline-none text-center tracking-widest"
          id="input-birth-date"
        />
      </div>

      {/* Interactive Calendar Popover / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-blue-950/40 max-w-sm w-full text-slate-100 animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <h3 className="font-semibold text-base text-blue-400 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-400" /> Selecionar Data
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Month & Year Controls */}
            <div className="flex items-center justify-between mb-4 gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <select
                  value={currentMonth}
                  onChange={(e) =>
                    setCurrentViewDate(new Date(currentYear, parseInt(e.target.value, 10), 1))
                  }
                  className="bg-slate-950 text-slate-100 rounded-lg px-2.5 py-1 text-xs font-semibold border border-slate-700 outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {monthNames.map((m, idx) => (
                    <option key={m} value={idx}>
                      {m}
                    </option>
                  ))}
                </select>

                <select
                  value={currentYear}
                  onChange={(e) =>
                    setCurrentViewDate(new Date(parseInt(e.target.value, 10), currentMonth, 1))
                  }
                  className="bg-slate-950 text-slate-100 rounded-lg px-2.5 py-1 text-xs font-semibold border border-slate-700 outline-none max-h-40 focus:ring-1 focus:ring-blue-500"
                >
                  {yearsList.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleNextMonth}
                className="p-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold tracking-wider text-slate-500 mb-2">
              <span>DOM</span>
              <span>SEG</span>
              <span>TER</span>
              <span>QUA</span>
              <span>QUI</span>
              <span>SEX</span>
              <span>SÁB</span>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {/* Offset days */}
              {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                <div key={`offset-${idx}`} className="h-8" />
              ))}

              {/* Month days */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const isSelected =
                  selectedDay.getDate() === dayNum &&
                  selectedDay.getMonth() === currentMonth &&
                  selectedDay.getFullYear() === currentYear;

                return (
                  <button
                    key={dayNum}
                    onClick={() => handleSelectDay(dayNum)}
                    className={`h-9 w-9 rounded-lg font-medium text-xs flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/40 ring-1 ring-blue-400'
                        : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>

            {/* Selected preview & Close button */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                Data: <strong className="text-blue-400">{value || '00/00/0000'}</strong>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" /> Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
