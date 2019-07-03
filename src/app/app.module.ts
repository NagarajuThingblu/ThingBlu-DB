import { MsalModule } from './msal.module';
import { EmployeeModule } from './employee/employee.module';
import { Azureb2cModule } from './azureb2c/azureb2c.module';
import { AppLoadService } from './azureb2c/app-load.service';
import { ReportsModule } from './reports/reports.module';
import { AdminModule } from './admin/admin.module';
import { HomeModule } from './home/home.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, LOCALE_ID  } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoginModule } from './login/login.module';

import { AppComponent } from './app.component';

import { routing } from './app.routing';

import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { TaskModule } from './task/task.module';
import { OrderModule } from './order/order.module';

import { SharedModule } from './shared/shared.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { StartupService } from './shared/services/startup.service';
import {HttpModule} from '@angular/http';
import { LotModule } from './lot/lot.module';
import { LoaderService } from './shared/services/loader.service';
import { MastersModule } from './Masters/Masters.module';

import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { NgIdleModule } from '@ng-idle/core';
import { MsalService } from './azureb2c/msal.service';
import { ResetPasswordMsalService } from './azureb2c/reset-password-msal.service';
import { promise } from 'protractor';

// import { UserIdleModule } from 'angular-user-idle/user-idle.module';

// export function startupServiceFactory(startupService: StartupService): Function {
//   return () => startupService.load();
// }

export function init_app(appLoadService: AppLoadService) {
  return () => appLoadService.initializeApp();
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    LoginModule,
    SharedModule.forRoot(),
    TaskModule,
    LotModule,
    OrderModule,
    HomeModule,
    DashboardModule,
    routing,
    HttpClientModule,
    HttpModule,
    MastersModule,
    BrowserAnimationsModule,
    ProgressSpinnerModule,
    // NgIdleKeepaliveModule.forRoot(),
    NgIdleModule.forRoot(),
      // Optionally you can set time for `idle`, `timeout` and `ping` in seconds.
    // Default values: `idle` is 600 (10 minutes), `timeout` is 300 (5 minutes)
    // and `ping` is 120 (2 minutes).
    // UserIdleModule.forRoot({idle: 300, timeout: 300, ping: 100})
    AdminModule,
    ReportsModule,
    Azureb2cModule,
    EmployeeModule,
    MsalModule
  ],
  exports: [NgIdleModule],
  providers: [
    StartupService,
    LoaderService,
    MsalService,
    ResetPasswordMsalService,
    AppLoadService,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi: true }
    // {
    //   provide: LOCALE_ID,
    //   useValue: 'en-US'
    // }
    // {
    //     // Provider for APP_INITIALIZER
    //     provide: APP_INITIALIZER,
    //     useFactory: startupServiceFactory,
    //     deps: [StartupService],
    //     multi: true
    // },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
