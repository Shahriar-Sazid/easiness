import { NgModule } from '@angular/core';
import { AccountPipe } from './account.pipe';
import { AmountPipe } from './amount.pipe';
import { EmptyPlaceHolderPipe } from './empty-placeholder.pipe';
import { PillPipe } from './pill.pipe';
import { PlacePipe } from './place.pipe';
import { UnitPipe } from './unit.pipe';


@NgModule({
    exports: [
        EmptyPlaceHolderPipe,
        PillPipe,
        PlacePipe,
        UnitPipe,
        AmountPipe,
        AccountPipe
    ],
    declarations: [
        EmptyPlaceHolderPipe,
        PillPipe,
        PlacePipe,
        UnitPipe,
        AmountPipe,
        AccountPipe
    ],
})
export class PipesModule { }
