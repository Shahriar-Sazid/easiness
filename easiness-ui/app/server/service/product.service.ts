import { Request } from "express";
import { ds } from "../config/data-source";
import { Product, uniqueProductCols } from "../entity/product.entity";
import { Pagination } from "../model/pagination.model";
import { FindProductRequest, ProductRequest } from "../model/product.model";
import { paginate } from "../util/util";

const productRepo = ds.getRepository(Product)

export const productService = {
    create: async (req: Request) => {
        const product: ProductRequest = req.body
        let products: Product[] = []
        if (product.sizes?.length > 0) {
            products = product.sizes.map((size: string) => ({
                name: product.name,
                type: product.type,
                brand: product.brand,
                country: product.country,
                size,
            } as Product))
        } else {
            let { sizes, ...p } = product
            products.push(p as Product)
        }
        return productRepo.upsert(products, { conflictPaths: uniqueProductCols })
    },

    update: async (req: Request) => {
        const product: Product = req.body

        const oldProduct = await productRepo.findOne({
            where: { id: product.id }
        })
        if (!oldProduct) {
            throw new Error("Product not available with given id")
        }

        return await productRepo.save(product)
    },

    find: async (q: FindProductRequest) => {

        let name = q.name ?? '';
        let type = q.type ?? '';
        let brand = q.brand ?? '';

        const {skip, take} = paginate(q as Pagination)

        return productRepo.createQueryBuilder()
            .where(":name = '' OR LOWER(name) LIKE '%' || :name || '%'", { name })
            .andWhere(":type = '' OR LOWER(type) LIKE '%' || :type || '%'", { type })
            .andWhere(":brand = '' OR LOWER(brand) LIKE '%' || :brand || '%'", { brand })
            .skip(skip)
            .take(take)
            .getMany()
    }
}