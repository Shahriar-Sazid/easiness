export interface UnitData {
  unitList: Unit[];
  unitConversionList: UnitConversion[];
}

export interface Unit {
  id: number;
  name: string;
}

export interface UnitConversion {
  id: number;
  from: number;
  to: number;
  calStep: number;
  operator: string;
  constant: number;
}
