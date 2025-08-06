import * as Big from "big.js"
import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from "typeorm"
import { PeopleType } from "../model/people.model"
import { BigColumn } from "../utils/decorators"
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

    @Column({ nullable: true })
    address!: string

    @Column()
    type: PeopleType

    @Column({ nullable: true })
    email!: string

    @BigColumn()
    balance: Big

    @OneToMany(() => ContactNo, (contact) => contact.owner, { eager: true, cascade: true })
    contactNoList: ContactNo[]
}

