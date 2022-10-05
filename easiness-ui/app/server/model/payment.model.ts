import Big from "big.js";

export type Payment = {
    fromAccount: number;
    toAccount: number;
    amount: Big;
}