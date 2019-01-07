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

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  animations: [
    trigger('bodyLeftRight', [
      state('left', style({

        paddingLeft:'0px'
        // transform:  'translateX(0px)'
       
      })),
      state('bigLeft', style({
        paddingLeft:'50px'
       // transform: 'translateX(280px)'
      })),
      state('right', style({
        paddingLeft:'271px'
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
export class HomeComponent implements OnInit, OnDestroy {
  newReloginForm: FormGroup;
  menuState:string = 'out';
  bodystates:string = 'right';
  public inputClass: any = 'big';
  public windowInnerSize : any;
  public getMenuStatusOnResize : any;
  public getMenuClassOnResize : any;
  public username: any;
  heading: any;
  menustatus: boolean = false;
  timer: any;
  public isOn : any = true;
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

  constructor(private fb: FormBuilder,
    private titleService: Title,
    private appCommonService: AppCommonService,
    private _element: ElementRef,
    private idleUserService: IdleUserService,
    private loaderService: LoaderService,
    private authenticationService: AuthenticationService,
    private cookieService: CookieService,
    private router: Router,
  ) {
    this.screenwidthfind();
    this.idleUserService.initiaization(_element);
  }

  ngOnInit() {
    this.titleService.setTitle('Home');
    this.globalResource = GlobalResources.getResources().en;
    // this.autoLogoutService.display(false);
    this.idleUserService.showLogoutModal.subscribe(data => this.showLogoutModal = data);
    this.idleUserService.LogoutModalParams.subscribe(data => {
      this.logoutModalObject = data;

      if (this.logoutModalObject.loggedOut) {
        this.logOut();
      }
    });

    this.username = this.appCommonService.getUserProfile().UserName;
    this.heading = this.username + ' is logged in. Do you want to continue with this?';

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
   //alert(this.getMenuStatusOnResize + " - " + this.getMenuClassOnResize);


    if(this.windowInnerSize < 1024){
      this.menuState = this.menuState === 'out' ? 'smallDeviceIn' : 'out'; 
      //this.bodystates = this.bodystates === 'right' ? 'left' : 'right';
     
    }else{

      if (this.getMenuStatusOnResize == 'out'  && this.getMenuClassOnResize == 'big'){
        //alert("out and big");
        this.inputClass = 'small';
        this.bodystates = 'bigLeft';
        this.menuState = 'in'
        }
      if (this.getMenuStatusOnResize == 'in'  && this.getMenuClassOnResize == 'small'){
      //alert(" abou 900 = in small ")
      this.inputClass = 'big';
      this.bodystates = 'right';
      this.menuState = 'out'

      }
    }

    var elementResult = document.querySelectorAll('.ui-menuitem-text');
    //alert(elementResult);

    this.isOn = this.isOn == true ? false : true; 
   
  }
// Hide menu on Black Mask
hideMenu(){
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

     if(event.target.innerWidth <= 900){

              if (this.getMenuStatusOnResize == 'out'  && this.getMenuClassOnResize == 'big'){
//                 this.menuState = 'smallDeviceIn'; 
                  this.inputClass = "big";
                  this.bodystates = "left";
              }
              if (this.getMenuStatusOnResize == 'smallDeviceIn'  && this.getMenuClassOnResize == 'big'){
               //                 //alert(" ")
                  this.bodystates = "smallDeviceIn"; 
                  this.inputClass = "big";
               }   
               if (this.getMenuStatusOnResize == 'in'  && this.getMenuClassOnResize == 'small'){
                // alert(" 900 = in small ")
                 this.bodystates = "left"; 
                 this.inputClass = "big";
                 this.menuState = 'smallDeviceIn';
                 }  

     
     }else{

           if (this.getMenuStatusOnResize == 'out'  && this.getMenuClassOnResize == 'big'){
                         //alert("out and big");
                         this.inputClass = 'big';
                         this.bodystates = 'right';
               }
           if (this.getMenuStatusOnResize == 'in'  && this.getMenuClassOnResize == 'small'){
           //  alert(" abou 900 = in small ")
                  this.inputClass = 'small';
                  this.bodystates = 'bigLeft';
               }
               if (this.getMenuStatusOnResize == 'smallDeviceIn'  && this.getMenuClassOnResize == 'big'){
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
     if(this.windowInnerSize < 1024){
      this.bodystates = "left";
     }else{
      // this.menuState = this.menuState === 'out' ? 'in' : 'out';
       //this.bodystates = this.bodystates === 'right' ? 'left' : 'right';
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
            this.router.navigate(['/login']);
            this.loaderService.display(false);
          },
          () => {
            this.router.navigate(['/login']);
          }
      );

      this.loaderService.display(false);
  }

  onSubmit(value: any) {
    const encryptedPwd = this.appCommonService.encode64(value.password);

    const form = {
    //   'username' : value.username,
      'password' : encryptedPwd
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

}
