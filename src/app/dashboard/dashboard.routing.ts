import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth.guard";
import { RoleGuard } from "../guards/role.guard";
import { EmpPerformanceDashboardComponent } from "./components/emp-performance-dashboard/emp-performance-dashboard.component";
import { EmployeedashboardComponent } from "./components/employeedashboard/employeedashboard.component";
import { JointsDashboardComponent } from "./components/joints-dashboard/joints-dashboard.component";
import { ManagerdashboardComponent } from "./components/managerdashboard/managerdashboard.component";
import { ProductiondashboardsummaryComponent } from "./components/productiondashboardsummary/productiondashboardsummary.component";
import { ProductionsdashboardComponent } from "./components/productionsdashboard/productionsdashboard.component";
import { WhiteboardDetailsComponent } from "./components/whiteboards/components/whiteboard-details/whiteboard-details.component";
import { WhiteboardsComponent } from "./components/whiteboards/components/whiteboard-list/whiteboards.component";

const routes:Routes =[
    { path: 'managerdashboard', component: ManagerdashboardComponent, canActivate: [AuthGuard, RoleGuard] },
    { path: 'whiteboards', component: WhiteboardsComponent, canActivate: [AuthGuard] },
    { path: 'whiteboard/:flag', component: WhiteboardDetailsComponent },
    { path: 'empdashboard', component: EmployeedashboardComponent, canActivate: [AuthGuard, RoleGuard] },
    { path: 'jointsproductiondashboard', component: JointsDashboardComponent, canActivate: [AuthGuard, RoleGuard] },
    {path:'productiondashboard',component:ProductionsdashboardComponent,canActivate:[AuthGuard,RoleGuard]},
    {path:'employeeperformancedashBoard', component:EmpPerformanceDashboardComponent, canActivate:[AuthGuard,RoleGuard] },
    {path:'productiondashboardsummary', component:ProductiondashboardsummaryComponent,canActivate:[AuthGuard,RoleGuard]},
]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class DashboardRoutingModule{}