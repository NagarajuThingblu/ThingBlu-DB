import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth.guard";
import { RoleGuard } from "../guards/role.guard";
import { FlowerReportComponent } from "./flower-report/flower-report.component";
import { OrderReportComponent } from "./order-report/order-report.component";
import { PrerollReportComponent } from "./preroll-report/preroll-report.component";

const routes:Routes =[
    { path: 'order', component: OrderReportComponent , canActivate: [AuthGuard, RoleGuard] },
    { path: 'preroll', component: PrerollReportComponent , canActivate: [AuthGuard, RoleGuard]  },
    { path: 'flower', component: FlowerReportComponent , canActivate: [AuthGuard, RoleGuard] },
]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class ReportsRoutingModule{}