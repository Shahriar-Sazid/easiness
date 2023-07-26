import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { Account } from "../../models/accounting.model";
import { Page } from "../../models/page.model";
import { Product } from "../../models/product.model";
import { ProductService } from "../iface/product.service";
import { UtilService } from "../util.service";


@Injectable()
export class ProductIPCService implements ProductService {

    constructor(private util: UtilService) { }

    getProduct(searchOptions: { name: string; type: string; brand: string; page: number; pageSize: number; }): Observable<Page<Product>> {
        this.util.deepTrim(searchOptions)
        const res = (window as any).electronAPI.searchProduct(searchOptions) as Promise<Page<Product>>
        return from(res)
    }

    addProducts(newProducts: any): Observable<any> {
        this.util.deepTrim(newProducts)
        const res = (window as any).electronAPI.createProduct(newProducts)
        return from(res)
    }

    updateProduct(updatedProduct: Product): Observable<any> {
        this.util.deepTrim(updatedProduct)
        const res = (window as any).electronAPI.updateProduct(updatedProduct)
        return from(res)
    }

    move(request: any): Observable<unknown> {
        if (!Array.isArray(request)) {
            request = [request]
        }
        const res = (window as any).electronAPI.moveProduct(request)
        return from(res)
    }

}
