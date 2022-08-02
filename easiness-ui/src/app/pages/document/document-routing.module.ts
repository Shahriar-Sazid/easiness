import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentResolver } from 'src/app/core/services/resolvers/document-resolver.service';
import { PlaceResolver } from 'src/app/core/services/resolvers/place-resolver.service';
import { UnitResolver } from 'src/app/core/services/resolvers/unit-resolver.service';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentViewComponent } from './document-view/document-view.component';
import { DocumentComponent } from './document/document.component';

const routes: Routes = [
  {
    path: 'list/:type',
    component: DocumentListComponent,
  },
  {
    path: 'details/:id',
    component: DocumentViewComponent,
    resolve: {
      units: UnitResolver,
      document: DocumentResolver,
      place: PlaceResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentRoutingModule { }
