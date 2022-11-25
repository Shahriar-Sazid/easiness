import { Injectable } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { APP_CONFIG } from "src/environments/environment";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let apiReq = req;
    if (APP_CONFIG['interceptAPICall']) {
      if (req.url.includes("api/v1/")) {
        apiReq = req.clone({ url: `http://localhost:3000/${req.url}` });
      }
    }
    return next.handle(apiReq);
  }
}
