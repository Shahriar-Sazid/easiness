import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from "typeorm"
import { People } from "./people.entity"

export const uniqueContactCols = ['number', 'ownerId']

@Entity({ name: 'contact_no' })
@Unique(uniqueContactCols)
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
        primary: true
    })
    ownerId: number
}