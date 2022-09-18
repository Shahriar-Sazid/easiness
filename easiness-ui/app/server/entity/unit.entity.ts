import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: 'unit' })
export class Unit {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
}