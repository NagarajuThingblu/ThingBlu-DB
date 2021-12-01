import { MsalComponent } from './msal.component';
import { DefaultComponent } from './default/default.component';
import { AddEmployeeComponent } from './employee/components/add-employee/add-employee.component';
import { PrerollReportComponent } from './reports/preroll-report/preroll-report.component';
import { FlowerReportComponent } from './reports/flower-report/flower-report.component';
import { OrderReportComponent } from './reports/order-report/order-report.component';
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
import { EmployeeSkillsetComponent } from './Masters/components/employee-skillset/employee-skillset.component';
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
import { CanDeactivateGuard } from './guards/can-deactivate.guard';
import { ResetPasswordComponent } from './azureb2c/reset-password/reset-password.component';
import { AppSignupComponent } from './azureb2c/app-signup/app-signup.component';
import { InviteNewEmployeeComponent } from './employee/components/invite-new-employee/invite-new-employee.component';
import { EmployeesComponent } from './employee/components/employees/employees.component';
import { IdentifyOrderComponent } from './order/components/order-automation/identify-order/identify-order.component';
import { AcceptOrderComponent } from './order/components/order-automation/accept-order/accept-order.component';
import { ChangeOrderComponent } from './order/components/order-automation/change-order/change-order.component';
import{AddNewTaskComponent} from './Masters/components/add-new-task/add-new-task.component';
import{RoomtypeMasterComponent} from './Masters/components/roomtype-master/roomtype-master.component';
import{ZonesComponent} from './Masters/components/zones/zones.component';
import{RoomsComponent}from './Masters/components/rooms/rooms.component';
import{RoomsTablesComponent}from './Masters/components/rooms-tables/rooms-tables.component';
import{ProductionsdashboardComponent}from './dashboard/components/productionsdashboard/productionsdashboard.component';
import{EmpPerformanceDashboardComponent} from './dashboard/components/emp-performance-dashboard/emp-performance-dashboard.component'
import{ProductiondashboardsummaryComponent} from './dashboard/components/productiondashboardsummary/productiondashboardsummary.component'
import { FieldsComponent } from './Masters/components/fields/fields.component';
import { SectionsComponent } from './Masters/components/sections/sections.component';
import { LabelsComponent } from './Masters/components/labels/labels.component';
import {FlcComponent} from './Masters/components/flc/flc.component';
import {PlantTerminationReasonsComponent} from './Masters/components/plant-termination-reasons/plant-termination-reasons.component';
import {AddRawMaterialComponent} from './Masters/components/add-raw-material/add-raw-material.component';
import { HelpComponent } from './Masters/components/help/help.component';
import { OrderformComponent } from './order/components/orderform/orderform.component';
import { UpdateTerminationreasonComponent } from './Masters/components/update-terminationreason/update-terminationreason.component';
import { SectionDetailsComponent } from './Masters/components/section-details/section-details.component';
import { LabelDetailsComponent } from './Masters/components/label-details/label-details.component';
import { CrewComponent } from './Masters/components/crew/crew.component';
import { SubcrewComponent } from './Masters/components/subcrew/subcrew.component';
import { OthersourceComponent } from './Masters/components/othersource/othersource.component';


const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'login', component: LoginComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'forgotpassword/:token', component: ForgotPasswordComponent, canActivate: [] },
  { path: 'resetpassword', component: ResetPasswordComponent, canActivate: [AuthGuard] },
  { path: 'convertpwd', component: EncDecPwdComponent },
  { path: 'resetsuccess', component: MsalComponent },
  {
    path: 'login', component: LoginComponent,
    children: [
      { path: '', redirectTo: 'home/lotentry', pathMatch: 'full' },
      { path: 'signup', component: AppSignupComponent },
    ]
  },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'lotentry', pathMatch: 'full' },
      {
        path: 'lotentry', component: LotEntryFormComponent, resolve: { data: SkewListResolver }, canActivate: [AuthGuard, RoleGuard],
        canDeactivate: [CanDeactivateGuard]
      },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'assigntask', component: AssignTaskComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'assigntask/:id', component: EditTaskComponent, resolve: { data: TaskResolver } },
      { path: 'managerdashboard', component: ManagerdashboardComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'searchtask', component: SearchtaskComponent, canActivate: [AuthGuard] },
      { path: 'taskaction/:taskType/:id', component: TaskactionsComponent, resolve: { data: SkewListResolver }, canActivate: [AuthGuard] },
      { path: 'whiteboards', component: WhiteboardsComponent, canActivate: [AuthGuard] },
      { path: 'whiteboard/:flag', component: WhiteboardDetailsComponent },
      { path: 'orderrequestform', component: OrderRequestFormComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'orderrequestform/:draftOrderId', component: OrderRequestFormComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'orderreturn', component: OrderReturnComponent, canActivate: [AuthGuard] },
      { path: 'oilmaterialsout', component: OilMaterialsOutComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'oilmaterialsin', component: OilMaterialsInComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'lottracking', component: LotTrackingComponent, canActivate: [AuthGuard] },
      { path: 'empdashboard', component: EmployeedashboardComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'orderlisting', component: OrderListingComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'lotlisting', component: LotlistingComponent, canActivate: [AuthGuard, RoleGuard], resolve: { data: SkewListResolver } },
      { path: 'oiloutword', component: OilOutwordListingComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'oilinword', component: OilInwordListingComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'newproducttype', component: NewProductTypeComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'grower', component: GrowerComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'city', component: CityComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'tpprocessor', component: TpProcessorComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'retailer', component: RetailerComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'customer', component: RetailerComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'client', component: AddNewClientComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'addemployee', component: AddNewEmployeeComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'skills', component: EmployeeSkillsetComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'strainmaster', component: StrainMasterComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'straintypemaster', component: StraintypeMasterComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'addnewbrand', component: AddNewBrandFormComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'addnewpackagetype', component: NewPackageTypeFormComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'addnewsubbrand', component: AddNewSubBrandFormComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'addnewsgenetics', component: GeneticsMasterComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'addtpppackagetype', component: TppPackageTypeMappingMasterComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'jointsproductiondashboard', component: JointsDashboardComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'tasksetting', component: TaskSettingComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'masteruserroleaccess', component: MasterUserRoleAccessComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'erroraccessdenieded', component: ErrorAccessDeniededComponent, canActivate: [AuthGuard] },
      { path: 'empassigntask', component: EmployeeAssignTaskComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'report/order', component: OrderReportComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'report/preroll', component: PrerollReportComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'report/flower', component: FlowerReportComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'userlist', component: EmployeesComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'inviteemployee', component: InviteNewEmployeeComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'adduser', component: AddEmployeeComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'adduser/:UserId', component: AddEmployeeComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'identifyorder', component: IdentifyOrderComponent, canActivate: [AuthGuard] },
      { path: 'identifyorder/:incomingOrderId', component: IdentifyOrderComponent, canActivate: [AuthGuard]},
      { path: 'acceptorder', component: AcceptOrderComponent, canActivate: [AuthGuard] },
      { path: 'acceptorder/:incomingOrderId', component: AcceptOrderComponent, canActivate: [AuthGuard] },
      { path: 'changeOrder/:incomingOrderId', component: ChangeOrderComponent, canActivate: [AuthGuard] },
      {path:'Taskmaster',component:AddNewTaskComponent, canActivate:[AuthGuard]},
      { path: 'Roomtypes', component: RoomtypeMasterComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'Zones', component: ZonesComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'Rooms', component: RoomsComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'RoomTables', component: RoomsTablesComponent, canActivate: [AuthGuard, RoleGuard] },
      {path:'productiondashboard',component:ProductionsdashboardComponent,canActivate:[AuthGuard,RoleGuard]},
      {path:'employeeperformancedashBoard', component:EmpPerformanceDashboardComponent, canActivate:[AuthGuard,RoleGuard] },
      {path:'productiondashboardsummary', component:ProductiondashboardsummaryComponent,canActivate:[AuthGuard,RoleGuard]},
      {path:'fields', component:FieldsComponent, canActivate:[AuthGuard,RoleGuard]},
      {path:'sections', component:SectionsComponent,canActivate:[AuthGuard,RoleGuard]},
      {path:'labels', component:LabelsComponent,canActivate:[AuthGuard,RoleGuard]},
      {path:'flc', component:FlcComponent,canActivate:[AuthGuard,RoleGuard]},
      {path:'plantterminationreasons', component:PlantTerminationReasonsComponent,canActivate:[AuthGuard,RoleGuard]},
      {path:'addrawmaterial', component:AddRawMaterialComponent},
      {path:'help', component:HelpComponent},
      {path:'orderform', component:OrderformComponent},
      { path: 'taskupdate', component: UpdateTerminationreasonComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'infoofsection', component: SectionDetailsComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'sectionsMergeinfo', component: LabelDetailsComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'crew', component: CrewComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'subcrew', component: SubcrewComponent, canActivate: [AuthGuard, RoleGuard] },
      // {path:'planting', component:PlantingComponent}
     // {path:'harvesting',component:HarvestingComponent}
     { path: 'othersource', component: OthersourceComponent, canActivate: [AuthGuard, RoleGuard] },
    ]
  }
];
// RouterModule.forRoot(appRoutes, { useHash: true })
export const routing = RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' });
