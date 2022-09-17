import { Pagination } from "./page.model";

export enum AccountType {
    BANK_ACCOUNT = "BANK_ACCOUNT",
    CASH = "CASH"
}

export type FindAccountRequest = {
    accountName: string;
    holderName: string;
    accountNo: string;
} & Pagination