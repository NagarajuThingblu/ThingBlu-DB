import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { UpdateEmployeeComponent } from './components/update-employee/update-employee.component';

import { AddEmployeeComponent } from './components/add-employee/add-employee.component';

import { NgModule, Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EmployeesComponent } from './components/employees/employees.component';
import { InviteNewEmployeeComponent } from './components/invite-new-employee/invite-new-employee.component';

@NgModule({
  declarations: [ EmployeesComponent, InviteNewEmployeeComponent, AddEmployeeComponent,
    UpdateEmployeeComponent,
    ResetPasswordComponent
   ],
  imports: [
    SharedModule
  ],
  providers: [],
  exports: [
  ]
})

export class EmployeeModule { }
