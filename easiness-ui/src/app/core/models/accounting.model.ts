import { FormControl } from "@angular/forms";

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

export type TxOptions = {
  view: {
    fromAccount: boolean,
    toAccount: boolean,
    people: boolean,
  },
  class: string;
  icon: string;
  text: string;
  html: string;
}

export const TxType: { [key: string]: TxOptions } = {
  INCOME: {
    text: "Income",
    html: `<span class="text-success fw-semibold"> <i class="fas fa-arrow-alt-circle-up"></i> Income </span>`,
    view: {
      fromAccount: false,
      toAccount: true,
      people: true,
    },
    icon: "fa-arrow-alt-circle-up",
    class: 'text-success'
  },
  EXPENSE: {
    text: "Expense",
    html: `<span class="text-danger fw-semibold"> <i class="fas fa-arrow-alt-circle-down"></i> Expense </span>`,
    view: {
      fromAccount: true,
      toAccount: false,
      people: true,
    },
    class: 'text-danger',
    icon: "fa-arrow-alt-circle-down",
  },
  BANK_TRANSFER: {
    text: "Bank Transfer",
    html: `<span class="text-primary fw-semibold"> <i class="fas fa-arrows-alt-h"></i> Bank Transfer </span>`,
    view: {
      fromAccount: true,
      toAccount: true,
      people: false
    },
    class: 'text-primary',
    icon: "fa-arrows-alt-h"
  },
}


export type SaveTxRequest = {
  fromAccount: FormControl<number>;
  toAccount: FormControl<number>;
  amount: FormControl<number>;
  ref: FormControl<string>;
  people: FormControl<number>;
  description: FormControl<string>;
  tag: FormControl<string>;
}