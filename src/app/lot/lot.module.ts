
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LotlistingComponent } from './components/lotlisting/lotlisting.component';
import { LotService } from './services/lot.service';
import { LotEntryFormComponent } from './components/lotentryform/lot-entry-form.component';
import { LotTrackingComponent } from './components/lot-tracking/lot-tracking.component';
import { LotEditComponent } from './components/lot-edit/lot-edit.component';

@NgModule({
  declarations: [
    LotlistingComponent,
    LotEntryFormComponent,
    LotTrackingComponent,
    LotEditComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [LotService],
  exports: [
    LotlistingComponent,
    LotEntryFormComponent
  ]
})

export class LotModule { }
