import { UserRolePermissionService } from './services/user-role-permission.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterUserRoleAccessComponent } from './components/master-user-role-access/master-user-role-access.component';
import { SharedModule } from '../shared/shared.module';
import {TreeModule} from 'primeng/tree';




@NgModule({
  declarations: [
    MasterUserRoleAccessComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TreeModule
  ],
  exports: [
    MasterUserRoleAccessComponent
  ],
  providers: [
UserRolePermissionService
  ]
})
export class AdminModule { }
