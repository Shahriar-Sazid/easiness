import { Type } from "class-transformer"

export type DashboardResponse = {
    topDuePeople: ChartPoint[]
    topDebtPeople: ChartPoint[]
    topProductByProfit: ChartPoint[]
    topProductByQuantity: ChartPoint[]
}

export type ChartPoint = {
    label: string
    value: string | number
}

export class DateRange {
    @Type(() => Date)
    from: Date

    @Type(() => Date)
    to: Date
}