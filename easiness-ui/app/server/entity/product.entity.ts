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

    @Column()
    type: string

    @Column()
    brand: string
    
    @Column()
    country: string

    @Column()
    size: string

}