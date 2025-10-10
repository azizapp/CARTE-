import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Store, StoreFormData } from '../types.ts';
import LocationMarkerIcon from './icons/LocationMarkerIcon.tsx';
import CameraIcon from './icons/CameraIcon.tsx';
import SpinnerIcon from './icons/SpinnerIcon.tsx';
import ArrowPathIcon from './icons/ArrowPathIcon.tsx';

// --- START OF IN-COMPONENT ICONS ---
const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);
const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);
const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);
const BuildingOffice2Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.21 6.337A48.692 48.692 0 0 1 12 4.5c2.394 0 4.723.28 6.99.837m-13.98 0a48.636 48.636 0 0 1 13.98 0M3.21 6.337c-1.259 4.12-.904 8.78.932 12.337a48.42 48.42 0 0 0 13.716 0c1.836-3.557 2.19-8.217.932-12.337a48.636 48.636 0 0 0-13.98 0Z" />
    </svg>
);
const GlobeAltIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
);
const TagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
);
const PencilSquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);
const PhotoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm1.5-1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75H3.75Z" />
    </svg>
);
const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);
const PhoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
);
const EnvelopeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25-2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
);
const BuildingStorefrontIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A.75.75 0 0 1 14.25 12h.01a.75.75 0 0 1 .75.75v7.5m-4.5 0v-7.5A.75.75 0 0 0 9.75 12h-.01a.75.75 0 0 0-.75.75v7.5m-4.5 0v-7.5A.75.75 0 0 0 5.25 12h-.01a.75.75 0 0 0-.75.75v7.5m15-7.5-3-4.5-3 4.5m-4.5-4.5L7.5 12m9 0-.75 1.125" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21.75h16.5a1.5 1.5 0 0 0 1.5-1.5v-6.75a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v6.75a1.5 1.5 0 0 0 1.5 1.5Z" />
  </svg>
);
const CalendarDaysIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" />
    </svg>
);
const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);
const MapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);
const ClipboardDocumentCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
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

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      if (isOpen) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err: any) {
          console.error("Error accessing camera:", err);
          alert("Could not access the camera. Please grant permission in your browser settings.");
          onClose();
        }
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, onClose]);

  const handleCapture = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(dataUrl);
      }
    }
  }, [onCapture]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-[60] flex flex-col justify-center items-center">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 flex justify-center items-center gap-4">
        <button type="button" onClick={handleCapture} className="p-4 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white">
          <CameraIcon className="w-8 h-8 text-black" />
        </button>
        <button type="button" onClick={onClose} className="text-white bg-black/50 rounded-full py-2 px-6 text-lg">
          Cancel
        </button>
      </div>
    </div>
  );
};


const initialFormData: StoreFormData = {
  Magazin: '', Ville: '', GSM: '', Gérant: '', Gamme: 'Haute', 'Rendez-Vous': '',
  Localisation: '', Image: '', Région: '', Adresse: '', Phone: '', Email: '', 'Action-Client': '', 'Date-Heure': '', Note: '', Prix: '', Quantité: '',
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

interface StoreFormPageProps {
    onClose: () => void;
    onSubmit: (storeData: StoreFormData | Store) => void;
    storeToEdit?: Store | null;
    stores: Store[];
}

const StoreFormPage: React.FC<StoreFormPageProps> = ({ onClose, onSubmit, storeToEdit, stores }) => {
  const [formData, setFormData] = useState<StoreFormData | Store>(initialFormData);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [meetingDate, setMeetingDate] = useState('');

  const uniqueCities = useMemo(() => {
    const cities = new Set(stores.map(store => store.Ville).filter(Boolean));
    return Array.from(cities).sort();
  }, [stores]);

  const uniqueGerants = useMemo(() => {
    const gerants = new Set(stores.map(store => store.Gérant).filter(Boolean));
    return Array.from(gerants).sort();
  }, [stores]);
  
  const uniqueMagazins = useMemo(() => {
    const magazins = new Set(stores.map(store => store.Magazin).filter(Boolean));
    return Array.from(magazins).sort();
  }, [stores]);

  useEffect(() => {
    if (storeToEdit) {
      setFormData(storeToEdit);
      const rendezVous = storeToEdit['Rendez-Vous'];
      if (rendezVous && typeof rendezVous === 'string') {
        // Handle various date formats (ISO string, YYYY-MM-DD). We just need the date part.
        const datePart = rendezVous.substring(0, 10);
        // Basic validation for YYYY-MM-DD format
        if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
            setMeetingDate(datePart);
        } else {
            setMeetingDate('');
        }
      } else {
        setMeetingDate('');
      }
    } else {
      setFormData(initialFormData);
      setMeetingDate('');
    }
  }, [storeToEdit]);
  
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ ...prev, Localisation: `${latitude}, ${longitude}` }));
        setIsFetchingLocation(false);
      },
      (error: GeolocationPositionError) => {
        console.error(`Error getting location: ${error.message}`);
        alert("Could not fetch location. Please check your device settings.");
        setIsFetchingLocation(false);
      }
    );
  };
  
  const handleCapture = (imageDataUrl: string) => {
    setFormData(prev => ({ ...prev, Image: imageDataUrl }));
    setIsCameraOpen(false);
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            if (loadEvent.target && typeof loadEvent.target.result === 'string') {
                setFormData(prev => ({ ...prev, Image: loadEvent.target.result as string }));
            }
        };
        reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'Magazin' && !storeToEdit) {
        const matchingStores = stores.filter(s => s.Magazin === value);
        
        if (matchingStores.length > 0) {
            const latestStore = matchingStores.sort((a, b) => {
                const dateA = a['Date-Heure'] ? parseVisitDate(a['Date-Heure'])?.getTime() ?? 0 : 0;
                const dateB = b['Date-Heure'] ? parseVisitDate(b['Date-Heure'])?.getTime() ?? 0 : 0;
                return dateB - dateA;
            })[0];
            
            setFormData(prev => ({
                ...prev,
                Magazin: value,
                Gérant: latestStore.Gérant,
                Ville: latestStore.Ville,
                Région: latestStore.Région,
                Adresse: latestStore.Adresse,
                GSM: latestStore.GSM,
                Phone: latestStore.Phone,
                Email: latestStore.Email,
                Gamme: latestStore.Gamme || 'Haute',
                Localisation: latestStore.Localisation,
            }));
            return;
        }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass the date as a simple 'YYYY-MM-DD' string. The service will handle parsing.
    const combinedData = { ...formData, 'Rendez-Vous': meetingDate };
    onSubmit(combinedData);
  };

  const renderInput = (name: keyof StoreFormData, label: string, placeholder: string, Icon: React.FC<any>, type = 'text', required = false) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon className="h-5 w-5 text-slate-400" />
            </div>
            <input
                type={type}
                name={name}
                id={name}
                value={(formData as any)[name] || ''}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                className="block w-full rounded-md border-slate-300 bg-white py-2.5 pl-10 pr-3 shadow-sm focus:border-[var(--accent-color)] focus:ring-[var(--accent-color)] sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
        </div>
    </div>
  );

  return (
    <>
      <CameraModal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={handleCapture} />
      <div className="bg-slate-100 dark:bg-slate-900 min-h-screen font-sans">
        
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
            <div className="container mx-auto px-4 h-16 flex items-center justify-center relative">
                <button type="button" onClick={onClose} className="absolute left-4 top-0 bottom-0 flex items-center">
                    <ArrowLeftIcon className="w-6 h-6 text-slate-700 dark:text-slate-200" />
                </button>
                <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{storeToEdit ? 'Modifier le Lead' : 'Nouveau Lead'}</h1>
            </div>
        </header>

        <main className="pt-20 pb-28 px-4 max-w-3xl mx-auto">
            <section className="text-center mb-8">
                <div className="inline-block p-3 bg-slate-200/60 dark:bg-slate-700/50 rounded-full">
                    <UserCircleIcon className="w-8 h-8 text-[var(--accent-color)]" />
                </div>
                <h2 className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">Détails du Prospect</h2>
                <p className="text-slate-500 dark:text-slate-400">Capturez les informations de votre nouveau prospect optique</p>
            </section>
            
            <form id="lead-form" onSubmit={handleSubmit} className="space-y-6">
                
                <FormSection title="Informations Prospect" Icon={UserCircleIcon}>
                    <div>
                        <label htmlFor="Magazin" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Nom de l'opticien <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <BuildingStorefrontIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                name="Magazin"
                                id="Magazin"
                                value={formData.Magazin || ''}
                                onChange={handleChange}
                                placeholder="Nom du magasin d'optique"
                                required={true}
                                list="magazin-list"
                                className="block w-full rounded-md border-slate-300 bg-white py-2.5 pl-10 pr-3 shadow-sm focus:border-[var(--accent-color)] focus:ring-[var(--accent-color)] sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            />
                            <datalist id="magazin-list">
                                {uniqueMagazins.map(magazin => (
                                    <option key={magazin} value={magazin} />
                                ))}
                            </datalist>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="Gérant" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Nom complet <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <UserIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                name="Gérant"
                                id="Gérant"
                                value={formData.Gérant || ''}
                                onChange={handleChange}
                                placeholder="Entrez le nom complet"
                                required={true}
                                list="gerant-list"
                                className="block w-full rounded-md border-slate-300 bg-white py-2.5 pl-10 pr-3 shadow-sm focus:border-[var(--accent-color)] focus:ring-[var(--accent-color)] sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            />
                            <datalist id="gerant-list">
                                {uniqueGerants.map(gerant => (
                                    <option key={gerant} value={gerant} />
                                ))}
                            </datalist>
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Localisation GPS" Icon={GlobeAltIcon}>
                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex items-center text-green-600 dark:text-green-400">
                            <LocationMarkerIcon className="w-5 h-5 mr-2"/>
                            <span className="font-semibold text-sm">Position enregistrée</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">{formData.Localisation || 'Aucune localisation enregistrée'}</p>
                    </div>
                    {formData.Localisation && (
                        <div className="mt-2 h-24 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center relative">
                             <a href={`https://www.google.com/maps?q=${formData.Localisation}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[var(--accent-color)] flex items-center gap-2 z-10">
                                <MapIcon className="w-5 h-5"/>
                                Aperçu de la carte
                             </a>
                        </div>
                    )}
                    <button type="button" onClick={handleGetLocation} disabled={isFetchingLocation} className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        {isFetchingLocation ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : <ArrowPathIcon className="w-5 h-5" />}
                        Actualiser la position
                    </button>
                </FormSection>

                <FormSection title="Photos (Optionnel)" Icon={PhotoIcon}>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Capturez des photos de cartes de visite ou de la devanture du magasin</p>
                    {formData.Image ? (
                        <div className="relative group">
                            <img src={formData.Image} alt="Aperçu" className="w-full h-48 object-cover rounded-lg"/>
                            <button type="button" onClick={() => setFormData(p => ({...p, Image: ''}))} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                        </div>
                    ) : (
                        <div className="p-6 text-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                           <CameraIcon className="mx-auto h-12 w-12 text-slate-400" />
                           <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Aucune photo</p>
                        </div>
                    )}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                        <button type="button" onClick={() => setIsCameraOpen(true)} className="flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <CameraIcon className="w-5 h-5"/>
                            Capturer
                        </button>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <PhotoIcon className="w-5 h-5"/>
                            Galerie
                        </button>
                    </div>
                </FormSection>

                <FormSection title="Adresse & Contact" Icon={BuildingOffice2Icon}>
                     <div>
                        <label htmlFor="Ville" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Ville
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <BuildingStorefrontIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <select
                                name="Ville"
                                id="Ville"
                                value={formData.Ville || ''}
                                onChange={handleChange}
                                className="block w-full appearance-none rounded-md border-slate-300 bg-white py-2.5 pl-10 pr-10 shadow-sm focus:border-[var(--accent-color)] focus:ring-[var(--accent-color)] sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            >
                                <option value="" disabled>Sélectionnez une ville</option>
                                {uniqueCities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ChevronDownIcon className="h-5 w-5 text-slate-400" />
                            </div>
                        </div>
                    </div>
                    {renderInput('Région', 'Région', 'Entrez la région', MapIcon, 'text')}
                    {renderInput('Adresse', 'Adresse', "Entrez l'adresse complète", LocationMarkerIcon, 'text')}
                    {renderInput('GSM', 'GSM', '+212 6XX XXX XXX', PhoneIcon, 'tel')}
                    {renderInput('Phone', 'Téléphone (Fixe)', '+212 5XX XXX XXX', PhoneIcon, 'tel')}
                    {renderInput('Email', 'Adresse e-mail', 'exemple@email.com', EnvelopeIcon, 'email')}
                </FormSection>

                <FormSection title="Catégorisation du Lead" Icon={TagIcon}>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Niveau Client
                        </label>
                        <div className="space-y-3 mt-2">
                            {[
                              { value: 'Haute', label: 'Haute', description: 'Clients premium' },
                              { value: 'Haute et Moyenne', label: 'Haute et Moyenne', description: 'Clients mixtes' },
                              { value: 'Moyenne', label: 'Moyenne', description: 'Clients de gamme standard' },
                              { value: 'Économie', label: 'Économie', description: 'Clients économiques' },
                            ].map(option => (
                                <label key={option.value} htmlFor={`gamme-${option.value}`} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                                    formData.Gamme === option.value
                                        ? 'bg-slate-100 border-[var(--accent-color)] ring-1 ring-[var(--accent-color)] dark:bg-slate-700/50 dark:border-[var(--accent-color)]'
                                        : 'bg-white border-slate-300 hover:bg-slate-50 dark:bg-slate-700/50 dark:border-slate-600 dark:hover:bg-slate-700'
                                }`}>
                                    <input
                                        type="radio"
                                        id={`gamme-${option.value}`}
                                        name="Gamme"
                                        value={option.value}
                                        checked={formData.Gamme === option.value}
                                        onChange={handleChange}
                                        className="h-5 w-5 text-[var(--accent-color)] border-gray-300 focus:ring-[var(--accent-color)] dark:bg-slate-600 dark:border-slate-500 dark:checked:bg-[var(--accent-color)] dark:focus:ring-offset-slate-800"
                                    />
                                    <div className="ml-4 flex flex-col">
                                        <span className="font-semibold text-slate-800 dark:text-slate-100">{option.label}</span>
                                        <span className="text-sm text-slate-500 dark:text-slate-400">{option.description}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </FormSection>

                 <FormSection title="Détails Commerciaux" Icon={ClipboardDocumentCheckIcon}>
                    <div>
                        <label htmlFor="Rendez-Vous" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Date de Rendez-vous
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <CalendarDaysIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="date"
                                name="Rendez-Vous"
                                id="Rendez-Vous"
                                value={meetingDate}
                                onChange={(e) => setMeetingDate(e.target.value)}
                                className="block w-full rounded-md border-slate-300 bg-white py-2.5 pl-10 pr-3 shadow-sm focus:border-[var(--accent-color)] focus:ring-[var(--accent-color)] sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="Action-Client" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Action à entreprendre
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <ClipboardDocumentCheckIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <select
                                name="Action-Client"
                                id="Action-Client"
                                value={formData['Action-Client'] || ''}
                                onChange={handleChange}
                                className="block w-full appearance-none rounded-md border-slate-300 bg-white py-2.5 pl-10 pr-10 shadow-sm focus:border-[var(--accent-color)] focus:ring-[var(--accent-color)] sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            >
                                <option value="" disabled>Sélectionnez une action</option>
                                <option value="Acheter">Acheter</option>
                                <option value="Revisiter">Revisiter</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ChevronDownIcon className="h-5 w-5 text-slate-400" />
                            </div>
                        </div>
                    </div>
                    {renderInput('Prix', 'Prix', '0.00 DH', CurrencyDollarIcon, 'number')}
                    {renderInput('Quantité', 'Quantité', '0', CubeIcon, 'number')}
                </FormSection>
                
                <FormSection title="Suivi" Icon={CalendarDaysIcon}>
                    <div>
                      <label htmlFor="Note" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Notes
                      </label>
                      <textarea
                          name="Note"
                          id="Note"
                          rows={5}
                          value={(formData as any)['Note'] || ''}
                          onChange={handleChange}
                          placeholder="Ajoutez des notes sur ce prospect..."
                          className="mt-1 block w-full rounded-lg border-slate-300 dark:border-slate-600 shadow-sm focus:border-[var(--accent-color)] focus:ring-[var(--accent-color)] sm:text-sm bg-white dark:bg-slate-700"
                      />
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Conseils: Notez les détails importants, les préférences du client, et les prochaines étapes.</p>
                    </div>
                </FormSection>

            </form>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
            <div className="container mx-auto p-4 max-w-3xl">
                <button type="submit" form="lead-form" className="w-full py-3 px-4 text-base font-semibold text-white bg-[var(--accent-color)] rounded-xl shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)]">
                    Enregistrer le Lead
                </button>
            </div>
        </footer>
      </div>
    </>
  );
};

const FormSection: React.FC<{title: string, Icon: React.FC<any>, children: React.ReactNode}> = ({ title, Icon, children }) => (
    <section className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
        <div className="flex items-center mb-4">
            <Icon className="w-6 h-6 text-[var(--accent-color)]" />
            <h3 className="text-md font-semibold ml-3 text-slate-800 dark:text-white">{title}</h3>
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </section>
);


export default StoreFormPage;