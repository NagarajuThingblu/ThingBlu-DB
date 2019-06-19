import { LoaderService } from './../shared/services/loader.service';
import { Injectable, Injector } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import * as Msal from 'msal';

@Injectable()
export class AppLoadService {

    private clientApplicationRef: Msal.UserAgentApplication;

    B2CTodoAccessTokenKey = 'b2c.todo.access.token';

    tenantConfig = {
        tenant: 'thingblub2ctest.onmicrosoft.com',
        clientID: '00f2482d-33d6-47a8-9639-39be906d926e',
        signUpSignInPolicy: 'B2C_1_SignUpInV2 ',
        signUpPolicy: 'B2C_1_SignUp',
        resetPolicy: 'B2C_1_ResetPassword',
        b2cScopes: ['https://thingblub2ctest.onmicrosoft.com/helloAPI/demo.read']
    };

    // Configure the authority for Azure AD B2C
    authority = 'https://login.microsoftonline.com/tfp/' + this.tenantConfig.tenant + '/' + this.tenantConfig.signUpSignInPolicy;

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
                redirectUri: 'http://localhost:8000/',
                navigateToLoginRequestUrl: false,
                // validateAuthority: false
            },
        );
    }

    loggerCallback(logLevel: any, message: any, piiEnabled: any) {
        console.log(message);
    }

    initializeApp(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (String(window.location.href).indexOf('register?inviteToken') > 0) {
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
