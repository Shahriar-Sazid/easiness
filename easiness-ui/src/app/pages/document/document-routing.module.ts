import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountResolver } from 'src/app/core/services/resolvers/account-resolver.service';
import { DocumentResolver } from 'src/app/core/services/resolvers/document-resolver.service';
import { PlaceResolver } from 'src/app/core/services/resolvers/place-resolver.service';
import { UnitResolver } from 'src/app/core/services/resolvers/unit-resolver.service';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentViewComponent } from './document-view/document-view.component';

const routes: Routes = [
  {
    path: 'list/:type',
    component: DocumentListComponent,
    resolve: {
      account: AccountResolver
    }
  },
  {
    path: 'details/:id',
    component: DocumentViewComponent,
    resolve: {
      units: UnitResolver,
      document: DocumentResolver,
      place: PlaceResolver,
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentRoutingModule { }
