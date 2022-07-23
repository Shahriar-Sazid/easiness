import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnitResolver } from 'src/app/core/services/resolvers/unit-resolver.service';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentComponent } from './document/document.component';

const routes: Routes = [
  {
    path: 'list/:type',
    component: DocumentListComponent,
  },
  {
    path: 'details/:id',
    component: DocumentComponent,
    resolve: {
      units: UnitResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentRoutingModule { }
