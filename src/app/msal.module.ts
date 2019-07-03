import { SharedModule } from './shared/shared.module';
import { MsalComponent } from './msal.component';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      MsalComponent,
    ],
    imports: [
      SharedModule
    ],
    exports: [MsalComponent]
  })
  export class MsalModule { }
