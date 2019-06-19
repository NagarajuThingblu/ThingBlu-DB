import { ResetPasswordMsalService } from './../reset-password-msal.service';
import { MsalService } from './../msal.service';
import { environment } from './../../../environments/environment.prod';
import { HttpMethodsService } from './../../shared/services/http-methods.service';
import { Component, OnInit } from '@angular/core';
import { LoaderService } from './../../shared/services/loader.service';

@Component({
  moduleId: module.id,
  selector: 'app-app-signup',
  templateUrl: 'app-signup.component.html'
})
export class AppSignupComponent implements OnInit {

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
      AzureUserIs: iD
    };
    this.httpMethodsService.post('api/Employee/UpdateAzureUserFlag', updateUserApiDetails)
      .subscribe((result: any) => {
        this.loaderService.display(false);
        this.msalService.logout();
      });

  }

}
