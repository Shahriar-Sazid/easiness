import * as Big from "big.js";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BigColumn } from "../utils/decorators";
import { Account } from "./account.entity";
import { Base } from "./base.entity";
import { Document } from "./document.entity";
import { People } from "./people.entity";


export enum TxType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE",
    BANK_TRANSFER = "BANK_TRANSFER"
}

@Entity({ name: 'tx' })
export class Tx extends Base {
    @PrimaryGeneratedColumn()
    id: number

    @BigColumn()
    amount: Big

    @ManyToOne(() => Account)
    fromAccount: Account
    @Column({ nullable: true })
    fromAccountId!: number

    @ManyToOne(() => Account)
    toAccount: Account
    @Column({ nullable: true })
    toAccountId!: number

    @ManyToOne(() => Document)
    document: Document
    @Column({ nullable: true })
    documentId!: number

    @ManyToOne(() => People)
    people: People
    @Column({ nullable: true })
    peopleId: number

    @Column({ nullable: true })
    ref!: string

    @Column()
    type: TxType

    @Column({ nullable: true })
    meta!: string

    @Column({ nullable: true })
    description!: string

}