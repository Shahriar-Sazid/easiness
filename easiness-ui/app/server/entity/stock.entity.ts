import Big from "big.js";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { BigColumn } from "../utils/decorators";
import { Base } from "./base.entity";
import { Place } from "./place.entity";
import { Product } from "./product.entity";
import { Unit } from "./unit.entity";

export const uniqueStockCols = ['productId', 'placeId']
@Entity({ name: 'stock' })
@Unique(uniqueStockCols)
export class Stock extends Base {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Product)
    product: Product
    @Column()
    productId: number

    @BigColumn()
    cost: Big;

    @BigColumn(true)
    latestPrice!: Big;

    @BigColumn()
    quantity: Big;

    @ManyToOne(() => Unit)
    unit: Unit
    @Column()
    unitId: number

    @ManyToOne(() => Place)
    place: Place
    @Column()
    placeId: number

    public getAltId() {
        return `${this.productId}_${this.placeId}`
    }
}