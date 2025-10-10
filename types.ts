
export enum Mode {
  Test = 'test',
  Production = 'production',
}

export interface Store {
  ID: string;
  Date: string;
  'Date-Heure'?: string;
  Magazin: string;
  Gérant?: string;
  Localisation?: string;
  Image?: string;
  Ville: string;
  Région?: string;
  Adresse?: string;
  GSM: string;
  Phone?: string;
  Email?: string;
  Gamme?: string;
  'Action-Client'?: string;
  'Rendez-Vous'?: string;
  Note?: string;
  'Nombre-Jours'?: number | string;
  Prix?: number | string;
  Quantité?: number | string;
  user?: string;
}

export type StoreFormData = Omit<Store, 'ID' | 'Date'> & {
  ID?: string;
  Date?: string;
};