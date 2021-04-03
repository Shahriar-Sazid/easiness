import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FullCalendarModule } from '@fullcalendar/angular';

import { PagesRoutingModule } from './pages-routing.module';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { LoaderService } from '../core/services/loader.service';
import { LoaderInterceptorService } from '../core/services/interceptors/loader-interceptor.service';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import bootstrapPlugin from "@fullcalendar/bootstrap";


FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  bootstrapPlugin
]);

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PagesRoutingModule,
  ],
  providers: [
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true }
  ]
})
export class PagesModule { }
