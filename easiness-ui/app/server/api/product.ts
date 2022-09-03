import { AppDataSource } from "../config/data-source";
import { Product } from "../entity/product";

export class UserController {
    getAll() {
        return AppDataSource.manager.find(Product)
    }
}