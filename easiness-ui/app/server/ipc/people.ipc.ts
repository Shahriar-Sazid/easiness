import { IpcMainInvokeEvent } from "electron"
import { FindPeopleRequest, PeopleRequest } from "../model/people.model"
import { peopleService } from "../service/people.service"
import { utils } from "../utils/utils"

export const peopleHandler = {
    create: async (event: IpcMainInvokeEvent, people: PeopleRequest) => {
        const res = await peopleService.save(people)

        return utils.simpleClone(res)
    },

    update: async (event: IpcMainInvokeEvent, people: PeopleRequest) => {
        const res = await peopleService.save(people)

        return utils.simpleClone(res)
    },

    search: async (event: IpcMainInvokeEvent, req: FindPeopleRequest) => {
        const res = await peopleService.find({
            name: req.name ?? '',
            contactNo: req.contactNo ?? '',
            page: req.page,
            pageSize: req.pageSize
        } as FindPeopleRequest)

        return utils.simpleClone(res)
    },

    getCustomer: async (event: IpcMainInvokeEvent) => {
        const res = await peopleService.findAllCustomer()

        return utils.simpleClone(res)
    },

    getSupplier: async (event: IpcMainInvokeEvent) => {
        const res = await peopleService.findAllSupplier()

        return utils.simpleClone(res)
    },

    getAll: async (event: IpcMainInvokeEvent) => {
        const res = await peopleService.findAll()

        return utils.simpleClone(res)
    },

    getDetails: async (event: IpcMainInvokeEvent, id: number) => {
        const res = await peopleService.findById(id)

        return utils.simpleClone(res)
    }
}