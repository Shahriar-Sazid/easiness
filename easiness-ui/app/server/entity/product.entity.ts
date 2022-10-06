import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm"
import { Base } from "./base.entity"


export const uniqueProductCols = ['name', 'type', 'brand', 'country', 'size']

@Entity({name: 'product'})
@Unique(uniqueProductCols)
export class Product extends Base {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({nullable: true})
    type!: string

    @Column({nullable: true})
    brand!: string
    
    @Column()
    country: string

    @Column({nullable: true})
    size!: string

}