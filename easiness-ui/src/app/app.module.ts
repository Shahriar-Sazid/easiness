import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { APP_CONFIG } from "../environments/environment";

import {
  NgbAccordionModule,
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbNavModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";

import { DatePipe, registerLocaleData } from "@angular/common";
import localeIn from "@angular/common/locales/en-IN";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ToastrModule } from "ngx-toastr";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { initFirebaseBackend } from "./authUtils";
import { AccountingWebService } from "./core/services/accounting.service";
import { AccountingService } from "./core/services/iface/account.service";
import { PeopleService } from "./core/services/iface/people.service";
import { ProductService } from "./core/services/iface/product.service";
import { ApiInterceptor } from "./core/services/interceptors/api-interceptor";
import { ErrorInterceptor } from "./core/services/interceptors/error.interceptor";
import { FakeBackendInterceptor } from "./core/services/interceptors/fake-backend";
import { JwtInterceptor } from "./core/services/interceptors/jwt.interceptor";
import { LoaderInterceptorService } from "./core/services/interceptors/loader-interceptor.service";
import { AccountingIPCService } from "./core/services/ipc/accounting-ipc.service";
import { ProductIPCService } from "./core/services/ipc/product-ipc.service";
import { PeopleWebService } from "./core/services/people.service";
import { ProductWebService } from "./core/services/product.service";
import { LayoutsModule } from "./layouts/layouts.module";
import { UnitService } from "./core/services/iface/unit.service";
import { UnitWebService } from "./core/services/unit.service";
import { StockService } from "./core/services/iface/stock.service";
import { StockIPCService } from "./core/services/ipc/stock-ipc.service";
import { StockWebService } from "./core/services/stock.service";
import { UserProfileService } from "./core/services/user.service";
import { BusinessService } from "./core/services/business.service";
import { DocumentService } from "./core/services/document.service";
import { LanguageService } from "./core/services/language.service";
import { UtilService } from "./core/services/util.service";
import { PlaceService } from "./core/services/place.service";
import { PDFService } from "./core/services/pdf.service";
import { LoaderService } from "./core/services/loader.service";
import { EventService } from "./core/services/event.service";
import { AppService } from "./core/services/app.service";
import { AuthenticationService } from "./core/services/auth.service";
import { AuthfakeauthenticationService } from "./core/services/authfake.service";
import { DashboardService } from "./core/services/dashboard.service";
import { UnitIPCService } from "./core/services/ipc/unit-ipc.service";
import { PlaceIpcService } from "./core/services/ipc/place-ipc.service";
import { PeopleIPCService } from "./core/services/ipc/people-ipc.service";
import { DocumentIpcService } from "./core/services/ipc/document-ipc.service";
import { BusinessIpcService } from "./core/services/ipc/business-ipc.service";

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
  declarations: [AppComponent],
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
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FakeBackendInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true,
    },
    DatePipe,

    {
      provide: AccountingService,
      useClass: (() =>
        APP_CONFIG.useIPC ? AccountingIPCService : AccountingWebService)(),
    },
    {
      provide: ProductService,
      useClass: (() =>
        APP_CONFIG.useIPC ? ProductIPCService : ProductWebService)(),
    },

    {
      provide: PeopleService,
      useClass: (() =>
        APP_CONFIG.useIPC ? PeopleIPCService : PeopleWebService)(),
    },
    {
      provide: UnitService,
      useClass: (() => (APP_CONFIG.useIPC ? UnitIPCService : UnitWebService))(),
    },
    {
      provide: StockService,
      useClass: (() =>
        APP_CONFIG.useIPC ? StockIPCService : StockWebService)(),
    },
    {
      provide: UserProfileService,
      useClass: (() =>
        APP_CONFIG.useIPC ? UserProfileService : UserProfileService)(),
    },
    {
      provide: BusinessService,
      useClass: (() =>
        APP_CONFIG.useIPC ? BusinessIpcService : BusinessService)(),
    },
    {
      provide: DocumentService,
      useClass: (() =>
        APP_CONFIG.useIPC ? DocumentIpcService : DocumentService)(),
    },
    {
      provide: LanguageService,
      useClass: (() =>
        APP_CONFIG.useIPC ? LanguageService : LanguageService)(),
    },
    {
      provide: UtilService,
      useClass: (() => (APP_CONFIG.useIPC ? UtilService : UtilService))(),
    },
    {
      provide: PlaceService,
      useClass: (() => (APP_CONFIG.useIPC ? PlaceIpcService : PlaceService))(),
    },
    {
      provide: PDFService,
      useClass: (() => (APP_CONFIG.useIPC ? PDFService : PDFService))(),
    },
    {
      provide: LoaderService,
      useClass: (() => (APP_CONFIG.useIPC ? LoaderService : LoaderService))(),
    },
    {
      provide: EventService,
      useClass: (() => (APP_CONFIG.useIPC ? EventService : EventService))(),
    },
    {
      provide: AppService,
      useClass: (() => (APP_CONFIG.useIPC ? AppService : AppService))(),
    },
    {
      provide: AuthenticationService,
      useClass: (() =>
        APP_CONFIG.useIPC ? AuthenticationService : AuthenticationService)(),
    },
    {
      provide: AuthfakeauthenticationService,
      useClass: (() =>
        APP_CONFIG.useIPC
          ? AuthfakeauthenticationService
          : AuthfakeauthenticationService)(),
    },
    {
      provide: DashboardService,
      useClass: (() =>
        APP_CONFIG.useIPC ? DashboardService : DashboardService)(),
    },
  ],
})
export class AppModule {}
