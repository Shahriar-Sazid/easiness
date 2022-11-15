import Big from "big.js"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { Operator } from "../model/operator"

@Entity({ name: 'unit_conversion' })
export class UnitConversion {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'from_unit' })
    from: number

    @Column({ name: 'to_unit' })
    to: number

    @Column({ name: 'cal_step' })
    calStep: number

    @Column()
    operator: Operator

    @Column('numeric', {
        precision: 20,
        scale: 6,
        transformer: {
            from: (value: string) => new Big(value),
            to: (value: Big) => value.toString()
        }
    })
    constant: Big;
}