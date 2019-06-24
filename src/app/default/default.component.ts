import { HttpParams } from '@angular/common/http';
import { MsalService } from '../azureb2c/msal.service';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, ElementRef, Renderer2, OnDestroy, HostListener } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Title } from '@angular/platform-browser';
import { IdleUserService } from '../idle-user.service';
import { AppCommonService } from '../shared/services/app-common.service';
import { LoaderService } from '../shared/services/loader.service';
import { AuthenticationService } from '../shared/services/authentication.service';
import { Router } from '@angular/router';
import { UserModel } from '../shared/models/user.model';
import { CookieService } from 'ngx-cookie-service';
import { GlobalResources } from '../global resource/global.resource';
import { HttpMethodsService } from '../shared/services/http-methods.service';

@Component({
  moduleId: module.id,
  selector: 'app-default',
  templateUrl: 'default.component.html',
  animations: [
    trigger('bodyLeftRight', [
      state('left', style({

        paddingLeft: '0px'
      })),
      state('bigLeft', style({
        paddingLeft: '50px'
        // transform: 'translateX(280px)'
      })),
      state('right', style({
        paddingLeft: '271px'
        // transform: 'translateX(280px)'
      })),
      transition('left <=> right', animate('150ms ease')),
      transition('bigLeft => right', animate('150ms ease'))
    ]),
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(-230px, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('smallDeviceIn', style({
        transform: 'translate3d(-101%, 0, 0)'
      })),
      transition('in <=> out', animate('250ms ease')),
      transition('smallDeviceIn <=> out', animate('250ms ease')),
    ])
  ]
})
export class DefaultComponent implements OnInit, OnDestroy {
  newReloginForm: FormGroup;
  menuState = 'out';
  bodystates = 'right';
  public inputClass: any = 'big';
  public windowInnerSize: any;
  public getMenuStatusOnResize: any;
  public getMenuClassOnResize: any;
  public username: any;
  heading: any;
  menustatus = false;
  timer: any;
  public isOn: any = true;
  showLogoutModal = false;
  public isAuthenticated: boolean;
  public userModel: UserModel;

  public logoutModalObject = {
    count: 0,
    progressCount: 0,
    countMinutes: 0,
    countSeconds: 0,
    loggedOut: false
  };
  public globalResource: any;

  public isNewUser = false;
  public userRoles: any;
  public menuItems: any = [];

  constructor(private fb: FormBuilder,
    private titleService: Title,
    private appCommonService: AppCommonService,
    private _element: ElementRef,
    private idleUserService: IdleUserService,
    private loaderService: LoaderService,
    private authenticationService: AuthenticationService,
    private cookieService: CookieService,
    private router: Router,
    private msalService: MsalService,
    private httpMethodsService: HttpMethodsService
  ) {
    this.screenwidthfind();
    // this.idleUserService.initiaization(_element);
  }

  ngOnInit() {
    // this.msalService.logout();
    this.titleService.setTitle('Default');
    this.globalResource = GlobalResources.getResources().en;
    // this.idleUserService.showLogoutModal.subscribe(data => this.showLogoutModal = data);
    // this.idleUserService.LogoutModalParams.subscribe(data => {
    //   this.logoutModalObject = data;

    //   if (this.logoutModalObject.loggedOut) {
    //     this.logOut();
    //   }
    // });

    // this.username = this.appCommonService.getUserProfile().UserName;
    // this.heading = this.username + ' is logged in. Do you want to continue with this?';
    // this.msalService.logout();
    if (this.msalService.getUser().idToken['newUser']) {
      if (this.msalService.isOnline()) {
        const userData = this.msalService.getUser();
        // this.router.navigate(['/signup']);
        let signupDetailsForApi: any;
        signupDetailsForApi = {
          UserSignupDetails: {
            Id: 0,
            UserName: userData.idToken['emails'][0],
            AzureUserId: userData.userIdentifier,
            EmailId: userData.idToken['emails'][0],
            IsNewUser: userData.idToken['newUser'],
            FirstName: userData.idToken['given_name'],
            LastName: userData.idToken['family_name'],
            City: userData.idToken['city'],
            ClientId: 16
          }
        };
        const url = 'api/Login/UserSignup';
        this.httpMethodsService.post(url, signupDetailsForApi).subscribe(
          (data: any) => {
            this.isNewUser = true;
            // this.router.navigate(['/resetpassword']);
            // if (String(data).toLocaleUpperCase() !== 'NO DATA FOUND!') {
            //   if (String(data[0].ResultKey === 'Success')) {

            //     this.confirmationService.confirm({
            //       message: 'You are signed up successfully.',
            //       key: 'draftconfirm',
            //       rejectVisible: false,
            //       acceptLabel: 'Ok',
            //       accept: () => {
            //         this.msalService.logout();
            //       }
            //     });
            //   }
            // }
          }
        );
      }
      //  this.msalService.logout();
    } else {
      // if ( this.msalService.clientApplication.validateAuthority) {
      //   let abc = '';
      //   if (localStorage.getItem('ABC')) {
      //   abc =   localStorage.getItem('ABC');
      //   if (abc === '1') {
      //     abc = '0';
      //     this. updateEmpInfo(this.msalService.getUser().idToken['oid']);
      //     localStorage.setItem('ABC', abc);
      //   }
      //   }
      // }
      if (this.msalService.isOnline()) {
        this.loaderService.display(true);

        let params = new HttpParams();
        params = params.append('AzureUserId', this.msalService.getUser().idToken['oid']);
        this.httpMethodsService.get('api/Login/GetSignInUserDetails', { params: params })
          .subscribe(
            (data: any) => {

              if (String(data).toLocaleUpperCase() !== 'NO DATA FOUND!') {
                this.userModel = <UserModel>data.Table[0];

                const expires_in = this.msalService.getUser().idToken['exp'];

                const expireDate = new Date(new Date().getTime() + ((expires_in))).toUTCString();
                this.appCommonService.encryptDecryptKey = this.userModel.EncryptDecryptKey;

                localStorage.setItem('EncryptDecryptKey', this.appCommonService.EncryptKey(this.userModel.EncryptDecryptKey));

                this.appCommonService.setCookie('userProfile' + this.appCommonService.getEnvData().clientCode,
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
                if (this.userModel.IsFirstTimeSignIn && String(location.href).indexOf('default/signup') > 0) {
                  this.router.navigate(['default/signup']);
                } else if (this.userModel.IsFirstTimeSignIn && String(location.href).indexOf('default/signup') <= 0) {
                  this.router.navigate(['/resetpassword']);
                } else {
                  if (this.menuItems.length > 0) {
                    this.menuItems = this.menuItems.filter(r => r.IsDefaultPage === 1);
                    let routeName;
                    if (this.menuItems.length > 0) {
                      routeName = this.menuItems[0].RouterLink;
                      this.router.navigate(['home/' + routeName]);
                    } else {
                      this.router.navigate(['home/erroraccessdenieded']);
                    }
                  } else {
                    if (this.userModel.UserRole.toString() === this.userRoles.Manager) {
                      this.router.navigate(['home/managerdashboard']);
                    } else if (this.userModel.UserRole.toString() === this.userRoles.SuperAdmin) {
                      this.router.navigate(['home/managerdashboard']);
                    } else {
                      this.router.navigate(['home/empdashboard']);
                    }
                  }
                }

                this.loaderService.display(false);
              }
            });
      }
    }


    this.newReloginForm = this.fb.group({
      'password': new FormControl(null, Validators.required)
    });
  }

  ngOnDestroy() {
    this.idleUserService.logoutModalFlag = false;
    this.idleUserService.resetTimeOut();
  }

  toggleMenu() {
    // var screenWidth = screen.width;
    // var screenHeight = screen.height;
    this.windowInnerSize = window.innerWidth;
    this.getMenuStatusOnResize = this.menuState;
    this.getMenuClassOnResize = this.inputClass;
    // alert(this.getMenuStatusOnResize + " - " + this.getMenuClassOnResize);
    if (this.windowInnerSize < 1024) {
      this.menuState = this.menuState === 'out' ? 'smallDeviceIn' : 'out';
      // this.bodystates = this.bodystates === 'right' ? 'left' : 'right';
    } else {

      if (this.getMenuStatusOnResize === 'out' && this.getMenuClassOnResize === 'big') {
        // alert("out and big");
        this.inputClass = 'small';
        this.bodystates = 'bigLeft';
        this.menuState = 'in';
      }
      if (this.getMenuStatusOnResize === 'in' && this.getMenuClassOnResize === 'small') {
        // alert(" abou 900 = in small ")
        this.inputClass = 'big';
        this.bodystates = 'right';
        this.menuState = 'out';

      }
    }
    // var elementResult = document.querySelectorAll('.ui-menuitem-text');
    // alert(elementResult);
    this.isOn = this.isOn === true ? false : true;
  }
  // Hide menu on Black Mask
  hideMenu() {
    this.menuState = 'smallDeviceIn';
    this.isOn = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.getMenuStatusOnResize = this.menuState;
      this.getMenuClassOnResize = this.inputClass;
      // alert(this.getMenuStatusOnResize + " - " + this.getMenuClassOnResize);

      if (event.target.innerWidth <= 900) {

        if (this.getMenuStatusOnResize === 'out' && this.getMenuClassOnResize === 'big') {
          // this.menuState = 'smallDeviceIn';
          this.inputClass = 'big';
          this.bodystates = 'left';
        }
        if (this.getMenuStatusOnResize === 'smallDeviceIn' && this.getMenuClassOnResize === 'big') {
          //                 //alert(" ")
          this.bodystates = 'smallDeviceIn';
          this.inputClass = 'big';
        }
        if (this.getMenuStatusOnResize === 'in' && this.getMenuClassOnResize === 'small') {
          // alert(" 900 = in small ")
          this.bodystates = 'left';
          this.inputClass = 'big';
          this.menuState = 'smallDeviceIn';
        }
      } else {

        if (this.getMenuStatusOnResize === 'out' && this.getMenuClassOnResize === 'big') {
          // alert("out and big");
          this.inputClass = 'big';
          this.bodystates = 'right';
        }
        if (this.getMenuStatusOnResize === 'in' && this.getMenuClassOnResize === 'small') {
          //  alert(" abou 900 = in small ")
          this.inputClass = 'small';
          this.bodystates = 'bigLeft';
        }
        if (this.getMenuStatusOnResize === 'smallDeviceIn' && this.getMenuClassOnResize === 'big') {
          //                 //alert(" ")
          this.inputClass = 'small';
          this.bodystates = 'bigLeft';
          this.menuState = 'in';
        }
      }
    }, 500);
  }

  hideMenuBodyClick() {
    const screenWidth = screen.width;
    const screenHeight = screen.height;

    if (screenWidth < 1024) {
      this.menuState = 'smallin';

    } else { }
  }
  screenwidthfind() {
    this.windowInnerSize = window.innerWidth;
    // alert(this.windowInnerSize);
    if (this.windowInnerSize < 1024) {
      this.bodystates = 'left';
    } else {
      // this.menuState = this.menuState === 'out' ? 'in' : 'out';
      // this.bodystates = this.bodystates === 'right' ? 'left' : 'right';
    }
  }

  doLogOut() {
    this.newReloginForm.controls['password'].patchValue(null);
    this.newReloginForm.controls['password'].markAsPristine();
    this.idleUserService.display(false);
    this.logOut();
  }

  logOut() {
    this.loaderService.display(true);
    this.authenticationService.logOut()
      .subscribe(
        (data: any) => {
          this.appCommonService.clearUserSession();
          this.idleUserService.logout();
        },
        error => {
          if (this.msalService.isOnline()) {
            this.msalService.logout();
          } else {
            this.msalService.login();
          }
          // this.router.navigate(['/login']);
          this.loaderService.display(false);
        },
        () => {
          if (this.msalService.isOnline()) {
            this.msalService.logout();
          } else {
            this.msalService.login();
          }
          // this.router.navigate(['/login']);
        }
      );
    this.loaderService.display(false);
  }

  onSubmit(value: any) {
    const encryptedPwd = this.appCommonService.encode64(value.password);

    const form = {
      // 'username' : value.username,
      'password': encryptedPwd
    };

    if (this.newReloginForm.valid) {
      this.loaderService.display(true);
      this.authenticationService.validateUser(form)
        .subscribe(
          (data: any) => {
            if (String(data).toLocaleUpperCase() === 'SUCCESS') {
              this.idleUserService.logoutModalFlag = false;
              this.idleUserService.initiaization(this._element);

              this.newReloginForm.controls['password'].patchValue(null);
              this.newReloginForm.controls['password'].markAsPristine();

              this.idleUserService.display(false);
              this.idleUserService.logout();
              this.idleUserService.initiaization(this._element);
            }
            this.loaderService.display(false);
          },
          error => {
            this.isAuthenticated = false;
            this.loaderService.display(false);
            this.newReloginForm.controls['password'].setErrors({ badpassword: true });
          },
          () => console.log('Session Validate complete')
        );
    } else {
      this.appCommonService.validateAllFields(this.newReloginForm);
    }
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
    if (this.appCommonService.getUserProfile().UserRole === 'SuperAdmin') {
      const roleMenu: any = {};
      roleMenu.id = 0;
      roleMenu.label = 'Master Role Access';
      roleMenu.icon = 'fa-unlock-alt';
      roleMenu.routerLink = 'masteruserroleaccess';
      roleMenu.name = 'Master Role Access';
      roleMenu.num = 100;
      roleMenu.items = [];
      roleMenu.isParent = true;
      roleMenu.parentId = 0;
      roleMenu.subState = 'inactive';
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

  updateEmpInfo(iD) {
    let updateUserApiDetails: any;
    updateUserApiDetails = {
      AzureUserIs: iD
    };
    this.httpMethodsService.post('api/Employee/UpdateAzureUserFlag', updateUserApiDetails)
      .subscribe((result: any) => {
        if (String(result[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
        }
        // this.msalService.logout();
      });

  }

}
