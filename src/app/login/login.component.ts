import { MsalService } from './../azureb2c/msal.service';
import { FieldsetModule } from 'primeng/fieldset';
import { AppCommonService } from './../shared/services/app-common.service';
import { AppConstants } from './../shared/models/app.constants';
import { LoaderService } from './../shared/services/loader.service';
import { environment } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service';
import { LoginResources } from './login.resources';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../shared/models/user.model';
import { GlobalResources } from '../global resource/global.resource';
import { AppComponent } from '../app.component';
import { Title } from '@angular/platform-browser';

const parser = require('ua-parser-js');
// import { StartupService } from '../shared/services/startup.service';
declare function unescape(s: string): string;
@Component({
  moduleId: module.id,
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public deviceInfo: any;
  public signOutID: any;
  public msgs: Message[] = [];
  public cipherText: any;
  public bytes: any;
  public isAuthenticated: boolean;
  public isUnAuthenticatedLogin: boolean;
  public adusernamepassword: any;
  public model: any = {};
  public returnUrl: string;
  public menuItems: any = [];
 public IsFirstTimeSignIn: any;
  public loginResources: any;
  public token: string;
  cookieValue;
  result;
  stringEscapeRegex: any = /[^ a-zA-Z0-9]/g;
  public userModel: UserModel;
  public globalResource: any;
  public userRoles: any;
  lastCookie = document.cookie; // 'static' memory between function calls
  currentUserLastCooKie: any;
  deviceDetails: any[];

  tempData: any;
  localBuildNo = '6';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private cookieService: CookieService,
    private appCommonService: AppCommonService,
    private loaderService: LoaderService,
    private msalService: MsalService,
    private titleService: Title
  ) {
    this.loaderService.display(true);
    this.cookieService.deleteAll('./');
    this.loginForm = this.fb.group({
      'username': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20)]))
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Thingblu');
    this.loginResources = LoginResources.getResources().en;
    this.globalResource = GlobalResources.getResources().en;
    this.userRoles = AppConstants.getUserRoles;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.checkBuildNumber();
    this.loaderService.display(false);
  }

  checkBuildNumber() {
    this.authenticationService.getBuildNumber(environment.clientCode)
      .subscribe(data => {
        if (data && Number(data) > Number(this.localBuildNo)) {
          this.localBuildNo = String(data);
          location.reload();
        }
      });
  }

  onSubmit(value: any) {
    this.msgs = [];
    this.msgs.push({ severity: 'info', summary: this.globalResource.applicationmsg, detail: 'Form Submitted' });
    const encryptedPwd = this.encode64(value.password);
    const decryptedpwd = this.decode64(encryptedPwd);

    const form = {
      'username': value.username,
      'password': encryptedPwd,
      'grant_type': 'password',
      'IpAddress': ''
    };

    if (this.loginForm.valid) {
      // this.model.username, this.model.password
      this.loaderService.display(true);
      this.authenticationService.login(form)
        .subscribe(
          (data: any) => {
            console.log(data);
            // this.router.navigate(['']);
            // login successful if there's a jwt token in the response
            const token = data.access_token;
            if (token) {
              // set token property
              this.token = token;
              const expireDate = new Date(new Date().getTime() + (1000 * (data.expires_in))).toUTCString();

              // Added by Devdan :: 27-Sep-2018 :: Set EncryptionKey to veriable
              this.appCommonService.encryptDecryptKey = data.EncryptDecryptKey;
              // Save the Encryption key into Local Storage and use the key from environment
              // alert('before encryption' + environment.parentEncryptionKey);
              localStorage.setItem('EncryptDecryptKey', this.appCommonService.EncryptKey(data.EncryptDecryptKey));
              this.setCookie('currentUser' + this.appCommonService.getEnvData().clientCode, this.appCommonService.Encrypt(JSON.stringify({
                username: value.username,
                access_token: token,
                expires_in: data.expires_in
              })), expireDate);

              this.isAuthenticated = true;
              this.isUnAuthenticatedLogin = false;
            } else {
              this.adusernamepassword = data.error.error_description;
              // return false to indicate failed login
              this.isAuthenticated = false;
              this.isUnAuthenticatedLogin = false;
              // if (this.msalService.isOnline()) {
              //   this.msalService.logout();
              // } else {
              //   this.msalService.login();
              // }
              this.router.navigate(['/login']);
            }

          },
          error => {
            this.isAuthenticated = false;
            this.isUnAuthenticatedLogin = false;
            this.bindDevicesDetails(error);
            this.loaderService.display(false);
          },
          () => this.getLoggedInUserData()
        );
    } else {
      this.appCommonService.validateAllFields(this.loginForm);
    }
  }

  setCookie(cname, cvalue, expiretime) {
    const expires = 'expires=' + expiretime;
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }
  bindDevicesDetails(error) {
    this.adusernamepassword = error.error.error_description;
    if (error.error.error_uri !== 'invalid_grant') {
      this.deviceDetails = JSON.parse(error.error.error_uri);
      if (this.deviceDetails.length > 0) {
        this.isUnAuthenticatedLogin = true;
        for (let i = 0; i < this.deviceDetails.length; i++) {
          this.signOutID = this.deviceDetails[i].Id;
          this.deviceInfo = parser(this.deviceDetails[i].DeviceName);
          this.deviceDetails[i].BrowserName = this.deviceInfo.browser.name;
          this.deviceDetails[i].DeviceName = this.deviceInfo.os.name + ' ' + this.deviceInfo.os.version;
        }
      }
    }
    this.loaderService.display(false);
  }
  onSignOutClick(id) {
    const LogOutObject = {
      'UserLog': {
        'Id': 1,
        'SignOutID': id,
        'SignAll': 0
      }
    };
    this.authenticationService.signOut(LogOutObject).subscribe(
      data => {
        if (data === 'Success') {
          alert('session sing out successfully!');
          this.isUnAuthenticatedLogin = false;
          this.isAuthenticated = true;
        }
      });
  }
  clickhere() {
    this.isUnAuthenticatedLogin = false;
    this.isAuthenticated = true;
    this.loginForm = this.fb.group({
      'username': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20)]))
    });
  }
  onSignOutAllClick(id) {
    const LogOutObject = {
      'UserLog': {
        'Id': 1,
        'SignOutID': id,
        'SignAll': 1
      }
    };
    this.authenticationService.signOut(LogOutObject).subscribe(
      data => {
        if (data === 'Success') {
          alert('session sing out successfully!');
          this.isUnAuthenticatedLogin = false;
          this.isAuthenticated = true;
        }
      });
  }
  getLoggedInUserData() {
    this.authenticationService.getUserProfile()
      .subscribe(
        (data: any) => {
          if (String(data).toLocaleUpperCase() !== 'NO DATA FOUND!') {
            this.userModel = <UserModel>data.Table[0];
            const expires_in =  this.appCommonService.getCurrentUser().expires_in;

            const expireDate = new Date (new Date().getTime() + (1000 * (expires_in))).toUTCString();

            this.setCookie('userProfile' + this.appCommonService.getEnvData().clientCode ,
            this.appCommonService.Encrypt(JSON.stringify(this.userModel)), expireDate);

         
            // Added Employee page access list in localstorage
            if (data.Table1.length > 0) {
              this.rolewiseMenuItem(data.Table1);
            } else {
              this.addSuperAdminPage();
            }

            this.menuItems = [];
            if (this.appCommonService.getRoleAccess()) {
              this.menuItems = this.appCommonService.getRoleAccess();
            }
            if (this.menuItems.length > 0) {
              this.menuItems = this.menuItems.filter(r => r.IsDefaultPage === 1);
              let routeName;
              if (this.menuItems.length > 0) {
                  routeName = this.menuItems[0].RouterLink;
                  this.router.navigate(['home/dashboard/' + routeName] );
                } else {
                  this.router.navigate(['home/erroraccessdenieded']);
              }
            } else {
              if (this.userModel.UserRole.toString() === this.userRoles.Manager) {
                this.router.navigate(['home/dashboard/managerdashboard']);
              } else if (this.userModel.UserRole.toString() === this.userRoles.SuperAdmin) {
                this.router.navigate(['home/dashboard/managerdashboard']);
              } else {
                this.router.navigate(['home/dashboard/empdashboard']);
              }
            }

            this.loaderService.display(false);
          }
      });
  }

  rolewiseMenuItem(menuItems) {
    if (this.appCommonService.getRoleAccess()) {
      this.appCommonService.removeItem('RoleAccess');
      this.appCommonService.setLocalStorage('RoleAccess', JSON.stringify(menuItems));
    } else {
      this.appCommonService.setLocalStorage('RoleAccess', JSON.stringify(menuItems));
    }
  }

  addSuperAdminPage() {
    if (this.appCommonService.getUserProfile().UserRole === 'SuperAdmin' ) {
      const roleMenu: any =  {};
      roleMenu.id = 0;
      roleMenu.label = 'Master Role Access';
      roleMenu.icon = 'fa-unlock-alt';
      roleMenu.routerLink = 'masteruserroleaccess';
      roleMenu.name = 'Master Role Access';
      roleMenu.num = 100;
      roleMenu.items = [];
      roleMenu.isParent = true ;
      roleMenu.parentId = 0;
      roleMenu.subState = 'inactive' ;
      roleMenu.arrow = 'pull-right-container';

      if (this.appCommonService.getRoleAccess()) {
        // localStorage.removeItem('RoleAccess' + this.appCommonService.getEnvData().clientCode);
        this.appCommonService.removeItem('RoleAccess');
        this.appCommonService.setLocalStorage('RoleAccess', JSON.stringify(roleMenu));
      } else {
        this.appCommonService.setLocalStorage('RoleAccess', JSON.stringify(roleMenu));
      }
    }
  }

  encode64(input) {

    input = this.escape(input);
    let output = '';
    let chr1: any = '', chr2: any = '', chr3: any = '';
    let enc1: any = '', enc2: any = '', enc3: any = '', enc4: any = '';
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

  // Decode Base64 PASSWORD
  decode64(input) {
    let output = '';
    let chr1: any = '', chr2: any = '', chr3: any = '';
    let enc1: any = '', enc2: any = '', enc3: any = '', enc4: any = '';
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

  stringEscapeFn(c) {
    return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
  }

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

  isString(value) { return typeof value === 'string'; }
  isNumber(value) { return typeof value === 'number'; }

  get diagnostic() { return JSON.stringify(this.loginForm.value); }

}
