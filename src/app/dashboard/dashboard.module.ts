
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { WhiteboardDetailsComponent } from './components/whiteboards/components/whiteboard-details/whiteboard-details.component';
import { WhiteboardsComponent } from './components/whiteboards/components/whiteboard-list/whiteboards.component';
import { ManagerdashboardComponent } from './components/managerdashboard/managerdashboard.component';
import { EmployeedashboardComponent } from './components/employeedashboard/employeedashboard.component';
import { JointsProductionDashboardComponent } from './components/joints-production-dashboard/joints-production-dashboard.component';
import { DashobardService } from './services/dashobard.service';
import { RefreshService } from './services/refresh.service';

@NgModule({
  declarations: [
    ManagerdashboardComponent,
    WhiteboardDetailsComponent,
    WhiteboardsComponent,
    EmployeedashboardComponent,
    JointsProductionDashboardComponent
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
