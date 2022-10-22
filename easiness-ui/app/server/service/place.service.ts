import { ds } from "../config/data-source";
import { Place } from "../entity/place.entity";
import { utils } from "../utils/utils";

const repo = ds.getRepository(Place)


export const placeService = {
    save: async (place: Place) => {
        return await repo.save(place)
    },

    findAll: async () => {
        return utils.convertArrayToObject(await repo.find(), (place: Place) => place.id)
    }
}