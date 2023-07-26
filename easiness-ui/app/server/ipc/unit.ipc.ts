import { IpcMainInvokeEvent } from "electron";
import { unitService } from "../service/unit.service";
import { utils } from "../utils/utils";

export const unitHandler = {
    getAll: async (event: IpcMainInvokeEvent) => {
        const res = await unitService.findAll()

        return utils.simpleClone(res)
    },
}