import { Observable } from "rxjs";
import { Product } from "../../models/product.model";
import { Injectable } from "@angular/core";
import { Page } from "../../models/page.model";

@Injectable()
export abstract class ProductService {
    abstract getProduct(searchOptions: {
        name: string;
        type: string;
        brand: string;
        page: number;
        pageSize: number;
    }): Observable<Page<Product>>
    abstract addProducts(newProducts): Observable<any>
    abstract updateProduct(updatedProduct: Product): Observable<any>
    abstract move(request): Observable<unknown>
}