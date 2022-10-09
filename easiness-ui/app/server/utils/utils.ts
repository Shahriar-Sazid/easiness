import Big from "big.js";

type CallbackFunction<Type> = (arg: Type) => string | number;
export const utils = {
    convertArrayToObject<Type>(arr: Type[], fn: CallbackFunction<Type>): Record<string, Type> {
        return arr.reduce((acc, curr) => {
            acc[fn(curr)] = curr
            return acc
        }, {});
    },

    camelToSnakeCase: (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`),

    negate: (num: Big) => {
        const zero = new Big(0)
        return zero.sub(num)
    },

}
