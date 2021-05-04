
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';

import { NgModule, Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EmployeesComponent } from './components/employees/employees.component';
import { InviteNewEmployeeComponent } from './components/invite-new-employee/invite-new-employee.component';
import { EmployeeRoutingModule } from './employee.routing';
@NgModule({
  declarations: [ EmployeesComponent, InviteNewEmployeeComponent, AddEmployeeComponent,
   ],
  imports: [
    SharedModule,
    EmployeeRoutingModule
  ],
  providers: [],
  exports: [
  ]
})

export class EmployeeModule { }
