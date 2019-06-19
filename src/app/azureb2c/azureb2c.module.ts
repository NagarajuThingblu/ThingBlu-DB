import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AppSignupComponent } from './app-signup/app-signup.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule
    ],
    declarations: [AppSignupComponent, ResetPasswordComponent],
    providers: [],
    exports: [AppSignupComponent]
})
export class Azureb2cModule { }
