import { ds } from "../config/data-source";
import { Place } from "../entity/place.entity";

const repo = ds.getRepository(Place)


export const placeService = {
    save: async (place: Place) => {
        return await repo.save(place)
    },

    findAll: async () => {
        return await repo.find();
    }
}