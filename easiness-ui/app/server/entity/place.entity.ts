import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { Base } from "./base.entity"


@Entity({ name: 'place' })
export class Place extends Base {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    name: string

    @Column()
    address: string
}