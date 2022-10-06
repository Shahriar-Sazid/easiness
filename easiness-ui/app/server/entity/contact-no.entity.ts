import { Entity, Column, ManyToOne, Unique } from "typeorm"
import { People } from "./people.entity"


@Entity({ name: 'contact_no' })
export class ContactNo {
    @Column({
        primary: true,
    })
    number: string

    @ManyToOne(() => People, (people) => people.contactNoList, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete'
    })
    owner: People

    @Column({
        primary: true,
    })
    ownerId: number
}