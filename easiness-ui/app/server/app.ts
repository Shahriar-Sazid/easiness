import * as bodyParser from "body-parser"
import * as express from "express"
import * as cookieParser from "cookie-parser"
import * as logger from "morgan"
import * as path from "path"
import 'reflect-metadata'
import productRouter from "./api/product.api"
import placeRouter from "./api/place.api"
import peopleRouter from "./api/people.api"
import accountRouter from "./api/account.api"
import { apiErrorHandler } from "./errors/handler"
import unitRouter from "./api/unit.api"
import businessRouter from "./api/business.api"
import stockRouter from "./api/stock.api"
import documentRouter from "./api/document.api"
import txRouter from "./api/tx.api"
import dashboardRouter from "./api/dashboard.api"

const app = express()

app.use(logger("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/api/v1/product", productRouter)
app.use("/api/v1/place", placeRouter)
app.use("/api/v1/people", peopleRouter)
app.use("/api/v1/account", accountRouter)
app.use("/api/v1/business", businessRouter)
app.use("/api/v1/stock", stockRouter)
app.use("/api/v1/document", documentRouter)
app.use("/api/v1/tx", txRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/unit", unitRouter)

// Error handler middleware
app.use(apiErrorHandler)

export default app