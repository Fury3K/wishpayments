export type ItemType = 'need' | 'want';
export type Priority = 'high' | 'medium' | 'low';

export interface Item {
  id: number;
  name: string;
  price: number;
  saved: number;
  type: ItemType;
  priority: Priority;
  dateAdded: string;
  isArchived?: boolean;
  dateArchived?: string | null;
  bankId?: number | null;
}

export interface BankAccount {
  id: number;
  name: string;
  balance: number;
  color: string;
}
