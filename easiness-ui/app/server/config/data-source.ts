import { DataSource } from "typeorm"
import { UnitConversion } from "../entity/unit-conversion.entity"
import { Unit } from "../entity/unit.entity"
import { initUnit } from "../service/unit.service"

export const ds = new DataSource({
    type: "better-sqlite3",
    database: "easiness-db",
    entities: ["app/**/*.entity.js"],
    logger: 'advanced-console',
    logging: true
})

ds.initialize()
    .then(async () => {
        console.log("Data Source has been initialized!")
        initUnit(await ds.getRepository(Unit).find(), await ds.getRepository(UnitConversion).find())
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })