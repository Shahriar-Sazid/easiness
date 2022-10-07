import Big from "big.js";

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