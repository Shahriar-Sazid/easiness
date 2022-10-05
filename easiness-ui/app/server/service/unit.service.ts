import Big from "big.js";
import { UnitConversion } from "../entity/unit-conversion.entity";
import { Unit } from "../entity/unit.entity";
import { ApiError } from "../errors/api-error";
import { ReasonCode } from "../errors/codes";
import { Operator } from "../model/operator";

let units: Unit[]
let conversions: UnitConversion[]

export function initUnit(unit: Unit[], conversion: UnitConversion[]) {
    units = unit
    conversions = conversion
}

export const unitService = {
    findAll: async () => {
        return {
            unitList: units,
            unitConversionList: conversions
        }
    },

    convert: (from: number, to: number, value: string | Big) => {
        value = new Big(value)
        let cx = conversions.filter(el => el.from === from && el.to === to).sort((a, b) => a.calStep - b.calStep)
        if (cx?.length > 0) {
            for (const el of cx) {
                switch (el.Operator) {
                    case Operator.PLUS:
                        value = value.add(el.constant)
                        break
                    case Operator.MINUS:
                        value = value.sub(el.constant)
                        break
                    case Operator.MULTIPLY:
                        value = value.mul(el.constant)
                        break
                    case Operator.DIVIDE:
                        value = value.div(el.constant)
                }
            }
            return value
        }
        cx = conversions.filter(el => el.from === to && el.to === from).sort((a, b) => b.calStep - a.calStep)
        if (cx?.length > 0) {
            for (const el of cx) {
                switch (el.Operator) {
                    case Operator.PLUS:
                        value = value.sub(el.constant)
                        break
                    case Operator.MINUS:
                        value = value.add(el.constant)
                        break
                    case Operator.MULTIPLY:
                        value = value.div(el.constant)
                        break
                    case Operator.DIVIDE:
                        value = value.mul(el.constant)
                }
            }
            return value
        }
        throw ApiError.New(ReasonCode.InvalidUnitConversion)
    }
}