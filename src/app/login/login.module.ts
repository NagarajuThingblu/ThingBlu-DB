import { LoginResources } from './login.resources';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { LoginComponent } from './login.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { SharedModule } from '../shared/shared.module';

import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    HttpModule,
  ],
  declarations: [LoginComponent, ForgotPasswordComponent],
  providers: [],
  exports: [ LoginComponent ]
})
export class LoginModule { }
