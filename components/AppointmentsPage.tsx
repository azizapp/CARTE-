import React, { useMemo } from 'react';
import { Store } from '../types.ts';
import PhoneCallIcon from './icons/PhoneCallIcon.tsx';
import WhatsAppIcon from './icons/WhatsAppIcon.tsx';
import LocationMarkerIcon from './icons/LocationMarkerIcon.tsx';

// Helper function to create the WhatsApp link
const formatWhatsAppLink = (gsm?: string): string => {
  if (!gsm) return '#';
  // Morocco phone number logic: remove spaces, +, and if it starts with 0, replace with 212
  let cleanedGsm = gsm.replace(/[\s+()-]/g, '');
  if (cleanedGsm.startsWith('0')) {
    cleanedGsm = '212' + cleanedGsm.substring(1);
  }
  return `https://wa.me/${cleanedGsm}`;
};

// Helper function to create the map link
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

interface Appointment {
  store: Store;
  date: Date;
}

interface AppointmentsPageProps {
  stores: Store[];
  onClose: () => void;
}

const AppointmentsPage: React.FC<AppointmentsPageProps> = ({ stores, onClose }) => {
  const allAppointments = useMemo((): Appointment[] => {
    if (!stores) return [];

    const appointments: Appointment[] = [];
    const processed = new Set<string>();

    stores.forEach(store => {
      if (store['Rendez-Vous']) {
        const dateStrings = store['Rendez-Vous'].split(/[\n,]/).map(s => s.trim()).filter(Boolean);
        dateStrings.forEach(dateStr => {
          const appointmentDate = new Date(dateStr);
          if (!isNaN(appointmentDate.getTime())) {
            const key = `${store.ID}-${dateStr}`; // Use store ID for uniqueness
            if (!processed.has(key)) {
              appointments.push({ store, date: appointmentDate });
              processed.add(key);
            }
          }
        });
      }
    });
    
    // Sort all appointments by date, descending
    appointments.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    return appointments;
  }, [stores]);

  const { today, upcoming, past } = useMemo(() => {
    const todayAppointments: Appointment[] = [];
    const upcomingAppointments: Appointment[] = [];
    const pastAppointments: Appointment[] = [];

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    allAppointments.forEach(appt => {
      const apptDate = new Date(appt.date);
      apptDate.setHours(0, 0, 0, 0);

      if (apptDate.getTime() === todayDate.getTime()) {
        todayAppointments.push(appt);
      } else if (apptDate.getTime() >= tomorrowDate.getTime()) {
        upcomingAppointments.push(appt);
      } else {
        pastAppointments.push(appt);
      }
    });

    // Sort upcoming ascending
    upcomingAppointments.sort((a,b) => a.date.getTime() - b.date.getTime());

    return { today: todayAppointments, upcoming: upcomingAppointments, past: pastAppointments };
  }, [allAppointments]);

  const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
    const { store, date } = appointment;
    
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 space-y-4">
        <div>
          <p className="font-bold text-lg text-slate-900 dark:text-white">{store.Magazin}</p>
          {store.Gérant && <p className="text-sm text-slate-500 dark:text-slate-400">{store.Gérant}</p>}
          <p className="text-sm font-medium text-[var(--accent-color)] mt-1">
            {date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-400 dark:text-slate-500">{store.Ville}</p>
          <div className="flex items-center space-x-3">
            <a href={formatWhatsAppLink(store.GSM)} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800 transition-colors" aria-label="Contacter sur WhatsApp">
              <WhatsAppIcon className="w-5 h-5" />
            </a>
            <a href={`tel:${store.GSM}`} className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors" aria-label="Appeler">
              <PhoneCallIcon className="w-5 h-5" />
            </a>
            <a href={getMapLink(store)} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors" aria-label="Voir la localisation">
              <LocationMarkerIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    );
  };
  
  const AppointmentSection: React.FC<{title: string, appointments: Appointment[]}> = ({ title, appointments }) => {
      if (appointments.length === 0) return null;
      return (
        <section>
            <h2 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400 px-1 mb-3">{title}</h2>
            <div className="space-y-4">
                {appointments.map((appt, index) => (
                    <AppointmentCard key={`${appt.store.ID}-${index}`} appointment={appt} />
                ))}
            </div>
        </section>
      );
  }

  const BackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );

  return (
    <div className="bg-slate-100 dark:bg-slate-900 min-h-screen">
      <header className="sticky top-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm z-10 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 h-16 flex items-center justify-center relative">
          <button type="button" onClick={onClose} className="absolute left-4 top-0 bottom-0 flex items-center">
            <BackIcon className="w-6 h-6 text-slate-700 dark:text-slate-200" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Mes Rendez-vous</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 max-w-4xl pb-20">
        {allAppointments.length > 0 ? (
            <div className="space-y-8">
                <AppointmentSection title="Aujourd'hui" appointments={today} />
                <AppointmentSection title="À venir" appointments={upcoming} />
                <AppointmentSection title="Passés" appointments={past} />
            </div>
        ) : (
             <div className="text-center py-20 px-4">
                <svg className="mx-auto h-12 w-12 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">Aucun rendez-vous</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Vous n'avez pas de rendez-vous programmé.</p>
              </div>
        )}
      </main>
    </div>
  );
};

export default AppointmentsPage;
