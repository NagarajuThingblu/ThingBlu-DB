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
        tenant: 'thingblub2ctest.onmicrosoft.com',
        clientID: '00f2482d-33d6-47a8-9639-39be906d926e',
        signUpSignInPolicy: 'B2C_1_SignUpInV2',
        signUpPolicy: 'B2C_1_SignUpV2',
        b2cScopes: ['https://thingblub2ctest.onmicrosoft.com/helloAPI/demo.read']
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
                redirectUri: 'http://localhost:8000/',
                state: '12345',
                navigateToLoginRequestUrl: false,
                // validateAuthority: false
            },
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
        return this.clientApplication.acquireTokenSilent(this.tenantConfig.b2cScopes)
            .then(token => {
                return token;
            })
            .catch(error => {
                this.clientApplication.acquireTokenRedirect(this.tenantConfig.b2cScopes);
                return Promise.resolve('');
            });
    }
}
