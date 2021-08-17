
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import {TreeModule} from 'primeng/tree';
import {TreeNode} from 'primeng/api';
import { GrowerDetailsActionService } from './services/grower-details-action.service';

import { AssignTaskComponent } from './components/assign-task/assign-task.component';

import { LoadComponentDirective } from './directives/load-component.directive';
import { QuarantineComponent } from './components/taskparameters/quarantine/quarantine.component';
import { TaskCommonService } from './services/task-common.service';
import { TrimmingComponent } from './components/taskparameters/trimming/trimming.component';
import { SiftingComponent } from './components/taskparameters/sifting/sifting.component';
import { TaskactionsComponent } from './components/taskactions/taskactions.component';
import { SearchtaskComponent } from './components/searchtask/searchtask.component';

import { BudPackagingComponent } from './components/taskparameters/bud/bud-packaging/bud-packaging.component';
import { GrindingComponent } from './components/taskparameters/joints/grinding/grinding.component';
import { TampingComponent } from './components/taskparameters/joints/tamping/tamping.component';
import { TubingComponent } from './components/taskparameters/joints/tubing/tubing.component';
// tslint:disable-next-line:max-line-length

import { TaskResolver } from './resolvers/task.resolvers';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { SkewListResolver } from './resolvers/skew-list.resolver';
import { JointsCreationComponent } from './components/taskparameters/joints/joints-creation/joints-creation.component';
import { OilService } from './services/oil.service';
import { OilPackagingComponent } from './components/taskparameters/oil/oil-packaging/oil-packaging.component';
import { OilOutwordListingComponent } from './components/taskparameters/oil/oil-outword-listing/oil-outword-listing.component';
import { OilInwordListingComponent } from './components/taskparameters/oil/oil-inword-listing/oil-inword-listing.component';
import { CustomTaskComponent } from './components/taskparameters/custom-task/custom-task.component';
import { OrderFulfilmentQaCheckComponent } from './components/taskparameters/order-fulfilment-qa-check/order-fulfilment-qa-check.component';
import { PackageReplacementComponent } from './components/taskparameters/package-replacement/package-replacement.component';
import { BrandLabelReplacementComponent } from './components/taskparameters/brand-label-replacement/brand-label-replacement.component';
import { OilMaterialsInComponent } from './components/taskparameters/oil/oil-materials-in/oil-materials-in.component';
import { OilMaterialsOutComponent } from './components/taskparameters/oil/oil-materials-out/oil-materials-out.component';
import { TubeBrandLabelComponent } from './components/taskparameters/joints/tube-brand-label/tube-brand-label.component';
import { EmployeeAssignTaskComponent } from './components/employee-assign-task/employee-assign-task.component';
import { BudPkgAllocateEmployeeComponent } from './components/taskparameters/bud/bud-packaging/bud-pkg-allocate-employee/bud-pkg-allocate-employee.component';
import { HarvestingComponent } from './components/taskparameters/harvesting/harvesting.component';
import { PlantingComponent } from './components/taskparameters/planting/planting.component';
import { PrebuckingComponent } from './components/taskparameters/prebucking/prebucking.component';
import { BuckingComponent } from './components/taskparameters/bucking/bucking.component';
import { GrowertrimmingComponent } from './components/taskparameters/growertrimming/growertrimming.component';
import { D8DistillateComponent } from './components/taskparameters/d8-distillate/d8-distillate.component';



@NgModule({
  declarations: [
    AssignTaskComponent,
    LoadComponentDirective,
    QuarantineComponent,
    TrimmingComponent,
    SiftingComponent,
    TaskactionsComponent,
    SearchtaskComponent,
    BudPackagingComponent,
    GrindingComponent,
    TampingComponent,
    TubingComponent,
    OilMaterialsOutComponent,
    OilMaterialsInComponent,
    EditTaskComponent,
    JointsCreationComponent,
    OilPackagingComponent,
    OilOutwordListingComponent,
    OilInwordListingComponent,
    CustomTaskComponent,
    OrderFulfilmentQaCheckComponent,
    PackageReplacementComponent,
    BrandLabelReplacementComponent,
    TubeBrandLabelComponent,
    EmployeeAssignTaskComponent,
    BudPkgAllocateEmployeeComponent,
    HarvestingComponent,
    PlantingComponent,
    PrebuckingComponent,
    BuckingComponent,
    GrowertrimmingComponent,
    D8DistillateComponent,
  
    
  ],
  imports: [
    SharedModule,
    TreeModule
  ],
  providers: [GrowerDetailsActionService, TaskCommonService, TaskResolver, SkewListResolver, OilService],
  entryComponents: [ QuarantineComponent ],
  exports: [
     AssignTaskComponent, LoadComponentDirective, EmployeeAssignTaskComponent
  ]
})

export class TaskModule { }
