import Big from "big.js";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BigColumn } from "../utils/decorators";
import { Base } from "./base.entity";
import { DocumentItem } from "./document-item.entity";
import { People } from "./people.entity";
import { Tx } from "./tx.entity";

export enum DocumentType {
    PURCHASE_ORDER = "PURCHASE_ORDER",
    INVOICE = "INVOICE"
}

@Entity({ name: 'document' })
export class Document extends Base {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => People)
    people: People
    @Column()
    peopleId: number

    @Column()
    type: DocumentType

    @BigColumn()
    total: Big

    @BigColumn(true)
    profit!: Big

    @OneToMany(() => DocumentItem, (item) => item.document, { cascade: true })
    items: DocumentItem[]

    @OneToMany(() => Tx, (item) => item.document)
    payments: Tx[]

}