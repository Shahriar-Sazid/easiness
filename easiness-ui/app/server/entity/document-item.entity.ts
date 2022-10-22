import { Big } from "big.js";
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BigColumn } from "../utils/decorators";
import { Base } from "./base.entity";
import { Document } from "./document.entity";
import { Place } from "./place.entity";
import { Product } from "./product.entity";
import { Stock } from "./stock.entity";
import { Unit } from "./unit.entity";

@Entity({ name: 'document_item' })
export class DocumentItem extends Base {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Document, (document) => document.items)
    document: Document
    @Index()
    @Column()
    documentId: number

    @ManyToOne(() => Product)
    product: Product
    @Column()
    productId: number

    @BigColumn()
    quantity: Big

    @BigColumn()
    costOrPrice: Big

    @ManyToOne(() => Unit)
    unit: Unit
    @Column()
    unitId: number

    @ManyToOne(() => Place)
    place!: Place
    @Column({ nullable: true })
    placeId!: number

    @ManyToOne(() => Stock)
    affectedStock!: Stock
    @Column({ nullable: true })
    affectedStockId!: number

}