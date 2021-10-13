import { AddNewSkewPopupComponent } from './components/add-new-skew-popup/add-new-skew-popup.component';

import { NgModule } from '@angular/core';
import {TreeModule} from 'primeng/tree';
import {TreeNode} from 'primeng/api';
import { SharedModule } from '../shared/shared.module';
import { NewProductTypeComponent } from './components/new-product-type/new-product-type.component';
import { NewProductTypeDetailsActionService } from '../task/services/new-product-type.service';
import { AddNewBrandComponent } from './components/add-new-brand/add-new-brand.component';
import { NewBrandActionService } from '../task/services/new-brand.service';
import { AddNewStrainComponent } from './components/add-new-strain/add-new-strain.component';
import { NewStrainActionService } from '../task/services/new-strain-action.service';
import { AddNewStraintypeComponent } from './components/add-new-straintype/add-new-straintype.component';
import { AddNewPackagetypeComponent } from './components/add-new-packagetype/add-new-packagetype.component';
import { NewPackageTypeActionService } from '../task/services/new-package-type-action.service';
import { AddNewSubBrandComponent } from './components/add-new-sub-brand/add-new-sub-brand.component';
import { NewSubBrandActionService } from '../task/services/new-sub-brand-action.service';
import { NewStrainTypeActionService } from '../task/services/new-strain-type-action.service';
import { ProductTypeListingComponent } from './components/product-type-listing/product-type-listing.component';
import { NewProductTypeService } from './services/new-product-type.service';
import { GrowerComponent } from './components/grower/grower.component';
import { GrowerDetailsActionService } from '../task/services/grower-details-action.service'
import { CityComponent } from './components/city/city.component';
import { AddNewCountryComponent } from './components/add-new-country/add-new-country.component';
import { TpProcessorComponent } from './components/tp-processor/tp-processor.component';
import { TpprocessorService } from './services/tpprocessor.service';
import { RetailerComponent } from './components/retailer/retailer.component';
import { RetailerService } from './services/retailer.service';
import { FLCService } from './services/flc.service';
import { PTRService } from './services/ptr.service';
import {ChemicalMasterService} from './services/chemicalmaster.service'
import { AddNewClientComponent } from './components/add-new-client/add-new-client.component';
import { NewClientService } from './services/new-client.service';
import { CityService } from './services/city.service';
import { AddNewStateComponent } from './components/add-new-state/add-new-state.component';

import { AddNewUserRoleComponent } from './components/add-new-user-role/add-new-user-role.component';
import { NewRoleActionService } from '../task/services/new-role.service';
import { NewEmployeeActionService } from '../task/services/add-employee';

import { NewEmployeeService } from './services/new-employee.service';
import { StrainMasterComponent } from './components/strain-master/strain-master.component';
import { AddNewBrandFormComponent } from './components/add-new-brand-form/add-new-brand-form.component';
import { StrainMasterService } from './services/strain-master.service';
import { StraintypeMasterComponent } from './components/straintype-master/straintype-master.component';
import { GeneticsMasterComponent } from './components/genetics-master/genetics-master.component';
import { NewBrandService } from './services/brand.service';
import { NewPackageTypeFormComponent } from './components/new-package-type-form/new-package-type-form.component';
import { PackagingTypesService } from './services/packagingtypes.service';
import { AddNewSubBrandFormComponent } from './components/add-new-sub-brand-form/add-new-sub-brand-form.component';
import { AddNewEmployeeComponent } from './components/add-new-employee/add-new-employee.component';
import { EmployeeListingComponent } from './components/employee-listing/employee-listing.component';
import { StrainTypeService } from './services/strain-type.service';
import { AddGeneticsActionService } from '../task/services/add-genetics-action.service';
import { GeneticsService } from './services/genetics.service';
import { TppPackageTypeMappingMasterComponent } from './components/tpp-package-type-mapping-master/tpp-package-type-mapping-master.component';
import { TPPPackageTypeActionService } from '../task/services/tpp-package-type-action.service';
import { TPPPackageTypeService } from './services/tpp-package-type.service';
import { ForgotPasswordService } from '../task/services/forgot-password.service';
import { TaskSettingComponent } from './components/task-setting/task-setting.component';
import { TaskSettingService } from './services/tasksetting.service';
import { EmployeesComponent } from './components/employees/employees.component';
import { AddNewTaskComponent } from './components/add-new-task/add-new-task.component';
import{ NewTaskActionService} from '../task/services/new-task-action.service';
import { RoomtypeMasterComponent } from './components/roomtype-master/roomtype-master.component';
import{NewRoomGenerationService} from './../task/services/new-room-generation.service';
import{NewFieldGenerationService} from './../task/services/new-field-generation.service';
import { ZonesComponent } from './components/zones/zones.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { RoomsTablesComponent } from './components/rooms-tables/rooms-tables.component';
import { FieldsComponent } from './components/fields/fields.component';
import { SectionsComponent } from './components/sections/sections.component';
import{NewSectionDetailsActionService} from './../task/services/add-section-details.service';
import { NewLabelDetailsActionService } from './../task/services/add-label-details.service';
import{NewARMDetailsActionService} from './../task/services/add-raw-material.service';
import { LabelsComponent } from './components/labels/labels.component';
import { HelpComponent } from './components/help/help.component';
import { FlcComponent } from './components/flc/flc.component';
import { PlantTerminationReasonsComponent } from './components/plant-termination-reasons/plant-termination-reasons.component';
import { AddRawMaterialComponent } from './components/add-raw-material/add-raw-material.component';
import { ChemicalPurchaseComponent } from './components/chemical-purchase/chemical-purchase.component';
import { ChemicalMasterPageComponent } from './components/chemical-master-page/chemical-master-page.component';
import { UpdateTerminationreasonComponent } from './components/update-terminationreason/update-terminationreason.component';
import { SectionDetailsComponent } from './components/section-details/section-details.component';
import { LabelDetailsComponent } from './components/label-details/label-details.component';
import { EmployeeSkillsetComponent } from './components/employee-skillset/employee-skillset.component';

import { MastersRoutingModule } from './Masters.routing';
import { CrewComponent } from './components/crew/crew.component';
import { CrewService} from './services/crew.service';
import { SubcrewComponent } from './components/subcrew/subcrew.component'

@NgModule({
  declarations: [
    NewProductTypeComponent,
    AddNewBrandComponent,
    AddNewStrainComponent,
    AddNewStraintypeComponent,
    AddNewPackagetypeComponent,
    AddNewSubBrandComponent,
    ProductTypeListingComponent,
    GrowerComponent,
    CityComponent,
    AddNewCountryComponent,
    TpProcessorComponent,
    RetailerComponent,
    AddNewClientComponent,
    AddNewStateComponent,
    ProductTypeListingComponent,
    AddNewEmployeeComponent,
    AddNewUserRoleComponent,
    EmployeeListingComponent,
    // AddNewBrandFormComponent,
    StrainMasterComponent,
    StraintypeMasterComponent,
    GeneticsMasterComponent,
    AddNewBrandFormComponent,
    NewPackageTypeFormComponent,
    AddNewSubBrandFormComponent,
    TppPackageTypeMappingMasterComponent,
    TaskSettingComponent,
    EmployeesComponent,
    AddNewSkewPopupComponent,
    AddNewTaskComponent,
    RoomtypeMasterComponent,
    ZonesComponent,
    RoomsComponent,
    RoomsTablesComponent,
    FieldsComponent,
    SectionsComponent,
    LabelsComponent,
    HelpComponent,
    FlcComponent,
    PlantTerminationReasonsComponent,
    AddRawMaterialComponent,
    ChemicalPurchaseComponent,
    ChemicalMasterPageComponent,
    UpdateTerminationreasonComponent,
    SectionDetailsComponent,
    LabelDetailsComponent,
    EmployeeSkillsetComponent,
    CrewComponent,
    SubcrewComponent
   
  ],
  imports: [
    SharedModule,
    MastersRoutingModule,
    TreeModule,
  
  ],
  providers: [
    NewProductTypeDetailsActionService,
    NewBrandActionService,
    NewStrainActionService,
    NewStrainTypeActionService,
    NewPackageTypeActionService,
    NewSubBrandActionService,
    NewProductTypeService,
    TpprocessorService,
    RetailerService,
    FLCService,
    PTRService,
    ChemicalMasterService,
    NewClientService,
    CityService,
    NewRoleActionService,
    NewEmployeeActionService,
    NewEmployeeService,
    StrainMasterService,
    NewEmployeeService,
    NewBrandService,
    PackagingTypesService,
    StrainTypeService,
    AddGeneticsActionService,
    GeneticsService,
    TPPPackageTypeActionService,
    TPPPackageTypeService,
    ForgotPasswordService,
    TaskSettingService,
    NewTaskActionService,
    NewRoomGenerationService,
    NewFieldGenerationService,
    NewSectionDetailsActionService,
    NewLabelDetailsActionService,
    NewARMDetailsActionService,
    GrowerDetailsActionService,
    CrewService
  ],
  exports: [
    NewProductTypeComponent,
    AddNewBrandComponent,
    AddNewStrainComponent,
    AddNewStraintypeComponent,
    AddNewPackagetypeComponent,
    AddNewSubBrandComponent,
    ProductTypeListingComponent,
    RetailerComponent,
    ProductTypeListingComponent,
    AddNewUserRoleComponent,
   // AddNewBrandFormComponent,
    AddNewBrandFormComponent,
    NewPackageTypeFormComponent,
    AddNewSubBrandFormComponent,
    TppPackageTypeMappingMasterComponent,
    TaskSettingComponent,
    AddNewSkewPopupComponent
  ]
})

export class MastersModule { }
