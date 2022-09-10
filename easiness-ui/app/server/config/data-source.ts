import { DataSource } from "typeorm"

export const ds = new DataSource({
    type: "better-sqlite3",
    database: "easiness-db",
    entities: ["app/**/*.entity.js"],
    logger: 'advanced-console',
    logging: true
})

ds.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })