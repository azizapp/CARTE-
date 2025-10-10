import React, { useState, useMemo, useEffect } from 'react';
import { Store } from '../types.ts';
import { FilterState } from '../App.tsx';

const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  onClear: () => void;
  currentFilters: FilterState;
  stores: Store[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  onClear,
  currentFilters,
  stores,
}) => {
  const [filters, setFilters] = useState<FilterState>(currentFilters);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters, isOpen]);

  const cities = useMemo(() => {
    const citySet = new Set<string>();
    stores.forEach(store => {
      if (store.Ville) {
        citySet.add(store.Ville);
      }
    });
    return Array.from(citySet).sort();
  }, [stores]);
  
  const clientLevels = ['Haute', 'Haute et Moyenne', 'Moyenne', 'Économie'];
  const priorities = ['High', 'Medium', 'Low'];

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, city: e.target.value }));
  };

  const toggleSelection = (key: 'gammes' | 'priorities', value: string) => {
    setFilters(prev => {
      const currentValues = prev[key] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [key]: newValues };
    });
  };

  const handleApply = () => {
    onApply(filters);
  };
  
  const handleClear = () => {
    const clearedFilters = { city: '', gammes: [], priorities: [] };
    setFilters(clearedFilters);
    onApply(clearedFilters);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-end sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-md m-0 sm:m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Filtres</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Close filters"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <label htmlFor="ville" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Ville
            </label>
            <select
              id="ville"
              name="ville"
              value={filters.city}
              onChange={handleCityChange}
              className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-[var(--accent-color)] focus:ring-[var(--accent-color)] sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            >
              <option value="">Toutes les villes</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Niveau client</h3>
            <div className="flex flex-wrap gap-2">
              {clientLevels.map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => toggleSelection('gammes', level)}
                  className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                    filters.gammes.includes(level)
                      ? 'bg-[var(--accent-color)] text-white border-transparent'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Priorité</h3>
            <div className="flex flex-wrap gap-2">
              {priorities.map(priority => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => toggleSelection('priorities', priority)}
                   className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                    filters.priorities.includes(priority)
                      ? 'bg-[var(--accent-color)] text-white border-transparent'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-end p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-2xl sm:rounded-b-2xl space-x-3">
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600"
          >
            Effacer
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--accent-color)] rounded-lg shadow-sm hover:opacity-90"
          >
            Appliquer
          </button>
        </footer>
      </div>
    </div>
  );
};

export default FilterModal;