import { DefaultComponent } from './../default/default.component';
import { SharedModule } from './../shared/shared.module';

import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { TaskModule } from '../task/task.module';


@NgModule({
  declarations: [
    HomeComponent,
    DefaultComponent
  ],
  imports: [
    SharedModule,
    TaskModule
  ],
  exports: [
    HomeComponent, SharedModule, TaskModule, DefaultComponent
  ]
})

export class HomeModule { }
