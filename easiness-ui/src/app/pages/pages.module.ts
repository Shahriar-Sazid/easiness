import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { PagesRoutingModule } from './pages-routing.module';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { LoaderService } from '../core/services/loader.service';
import { LoaderInterceptorService } from '../core/services/interceptors/loader-interceptor.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PagesRoutingModule
  ],
  providers: [
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true }
  ]
})
export class PagesModule { }
