import { environment } from './../../environments/environment';
import { UserModel } from './../shared/models/user.model';
import { LoaderService } from './../shared/services/loader.service';
import { Injectable } from '@angular/core';
import * as Msal from 'msal';

@Injectable()
export class MsalService {
    B2CTodoAccessTokenKey = 'b2c.todo.access.token';
    public userModel: UserModel;
    public menuItems: any = [];
    public userRoles: any;

    tenantConfig = {
        tenant: environment.tenant,
        clientID: environment.tenantClientID,
        signUpSignInPolicy: environment.signUpSignInPolicy,
        signUpPolicy: environment.signUpPolicy,
        b2cScopes: [environment.b2cScopes]
    };

    // Configure the authority for Azure AD B2C
    authority = 'https://login.microsoftonline.com/tfp/' + this.tenantConfig.tenant + '/' + this.tenantConfig.signUpSignInPolicy;

    logger = new Msal.Logger(this.loggerCallback, { level: Msal.LogLevel.Verbose, correlationId: '12345' });

    public clientApplication: Msal.UserAgentApplication;

    constructor(
        private loaderService: LoaderService
    ) {
        /** B2C SignIn SignUp Policy Configuration*/
        this.clientApplication = new Msal.UserAgentApplication(
            this.tenantConfig.clientID, this.authority,
            this.authCallback.bind(this),
            {
                cacheLocation: 'localStorage',
                logger: this.logger,
                storeAuthStateInCookie: true,
                redirectUri:  environment.redirectUri,
                state: '12345',
                navigateToLoginRequestUrl: false,
                postLogoutRedirectUri: environment.redirectUri
                // validateAuthority: false
            }
        );
    }

    authCallback(errorDesc: any, token: any, error: any, tokenType: any, userState: any) {
        this.loaderService.display(true);
    }

    loggerCallback(logLevel: any, message: any, piiEnabled: any) {
    }


    public login(): void {
        this.clientApplication.loginRedirect(this.tenantConfig.b2cScopes);
    }

    public logout(): void {
        this.clientApplication.logout();
    }

    public isOnline(): boolean {
        return this.clientApplication.getUser() != null;
    }

    public getUser(): any {
        return this.clientApplication.getUser();
    }

    public getAuthenticationToken(): Promise<string> {
        // return this.clientApplication.acquireTokenSilent(this.tenantConfig.b2cScopes)
        //     .then(token => {
        //         return token;
        //     })
        //     .catch(error => {
        //         this.clientApplication.acquireTokenRedirect(this.tenantConfig.b2cScopes);
        //         return Promise.resolve('');
        //     });

        return this.clientApplication.acquireTokenSilent(this.tenantConfig.b2cScopes)
            .then(token => {
                return token;
            }).catch(error => {
                return this.clientApplication.acquireTokenPopup(this.tenantConfig.b2cScopes)
                    .then(token => {
                        return token;
                    }).catch(innererror => {
                        return  Promise.resolve('');
                    });
            });
    }
    public getAllUsers() {
        return this.clientApplication.getAllUsers();
    }
}
