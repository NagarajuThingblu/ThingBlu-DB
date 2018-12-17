import { SharedModule } from './../shared/shared.module';

import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { TaskModule } from '../task/task.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    SharedModule,
    TaskModule
  ],
  exports: [
    HomeComponent, SharedModule, TaskModule
  ]
})

export class HomeModule { }
