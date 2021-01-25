import { AddNewSkewPopupComponent } from './components/add-new-skew-popup/add-new-skew-popup.component';

import { NgModule } from '@angular/core';
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
import { CityComponent } from './components/city/city.component';
import { AddNewCountryComponent } from './components/add-new-country/add-new-country.component';
import { TpProcessorComponent } from './components/tp-processor/tp-processor.component';
import { TpprocessorService } from './services/tpprocessor.service';
import { RetailerComponent } from './components/retailer/retailer.component';
import { RetailerService } from './services/retailer.service';
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
    SectionsComponent
   
  ],
  imports: [
    SharedModule
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
    NewSectionDetailsActionService
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
