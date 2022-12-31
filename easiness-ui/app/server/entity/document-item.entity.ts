import { Big } from "big.js";
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BigColumn } from "../utils/decorators";
import { Document } from "./document.entity";
import { Place } from "./place.entity";
import { Product } from "./product.entity";
import { Stock } from "./stock.entity";

@Entity({ name: 'document_item' })
export class DocumentItem {
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
    cost: Big

    @BigColumn(true)
    price!: Big

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