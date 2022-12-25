import { ds } from "../config/data-source";
import { Product, uniqueProductCols } from "../entity/product.entity";
import { Pagination, getPage } from "../model/page.model";
import { FindProductRequest, ProductRequest } from "../model/product.model";

const repo = ds.getRepository(Product)

export const productService = {
    create: async (product: ProductRequest) => {
        let products: Product[] = []
        if (product.sizes?.length > 0) {
            products = product.sizes.map((size: string) => ({
                name: product.name,
                type: product.type,
                brand: product.brand,
                country: product.country,
                preferredUnit: product.preferredUnit,
                size,
            } as Product))
        } else {
            let { sizes, ...p } = product
            products.push(p as Product)
        }
        return await repo.createQueryBuilder()
            .insert()
            .values(products)
            .orUpdate(uniqueProductCols, uniqueProductCols)
            .updateEntity(false)
            .execute()
    },

    update: async (product: Product) => {
        const oldProduct = await repo.findOne({
            where: { id: product.id }
        })
        if (!oldProduct) {
            throw new Error("Product not available with given id")
        }

        return await repo.save(product)
    },

    find: async (params: FindProductRequest) => {

        const query = repo.createQueryBuilder()
            .where("(:name = '' OR LOWER(name) LIKE '%' || :name || '%')", { name: params.name })
            .andWhere("(:type = '' OR LOWER(type) LIKE '%' || :type || '%')", { type: params.type })
            .andWhere("(:brand = '' OR LOWER(brand) LIKE '%' || :brand || '%')", { brand: params.brand })

        return getPage(query, params as Pagination);
    }
}