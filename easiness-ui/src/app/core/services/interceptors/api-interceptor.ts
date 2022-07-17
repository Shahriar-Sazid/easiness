import { Injectable } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let apiReq = req;
    // if(req.url.includes("api/")) {
    //   apiReq = req.clone({ url: `http://localhost:8080/${req.url}` });
    // }
    return next.handle(apiReq);
  }
}
