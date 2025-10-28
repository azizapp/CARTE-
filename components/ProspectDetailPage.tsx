import React, { useState, useMemo } from 'react';
import { Store } from '../types.ts';
import LocationMarkerIcon from './icons/LocationMarkerIcon.tsx';
import PhoneCallIcon from './icons/PhoneCallIcon.tsx';
import WhatsAppIcon from './icons/WhatsAppIcon.tsx';
import PlusIcon from './icons/PlusIcon.tsx';
import AppointmentModal from './AppointmentModal.tsx';

// --- START OF IN-COMPONENT ICONS ---
const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

const TagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
);

const CalendarDaysIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" />
    </svg>
);

const PencilSquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);
const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);
const EnvelopeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25-2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
);
const PhoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
);
const MapPinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);
const BuildingOfficeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6M9 15.75h6M9 20.25h6" />
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
// --- END OF IN-COMPONENT ICONS ---

const formatWhatsAppLink = (gsm?: string): string => {
  if (!gsm) return '#';
  let cleanedGsm = gsm.replace(/[\s+()-]/g, '');
  if (cleanedGsm.startsWith('0')) {
    cleanedGsm = '212' + cleanedGsm.substring(1);
  }
  return `https://wa.me/${cleanedGsm}`;
};

const getMapLink = (store: Store): string => {
  if (store.Localisation && /^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(store.Localisation)) {
    return `https://www.google.com/maps?q=${store.Localisation}`;
  }
  const address = [store.Adresse, store.Ville, store.Région].filter(Boolean).join(', ');
  if (address) {
    return `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
  }
  return '#';
};

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  href?: string;
  color: 'green' | 'orange' | 'teal' | 'blue';
  highlight?: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, onClick, href, color, highlight }) => {
  const colorClasses = {
    green: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-600 dark:text-green-400' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-600 dark:text-orange-400' },
    teal: { bg: 'bg-teal-100 dark:bg-teal-900/50', text: 'text-teal-600 dark:text-teal-400' },
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-600 dark:text-blue-400' },
  };

  const selectedColor = colorClasses[color];

  const cardContent = (
    <div className={`w-full text-center p-2 rounded-lg transition-all duration-200 flex flex-col items-center justify-center h-full ${highlight ? 'bg-green-50 dark:bg-green-900/40' : 'bg-white dark:bg-slate-800'}`}>
      <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${selectedColor.bg}`}>
        <div className={selectedColor.text}>{icon}</div>
      </div>
      <p className="font-semibold text-xs text-slate-800 dark:text-slate-100">{title}</p>
    </div>
  );

  const commonProps = {
    className: "block h-full",
    target: "_blank",
    rel: "noopener noreferrer",
  };

  if (href) {
    return <a href={href} {...commonProps}>{cardContent}</a>;
  }

  return <button type="button" onClick={onClick} className="w-full h-full block">{cardContent}</button>;
};

const InfoItem: React.FC<{ icon: React.ReactNode, label: string, value?: string | number, href?: string }> = ({ icon, label, value, href }) => {
  if (!value) return null;

  const content = (
    <div className="flex items-start gap-4 py-3">
      <div className="flex-shrink-0 w-6 h-6 text-slate-400 mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{value}</p>
      </div>
    </div>
  );
  
  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className="block hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-md -mx-2 px-2 transition-colors">{content}</a>
  }
  
  return <div className="px-2">{content}</div>;
};

interface ProspectDetailPageProps {
  store: Store;
  onClose: () => void;
  onAddFollowup: (store: Store) => void;
}

const ProspectDetailPage: React.FC<ProspectDetailPageProps> = ({ store, onClose, onAddFollowup }) => {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const getStatusColor = (days?: number | string): string => {
    if (days === undefined || days === null || days === '') return 'bg-slate-400';
    const numDays = typeof days === 'string' ? parseInt(days, 10) : days;
    if (isNaN(numDays)) return 'bg-slate-400';
    
    if (numDays <= 7) return 'bg-red-500';
    if (numDays <= 30) return 'bg-orange-500';
    return 'bg-green-500';
  };
  
  const latestAppointmentDate = useMemo(() => {
    if (!store['Rendez-Vous']) return null;
    const dates = store['Rendez-Vous']
      .split(/[\n,]/)
      .map(s => s.trim())
      .filter(Boolean)
      .map(str => {
        const date = new Date(str);
        return !isNaN(date.getTime()) ? date : null;
      })
      .filter((d): d is Date => d !== null)
      .sort((a, b) => b.getTime() - a.getTime());
    
    return dates.length > 0 ? dates[0] : null;
  }, [store]);

  return (
    <>
      <AppointmentModal 
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        appointments={store['Rendez-Vous']}
      />
      <div className="bg-slate-100 dark:bg-slate-900 min-h-screen font-sans">
        
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
                <button type="button" onClick={onClose} className="p-2 -ml-2">
                    <ArrowLeftIcon className="w-6 h-6 text-slate-700 dark:text-slate-200" />
                </button>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 text-center">
                   <h1 className="text-lg font-semibold text-slate-900 dark:text-white truncate">{store.Magazin}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                      type="button" 
                      onClick={() => onAddFollowup(store)} 
                      className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      title="Ajouter un suivi"
                    >
                      <PlusIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </header>

        <main className="pt-20 pb-32 px-4 max-w-3xl mx-auto">
          <div className="space-y-6">

            <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
                {store.Image && (
                    <img src={store.Image} alt={`${store.Magazin} storefront`} className="w-full h-48 object-cover" />
                )}
                <div className="p-4 sm:p-6">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{store.Magazin}</h2>
                            {store.Gérant && <p className="text-slate-500 dark:text-slate-400 mt-1">{store.Gérant}</p>}
                        </div>
                        <div className="flex-shrink-0 pt-1">
                            <span className={`h-4 w-4 rounded-full ${getStatusColor(store['Nombre-Jours'])} block`} title={`Status: ${store['Nombre-Jours'] || 'N/A'} days`}></span>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {store.Gamme && (
                            <span className="inline-flex items-center gap-x-1.5 rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-200">
                                <TagIcon className="h-3 w-3" />
                                {store.Gamme}
                            </span>
                        )}
                        {store['Action-Client'] && (
                            <span className="inline-flex items-center gap-x-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                            {store['Action-Client']}
                            </span>
                        )}
                    </div>
                </div>
            </section>
            
            <section className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-2">
                    <UserCircleIcon className="w-6 h-6 text-[var(--accent-color)]" />
                    <h3 className="text-md font-semibold ml-3 text-slate-800 dark:text-white">Informations de Contact</h3>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    <InfoItem icon={<UserCircleIcon className="w-5 h-5" />} label="Gérant" value={store.Gérant} />
                    <InfoItem icon={<PhoneCallIcon className="w-5 h-5" />} label="GSM" value={store.GSM} href={`tel:${store.GSM}`} />
                    <InfoItem icon={<PhoneIcon className="w-5 h-5" />} label="Téléphone (Fixe)" value={store.Phone} href={`tel:${store.Phone}`} />
                    <InfoItem icon={<EnvelopeIcon className="w-5 h-5" />} label="Email" value={store.Email} href={`mailto:${store.Email}`} />
                </div>
            </section>

            <section className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-2">
                    <MapPinIcon className="w-6 h-6 text-[var(--accent-color)]" />
                    <h3 className="text-md font-semibold ml-3 text-slate-800 dark:text-white">Adresse & Localisation</h3>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    <InfoItem icon={<MapPinIcon className="w-5 h-5" />} label="Adresse" value={store.Adresse} />
                    <InfoItem icon={<BuildingOfficeIcon className="w-5 h-5" />} label="Ville" value={store.Ville} />
                    <InfoItem icon={<LocationMarkerIcon className="w-5 h-5" />} label="Région" value={store.Région} />
                </div>
            </section>
            
            {(store.Prix || store.Quantité) && (
              <section className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-2">
                    <CurrencyDollarIcon className="w-6 h-6 text-[var(--accent-color)]" />
                    <h3 className="text-md font-semibold ml-3 text-slate-800 dark:text-white">Détails Commerciaux</h3>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  <InfoItem icon={<CurrencyDollarIcon className="w-5 h-5" />} label="Prix" value={store.Prix ? `${store.Prix} DH` : undefined} />
                  <InfoItem icon={<CubeIcon className="w-5 h-5" />} label="Quantité" value={store.Quantité} />
                </div>
              </section>
            )}

            {store.Note && (
               <section className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                      <PencilSquareIcon className="w-6 h-6 text-[var(--accent-color)]" />
                      <h3 className="text-md font-semibold ml-3 text-slate-800 dark:text-white">Historique & Notes</h3>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                    {store.Note}
                  </div>
              </section>
            )}

          </div>
        </main>
        
        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
            <div className="container mx-auto p-3 max-w-3xl">
                <div className="grid grid-cols-4 gap-3">
                    {store.GSM && (
                        <ActionCard
                        icon={<PhoneCallIcon className="w-6 h-6" />}
                        title="Téléphone"
                        href={`tel:${store.GSM}`}
                        color="green"
                        highlight={true}
                        />
                    )}
                    {(store.Localisation || store.Ville) && (
                        <ActionCard
                        icon={<LocationMarkerIcon className="w-6 h-6" />}
                        title="Localisation"
                        href={getMapLink(store)}
                        color="orange"
                        />
                    )}
                    {store.GSM && (
                        <ActionCard
                        icon={<WhatsAppIcon className="w-6 h-6" />}
                        title="WhatsApp"
                        href={formatWhatsAppLink(store.GSM)}
                        color="teal"
                        />
                    )}
                    {latestAppointmentDate && (
                        <ActionCard
                        icon={<CalendarDaysIcon className="w-6 h-6" />}
                        title="Rendez-vous"
                        onClick={() => setIsAppointmentModalOpen(true)}
                        color="blue"
                        />
                    )}
                </div>
            </div>
        </footer>

      </div>
    </>
  );
};

export default ProspectDetailPage;