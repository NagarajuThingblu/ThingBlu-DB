import { HttpParams } from '@angular/common/http';
import { IdleUserService } from './../../idle-user.service';
import { AppCommonService } from './../services/app-common.service';
import { UserModel } from './../models/user.model';
import { Router } from '@angular/router';
import { MenuItem, SelectItem } from 'primeng/api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {MenubarModule} from 'primeng/menubar';
import { AuthenticationService } from '../services/authentication.service';
import { UserInterface } from '../interface/user.interface';
import { CookieService } from 'ngx-cookie-service';
import {DropdownModule} from 'primeng/dropdown';
import { LoaderService } from '../services/loader.service';
import { AppConstants } from '../models/app.constants';
import { AppComponent } from '../../app.component';
import { GlobalResources } from '../../global resource/global.resource';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { LoginResources } from '../../login/login.resources';
import { ResetPasswordService } from '../services/reset-password.service';
import { MsalService } from '../../azureb2c/msal.service';
import { HttpMethodsService } from '../services/http-methods.service';
// import { UserIdleService } from 'angular-user-idle/src/lib/user-idle.service';
declare function unescape(s: string): string;

@Component({
  moduleId: module.id,
  selector: 'app-header',
  templateUrl: 'header.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['header.component.css']
})
export class HeaderComponent implements OnInit {
    newProductTypeDetailsActionService: any;

  constructor(
      private fb: FormBuilder,
      private router: Router,
      private authenticationService: AuthenticationService,
      private cookieService: CookieService,
      private loaderService: LoaderService,
    //   private userIdle: UserIdleService,
      private appCommonService: AppCommonService,
      private resetPasswordService: ResetPasswordService,
      private idleUserService: IdleUserService,
      private msalService: MsalService,
      private httpMethodsService: HttpMethodsService
    ) {
        // this.autoLogoutService.clearInterval();
        // this.autoLogoutService.initVariables((<UserModel>this.appCommonService.getUserProfile()).IdleLogoutValue,
        //      (<UserModel>this.appCommonService.getUserProfile()).AutoLogoutValue);

        // this.autoLogoutService.check();
        // this.autoLogoutService.initListener();
        // this.autoLogoutService.initInterval();
    }
    ResetPasswordDetails = {
        currentPassword: null,
        newPassword: null
      };
  showResetPasswordModal: any;
  items: MenuItem[];
  item1: MenuItem[];
  public note: MenuItem[];
  public setting: MenuItem[];
  public showLogoutModal = false;

  public ngpassword: any;
  public loginResources: any;
  public username: any;
  public ClientId:any;
  stringEscapeRegex: any = /[^ a-zA-Z0-9]/g;
  lastCookie = document.cookie; // 'static' memory between function calls
  public token: string;
  cookieExpireDate: any;
  public isAuthenticated: boolean;
  currentUserLastCooKie: any;
  newReloginForm: FormGroup;
  resetPasswordForm: FormGroup;
  newPassword = 'newPassword';
  public globalResource: any;
  msgs: any[];
  isYes: any = false;
  public IsFirstTimeSignIn: any;
  heading: any;
  public closable: boolean = true;
  public loggedInUsername: string;
  public userInterface: UserInterface;
  public userModel: UserModel;
  public userRoles: any;
  public userRoleWisePageList: any;
  public headerimagtail :any;
  public headerimagesmall:any;

  ngOnInit() {
    this.isYes = false;
    // this.autoLogoutService.display(false);
    // this.autoLogoutService.showLogoutModal.subscribe(data => this.showLogoutModal = data);
// this.ShowForgotPasswordPopup();
    this.username = this.appCommonService.getUserProfile().UserName;
    this.ClientId= String(this.appCommonService.getUserProfile().ClientId);
    this.headerimagtail="assets/img/"+this.ClientId+"ThingBluNoTagline.png";
    this.headerimagesmall="assets/img/"+this.ClientId+"hannah-logo-small.png";
    this.heading = this.username + ' is logged in. Do you want to continue with this?';

    this.userModel = this.appCommonService.getUserProfile();
    this.userRoles = AppConstants.getUserRoles;
   
if(this.userModel.IsFirstTimeSignIn != false){
this.closable = false;
  this.ShowForgotPasswordPopup();
}
    this.globalResource = GlobalResources.getResources().en;

    // this.userIdle.setConfigValues({idle: 30, timeout: 30, ping: 10});

    // console.log(this.userIdle.getConfigValue());
    // // Start watching for user inactivity.
    // this.userIdle.startWatching();
    // // Start watching when user idle is starting.
    // this.userIdle.onTimerStart().subscribe(count => console.log(count));
    // // Start watch when time is up.
    // this.userIdle.onTimeout().subscribe(() => console.log('Time is up!'));

    // this.userIdle.ping$.subscribe(() => console.log('PING'));

      this.item1 = [
        // {
        //     label: 'Profile',
        //     icon: 'fa-user'
        // },
        // {
        //     label: 'Settings',
        //     icon: 'fa-gear'
        // },
        {
            label: 'Sign out',
            icon: 'fa-sign-out',
            command: () => {
                this.logOut();
                // this.msalLogout();
            }
        },
        {
            label: 'Reset password',
            icon: 'fa-sign-out',
            command: () => {
                this.ShowForgotPasswordPopup();
            }
        }
    ];

    this.note = [
        {
            label: 'We will not make the harvest schedule, take action. Email Kevin!',
            icon: 'fa-leaf'
        },
        {
            label: ' New Order #002 was just created',
            icon: 'fa-usd'
        },
        {
            label: 'Lot 10 items moved to Extraction now Batch #10',
            icon: 'fa-comment'
        },
        {
            label: 'All notifications'
        }
    ];
    this.setting = [
        {
            label: 'Email Kevin!',
            icon: 'fa-leaf'
        },
        {
            label: ' just created',
            icon: 'fa-usd'
        },
        {
            label: 'now Batch #10',
            icon: 'fa-comment'
        },
        {
            label: 'All notifications'
        }
    ];

      if (this.appCommonService.getUserProfile().UserRole === this.userRoles.Manager) {
          this.items = [
            {
              label: 'Lot Entry',
              icon: 'fa-page',
              'routerLink': 'lotentry'
            },
            {
                label: 'Order',
                items: [
                    {
                        label: 'Order Request Form',
                        icon: 'fa-plus',
                        'routerLink': 'orderrequestform'
                    },
                    {
                      label: 'Order Return Form',
                      icon: 'fa-plus',
                      'routerLink': 'orderreturn'
                    }
                ]
            },
            {
                label: 'Task',
                icon: 'fa-tasks',
                items: [
                    {label: 'Assign Task', icon: 'fa-plus', routerLink: 'assigntask' },
                    {label: 'Search Task', icon: 'fa-search', routerLink: 'searchtask' },
                ]
            },
            {
              label: 'Dashboard',
              icon: 'fa-dashboard',
              items: [
                  {label: 'Manager Dashboard', icon: 'fa-area-chart', routerLink: 'managerdashboard' },
                  {label: 'Whiteboards', icon: 'fa-area-chart', routerLink: 'whiteboards'},
              ]
            },
            {
              label: 'Oil Details',
              items: [
                  {label: 'Oil Processing Details', routerLink: 'oilmaterialsout' },
                  {label: 'Oil Return Processing Details', routerLink: 'oilmaterialsin' }
                ]
            }
        ];
      } else {
        this.items = [
          {
            label: 'Lot Entry',
            icon: 'fa-page',
            'routerLink': 'lotentry'
          },
          {
              label: 'Order',
              items: [
                  {
                      label: 'Order Request Form',
                      icon: 'fa-plus',
                      'routerLink': 'orderrequestform'
                  },
                  {
                    label: 'Order Return Form',
                    icon: 'fa-plus',
                    'routerLink': 'orderreturn'
                  }
              ]
          },
          {
              label: 'Task',
              icon: 'fa-tasks',
              items: [
                  {label: 'Assign Task', icon: 'fa-plus', routerLink: 'assigntask' },
                  {label: 'Search Task', icon: 'fa-search', routerLink: 'searchtask' },
              ]
          },
          {
            label: 'Dashboard',
            icon: 'fa-dashboard',
            items: [
                {label: 'Employee Dashboard', icon: 'fa-area-chart', routerLink: 'employeedahsboard' },
                {label: 'Whiteboards', icon: 'fa-area-chart', routerLink: 'whiteboards'},
            ]
          },
          {
            label: 'Oil Details',
            items: [
                {label: 'Oil Processing Details', routerLink: 'oilmaterialsout' },
                {label: 'Oil Return Processing Details', routerLink: 'oilmaterialsin' }
              ]
          }
      ];
      }

      // this.loginResources = new LoginResources();
      this.loginResources = LoginResources.getResources().en;
      // new product type form defination(reactive form)
  this.newReloginForm = this.fb.group({
    'password': new FormControl(null, Validators.required)
  });
  this.resetPasswordForm = this.fb.group({
    'currentPassword': new FormControl(null, [Validators.required, Validators.maxLength(20)]),
    'newPassword': new FormControl(null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])),
    'confirmPassword': new FormControl(null, Validators.required),
  });
  }

  // stop() {
  //   this.userIdle.stopTimer();
  // }

  // stopWatching() {
  //   this.userIdle.stopWatching();
  // }

  // startWatching() {
  //   this.userIdle.startWatching();
  // }

  // restart() {
  //   this.userIdle.resetTimer();
  // }
  onSubmit(value: any) {
    this.msgs = [];
    this.msgs.push({severity: 'info', summary: this.globalResource.applicationmsg, detail: 'Form Submitted'});

    // const encryptedPwd = this.encode64(value.password);
    const encryptedPwd = this.encode64(value.password);
    const decryptedpwd = this.decode64(encryptedPwd);

    // console.log('Enc Pwd :' + encryptedPwd);
    // console.log('decry Pwd :' + decryptedpwd);

    const form = {
    //   'username' : value.username,
      'username' : this.username,
      'password' : encryptedPwd,
      'grant_type' : 'password',
      'IpAddress': ''
    };

    if (this.newReloginForm.valid) {
    // this.model.username, this.model.password
    this.loaderService.display(true);
          this.authenticationService.login(form)
            .subscribe(
              (data: any) => {
                // this.router.navigate(['']);
                // login successful if there's a jwt token in the response
                        const token =  data.access_token;
                        if (token) {
                            // set token property
                            this.token = token;
                            const expireDate = new Date (new Date().getTime() + (1000 * (data.expires_in))).toUTCString();
                            this.cookieExpireDate = expireDate;
                            this.setCookie('currentUser' + this.appCommonService.getEnvData().clientCode, this.appCommonService.Encrypt(JSON.stringify({
                            //   username: value.username,
                              username: this.username,
                              access_token: token,
                              expires_in: data.expires_in
                            })), expireDate);

                            this.currentUserLastCooKie = JSON.stringify({
                            //   username: value.username,
                              username: this.username,
                              access_token: token,
                              expires_in: data.expires_in
                            });

                            // this.autoLogoutService.reset();
                            //// localStorage.setItem('currentUser', JSON.stringify({
                            //   username: value.username,
                            //   access_token: token
                            // }));
                            //// localStorage.setItem('currentUser',  token);
                            this.isAuthenticated = true;
                            // return true to indicate successful login
                            // this.router.navigate(['home']);
                        } else {
                            // return false to indicate failed login
                            this.isAuthenticated = false;
                            this.router.navigate(['/login']);
                        }

              },
              error => {
                this.isAuthenticated = false;
                this.loaderService.display(false);
                  console.log(error);
              },
              () => this.getLoggedInUserData()
            );
         } else {
        this.appCommonService.validateAllFields(this.newReloginForm);
      }
}
stringEscapeFn(c) {
    return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
  }
isString(value) {return typeof value === 'string'; }
isNumber(value) {return typeof value === 'number'; }
escape(value) {

    if (this.isString(value)) {
        return '' + value.replace(this.stringEscapeRegex, this.stringEscapeFn) + '';
    }

    if (this.isNumber(value)) {
      return value.toString();
    }

    if (value === true) {
      return 'true';
    }

    if (value === false) {
      return 'false';
    }

    if (value === null) {
      return 'null';
    }
    if (typeof value === 'undefined') {
      return 'undefined';
    }

  // throw $parseMinErr('esc', 'IMPOSSIBLE');
  throw new Error('IMPOSSIBLE');
}
getLoggedInUserData() {
    this.authenticationService.getUserProfile()
    .subscribe(
      (data: UserModel) => {
        this.userModel = data;
        const expires_in = this.appCommonService.getCurrentUser().expires_in;
        const expireDate = new Date (new Date().getTime() + (1000 * (expires_in))).toUTCString();

        this.setCookie('userProfile' + this.appCommonService.getEnvData().clientCode,
          this.appCommonService.Encrypt(JSON.stringify(this.userModel)), expireDate);
        this.lastCookie = document.cookie;


            this.isYes = false;
            this.newReloginForm.controls['password'].patchValue(null);
            this.newReloginForm.controls['password'].markAsPristine();

            this.loaderService.display(false);
      });
    }
encode64(input) {

    input = this.escape(input);
    let output = '';
    let chr1: any = '', chr2: any = '', chr3: any = '' ;
    let enc1: any = '', enc2: any = '', enc3: any = '', enc4: any = '' ;
    let i = 0;
    const keyStr: string = 'ABCDEFGHIJKLMNOP' + 'QRSTUVWXYZabcdef' + 'ghijklmnopqrstuv' + 'wxyz0123456789+/' + '=';

    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = '';
        enc1 = enc2 = enc3 = enc4 = '';
    } while (i < input.length);

    // Return encoded string
    return output;
  }
  decode64 (input) {
    let output = '';
    let chr1: any = '', chr2: any = '', chr3: any = '' ;
    let enc1: any = '', enc2: any = '', enc3: any = '', enc4: any = '' ;
    let i = 0;
    const keyStr = 'ABCDEFGHIJKLMNOP' + 'QRSTUVWXYZabcdef' + 'ghijklmnopqrstuv' + 'wxyz0123456789+/' + '=';

    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    const base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
        alert('There were invalid base64 characters in the input text.\n'
          + 'Valid base64 characters are A-Z, a-z, 0-9, \'+\', \'/\',and \'=\'\n' + 'Expect errors in decoding.');
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

    do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = '';
        enc1 = enc2 = enc3 = enc4 = '';

    } while (i < input.length);
    // Return decoded string
     return unescape(output);
    // return output;
  }

  setCookie(cname, cvalue, expiretime) {
    const expires = 'expires=' + expiretime;
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  doNothing() {
    return true;
  }
  doLogOut() {
    this.isYes = false;
    // this.newReloginForm.value.password = null;
    this.newReloginForm.controls['password'].patchValue(null);
    this.newReloginForm.controls['password'].markAsPristine();
    // document.body.removeEventListener('click', this.autoLogoutService.reset, true);
    // document.body.removeEventListener('keyup', this.autoLogoutService.reset, true);

    // this.autoLogoutService.display(false);
    // this.logOut();
  }

  showPTextBox() {
      this.isYes = true;
      this.newReloginForm.value.password = null;
  }

  logoClick() {
    if (this.appCommonService.getUserProfile().UserRole === this.userRoles.Manager) {
      this.router.navigate(['home/managerdashboard']);
    } else {
      this.router.navigate(['home/empdashboard']);
    }
  }
  ShowForgotPasswordPopup() {
    this.showResetPasswordModal = true;
  }
  hideResetPasswordPopup() {
    this.showResetPasswordModal = false;
    this.clearResetPasswordForm();
  }
  clearResetPasswordForm() {
    this.resetPasswordForm.reset();
    this.ResetPasswordDetails = {
        currentPassword: null,
        newPassword: null
      };
  }
  submitResetPassword() {
    const newPassword = this.resetPasswordForm.value.newPassword;
    const confirmPassword = this.resetPasswordForm.value.confirmPassword;

    if (((newPassword !== '' && newPassword !== null)
        && (confirmPassword !== '' && confirmPassword !== null))) {
        if (String(newPassword).trim() !== String(confirmPassword).trim()) {
          this.resetPasswordForm.controls['confirmPassword'].setErrors({ 'passwordnotmatched': true});
        }
    }

    // if ((oldPassword !== '' && oldPassword !== null) && (newPassword !== '' && newPassword !== null)) {
    //   if (oldPassword === newPassword) {
    //     this.resetPasswordForm.controls['newPassword'].setErrors({ 'passwordmatched': true});
    //   }}

      let resetPasswordDetailsForApi;
      resetPasswordDetailsForApi = {
        ResetPasswordUserDetails: {
          EmpId: this.appCommonService.getUserProfile().EmpId,
          UserName: this.appCommonService.getUserProfile().UserName,
          CurrentPassword: this.encode64(String(this.resetPasswordForm.value.currentPassword).trim()),
          NewPassword: this.encode64(String(this.resetPasswordForm.value.newPassword).trim())
        }
      };
      // console.log(resetPasswordDetailsForApi);
      if (this.resetPasswordForm.valid) {
         // http call starts
         this.loaderService.display(true);
        this.resetPasswordService.resetPassword(resetPasswordDetailsForApi)
        .subscribe(
            data => {
              // console.log(data);
              this.msgs = [];
              if (String(data).toLocaleUpperCase() === 'SUCCESS') {
                this.msgs = [];
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.loginResources.passwordResertSuccess });
                this.hideResetPasswordPopup();
                this.router.navigate(['login']);
              } else if (String(data).toLocaleUpperCase() === 'NOTMATCHED') {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.loginResources.invalidDetails });
              } else if (String(data).toLocaleUpperCase() === 'OLDNEWPASSWORDSAME') {
                this.resetPasswordForm.controls['newPassword'].setErrors({ 'passwordmatched': true});
              } else if (String(data).toLocaleUpperCase() === 'FAILURE') {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg,
                 detail: this.globalResource.serverError });
              } else {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
              }
                // http call end
                this.loaderService.display(false);
            },
            error => {
              this.msgs = [];
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
              // http call end
              this.loaderService.display(false);
            });
      } else {
        this.appCommonService.validateAllFields(this.resetPasswordForm);
      }
    }
  logOut() {
    this.loaderService.display(true);
           this.authenticationService.logOut()
      .subscribe(
          (data: any) => {
            this.appCommonService.clearUserSession();

            this.idleUserService.logout();
            // this.msalService.logout();

            // console.log( this.cookieService.get('currentUser'));
            console.log('logout api success');
            // this.AppComponentData.setTitle('Th!ngblu');
          },
          error => {
          //  this.router.navigate(['/login']);
         // if (this.msalService.isOnline()) {
            this.msalService.logout();
         // } else {
           // this.msalService.login();
         // }
            this.loaderService.display(false);
              console.log(error);
          },
          () => {
          //  if (this.msalService.isOnline()) {
              this.msalService.logout();
           // } else {
          //    this.msalService.login();
          //
        //  }
           // this.router.navigate(['/login']);
          }
      );

      this.loaderService.display(false);
  }

  msalLogout() {
    this.msalService.logout();
  }

  managerSignUp() {
    let params = new HttpParams();
    params = params.append('AzureUserId', this.msalService.getUser().userIdentifier);

    this.httpMethodsService.post('api/Login/AddAzureLocalUser', null)
      .subscribe(
        (data: any) => {
          if (data) {
            alert('ok');
          }
        });
      }

      navinfo(){
        this.router.navigate(['../home/help']);
      }
}
