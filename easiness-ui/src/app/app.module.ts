import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from "@angular/common/http";

import { APP_CONFIG } from "../environments/environment";

import {
  NgbNavModule,
  NgbAccordionModule,
  NgbTooltipModule,
  NgbDateAdapter,
  NgbDateNativeAdapter,
} from "@ng-bootstrap/ng-bootstrap";

import { LayoutsModule } from "./layouts/layouts.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { initFirebaseBackend } from "./authUtils";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ErrorInterceptor } from "./core/services/interceptors/error.interceptor";
import { JwtInterceptor } from "./core/services/interceptors/jwt.interceptor";
import { FakeBackendInterceptor } from "./core/services/interceptors/fake-backend";
import { ApiInterceptor } from "./core/services/interceptors/api-interceptor";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { LoaderInterceptorService } from "./core/services/interceptors/loader-interceptor.service";
import { DatePipe, registerLocaleData } from '@angular/common';
import localeIn from '@angular/common/locales/en-IN';
import { ToastrModule } from 'ngx-toastr';
import { ProductService } from "./core/services/product.service";

if (APP_CONFIG.defaultAuth === "firebase") {
  initFirebaseBackend(APP_CONFIG.firebaseConfig);
} else {
  // tslint:disable-next-line: no-unused-expression
  FakeBackendInterceptor;
}
registerLocaleData(localeIn);

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    NgbNavModule,
    NgbAccordionModule,
    NgbTooltipModule,
    LayoutsModule,
    AppRoutingModule,
    NgxDatatableModule,
    ToastrModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FakeBackendInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true,
    },
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    DatePipe,
    "a" === "a"? ProductService: null
  ],
})
export class AppModule {}
