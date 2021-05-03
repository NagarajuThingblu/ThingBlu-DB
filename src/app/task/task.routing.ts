import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth.guard";
import { RoleGuard } from "../guards/role.guard";
import { AssignTaskComponent } from "./components/assign-task/assign-task.component";
import { EditTaskComponent } from "./components/edit-task/edit-task.component";
import { EmployeeAssignTaskComponent } from "./components/employee-assign-task/employee-assign-task.component";
import { SearchtaskComponent } from "./components/searchtask/searchtask.component";
import { TaskactionsComponent } from "./components/taskactions/taskactions.component";
import { OilInwordListingComponent } from "./components/taskparameters/oil/oil-inword-listing/oil-inword-listing.component";
import { OilMaterialsInComponent } from "./components/taskparameters/oil/oil-materials-in/oil-materials-in.component";
import { OilMaterialsOutComponent } from "./components/taskparameters/oil/oil-materials-out/oil-materials-out.component";
import { OilOutwordListingComponent } from "./components/taskparameters/oil/oil-outword-listing/oil-outword-listing.component";
import { SkewListResolver } from "./resolvers/skew-list.resolver";
import { TaskResolver } from "./resolvers/task.resolvers";

const routes:Routes =[
    { path: 'searchtask', component: SearchtaskComponent, canActivate: [AuthGuard] },
    { path: 'assigntask', component: AssignTaskComponent, canActivate: [AuthGuard, RoleGuard] },
    { path: 'assigntask/:id', component: EditTaskComponent, resolve: { data: TaskResolver } },
    { path: 'taskaction/:taskType/:id', component: TaskactionsComponent, resolve: { data: SkewListResolver }, canActivate: [AuthGuard] },
    { path: 'taskaction', component: OilOutwordListingComponent, canActivate: [AuthGuard, RoleGuard] },
    { path: 'oilmaterialsout', component: OilMaterialsOutComponent, canActivate: [AuthGuard, RoleGuard] },
    { path: 'oilmaterialsin', component: OilMaterialsInComponent, canActivate: [AuthGuard, RoleGuard] },
    { path: 'oilinword', component: OilInwordListingComponent, canActivate: [AuthGuard, RoleGuard] },
    { path: 'empassigntask', component: EmployeeAssignTaskComponent, canActivate: [AuthGuard, RoleGuard] },
]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class TaskRoutingModule{}