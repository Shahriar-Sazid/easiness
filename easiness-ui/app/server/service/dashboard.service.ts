import { DashboardResponse, DateRange } from "../model/dashboard.model"
import { documentService } from "./document.service"
import { peopleService } from "./people.service"

export const dashboardService = {
    find: async (dateRange: DateRange) => {
        const resp = {} as DashboardResponse
        resp.topDuePeople = await peopleService.getTopDuePeople(5)
        resp.topDebtPeople = await peopleService.getTopDebtPeople(5)
        resp.topProductByProfit = await documentService.getTopProductByProfit(dateRange, 5)
        resp.topProductByQuantity = await documentService.getTopProductByQuantity(dateRange, 5)
        return resp
    },
}