import { ChartType } from "chart.js"

export type DashboardResponse = {
    topDuePeople: ChartPoint[]
    topDebtPeople: ChartPoint[]
    topProductByProfit: ChartPoint[]
    topProductByQuantity: ChartPoint[]
}

export type ChartKeys = keyof DashboardResponse;
export type ChartMeta = {
    label: string
    backgroundColor: string[]
    type: ChartType
    key: ChartKeys
}

export type ChartsMeta = { [key in ChartKeys]: ChartMeta }

export type ChartPoint = {
    label: string
    value: string | number
}
