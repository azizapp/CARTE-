
import React from 'react';
import { Store } from '../types.ts';
import LocationMarkerIcon from './icons/LocationMarkerIcon.tsx';

const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const HistoryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);


const getStatusColor = (days?: number | string): string => {
  if (days === undefined || days === null || days === '') return 'bg-slate-400';
  const numDays = typeof days === 'string' ? parseInt(days, 10) : days;
  if (isNaN(numDays)) return 'bg-slate-400';
  
  if (numDays <= 7) return 'bg-red-500';
  if (numDays <= 30) return 'bg-orange-500';
  return 'bg-green-500';
};

const formatLastContact = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // Try to parse DD/MM/YYYY which is common but not reliably parsed by `new Date()`
            const parts = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
            if (parts) {
                // new Date(year, monthIndex, day)
                const parsedDate = new Date(parseInt(parts[3]), parseInt(parts[2]) - 1, parseInt(parts[1]));
                if (!isNaN(parsedDate.getTime())) {
                    const formattedDate = parsedDate.toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
                    return formattedDate.replace(/-/g, '/');
                }
            }
            return 'N/A';
        }

        const formattedDate = date.toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
        return formattedDate.replace(/-/g, '/');
    } catch (e) {
        return 'N/A';
    }
};

const parseVisitDate = (dateString: string): Date | null => {
  const trimmedDateString = dateString.trim();
  if (!trimmedDateString) return null;

  // Handles 'YYYY/MM/DD HH:mm:ss' format from Google Sheets
  const standardFormat = trimmedDateString.replace(/\//g, '-');
  let date = new Date(standardFormat);
  if (!isNaN(date.getTime())) {
    return date;
  }

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

interface StoreTableProps {
  stores: (Store & { recordCount: number })[];
  onViewDetails: (store: Store) => void;
  isLoading: boolean;
}

const StoreTable: React.FC<StoreTableProps> = ({ stores, onViewDetails, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <svg className="animate-spin h-8 w-8 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-white dark:bg-slate-800 rounded-lg shadow">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">Aucun prospect trouvé</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Essayez de modifier votre recherche ou vos filtres.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {stores.map((store) => (
        <article
          key={store.ID}
          onClick={() => onViewDetails(store)}
          className="bg-white dark:bg-slate-800 rounded-lg p-4 cursor-pointer transition-shadow duration-200 hover:shadow-md border border-slate-200 dark:border-slate-700"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onViewDetails(store)}
          aria-label={`View details for ${store.Magazin}`}
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-base text-slate-800 dark:text-slate-100">{store.Magazin}</h3>
              {store.Gérant && <p className="text-sm text-slate-500 dark:text-slate-400">{store.Gérant}</p>}
            </div>
            <div className="flex-shrink-0 flex items-center h-full pt-1">
              <span className={`h-3 w-3 rounded-full ${getStatusColor(store['Nombre-Jours'])}`} title={`Status based on last contact: ${store['Nombre-Jours'] || 'N/A'} days`}></span>
            </div>
          </div>

          <div className="mt-3 pt-3">
            <div className="flex justify-between items-end">
              <div className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center">
                  <LocationMarkerIcon className="h-4 w-4 mr-2 text-slate-400" />
                  <span>{store.Ville}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-2 text-slate-400" />
                  <span>
                    {(() => {
                        let lastDate: string | undefined;
                        if (store['Date-Heure']) {
                          const dates = store['Date-Heure']
                            .split(/[\n,]/)
                            .map(s => s.trim())
                            .filter(Boolean)
                            .map(parseVisitDate)
                            .filter((d): d is Date => d !== null)
                            .sort((a, b) => b.getTime() - a.getTime());
                          if (dates.length > 0) {
                            lastDate = dates[0].toISOString();
                          }
                        }
                        
                        const lastContact = formatLastContact(lastDate || store['Rendez-Vous'] || store.Date);

                        return lastContact === 'N/A' 
                          ? 'Dernière visite' 
                          : `${lastContact}: Dernière visite`;
                      })()}
                  </span>
                </div>
                {store.recordCount > 1 && (
                    <div className="flex items-center">
                        <HistoryIcon className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{store.recordCount} suivis</span>
                    </div>
                )}
              </div>
              
              {store.Gamme && (
                 <div className="flex-shrink-0">
                    <span className="inline-block bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-600">
                        {store.Gamme}
                    </span>
                </div>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default StoreTable;