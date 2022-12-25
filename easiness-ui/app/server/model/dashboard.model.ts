
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