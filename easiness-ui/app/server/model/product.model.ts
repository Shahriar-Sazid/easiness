import { Pagination } from "./page.model";

export type ProductRequest = {
    name: string;
    type: string;
    brand: string;
    country: string;
    sizes: string[];
}

export type FindProductRequest = ProductRequest & Pagination 