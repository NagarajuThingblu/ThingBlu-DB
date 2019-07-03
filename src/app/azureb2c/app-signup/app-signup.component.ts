import { ResetPasswordMsalService } from './../reset-password-msal.service';
import { MsalService } from './../msal.service';
import { HttpMethodsService } from './../../shared/services/http-methods.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoaderService } from './../../shared/services/loader.service';

@Component({
  moduleId: module.id,
  selector: 'app-app-signup',
  templateUrl: 'app-signup.component.html'
})
export class AppSignupComponent implements OnInit  {
public isPasswordResetSuccess = false;

  constructor(
    private loaderService: LoaderService,
    private msalService: MsalService,
    private httpMethodsService: HttpMethodsService,
    private resetPasswordMsalService: ResetPasswordMsalService
  ) { }

  ngOnInit() {
    console.log('app-signup component on init');
    this.updateEmpInfo(this.msalService.getUser().idToken['oid']);
  }

  redirectClick() {
    this.resetPasswordMsalService.resetPassword();
  }

  msalLogout() {
    this.msalService.logout();
  }

  updateEmpInfo(iD) {
    let updateUserApiDetails: any;
    updateUserApiDetails = {
      AzureUserId: iD
    };
    this.httpMethodsService.post('api/Employee/UpdateAzureUserFlag', updateUserApiDetails)
      .subscribe((result: any) => {
        this.loaderService.display(false);
        this.msalService.logout();
        this.isPasswordResetSuccess = true;
      });

  }

}
