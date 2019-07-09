import { MsalService } from './azureb2c/msal.service';
import { ResetPasswordMsalService } from './azureb2c/reset-password-msal.service';
import { Component, OnInit } from '@angular/core';
import { LoaderService } from './shared/services/loader.service';
import { Title } from '@angular/platform-browser';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {
    title = 'app';
    showLoader: boolean;

    constructor(
        private loaderService: LoaderService,
        private titleService: Title,
        private resetPasswordMsalService: ResetPasswordMsalService
    ) {
    }

    public setTitle( newTitle: string) {
        this.titleService.setTitle( newTitle );
    }

    ngOnInit(): void {
        this.loaderService.status.subscribe((val: boolean) => {
            this.showLoader = val;
        });
        // if (this.isForgotPassword()) {
        //     this.resetPasswordMsalService.resetPassword();
        // }
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
}

