
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { WhiteboardDetailsComponent } from './components/whiteboards/components/whiteboard-details/whiteboard-details.component';
import { WhiteboardsComponent } from './components/whiteboards/components/whiteboard-list/whiteboards.component';
import { ManagerdashboardComponent } from './components/managerdashboard/managerdashboard.component';
import { EmployeedashboardComponent } from './components/employeedashboard/employeedashboard.component';
import { JointsProductionDashboardComponent } from './components/joints-production-dashboard/joints-production-dashboard.component';
import { DashobardService } from './services/dashobard.service';
import { RefreshService } from './services/refresh.service';
import { JointsDashboardComponent } from './components/joints-dashboard/joints-dashboard.component';
import { JointsDashboardDataComponent } from './components/joints-dashboard-data/joints-dashboard-data.component';
import { JointsDashboardDataPrintComponent } from './components/joints-dashboard-data-print/joints-dashboard-data-print.component';
import { ManagerdashboardPrintComponent } from './components/managerdashboard-print/managerdashboard-print.component';
import{ProductionsdashboardComponent} from './components/productionsdashboard/productionsdashboard.component';

@NgModule({
  declarations: [
    ManagerdashboardComponent,
    WhiteboardDetailsComponent,
    WhiteboardsComponent,
    EmployeedashboardComponent,
    JointsProductionDashboardComponent,
    JointsDashboardComponent,
    JointsDashboardDataComponent,
    JointsDashboardDataPrintComponent,
    ManagerdashboardPrintComponent,
    ProductionsdashboardComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [
    DashobardService,
    RefreshService
  ],
  exports: [
  ]
})

export class DashboardModule { }
