
type CallbackFunction<Type> = (arg: Type) => string | number;
export const utils = {
    convertArrayToObject<Type>(arr: Type[], fn: CallbackFunction<Type>): Record<string, Type> {
        return arr.reduce((acc, curr) => {
            acc[fn(curr)] = curr
            return acc
        }, {});
    },

    convertObjectToArray(obj: object): any[] {
        return Object.values(obj);
    }
}
