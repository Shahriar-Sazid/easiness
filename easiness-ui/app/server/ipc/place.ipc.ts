import { IpcMainInvokeEvent } from "electron";
import { placeService } from "../service/place.service";
import { Place } from "../entity/place.entity";
import { utils } from "../utils/utils";

export const placeHandler = {
  
  create: async (event: IpcMainInvokeEvent, place: Place) => {
    const res = await placeService.save(place);

    return utils.simpleClone(res);
  },
  update: async (event: IpcMainInvokeEvent, place: Place) => {
    const res = await placeService.save(place);

    return utils.simpleClone(res);
  },

 
  findAll: async (event: IpcMainInvokeEvent) => {
    const res = await placeService.findAll();

    return utils.simpleClone(res);
  },
};
