import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth.guard";
import { RoleGuard } from "../guards/role.guard";
import { AddEmployeeComponent } from "./components/add-employee/add-employee.component";
import { EmployeesComponent } from "./components/employees/employees.component";
import { InviteNewEmployeeComponent } from "./components/invite-new-employee/invite-new-employee.component";

const routes:Routes =[
    { path: 'userlist', component: EmployeesComponent, canActivate: [AuthGuard, RoleGuard] },
    { path: 'inviteemployee', component: InviteNewEmployeeComponent, canActivate: [AuthGuard, RoleGuard] },
    { path: 'adduser', component: AddEmployeeComponent, canActivate: [AuthGuard, RoleGuard] },
    { path: 'adduser/:UserId', component: AddEmployeeComponent, canActivate: [AuthGuard, RoleGuard] },
]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class EmployeeRoutingModule{}