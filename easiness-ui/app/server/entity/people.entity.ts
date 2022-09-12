import Big from "big.js"
import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from "typeorm"
import { PeopleType } from "../model/people.model"
import { Base } from "./base.entity"
import { ContactNo } from "./contact-no.entity"


export const uniquePeopleCols = ['name', 'companyName']

@Entity({ name: 'people' })
@Unique(uniquePeopleCols)
export class People extends Base {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    companyName: string

    @Column()
    address: string

    @Column()
    type: PeopleType

    @Column()
    email: string

    @Column('numeric', {
        precision: 20,
        scale: 6,
        transformer: {
            from: (value: string) => new Big(value),
            to: (value: Big) => value.toString()
        }
    })
    balance: Big;

    @OneToMany(() => ContactNo, (contact) => contact.owner, { eager: true, cascade: true })
    contactNoList: ContactNo[]
}

