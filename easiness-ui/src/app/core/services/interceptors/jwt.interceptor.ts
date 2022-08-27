import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from 'src/environments/environment';
import { AuthenticationService } from '../auth.service';
import { AuthfakeauthenticationService } from '../authfake.service';



@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private authfackservice: AuthfakeauthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (APP_CONFIG.defaultAuth === 'firebase') {
            const currentUser = this.authenticationService.currentUser();
            if (currentUser && currentUser.token) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });
            }
        } else {
            // add authorization header with jwt token if available
            const currentUser = this.authfackservice.currentUserValue;
            if (currentUser && currentUser.token) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });
            }
        }
        return next.handle(request);
    }
}
