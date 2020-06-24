import { MsalService } from './msal.service';
import { UserModel } from './../shared/models/user.model';
import { LoaderService } from './../shared/services/loader.service';
import { Injectable } from '@angular/core';
import * as Msal from 'msal';
import { environment } from './../../environments/environment';

@Injectable()
export class ResetPasswordMsalService {
    B2CTodoAccessTokenKey = 'b2c.todo.access.token';
    public userModel: UserModel;
    public menuItems: any = [];
    public userRoles: any;

    tenantConfig = {
        tenant: environment.tenant,
        clientID: environment.tenantClientID,
        resetPolicy: environment.resetPolicy,
        b2cScopes: [environment.b2cScopes],
        tenantURL:environment.tenantURL
    };

    resetPasswordAuthority = 'https://'+this.tenantConfig.tenantURL+'/tfp/' + this.tenantConfig.tenant + '/' + this.tenantConfig.resetPolicy;
    //resetPasswordAuthority = 'https://thingblub2ctest.b2clogin.com/tfp/' + this.tenantConfig.tenant + '/' + this.tenantConfig.resetPolicy;
    logger = new Msal.Logger(this.loggerCallback, { level: Msal.LogLevel.Verbose, correlationId: '12345' });
    private signUpClientApplication: Msal.UserAgentApplication;

    constructor(
        private loaderService: LoaderService,
        private msalService: MsalService,
    ) {

        this.signUpClientApplication = new Msal.UserAgentApplication(
            this.tenantConfig.clientID, this.resetPasswordAuthority,
            this.authCallback.bind(this),
            {
                cacheLocation: 'localStorage',
                logger: this.logger,
                redirectUri: environment.resetPwdRedirectUri,
                state: '12345',
                storeAuthStateInCookie: true,
                validateAuthority: false
            }
        );
    }

    loggerCallback(logLevel: any, message: any, piiEnabled: any) {
    }

    public logout(): void {
        this.signUpClientApplication.logout();
    }

    public isOnline(): boolean {
        return this.signUpClientApplication.getUser() != null;
    }

    public resetPassword(): void {
        const abc = '1';
        localStorage.setItem('ABC', abc);
        this.signUpClientApplication.loginRedirect(this.tenantConfig.b2cScopes);
    }

    authCallback(errorDesc: any, token: any, error: any, tokenType: any, userState: any) {
        this.loaderService.display(false);
    }

    public getAuthenticationToken(): Promise<string> {
        return this.signUpClientApplication.acquireTokenSilent(this.tenantConfig.b2cScopes)
            .then(token => {
                return token;
            })
            .catch(error => {
                this.signUpClientApplication.acquireTokenRedirect(this.tenantConfig.b2cScopes);
                return Promise.resolve('');
            });
    }
}
