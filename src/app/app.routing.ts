import { TppPackageTypeMappingMasterComponent } from './Masters/components/tpp-package-type-mapping-master/tpp-package-type-mapping-master.component';
import { JointsProductionDashboardComponent } from './dashboard/components/joints-production-dashboard/joints-production-dashboard.component';
import { LotEditComponent } from './lot/components/lot-edit/lot-edit.component';
import { OilInwordListingComponent } from './task/components/taskparameters/oil/oil-inword-listing/oil-inword-listing.component';
import { EncDecPwdComponent } from './shared/components/enc-dec-pwd/enc-dec-pwd.component';
import { EditTaskComponent } from './task/components/edit-task/edit-task.component';
import { EmployeedashboardComponent } from './dashboard/components/employeedashboard/employeedashboard.component';
import { OrderReturnComponent } from './order/components/order-return/order-return.component';

import { OrderRequestFormComponent } from './order/components/order-request-form/order-request-form.component';
import { AuthGuard } from './guards/auth.guard';
import { SearchtaskComponent } from './task/components/searchtask/searchtask.component';
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { AssignTaskComponent } from './task/components/assign-task/assign-task.component';
import { TaskactionsComponent } from './task/components/taskactions/taskactions.component';
import { ManagerdashboardComponent } from './dashboard/components/managerdashboard/managerdashboard.component';
import { WhiteboardsComponent } from './dashboard/components/whiteboards/components/whiteboard-list/whiteboards.component';
import { WhiteboardDetailsComponent } from './dashboard/components/whiteboards/components/whiteboard-details/whiteboard-details.component';
import { HomeComponent } from './home/home.component';
import { TaskResolver } from './task/resolvers/task.resolvers';
import { SkewListResolver } from './task/resolvers/skew-list.resolver';
import { OrderListingComponent } from './order/components/order-listing/order-listing.component';
import { LotEntryFormComponent } from './lot/components/lotentryform/lot-entry-form.component';
import { LotTrackingComponent } from './lot/components/lot-tracking/lot-tracking.component';
import { LotlistingComponent } from './lot/components/lotlisting/lotlisting.component';
import { OilOutwordListingComponent } from './task/components/taskparameters/oil/oil-outword-listing/oil-outword-listing.component';
import { NewProductTypeComponent } from './Masters/components/new-product-type/new-product-type.component';
import { GrowerComponent } from './Masters/components/grower/grower.component';
import { CityComponent } from './Masters/components/city/city.component';
import { TpProcessorComponent } from './Masters/components/tp-processor/tp-processor.component';
import { RetailerComponent } from './Masters/components/retailer/retailer.component';
import { AddNewClientComponent } from './Masters/components/add-new-client/add-new-client.component';
import { AddNewEmployeeComponent } from './Masters/components/add-new-employee/add-new-employee.component';
import { StrainMasterComponent } from './Masters/components/strain-master/strain-master.component';
import { StraintypeMasterComponent } from './Masters/components/straintype-master/straintype-master.component';
import { AddNewBrandFormComponent } from './Masters/components/add-new-brand-form/add-new-brand-form.component';
import { NewPackageTypeFormComponent } from './Masters/components/new-package-type-form/new-package-type-form.component';
import { AddNewSubBrandFormComponent } from './Masters/components/add-new-sub-brand-form/add-new-sub-brand-form.component';
import { OilMaterialsInComponent } from './task/components/taskparameters/oil/oil-materials-in/oil-materials-in.component';
import { OilMaterialsOutComponent } from './task/components/taskparameters/oil/oil-materials-out/oil-materials-out.component';
import { GeneticsMasterComponent } from './Masters/components/genetics-master/genetics-master.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { TaskSettingComponent } from './Masters/components/task-setting/task-setting.component';
import { MasterUserRoleAccessComponent } from './admin/components/master-user-role-access/master-user-role-access.component';
import { ErrorAccessDeniededComponent } from './shared/components/error-access-denieded/error-access-denieded.component';
import { RoleGuard } from './guards/role.guard';
import { EmployeeAssignTaskComponent } from './task/components/employee-assign-task/employee-assign-task.component';
import { JointsDashboardComponent } from './dashboard/components/joints-dashboard/joints-dashboard.component';
import { EmployeesComponent } from './Masters/components/employees/employees.component';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';
// import { HomeComponent } from './home/index';
// import { LoginComponent } from './login/index';
// import { RegisterComponent } from './register/index';
// import { AuthGuard } from './_guards/index';

const appRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full'  },
    { path: 'login', component: LoginComponent},
    { path: 'forgotpassword', component: ForgotPasswordComponent },
    { path: 'forgotpassword/:token', component: ForgotPasswordComponent, canActivate: [] },
    { path: 'convertpwd', component: EncDecPwdComponent, canActivate: [AuthGuard] },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] ,
    children: [
        { path: '', redirectTo: 'lotentry', pathMatch: 'full' },
        { path: 'lotentry', component: LotEntryFormComponent, resolve: { data: SkewListResolver}, canActivate: [AuthGuard, RoleGuard],
                 canDeactivate: [CanDeactivateGuard]},
        { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
        { path: 'assigntask', component: AssignTaskComponent , canActivate: [AuthGuard, RoleGuard] },
        { path: 'assigntask/:id', component: EditTaskComponent, resolve: { data: TaskResolver } },
        { path: 'managerdashboard', component: ManagerdashboardComponent, canActivate: [AuthGuard, RoleGuard] },
        { path: 'searchtask', component: SearchtaskComponent, canActivate: [AuthGuard] },
        { path: 'taskaction/:taskType/:id', component: TaskactionsComponent, resolve: { data: SkewListResolver}, canActivate: [AuthGuard] },
        { path: 'whiteboards', component: WhiteboardsComponent, canActivate: [AuthGuard] },
        { path: 'whiteboard/:flag', component: WhiteboardDetailsComponent },
        { path: 'orderrequestform', component: OrderRequestFormComponent, canActivate: [AuthGuard, RoleGuard]},
        // draft order page routing
        { path: 'orderrequestform/:draftOrderId', component: OrderRequestFormComponent, canActivate: [AuthGuard, RoleGuard]},
        { path: 'orderreturn', component: OrderReturnComponent, canActivate: [AuthGuard]},
        { path: 'oilmaterialsout', component: OilMaterialsOutComponent, canActivate: [AuthGuard, RoleGuard]},
        { path: 'oilmaterialsin', component: OilMaterialsInComponent, canActivate: [AuthGuard, RoleGuard]},
        { path: 'lottracking', component: LotTrackingComponent, canActivate: [AuthGuard] },
        { path: 'empdashboard', component: EmployeedashboardComponent, canActivate: [AuthGuard, RoleGuard] },
        { path: 'orderlisting', component: OrderListingComponent, canActivate: [AuthGuard, RoleGuard]  },
        { path: 'lotlisting', component: LotlistingComponent, canActivate: [AuthGuard, RoleGuard], resolve: { data: SkewListResolver}  },
        { path: 'oiloutword', component: OilOutwordListingComponent, canActivate: [AuthGuard, RoleGuard]  },
        { path: 'oilinword', component: OilInwordListingComponent, canActivate: [AuthGuard, RoleGuard]  },
        { path: 'newproducttype', component: NewProductTypeComponent, canActivate: [AuthGuard, RoleGuard] },
        { path: 'grower', component: GrowerComponent, canActivate: [AuthGuard, RoleGuard]},
        { path: 'city', component: CityComponent, canActivate: [AuthGuard, RoleGuard]},
        { path: 'tpprocessor', component: TpProcessorComponent, canActivate: [AuthGuard, RoleGuard]},
        { path: 'retailer', component: RetailerComponent, canActivate: [AuthGuard, RoleGuard]},
        { path: 'client', component: AddNewClientComponent, canActivate: [AuthGuard, RoleGuard]},
        { path: 'addemployee', component: AddNewEmployeeComponent, canActivate: [AuthGuard, RoleGuard] },
        { path: 'strainmaster', component: StrainMasterComponent, canActivate: [AuthGuard, RoleGuard] },
        { path: 'straintypemaster', component: StraintypeMasterComponent, canActivate: [AuthGuard, RoleGuard] },
        { path: 'addnewbrand', component: AddNewBrandFormComponent, canActivate: [AuthGuard, RoleGuard] },
        { path: 'addnewpackagetype', component: NewPackageTypeFormComponent, canActivate: [AuthGuard, RoleGuard] },
        { path: 'addnewsubbrand', component: AddNewSubBrandFormComponent, canActivate: [AuthGuard, RoleGuard] },
        { path: 'addnewsgenetics', component: GeneticsMasterComponent, canActivate: [AuthGuard, RoleGuard] },
        { path: 'addtpppackagetype', component: TppPackageTypeMappingMasterComponent, canActivate: [AuthGuard, RoleGuard] },
        // { path: 'jointsproductiondashboard', component: JointsProductionDashboardComponent, canActivate: [AuthGuard, RoleGuard] },
        { path: 'jointsproductiondashboard', component: JointsDashboardComponent, canActivate: [AuthGuard, RoleGuard] },
        // Added by Devdan :: 03-Oct-2018 :: Path for Task Setting page
        { path: 'tasksetting', component: TaskSettingComponent, canActivate: [AuthGuard, RoleGuard]},
        // End of Added by Devdan
        { path: 'masteruserroleaccess', component: MasterUserRoleAccessComponent, canActivate: [AuthGuard, RoleGuard]},
        { path: 'erroraccessdenieded', component: ErrorAccessDeniededComponent, canActivate: [AuthGuard]},
        // Added By Bharat T on 13th-July-2018
         { path: 'empassigntask', component: EmployeeAssignTaskComponent , canActivate: [AuthGuard, RoleGuard] },
        // { path: 'lotedit/:LotId', component: LotEditComponent, resolve: { data: SkewListResolver}, canActivate: [AuthGuard] },
        // End of  Added By Bharat T on 13th-July-2018

        // Add Employees page :: Swapnil :: 02-april-2019
        { path: 'addemployees', component: EmployeesComponent, canActivate: [AuthGuard, RoleGuard] },
      ]
    }
];

export const routing = RouterModule.forRoot(appRoutes, {useHash: true, onSameUrlNavigation: 'reload'});
