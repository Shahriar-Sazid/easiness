export type Account = {
  id: number;
  accountName: string;
  holderName: string;
  bank: string;
  branch: string;
  accountNo: string;
  balance: number;
}

export type Tx = {
  id: number;
  amount: number;
  fromAccountId: number;
  toAccountId: number;
  peopleId: number;
  peopleName: string;
  documentId: number;
  ref: string;
  type: string;
  meta: string;
  purpose: string;
  date: string;
}

export type TxSearchOptions = {
  from: Date;
  to: Date;
  type: string;
  peopleName: string;
  account: number;
  page: number;
  pageSize: number;
}

export const TxType = {
  INCOME: {
    text: "Income",
  },
  EXPENSE: {
    text: "Expense",
  },
  BANK_TRANSFER: {
    text: "Bank Transfer"
  },
}

