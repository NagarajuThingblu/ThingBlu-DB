import { FlowerReportComponent } from './flower-report/flower-report.component';
import { PrerollReportComponent } from './preroll-report/preroll-report.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderReportComponent } from './order-report/order-report.component';
import { SharedModule } from '../shared/shared.module';
import { ReportsRoutingModule } from './reports.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReportsRoutingModule
  ],
  declarations: [OrderReportComponent,
    PrerollReportComponent,
    FlowerReportComponent]
})
export class ReportsModule { }
