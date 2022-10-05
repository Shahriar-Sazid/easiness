import Big from "big.js";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Place } from "./place.entity";
import { Product } from "./product.entity"
import { Unit } from "./unit.entity";

@Entity({ name: 'stock' })
export class Stock {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Product)
    product: Product 

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
        transformer: {
            from: (value: string) => new Big(value ?? "0"),
            to: (value: Big) => value?.toString()
        }
    })
    latestPrice: Big;

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
    unit: Unit | number

    @ManyToOne(() => Place)
    place:Place | number
}