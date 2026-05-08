/**
 * lib/types.ts
 * Shared TypeScript types for the application.
 */

import { BillSchema } from "./schema";

export interface StudioInfo {
  name: string;
  address: string;
  email: string;
  phone: string;
  bankAccounts: {
    bank: string;
    accountNumber: string;
    accountName: string;
  }[];
}

export type BillData = BillSchema;

export interface BillComputed {
  totalPrice: number;
  remaining: number;
}
