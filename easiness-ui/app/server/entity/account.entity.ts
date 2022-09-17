import Big from "big.js"
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from "typeorm"
import { AccountType } from "../model/account.model"
import { People } from "./people.entity"

export const uniqueAccountCols = ['accountNo', 'bank']

@Entity({ name: 'account' })
@Unique(uniqueAccountCols)
export class Account {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: AccountType

    @Column({ unique: true })
    accountName: string

    @Column()
    holderName: string

    @Column()
    bank: string

    @Column()
    branch: string

    @Column({ unique: true })
    accountNo: string

    @Column('numeric', {
        precision: 20,
        scale: 6,
        transformer: {
            from: (value: string) => new Big(value),
            to: (value: Big) => value.toString()
        }
    })
    balance: Big
}