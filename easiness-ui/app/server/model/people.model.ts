import Big from "big.js";
import { Pagination } from "./page.model";

export enum PeopleType {
    BOTH = "BOTH",
    SUPPLIER = "SUPPLIER",
    CUSTOMER = "CUSTOMER",
}


export type PeopleRequest = {
    id: number;
    name: string;
    companyName: string;
    address: string;
    type: PeopleType;
    email: string;
    balance: string | Big;
    contactNo: string[];
}

export type FindPeopleRequest = {
    name: string;
    contactNo: string;
} & Pagination