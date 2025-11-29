export type TransactionAddInput = {
  store_id: number;
  amount?: number;
  payment_mode: string;
  payment_note?: string;
  payment_discount?: number;
  transaction_date?: string;
  location_id?: string;
}