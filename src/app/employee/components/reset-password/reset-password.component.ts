import { ResetPasswordMsalService } from './../../../azureb2c/reset-password-msal.service';
import { MsalService } from './../../../azureb2c/msal.service';
import { IdleUserService } from './../../../idle-user.service';
import { HttpMethodsService } from './../../../shared/services/http-methods.service';
import { LoaderService } from './../../../shared/services/loader.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {

  constructor(private loaderService: LoaderService,
    private msalService: MsalService,
    private httpMethodsService: HttpMethodsService,
    private resetPasswordMsalService: ResetPasswordMsalService,
    private idleUserService: IdleUserService,
    ) { }

  ngOnInit() {
     this.loaderService.display(false);
    // alert('a');
  //  this. updateEmpInfo(this.msalService.getUser().idToken['oid']);
  }
  redirectClick() {
    this.resetPasswordMsalService.resetPassword();
      }

      updateEmpInfo(iD) {
        let updateUserApiDetails: any;
        updateUserApiDetails = {
          AzureUserIs: iD };
          this.httpMethodsService.post('api/Employee/UpdateAzureUserFlag', updateUserApiDetails)
          .subscribe((result: any) => {
            if (String(result[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
            }
            // this.msalService.logout();
          });
      }
}
