import { Pagination } from "./pagination.model";

export type ProductRequest = {
    name: string;
    type: string;
    brand: string;
    country: string;
    sizes: string[];
}

export type FindProductRequest = ProductRequest & Pagination 