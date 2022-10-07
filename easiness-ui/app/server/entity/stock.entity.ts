import Big from "big.js";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from "typeorm"
import { Base } from "./base.entity";
import { Place } from "./place.entity";
import { Product } from "./product.entity"
import { Unit } from "./unit.entity";

export const uniqueStockCols = ['productId', 'placeId']
@Entity({ name: 'stock' })
@Unique(uniqueStockCols)
export class Stock extends Base {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Product)
    @JoinColumn()
    product: Product
    @Column()
    productId: number

    @Column('numeric', {
        precision: 20,
        scale: 6,
        transformer: {
            from: (value: string) => new Big(value),
            to: (value: Big) => value.toString()
        }
    })
    cost: Big;


    @Column('numeric', {
        precision: 20,
        scale: 6,
        nullable: true,
        transformer: {
            from: (value: string) => new Big(value ?? "0"),
            to: (value: Big) => value?.toString()
        }
    })
    latestPrice!: Big;

    @Column('numeric', {
        precision: 20,
        scale: 6,
        transformer: {
            from: (value: string) => new Big(value),
            to: (value: Big) => value.toString()
        }
    })
    quantity: Big;

    @ManyToOne(() => Unit)
    @JoinColumn()
    unit: Unit
    @Column()
    unitId: number

    @ManyToOne(() => Place)
    @JoinColumn()
    place: Place
    @Column()
    placeId: number

    public getAltId() {
        return `${this.productId}_${this.placeId}`
    }
}