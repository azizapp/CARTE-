import React, { useState } from 'react';

// Icons
const AtSymbolIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
  </svg>
);

const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);


interface UserEmailSetupProps {
  isOpen: boolean;
  onSave: (email: string) => void;
}

const UserEmailSetup: React.FC<UserEmailSetupProps> = ({ isOpen, onSave }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Veuillez entrer une adresse Gmail valide.');
      return;
    }
    setError('');
    onSave(email);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-sm w-full m-4">
        <form onSubmit={handleSave}>
            <div className="p-6">
            <div className="flex items-start">
                 <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700/50 sm:mx-0 sm:h-10 sm:w-10">
                    <UserCircleIcon className="h-6 w-6 text-[var(--accent-color)]" />
                 </div>
                 <div className="mt-1 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white">Email de l'utilisateur</h3>
                    <div className="mt-1">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Veuillez entrer votre adresse Gmail pour l'associer aux nouveaux enregistrements.</p>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <label htmlFor="user-email" className="sr-only">Email</label>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <AtSymbolIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="email"
                        id="user-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@gmail.com"
                        required
                        className="block w-full rounded-md border-slate-300 bg-white py-2.5 pl-10 pr-3 shadow-sm focus:border-[var(--accent-color)] focus:ring-[var(--accent-color)] sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                </div>
              {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
            </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
            <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[var(--accent-color)] text-base font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] sm:ml-3 sm:w-auto sm:text-sm"
            >
                Enregistrer
            </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default UserEmailSetup;