import { StatusCodes } from "http-status-codes";
import { Err } from "./codes";

export class ApiError {
    constructor(public code: string, public msg: string = "", public status: number) {}

    static New(err: Err, message?: string, status: number = StatusCodes.BAD_REQUEST): ApiError {
        if (!message) {
            message = err.message
        }
        return new ApiError(err.code, message, status);
    }
}
