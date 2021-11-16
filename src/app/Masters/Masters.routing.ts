import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth.guard";
import { RoleGuard } from "../guards/role.guard";
import { AddNewBrandFormComponent } from "./components/add-new-brand-form/add-new-brand-form.component";
import { AddNewClientComponent } from "./components/add-new-client/add-new-client.component";
import { AddNewEmployeeComponent } from "./components/add-new-employee/add-new-employee.component";
import { AddNewSubBrandFormComponent } from "./components/add-new-sub-brand-form/add-new-sub-brand-form.component";
import { AddNewTaskComponent } from "./components/add-new-task/add-new-task.component";
import { AddRawMaterialComponent } from "./components/add-raw-material/add-raw-material.component";
import { CityComponent } from "./components/city/city.component";
import { FieldsComponent } from "./components/fields/fields.component";
import { FlcComponent } from "./components/flc/flc.component";
import { GeneticsMasterComponent } from "./components/genetics-master/genetics-master.component";
import { GrowerComponent } from "./components/grower/grower.component";
import { HelpComponent } from "./components/help/help.component";
import { LabelsComponent } from "./components/labels/labels.component";
import { NewPackageTypeFormComponent } from "./components/new-package-type-form/new-package-type-form.component";
import { NewProductTypeComponent } from "./components/new-product-type/new-product-type.component";
import { PlantTerminationReasonsComponent } from "./components/plant-termination-reasons/plant-termination-reasons.component";
import { RetailerComponent } from "./components/retailer/retailer.component";
//import { ChemicalPurchaseComponent } from './components/chemical-purchase/chemical-purchase.component';
// import { ChemicalMasterPageComponent } from './components/chemical-master-page/chemical-master-page.component';
import { RoomsTablesComponent } from "./components/rooms-tables/rooms-tables.component";
import { RoomsComponent } from "./components/rooms/rooms.component";
import { RoomtypeMasterComponent } from "./components/roomtype-master/roomtype-master.component";
import { SectionsComponent } from "./components/sections/sections.component";
import { StrainMasterComponent } from "./components/strain-master/strain-master.component";
import { StraintypeMasterComponent } from "./components/straintype-master/straintype-master.component";
import { TaskSettingComponent } from "./components/task-setting/task-setting.component";
import { TpProcessorComponent } from "./components/tp-processor/tp-processor.component";
import { TppPackageTypeMappingMasterComponent } from "./components/tpp-package-type-mapping-master/tpp-package-type-mapping-master.component";
import { ZonesComponent } from "./components/zones/zones.component";
import { EmployeeSkillsetComponent } from "./components/employee-skillset/employee-skillset.component";
import { SectionDetailsComponent } from "./components/section-details/section-details.component";
import { LabelDetailsComponent } from "./components/label-details/label-details.component";
import { UpdateTerminationreasonComponent } from "./components/update-terminationreason/update-terminationreason.component";
import { CrewComponent } from "./components/crew/crew.component";
import { SubcrewComponent } from "./components/subcrew/subcrew.component";

const routes:Routes =[
      { path: 'newproducttype', component: NewProductTypeComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'grower', component: GrowerComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'city', component: CityComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'tpprocessor', component: TpProcessorComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'retailer', component: RetailerComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'customer', component: RetailerComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'client', component: AddNewClientComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'addemployee', component: AddNewEmployeeComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'strainmaster', component: StrainMasterComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'straintypemaster', component: StraintypeMasterComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'addnewbrand', component: AddNewBrandFormComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'addnewpackagetype', component: NewPackageTypeFormComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'addnewsubbrand', component: AddNewSubBrandFormComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'addnewsgenetics', component: GeneticsMasterComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'addtpppackagetype', component: TppPackageTypeMappingMasterComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'tasksetting', component: TaskSettingComponent, canActivate: [AuthGuard, RoleGuard] },
      { path:'Taskmaster',component:AddNewTaskComponent, canActivate:[AuthGuard]},
      { path: 'Roomtypes', component: RoomtypeMasterComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'Zones', component: ZonesComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'Rooms', component: RoomsComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'RoomTables', component: RoomsTablesComponent, canActivate: [AuthGuard, RoleGuard] },
      { path:'fields', component:FieldsComponent, canActivate:[AuthGuard,RoleGuard]},
      { path:'sections', component:SectionsComponent,canActivate:[AuthGuard,RoleGuard]},
      { path:'labels', component:LabelsComponent,canActivate:[AuthGuard,RoleGuard]},
      { path:'help', component:HelpComponent},
      {path:'flc', component:FlcComponent},
      {path:'plantterminationreasons', component:PlantTerminationReasonsComponent,canActivate:[AuthGuard,RoleGuard]},
     {path:'addrawmaterial', component:AddRawMaterialComponent},
    // {path:'chemicalsaddupdate', component:ChemicalPurchaseComponent},
    //   {path:'chemicalType', component:ChemicalMasterPageComponent,canActivate:[AuthGuard,RoleGuard]},
      {path:'skills', component:EmployeeSkillsetComponent,canActivate:[AuthGuard,RoleGuard]},
      { path: 'taskupdate', component: UpdateTerminationreasonComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'infoofsection', component: SectionDetailsComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'sectionsMergeinfo', component: LabelDetailsComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'crew', component: CrewComponent, canActivate: [AuthGuard, RoleGuard] },
      { path: 'subcrew', component: SubcrewComponent, canActivate: [AuthGuard, RoleGuard] },
]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class MastersRoutingModule{}