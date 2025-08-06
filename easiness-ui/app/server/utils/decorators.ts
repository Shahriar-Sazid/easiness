import * as Big from "big.js";
import { Column } from "typeorm";

export const BigColumn = (nullable: boolean = false) => Column('numeric', {
    precision: 20,
    nullable,
    scale: 6,
    transformer: {
        from: (value: string) => new Big(value ?? 0),
        to: (value: Big) => value?.toString()
    }
})