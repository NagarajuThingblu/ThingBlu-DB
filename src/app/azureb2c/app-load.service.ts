import { AppCommonService } from './../shared/services/app-common.service';
import { ResetPasswordMsalService } from './reset-password-msal.service';
import { LoaderService } from './../shared/services/loader.service';
import { Injectable, Injector } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import * as Msal from 'msal';
import { environment } from './../../environments/environment';

@Injectable()
export class AppLoadService {

    private clientApplicationRef: Msal.UserAgentApplication;

    B2CTodoAccessTokenKey = 'b2c.todo.access.token';

    tenantConfig = {
        tenant:  environment.tenant,
        clientID: environment.tenantClientID  ,
        signUpSignInPolicy: environment.signUpSignInPolicy ,
        signUpPolicy: environment.signUpPolicy,
        resetPolicy: environment.resetPolicy,
        b2cScopes: [environment.b2cScopes],
        tenantURL:environment.tenantURL
    };

    // Configure the authority for Azure AD B2C
    authority = 'https://'+this.tenantConfig.tenantURL+'/tfp/' + this.tenantConfig.tenant + '/' + this.tenantConfig.signUpSignInPolicy;
    //authority = 'https://thingblub2ctest.b2clogin.com/tfp/' + this.tenantConfig.tenant + '/' + this.tenantConfig.signUpSignInPolicy;

    logger = new Msal.Logger(this.loggerCallback, { level: Msal.LogLevel.Verbose, correlationId: '12345' });

    constructor(
        private loaderService: LoaderService
    ) {
        this.clientApplicationRef = new Msal.UserAgentApplication(
            this.tenantConfig.clientID, this.authority,
            (errorDesc: any, token: any, error: any, tokenType: any, userState: any) => {
                // Code after loginRedirect or aquireLoginPopup

            },
            {
                cacheLocation: 'localStorage',
                logger: this.logger,
                storeAuthStateInCookie: true,
                state: '12345',
                redirectUri:  environment.redirectUri,
                navigateToLoginRequestUrl: false,
               // postLogoutRedirectUri: environment.redirectUri
                 validateAuthority: false
            },
        );
    }

    loggerCallback(logLevel: any, message: any, piiEnabled: any) {
        console.log(message);
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
            if (window.location.href.toString().indexOf('/resetsuccess/') > 0) {
                resolve('');
             } else if (this.isForgotPassword() || this.isForgotPasswordCancel()) {
                resolve('');
            } else {
                this.loaderService.display(true);
                // this.clientApplicationRef.logout();
                console.log(this.clientApplicationRef.getUser());
                    this.clientApplicationRef.acquireTokenSilent(this.tenantConfig.b2cScopes)
                        .then(token => {
                            localStorage.setItem(this.B2CTodoAccessTokenKey, token);
                            resolve(token);
                        }).catch(error => {
                            this.clientApplicationRef.acquireTokenPopup(this.tenantConfig.b2cScopes)
                                .then(token => {
                                    localStorage.setItem(this.B2CTodoAccessTokenKey, token);
                                    resolve(token);
                                }).catch(innererror => {
                                    this.clientApplicationRef.acquireTokenRedirect(this.tenantConfig.b2cScopes);
                                    console.error('Could not retrieve token from popup.', innererror);
                                    resolve('');
                                });
                        });
            }
        });
    }
}
