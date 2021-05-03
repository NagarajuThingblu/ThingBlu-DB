import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth.guard";
import { RoleGuard } from "../guards/role.guard";
import { FlowerReportComponent } from "./flower-report/flower-report.component";
import { OrderReportComponent } from "./order-report/order-report.component";
import { PrerollReportComponent } from "./preroll-report/preroll-report.component";

const routes:Routes =[
    { path: 'order', component: OrderReportComponent },
    { path: 'preroll', component: PrerollReportComponent},
    { path: 'flower', component: FlowerReportComponent},
]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class ReportsRoutingModule{}