import React, { useState, useMemo } from 'react';
import { Store } from '../types.ts';
import AppointmentModal from './AppointmentModal.tsx';

// Icon Definitions
const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
);
const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" /></svg>
);
const EllipsisVerticalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" /></svg>
);
const PhoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
);
const EnvelopeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25-2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
);
const MapPinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
);
const ChevronRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
);
const ArrowsPointingOutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
);
const DocumentPlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
);
const CompassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
);
const CalendarDaysIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" /></svg>
);
const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
);
const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);
const HistoryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);
const CurrencyDollarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);
const CubeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
);
const ClipboardDocumentCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
    </svg>
);


interface ProspectDetailPageProps {
  store: Store;
  onClose: () => void;
  onAddFollowup: (store: Store) => void;
  onDelete: (store: Store) => void;
}

const formatRelativeTime = (date: Date | null): string => {
  if (!date) return '';
  const now = new Date();
  if (isNaN(date.getTime())) return '';

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

const parseVisitDate = (dateString: string): Date | null => {
  const trimmedDateString = dateString.trim();
  if (!trimmedDateString) return null;
  
  // Handles 'YYYY/MM/DD HH:mm:ss' and 'YYYY-MM-DD...'
  const standardFormat = trimmedDateString.replace(/\//g, '-');
  let date = new Date(standardFormat);
  if (!isNaN(date.getTime())) {
    return date;
  }
  
  // Handles 'DD/MM/YYYY' or 'DD-MM-YYYY' etc.
  const parts = trimmedDateString.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (parts) {
    const day = parseInt(parts[1], 10);
    const month = parseInt(parts[2], 10) - 1; 
    const year = parseInt(parts[3], 10);

    if (year > 1000 && year < 3000 && month >= 0 && month < 12 && day > 0 && day <= 31) {
      const testDate = new Date(Date.UTC(year, month, day));
      if (testDate.getUTCFullYear() === year && testDate.getUTCMonth() === month && testDate.getUTCDate() === day) {
        return testDate;
      }
    }
  }

  return null;
};


const ProspectDetailPage: React.FC<ProspectDetailPageProps> = ({ store, onClose, onAddFollowup, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const getPriority = (days?: number | string): { label: string; color: string } => {
    if (days === undefined || days === null || days === '') return { label: 'Unknown', color: 'bg-slate-400' };
    const numDays = typeof days === 'string' ? parseInt(days, 10) : days;
    if (isNaN(numDays)) return { label: 'Unknown', color: 'bg-slate-400' };
    
    if (numDays <= 7) return { label: 'High', color: 'bg-red-500' };
    if (numDays <= 30) return { label: 'Medium', color: 'bg-orange-500' };
    return { label: 'Low', color: 'bg-green-500' };
  };
  
  const visitHistory = useMemo(() => {
    const dateHeure = store['Date-Heure'];
    if (!dateHeure) return [];

    const dateStrings = dateHeure.split(/[\n,]/).filter(Boolean);

    const dates = dateStrings
      .map(parseVisitDate)
      .filter((d): d is Date => d !== null);

    dates.sort((a, b) => b.getTime() - a.getTime());
    return dates;
  }, [store['Date-Heure']]);

  const priority = getPriority(store['Nombre-Jours']);
  const isValidCoords = store.Localisation && /^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(store.Localisation);
  const mapLink = isValidCoords ? `https://www.google.com/maps?q=${store.Localisation}` : `https://www.google.com/maps?q=${encodeURIComponent(store.Adresse || store.Ville)}`;
  const lastUpdatedDate = visitHistory.length > 0 ? visitHistory[0] : parseVisitDate(store.Date);

  return (
    <div className="flex flex-col h-screen">
      <header className="flex-shrink-0 bg-white dark:bg-slate-800/50 backdrop-blur-sm sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-semibold">Lead Details</h1>
              <div className="flex items-center gap-2">
                <button onClick={() => onAddFollowup(store)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" title="Add Follow-up">
                  <PencilIcon className="w-6 h-6" />
                </button>
                <div className="relative">
                   <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                     <EllipsisVerticalIcon className="w-6 h-6" />
                   </button>
                   {menuOpen && (
                     <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-30">
                       <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                         <a href="#" onClick={(e) => { e.preventDefault(); onDelete(store); setMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-600" role="menuitem">
                            <TrashIcon className="w-4 h-4" />
                            <span>Delete</span>
                         </a>
                       </div>
                     </div>
                   )}
                </div>
              </div>
            </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto pb-32 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto p-4 space-y-4">
          
          {/* Main Info Card */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{store.Magazin}</h2>
                {store.Gérant && <p className="text-slate-500 dark:text-slate-400">{store.Gérant}</p>}
              </div>
              {store.Gamme && <span className="text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full">{store.Gamme}</span>}
            </div>
            {priority.label !== 'Unknown' && (
              <div className="mt-4 flex items-center">
                <span className={`w-3 h-3 rounded-full ${priority.color}`}></span>
                <p className="ml-2 text-sm text-slate-600 dark:text-slate-300">Priority: <span className="font-semibold">{priority.label}</span></p>
              </div>
            )}
          </div>

          {/* Image Section */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Image</h3>
              {store.Image && (
                <a href={store.Image} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                  Voir en grand
                </a>
              )}
            </div>
            {store.Image ? (
              <img 
                src={store.Image} 
                alt={`${store.Magazin} storefront or business card`} 
                className="w-full h-auto max-h-64 object-contain rounded-lg bg-slate-100 dark:bg-slate-700" 
              />
            ) : (
                <div className="text-center py-10 px-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <h3 className="text-base font-medium text-slate-900 dark:text-white">Aucune image</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Aucune photo n'a été ajoutée pour ce prospect.</p>
                </div>
            )}
          </div>

          {/* Contact Information Card */}
          {store.Gérant && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
              <h3 className="text-base font-semibold mb-3">Contact Information</h3>
              <div className="space-y-2">
                <a href={`tel:${store.GSM}`} className="flex items-center justify-between group py-2">
                  <div className="flex items-center">
                    <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg"><PhoneIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" /></div>
                    <div className="ml-3">
                      <p className="text-xs text-slate-500">GSM</p>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">{store.GSM}</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                </a>
                {store.Phone && (
                   <a href={`tel:${store.Phone}`} className="flex items-center justify-between group py-2">
                      <div className="flex items-center">
                        <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg"><PhoneIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" /></div>
                        <div className="ml-3">
                          <p className="text-xs text-slate-500">Phone</p>
                          <p className="text-sm font-medium text-slate-800 dark:text-white truncate max-w-[200px]">{store.Phone}</p>
                        </div>
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                    </a>
                )}
                {store.Email && (
                   <a href={`mailto:${store.Email}`} className="flex items-center justify-between group py-2">
                      <div className="flex items-center">
                        <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg"><EnvelopeIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" /></div>
                        <div className="ml-3">
                          <p className="text-xs text-slate-500">Email</p>
                          <p className="text-sm font-medium text-slate-800 dark:text-white truncate max-w-[200px]">{store.Email}</p>
                        </div>
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                    </a>
                )}
                 <a href={mapLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group py-2">
                  <div className="flex items-center">
                    <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg"><MapPinIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" /></div>
                    <div className="ml-3">
                      <p className="text-xs text-slate-500">Address</p>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">{store.Adresse || store.Ville || 'Address not available'}</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                </a>
              </div>
            </div>
          )}

          {/* Commercial Information Card */}
          {(store.Prix || store.Quantité) && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
                <h3 className="text-base font-semibold mb-3">Informations Commerciales</h3>
                <div className="space-y-2">
                {store.Prix && (
                    <div className="flex items-center group py-2">
                        <div className="flex items-center">
                            <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg"><CurrencyDollarIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" /></div>
                            <div className="ml-3">
                                <p className="text-xs text-slate-500">Prix</p>
                                <p className="text-sm font-medium text-slate-800 dark:text-white">{store.Prix}</p>
                            </div>
                        </div>
                    </div>
                )}
                {store.Quantité && (
                    <div className="flex items-center group py-2">
                        <div className="flex items-center">
                            <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg"><CubeIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" /></div>
                            <div className="ml-3">
                                <p className="text-xs text-slate-500">Quantité</p>
                                <p className="text-sm font-medium text-slate-800 dark:text-white">{store.Quantité}</p>
                            </div>
                        </div>
                    </div>
                )}
                </div>
            </div>
          )}

          {/* Action Client Card */}
          {store['Action-Client'] && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
                <h3 className="text-base font-semibold mb-3">Action Client</h3>
                <div className="space-y-2">
                    <div className="flex items-center group py-2">
                        <div className="flex items-center">
                            <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg"><ClipboardDocumentCheckIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" /></div>
                            <div className="ml-3">
                                <p className="text-xs text-slate-500">Action</p>
                                <p className="text-sm font-medium text-slate-800 dark:text-white">{store['Action-Client']}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          )}
          
          {/* Notes Card */}
          {store.Note && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Notes</h3>
                <button onClick={() => onAddFollowup(store)} className="inline-flex items-center gap-2 text-sm font-medium py-1 px-3 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200">
                  <PencilIcon className="w-4 h-4" />
                  Add Note
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                {store.Note}
              </p>
              <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <ClockIcon className="w-3 h-3 mr-1.5" />
                <span>Last updated: {formatRelativeTime(lastUpdatedDate)}</span>
              </div>
            </div>
          )}

          {/* Follow-up History Card */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Historique des Suivis</h3>
                <button onClick={() => onAddFollowup(store)} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                  + Ajouter un suivi
                </button>
              </div>
              {visitHistory.length > 0 ? (
                <ul className="space-y-3">
                  {visitHistory.map((date, index) => (
                    <li key={index} className="flex items-start text-sm border-l-2 border-slate-200 dark:border-slate-700 pl-4 py-1">
                       <span className="h-2 w-2 bg-slate-300 dark:bg-slate-600 rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                       <span className="text-slate-700 dark:text-slate-300">
                        {date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-block bg-slate-100 dark:bg-slate-700 p-3 rounded-full">
                    <HistoryIcon className="h-8 w-8 text-slate-500 dark:text-slate-400" />
                  </div>
                  <h4 className="mt-4 text-sm font-semibold text-slate-800 dark:text-white">Aucun suivi enregistré</h4>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Les interactions et suivis apparaîtront ici</p>
                </div>
              )}
            </div>

          {/* Map Card */}
           <div className="bg-slate-200 dark:bg-slate-700 rounded-lg shadow h-48 flex items-center justify-center relative overflow-hidden">
                <MapPinIcon className="w-10 h-10 text-slate-500 dark:text-slate-400" />
                <p className="ml-2 text-slate-600 dark:text-slate-300 font-semibold">Shop Location</p>
                <div className="absolute top-2 right-2">
                   <a href={mapLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow-md backdrop-blur-sm"><ArrowsPointingOutIcon className="w-5 h-5" /></a>
                </div>
                <div className="absolute bottom-2 right-2">
                   <button onClick={() => navigator.clipboard.writeText(store.Adresse || store.Ville || '')} className="p-2 bg-amber-400/80 dark:bg-amber-600/80 rounded-lg shadow-md backdrop-blur-sm text-slate-800 dark:text-white"><DocumentPlusIcon className="w-5 h-5" /></button>
                </div>
           </div>

        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-2">
          <div className="grid grid-cols-4 gap-2">
            <a href={`tel:${store.GSM}`} className="flex flex-col items-center justify-center p-2 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">
              <PhoneIcon className="w-6 h-6 mb-1" />
              <span className="text-xs font-semibold">Call</span>
            </a>
            <a href={mapLink} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
              <CompassIcon className="w-6 h-6 mb-1" />
              <span className="text-xs font-semibold">Navigate</span>
            </a>
            <button onClick={() => setIsAppointmentModalOpen(true)} className="flex flex-col items-center justify-center p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300">
              <CalendarDaysIcon className="w-6 h-6 mb-1" />
              <span className="text-xs font-semibold">Schedule</span>
            </button>
            <button onClick={() => onAddFollowup(store)} className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              <DocumentPlusIcon className="w-6 h-6 mb-1" />
              <span className="text-xs font-semibold">Suivi</span>
            </button>
          </div>
        </div>
      </footer>

      <AppointmentModal 
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        appointments={store['Rendez-Vous']}
      />
    </div>
  );
};

export default ProspectDetailPage;