import { Injectable } from "@angular/core";
import { Unit, UnitData } from "../../models/unit-data.model";

@Injectable()
export abstract class UnitService {
    public unitData: UnitData;
    abstract fetchUnitData()

    convert(from: number, to: number, value: number): number {
        if (+from === +to) {
            return value
        }

        let conversions = this.unitData.unitConversionList.filter(el => +el.from === +from && +el.to === +to);
        conversions = conversions.sort((a, b) => (a.calStep - b.calStep))

        if (conversions.length > 0) {
            for (const conversion of conversions) {
                switch (conversion.operator) {
                    case 'PLUS':
                        value = value + conversion.constant
                        break;
                    case 'MINUS':
                        value = value - conversion.constant
                        break;
                    case 'MULTIPLY':
                        value = value * conversion.constant
                        break;
                    case 'DIVIDE':
                        value = value / conversion.constant
                        break;
                    default:
                        break;
                }
            }
            return value;
        }

        conversions = this.unitData.unitConversionList.filter(el => +el.from === +to && +el.to === +from);
        conversions = conversions.sort((a, b) => b.calStep - a.calStep)

        if (conversions.length > 0) {
            for (const conversion of conversions) {
                switch (conversion.operator) {
                    case 'PLUS':
                        value = value - conversion.constant
                        break;
                    case 'MINUS':
                        value = value + conversion.constant
                        break;
                    case 'MULTIPLY':
                        value = value / conversion.constant
                        break;
                    case 'DIVIDE':
                        value = value * conversion.constant
                        break;
                    default:
                        break;
                }
            }
            return value;
        }

        throw new Error('Unsupported conversion')
    }

    // !TODO: Implement in proper way. not work for multiple step
    getPossibleUnits(sample: number, inclusive = true): Unit[] {
        const possibleUnits = []

        if (inclusive) {
            for (const unit of this.unitData.unitList) {
                if (+unit.id === +sample) {
                    possibleUnits.push(unit)
                }
            }
        }


        let conversions = this.unitData.unitConversionList.filter(el => +el.from === +sample)
        for (const conversion of conversions) {
            for (const unit of this.unitData.unitList) {
                if (+unit.id === +conversion.to) {
                    possibleUnits.push(unit)
                }
            }
        }

        conversions = this.unitData.unitConversionList.filter(el => +el.to === +sample)
        for (const conversion of conversions) {
            for (const unit of this.unitData.unitList) {
                if (+unit.id === +conversion.from) {
                    possibleUnits.push(unit)
                }
            }
        }

        return possibleUnits
    }
}