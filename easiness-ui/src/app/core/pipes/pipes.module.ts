import { NgModule } from '@angular/core';
import { AccountPipe } from './account.pipe';
import { AmountPipe } from './amount.pipe';
import { EmptyPlaceHolderPipe } from './empty-placeholder.pipe';
import { PeoplePipe } from './people.pipe';
import { PillPipe } from './pill.pipe';
import { PlacePipe } from './place.pipe';
import { TxTypePipe } from './tx-type.pipe';
import { UnitPipe } from './unit.pipe';


@NgModule({
    exports: [
        EmptyPlaceHolderPipe,
        PillPipe,
        PlacePipe,
        UnitPipe,
        AmountPipe,
        AccountPipe,
        PeoplePipe,
        TxTypePipe,
    ],
    declarations: [
        EmptyPlaceHolderPipe,
        PillPipe,
        PlacePipe,
        UnitPipe,
        AmountPipe,
        AccountPipe,
        PeoplePipe,
        TxTypePipe,
    ],
})
export class PipesModule { }
