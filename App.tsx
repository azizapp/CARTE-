import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Store, Mode, StoreFormData } from './types.ts';
import storeService from './services/storeService.ts';
import StoreTable from './components/StoreTable.tsx';
import StoreFormPage from './components/StoreFormPage.tsx';
import SettingsPage from './components/SettingsPage.tsx';
import ConfirmationModal from './components/ConfirmationModal.tsx';
import PlusIcon from './components/icons/PlusIcon.tsx';
import ProspectDetailPage from './components/ProspectDetailPage.tsx';
import FilterModal from './components/FilterModal.tsx';
import SettingsIcon from './components/icons/SettingsIcon.tsx';
import LoginPage from './components/LoginPage.tsx';
import ConnectionStatusHeaderIcon from './components/icons/ConnectionStatusHeaderIcon.tsx';

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const FilterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
     <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
  </svg>
);

const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

type Theme = 'light' | 'dark';
type Page = 'list' | 'form' | 'settings' | 'detail';

export type FilterState = {
  city: string;
  gammes: string[];
  priorities: string[];
};

const initialFilterState: FilterState = {
  city: '',
  gammes: [],
  priorities: [],
};

const getPriority = (days?: number | string): 'High' | 'Medium' | 'Low' | 'Unknown' => {
    if (days === undefined || days === null || days === '') return 'Unknown';
    const numDays = typeof days === 'string' ? parseInt(days, 10) : days;
    if (isNaN(numDays)) return 'Unknown';
    
    if (numDays <= 7) return 'High';
    if (numDays <= 30) return 'Medium';
    return 'Low';
};

const areFiltersActive = (filters: FilterState): boolean => {
    return filters.city !== '' || filters.gammes.length > 0 || filters.priorities.length > 0;
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

const App: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>(Mode.Production);
  const [theme, setTheme] = useState<Theme>('light');
  const [font, setFont] = useState<string>('Inter');
  const [accentColor, setAccentColor] = useState<string>('#4f46e5');
  const [currentPage, setCurrentPage] = useState<Page>('list');
  const [formInitialData, setFormInitialData] = useState<StoreFormData | Store | null>(null);
  const [storeToDelete, setStoreToDelete] = useState<Store | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [scriptUrl, setScriptUrl] = useState<string | undefined>();
  const [authScriptUrl, setAuthScriptUrl] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>(initialFilterState);
  const [authenticatedUser, setAuthenticatedUser] = useState<string | null>(null);

  useEffect(() => {
    const loadConfigAndTheme = async () => {
      // Load config
      try {
        const response = await fetch('./config.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const configData = await response.json();
        setScriptUrl(configData.scriptUrl);
        setAuthScriptUrl(configData.authScriptUrl);
      } catch (e) {
        console.error("Failed to load application configuration:", e);
        setError("Could not load application configuration. Production mode may be unavailable.");
      }
      
      // Load theme, font, and accent color
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme) {
        setTheme(savedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      }

      const savedFont = localStorage.getItem('font');
      if (savedFont) {
        setFont(savedFont);
      }
      
      const savedAccentColor = localStorage.getItem('accentColor');
      if (savedAccentColor) {
        setAccentColor(savedAccentColor);
      }
      
      const savedMode = localStorage.getItem('mode') as Mode | null;
      if (savedMode && Object.values(Mode).includes(savedMode)) {
        setMode(savedMode);
      }

      // Check for existing session
      const sessionUser = sessionStorage.getItem('authenticatedUser');
      if (sessionUser) {
          setAuthenticatedUser(sessionUser);
      }
      // Finished initial config loading. If not authenticated, login page will show.
      // If authenticated, store fetching will be triggered by useEffect.
      setIsLoading(false);
    };
    loadConfigAndTheme();
  }, []);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.body.style.fontFamily = `'${font}', sans-serif`;
    localStorage.setItem('font', font);
  }, [font]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  useEffect(() => {
    localStorage.setItem('mode', mode);
  }, [mode]);


  const fetchStores = useCallback(async () => {
    if (!authenticatedUser) {
        setIsLoading(false);
        return;
    }
    if (mode === Mode.Production && !scriptUrl) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const fetchedStores = await storeService.getAllStores(mode, scriptUrl);
      setStores(fetchedStores);
      setIsOnline(mode === Mode.Test || (mode === Mode.Production && !!scriptUrl));
    } catch (e: any) {
      console.error("Failed to fetch stores:", e);
      setError(e.message || "An unknown error occurred while fetching data.");
      setIsOnline(false);
      if (mode === Mode.Production) {
        setMode(Mode.Test);
        alert("Connection to server failed. Switching to offline mode (local data). Your changes will not be saved online.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [mode, scriptUrl, authenticatedUser]);

  useEffect(() => {
    if (authenticatedUser) {
      fetchStores();
    }
  }, [fetchStores, authenticatedUser]);

  const handleLoginSuccess = (username: string) => {
    setAuthenticatedUser(username);
    sessionStorage.setItem('authenticatedUser', username);
  };
  
  const handleLogout = () => {
    setAuthenticatedUser(null);
    sessionStorage.removeItem('authenticatedUser');
    setStores([]); // Clear data on logout
    setCurrentPage('list'); // Reset to default page
  };

  const handleFormSubmit = (storeData: StoreFormData | Store) => {
    // Navigate back to the list page immediately
    setCurrentPage('list');
    setFormInitialData(null);

    // Define an async function to handle the submission in the background
    const backgroundSubmit = async () => {
      try {
        if ('ID' in storeData && storeData.ID) {
          await storeService.updateStore(mode, storeData as Store, scriptUrl);
        } else {
          await storeService.addStore(mode, storeData, scriptUrl, authenticatedUser || undefined);
        }
        // After successful submission, refresh the store list to show the new data
        await fetchStores();
      } catch (e: any) {
        // If there's an error, display it on the list page
        setError(e.message || "Failed to save data.");
      }
    };

    // Call the background submission function without awaiting it
    backgroundSubmit();
  };

  const handleOpenDeleteModal = (store: Store) => {
    setStoreToDelete(store);
  };
  
  const handleCloseDeleteModal = () => {
    setStoreToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!storeToDelete) return;
    setIsLoading(true);
    try {
      await storeService.deleteStore(mode, storeToDelete.ID, scriptUrl);
      await fetchStores();
    } catch (e: any) {
      setError(e.message || "Failed to delete data.");
    } finally {
      setIsLoading(false);
      setStoreToDelete(null);
    }
  };

  const handleViewDetails = (representativeStore: Store) => {
    const allRecordsForStore = stores
        .filter(s => s.Magazin === representativeStore.Magazin)
        .sort((a, b) => {
            const dateA = a['Date-Heure'] ? parseVisitDate(a['Date-Heure'])?.getTime() ?? 0 : 0;
            const dateB = b['Date-Heure'] ? parseVisitDate(b['Date-Heure'])?.getTime() ?? 0 : 0;
            return dateB - dateA;
        });
    
    if (allRecordsForStore.length === 0) {
        setSelectedStore(representativeStore);
        setCurrentPage('detail');
        return;
    }

    const latestRecord = allRecordsForStore[0];

    const mergedStore: Store = {
        ...latestRecord,
        'Date-Heure': allRecordsForStore
            .map(s => s['Date-Heure'])
            .filter(Boolean)
            .join('\n'),
        Note: allRecordsForStore
            .map(s => {
              if (!s.Note) return '';
              const date = s['Date-Heure'] ? parseVisitDate(s['Date-Heure']) : null;
              return !date || isNaN(date.getTime())
                ? s.Note
                : `[${date.toLocaleDateString('fr-CA')}] ${s.Note}`;
            })
            .filter(Boolean)
            .reverse()
            .join('\n\n'),
    };

    setSelectedStore(mergedStore);
    setCurrentPage('detail');
  };

  const handleCloseDetails = () => {
    setSelectedStore(null);
    setCurrentPage('list');
  };
  
  const handleAddFollowupFromDetails = (baseStore: Store) => {
    const allRecordsForStore = stores
      .filter(s => s.Magazin === baseStore.Magazin)
      .sort((a, b) => {
        const dateA = a['Date-Heure'] ? parseVisitDate(a['Date-Heure'])?.getTime() ?? 0 : 0;
        const dateB = b['Date-Heure'] ? parseVisitDate(b['Date-Heure'])?.getTime() ?? 0 : 0;
        return dateB - dateA;
      });
    const latestRecord = allRecordsForStore.length > 0 ? allRecordsForStore[0] : baseStore;

    const followUpTemplate: StoreFormData = {
      Magazin: latestRecord.Magazin,
      Gérant: latestRecord.Gérant,
      Localisation: latestRecord.Localisation,
      Ville: latestRecord.Ville,
      Région: latestRecord.Région,
      Adresse: latestRecord.Adresse,
      GSM: latestRecord.GSM,
      Phone: latestRecord.Phone,
      Email: latestRecord.Email,
      Gamme: latestRecord.Gamme,
      Note: '',
      Image: '',
      'Action-Client': '',
      'Rendez-Vous': '',
      Prix: '',
      Quantité: '',
    };
    
    setFormInitialData(followUpTemplate as Store);
    setCurrentPage('form');
    setSelectedStore(null);
  };

  const handleDeleteFromDetails = (store: Store) => {
    setSelectedStore(null);
    setCurrentPage('list');
    handleOpenDeleteModal(store);
  };

  const handleAddNew = () => {
    setFormInitialData(null);
    setCurrentPage('form');
  };

  const handleCloseForm = () => {
    setFormInitialData(null);
    setCurrentPage('list');
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setActiveFilters(newFilters);
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setActiveFilters(initialFilterState);
    setIsFilterModalOpen(false);
  }

  const handleResetSettings = () => {
    const defaultTheme: Theme = 'light';
    const defaultFont = 'Inter';
    const defaultAccentColor = '#4f46e5';
    const defaultMode = Mode.Production;

    setTheme(defaultTheme);
    setFont(defaultFont);
    setAccentColor(defaultAccentColor);
    setMode(defaultMode);

    localStorage.removeItem('theme');
    localStorage.removeItem('font');
    localStorage.removeItem('accentColor');
    localStorage.removeItem('mode');
  };

  const groupedAndFilteredStores = useMemo(() => {
    let processedStores = stores;
    
    // Apply filters
    if (activeFilters.city) {
        processedStores = processedStores.filter(store => store.Ville === activeFilters.city);
    }
    if (activeFilters.gammes.length > 0) {
        const gammesToFilter = [...activeFilters.gammes];
        
        // Backward compatibility for old values
        if (gammesToFilter.includes('Haute')) {
            gammesToFilter.push('Haut Gamme');
        }
        if (gammesToFilter.includes('Haute et Moyenne')) {
            gammesToFilter.push('Haut & Moyen Gamme');
        }
        if (gammesToFilter.includes('Moyenne')) {
            gammesToFilter.push('Moyenne gamme');
        }

        processedStores = processedStores.filter(store => store.Gamme && gammesToFilter.includes(store.Gamme));
    }
    if (activeFilters.priorities.length > 0) {
        processedStores = processedStores.filter(store => {
            const priority = getPriority(store['Nombre-Jours']);
            return activeFilters.priorities.includes(priority);
        });
    }

    // Apply search query
    if (searchQuery) {
      processedStores = processedStores.filter(store =>
        (store.Magazin?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (store.Gérant?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (store.Ville?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      );
    }

    const storesByMagazin = processedStores.reduce((acc, store) => {
        const key = store.Magazin;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(store);
        return acc;
    }, {} as Record<string, Store[]>);

    const representativeStores = Object.values(storesByMagazin).map(group => {
        const sortedGroup = [...group].sort((a, b) => {
            const dateA = a['Date-Heure'] ? new Date(a['Date-Heure']).getTime() : 0;
            const dateB = b['Date-Heure'] ? new Date(b['Date-Heure']).getTime() : 0;
            return dateB - dateA;
        });
        const latestStore = sortedGroup[0];
        
        return { ...latestStore, recordCount: group.length };
    });

    representativeStores.sort((a, b) => a.Magazin.localeCompare(b.Magazin));

    return representativeStores;
  }, [stores, searchQuery, activeFilters]);

  if (!authenticatedUser) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <svg className="animate-spin h-8 w-8 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <LoginPage onLoginSuccess={handleLoginSuccess} authScriptUrl={authScriptUrl} />
        )}
      </div>
    );
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'form':
        return <StoreFormPage onClose={handleCloseForm} onSubmit={handleFormSubmit} storeToEdit={formInitialData} stores={stores} />;
      case 'settings':
        return <SettingsPage 
                theme={theme} setTheme={setTheme} 
                font={font} setFont={setFont}
                accentColor={accentColor} setAccentColor={setAccentColor}
                onClose={() => setCurrentPage('list')} 
                mode={mode} setMode={setMode} 
                isOnline={isOnline}
                onRefresh={fetchStores}
                isLoading={isLoading}
                onResetSettings={handleResetSettings}
                onLogout={handleLogout}
               />;
      case 'detail':
        if (!selectedStore) {
          setCurrentPage('list'); // Should not happen, but as a safeguard
          return null;
        }
        return <ProspectDetailPage store={selectedStore} onClose={handleCloseDetails} onAddFollowup={handleAddFollowupFromDetails} onDelete={handleDeleteFromDetails} />;
      case 'list':
      default:
        return (
          <>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-24">
               <header className="sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 py-3 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-4 border-b border-slate-200 dark:border-slate-800">
                 <div className="flex items-center gap-2 max-w-7xl mx-auto">
                    <div className="relative flex-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <SearchIcon className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="search"
                        name="search"
                        id="search"
                        className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[var(--accent-color)] sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-[var(--accent-color)]"
                        placeholder="Rechercher des prospects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    {areFiltersActive(activeFilters) && (
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="flex-shrink-0 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-3 py-2.5 rounded-lg transition-colors"
                            title="Effacer les filtres"
                        >
                            <XCircleIcon className="h-4 w-4" />
                            <span>Effacer</span>
                        </button>
                    )}
                    <button
                      type="button"
                      className="p-2.5 rounded-lg text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      title="Filtrer les prospects"
                      onClick={() => setIsFilterModalOpen(true)}
                    >
                      <FilterIcon className="h-5 w-5" />
                    </button>
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                        <ConnectionStatusHeaderIcon connected={isOnline} />
                    </div>
                    <button
                        type="button"
                        className="p-2.5 rounded-lg text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Réglages"
                        onClick={() => setCurrentPage('settings')}
                      >
                        <SettingsIcon className="h-5 w-5" />
                      </button>
                  </div>
               </header>
              
              {error && (
                <div className="rounded-md bg-red-50 p-4 mb-4 dark:bg-red-900/20">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
                </div>
              )}

              <main>
                <StoreTable stores={groupedAndFilteredStores} onViewDetails={handleViewDetails} isLoading={isLoading} />
              </main>
            </div>
            <button
              type="button"
              onClick={handleAddNew}
              className="fixed bottom-6 right-6 bg-[var(--accent-color)] text-white p-4 rounded-xl shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] dark:focus:ring-offset-slate-900 transition-all duration-200 ease-in-out hover:scale-110"
              aria-label="Add new store"
              title="Add New Store"
            >
              <PlusIcon className="h-6 w-6" />
            </button>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {renderContent()}

      <ConfirmationModal
        isOpen={!!storeToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Store"
        message={`Are you sure you want to delete "${storeToDelete?.Magazin}"? This action cannot be undone.`}
        confirmText="Delete"
      />
      
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        currentFilters={activeFilters}
        stores={stores}
      />
    </div>
  );
};

export default App;
