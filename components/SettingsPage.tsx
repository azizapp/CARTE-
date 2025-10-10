import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle.tsx';
import ModeToggle from './ModeToggle.tsx';
import ConnectionStatusIcon from './ConnectionStatusIcon.tsx';
import ArrowPathIcon from './icons/ArrowPathIcon.tsx';
import SpinnerIcon from './icons/SpinnerIcon.tsx';
import CheckIcon from './icons/CheckIcon.tsx';
import ConfirmationModal from './ConfirmationModal.tsx';
import { Mode } from '../types.ts';

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

const accentColors = [
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
];

interface SettingsPageProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  font: string;
  setFont: (font: string) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  onClose: () => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  isOnline: boolean;
  onRefresh: () => void;
  isLoading: boolean;
  onResetSettings: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
  theme, setTheme, font, setFont, accentColor, setAccentColor, onClose, mode, setMode, isOnline, onRefresh, isLoading, onResetSettings 
}) => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  
  return (
    <div className="bg-slate-100 dark:bg-slate-900 min-h-screen">
      <header className="sticky top-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm z-10 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 h-16 flex items-center justify-center relative">
          <button type="button" onClick={onClose} className="absolute left-4 top-0 bottom-0 flex items-center">
            <ArrowLeftIcon className="w-6 h-6 text-slate-700 dark:text-slate-200" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Réglages</h1>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-6 max-w-4xl pb-20">
        <div className="space-y-8">
        
          <section>
            <h2 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 px-4 mb-2">Données & Synchronisation</h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
              <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                <li className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">Mode de stockage</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Test (local) ou Production (en ligne).</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {mode === Mode.Production && <ConnectionStatusIcon connected={isOnline} />}
                    <ModeToggle mode={mode} setMode={setMode} />
                  </div>
                </li>
                <li className="p-4 flex items-center justify-between">
                  <p className="font-medium text-slate-800 dark:text-slate-100">Mise à jour des données</p>
                  <button 
                    onClick={onRefresh} 
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 disabled:opacity-50 disabled:cursor-wait transition-colors"
                  >
                    {isLoading ? <SpinnerIcon className="w-5 h-5 animate-spin"/> : <ArrowPathIcon className="w-5 h-5"/>}
                    Actualiser
                  </button>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 px-4 mb-2">Apparence</h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
              <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                <li className="p-4 flex items-center justify-between">
                  <p className="font-medium text-slate-800 dark:text-slate-100">Thème</p>
                  <ThemeToggle theme={theme} setTheme={setTheme} />
                </li>
                 <li className="p-4">
                  <p className="font-medium text-slate-800 dark:text-slate-100 mb-3">Couleur d'accentuation</p>
                  <div className="flex items-center space-x-3">
                    {accentColors.map(color => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setAccentColor(color.value)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${accentColor === color.value ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800' : ''}`}
                        // FIX: Replaced invalid `ringColor` style property with `--tw-ring-color`, the correct CSS custom property for Tailwind's ring color.
                        style={{ backgroundColor: color.value, '--tw-ring-color': color.value } as React.CSSProperties}
                        aria-label={`Set accent color to ${color.name}`}
                      >
                        {accentColor === color.value && <CheckIcon className="w-6 h-6 text-white" />}
                      </button>
                    ))}
                  </div>
                </li>
                <li className="p-4 flex items-center justify-between">
                  <p className="font-medium text-slate-800 dark:text-slate-100">Police</p>
                  <select 
                    id="font-select" 
                    value={font}
                    onChange={(e) => setFont(e.target.value)}
                    className="block w-36 rounded-lg border-slate-300 dark:border-slate-600 shadow-sm sm:text-sm bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Lato">Lato</option>
                  </select>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 px-4 mb-2">Général</h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 flex items-center justify-between">
                    <div>
                        <p className="font-medium text-slate-800 dark:text-slate-100">Réinitialiser les paramètres</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Restaurer tous les paramètres à leurs valeurs par défaut.</p>
                    </div>
                    <button 
                        onClick={() => setIsResetModalOpen(true)}
                        className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
                    >
                        Réinitialiser
                    </button>
                </div>
            </div>
          </section>

        </div>
      </main>
      
      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={() => {
            onResetSettings();
            setIsResetModalOpen(false);
        }}
        title="Réinitialiser les paramètres"
        message="Êtes-vous sûr de vouloir réinitialiser tous les paramètres à leurs valeurs par défaut ? Cette action est irréversible."
        confirmText="Réinitialiser"
      />
    </div>
  );
};

export default SettingsPage;