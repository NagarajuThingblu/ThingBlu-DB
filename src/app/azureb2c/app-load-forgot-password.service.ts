import { MsalService } from './msal.service';
import { AppCommonService } from '../shared/services/app-common.service';
import { ResetPasswordMsalService } from './reset-password-msal.service';
import { LoaderService } from '../shared/services/loader.service';
import { Injectable, Injector } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import * as Msal from 'msal';
import { environment } from '../../environments/environment';

@Injectable()
export class AppLoadFOrgotPasswordService {
    constructor(
        private resetPassowrdservice: ResetPasswordMsalService,
        private msalService: MsalService
    ) {
    }

    isForgotPassword() {
        const errorDesc = localStorage.getItem('msal.error.description');
        if (errorDesc && errorDesc.indexOf('AADB2C90118') > -1) {
            return true;
        } else {
            return false;
        }
      }

      isForgotPasswordCancel() {
        const errorDesc = localStorage.getItem('msal.error.description');
        if (errorDesc && errorDesc.indexOf('AADB2C90091') > -1) {
            return true;
        } else {
            return false;
        }
      }

    initializeApp(): Promise<any> {
        return new Promise((resolve, reject) => {
          if (this.isForgotPassword()) {
              this.resetPassowrdservice.resetPassword();
            } else  if (this.isForgotPasswordCancel()) {
               this.msalService.logout();
              } else {
                resolve('');
              }
        });
    }
}
