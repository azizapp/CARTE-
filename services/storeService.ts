import { Store, Mode, StoreFormData } from '../types.ts';

const LOCAL_STORAGE_KEY = 'store-management-data';

const getLocalStores = (): Store[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse local storage data:", error);
    return [];
  }
};

const setLocalStores = (stores: Store[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stores));
};

const calculateNombreJours = (rendezVousString?: string): number | string => {
    if (!rendezVousString) return '';

    try {
        // Input can be 'YYYY-MM-DD' or a full ISO string. We only need the date part.
        const datePart = rendezVousString.substring(0, 10);
        const [year, month, day] = datePart.split('-').map(Number);

        if (!year || !month || !day || !/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
            return '';
        }

        // Create date at UTC midnight to ensure consistent day calculations across timezones
        const rendezVousDate = new Date(Date.UTC(year, month - 1, day));
        if (isNaN(rendezVousDate.getTime())) return '';

        const today = new Date();
        // Get today at UTC midnight for accurate comparison
        const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

        const diffTime = rendezVousDate.getTime() - todayUtc.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return Math.max(0, diffDays);
    } catch (e) {
        console.error("Error calculating days until appointment:", e);
        return '';
    }
};

const api = {
  async getAllStores(mode: Mode, scriptUrl?: string): Promise<Store[]> {
    if (mode === Mode.Test) {
      return getLocalStores();
    } else {
      if (!scriptUrl) throw new Error("Google Apps Script URL is not set.");
      
      const url = new URL(scriptUrl);
      url.searchParams.append('action', 'read');

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({}),
      });

      if (!response.ok) throw new Error(`Failed to fetch data from Google Sheets. Status: ${response.status}`);
      const text = await response.text();
      try {
        const result = JSON.parse(text);
        if (!result.success) throw new Error(result.error || "An unknown error occurred while fetching data from the script.");
        return result.data;
      } catch (error) {
        console.error("Invalid JSON response from server:", text);
        throw new Error("Failed to parse server response. Check console for details.");
      }
    }
  },

  async addStore(mode: Mode, storeData: StoreFormData, scriptUrl?: string, userEmail?: string): Promise<Store> {
    const allStores = await this.getAllStores(mode, scriptUrl);
    
    const maxId = allStores.reduce((max, store) => {
      const id = parseInt(store.ID, 10);
      return !isNaN(id) && id > max ? id : max;
    }, 0);
    const newId = (maxId + 1).toString();

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const formattedDateTime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;

    const newStore: Store = {
      ...storeData,
      ID: newId,
      Date: formattedDate,
      'Date-Heure': formattedDateTime,
      'Nombre-Jours': calculateNombreJours(storeData['Rendez-Vous']),
      user: userEmail,
    };

    if (mode === Mode.Test) {
      const updatedStores = [...allStores, newStore];
      setLocalStores(updatedStores);
      return newStore;
    } else {
      if (!scriptUrl) throw new Error("Google Apps Script URL is not set.");
      const url = new URL(scriptUrl);
      url.searchParams.append('action', 'create');

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ data: newStore }),
      });
      if (!response.ok) throw new Error(`Failed to add store to Google Sheets. Status: ${response.status}`);
      const text = await response.text();
      try {
        const result = JSON.parse(text);
        if (!result.success) throw new Error(result.error || "An unknown error occurred while adding the store.");
        return result.data;
      } catch (error) {
        console.error("Invalid JSON response from server:", text);
        throw new Error("Failed to parse server response. Check console for details.");
      }
    }
  },

  async updateStore(mode: Mode, storeData: Store, scriptUrl?: string): Promise<Store> {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const formattedDateTime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    
    const storeWithUpdatedTimestamp = { 
        ...storeData, 
        Date: formattedDate, 
        'Date-Heure': formattedDateTime, 
        'Nombre-Jours': calculateNombreJours(storeData['Rendez-Vous']),
    };
    
    if (mode === Mode.Test) {
      const stores = getLocalStores();
      const updatedStores = stores.map(s => s.ID === storeWithUpdatedTimestamp.ID ? storeWithUpdatedTimestamp : s);
      setLocalStores(updatedStores);
      return storeWithUpdatedTimestamp;
    } else {
      if (!scriptUrl) throw new Error("Google Apps Script URL is not set.");
      const url = new URL(scriptUrl);
      url.searchParams.append('action', 'update');

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ data: storeWithUpdatedTimestamp }),
      });
      if (!response.ok) throw new Error(`Failed to update store in Google Sheets. Status: ${response.status}`);
      const text = await response.text();
      try {
        const result = JSON.parse(text);
        if (!result.success) throw new Error(result.error || "An unknown error occurred while updating the store.");
        return result.data;
      } catch (error) {
        console.error("Invalid JSON response from server:", text);
        throw new Error("Failed to parse server response. Check console for details.");
      }
    }
  },

  async deleteStore(mode: Mode, id: string, scriptUrl?: string): Promise<void> {
    if (mode === Mode.Test) {
      const stores = getLocalStores();
      const updatedStores = stores.filter(s => s.ID !== id);
      setLocalStores(updatedStores);
    } else {
      if (!scriptUrl) throw new Error("Google Apps Script URL is not set.");
      const url = new URL(scriptUrl);
      url.searchParams.append('action', 'delete');

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ data: { id } }),
      });
      if (!response.ok) throw new Error(`Failed to delete store from Google Sheets. Status: ${response.status}`);
      const text = await response.text();
      try {
        const result = JSON.parse(text);
        if (!result.success) throw new Error(result.error || "An unknown error occurred while deleting the store.");
      } catch (error) {
        console.error("Invalid JSON response from server:", text);
        throw new Error("Failed to parse server response. Check console for details.");
      }
    }
  },
};

export default api;