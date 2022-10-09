import Big from "big.js";
import { Column } from "typeorm";

export const ToBig = (target: Object = 0, propertyKey: string | symbol): void => {
    let value: Big
    const getter = function () {
        return value;
    };
    const setter = function (newVal: string | number) {
        value = new Big(newVal)
    };
    Object.defineProperty(target, propertyKey, {
        get: getter,
        set: setter
    });
}

export const BigColumn = (nullable: boolean = false) => Column('numeric', {
    precision: 20,
    nullable,
    scale: 6,
    transformer: {
        from: (value: string) => new Big(value ?? 0),
        to: (value: Big) => value?.toString()
    }
})