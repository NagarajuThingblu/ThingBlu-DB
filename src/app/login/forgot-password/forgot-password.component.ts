import { MsalService } from './../../azureb2c/msal.service';
import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../shared/services/loader.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppCommonService } from '../../shared/services/app-common.service';
import { ForgotPasswordService } from '../../task/services/forgot-password.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/api';
import { GlobalResources } from '../../global resource/global.resource';
import { LoginResources } from '../login.resources';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public forgotpasswordForm: FormGroup;
  public loginResource: any;
  public forgotpasswordResources: any;
  stringEscapeRegex: any = /[^ a-zA-Z0-9]/g;
  public globalResource: any;
  public msgs: Message[] = [];
  public forgotPasswordLink: any;
  public isTokenLink: any;
  public loginResources: LoginResources;

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
    private forgotPasswordService: ForgotPasswordService,
    private route: ActivatedRoute,
    private router: Router,
    private appComponentData: AppComponent,
    private msalService: MsalService,
  ) {

  }

  ngOnInit() {
    this.appComponentData.setTitle('Forgot Password');
    this.loaderService.display(false);
    this.globalResource = GlobalResources.getResources().en;
    this.loginResources = LoginResources.getResources().en;
    this.forgotpasswordResources = LoginResources.getResources().en.forgotpasswordResources;

    this.route.params.forEach((urlParams) => {
      this.forgotPasswordLink = urlParams['token'];
      this.isTokenLink = this.forgotPasswordLink ? 1 : 0;
      if (this.isTokenLink === 1) {
        this.checkLinkOnPageLoad(this.forgotPasswordLink);
      }
    });
    // this.forgotPasswordLink = this.route.snapshot.queryParams['token'];

    // this.forgotpasswordResources = loginResources.getResources().en.forgotpasswordResources;
      if (this.isTokenLink === 0) {
        this.forgotpasswordForm = this.fb.group({
          'empemail': new FormControl(null, Validators.compose([Validators.required])),
          'newpassword': new FormControl(null),
          'confirmpassword': new FormControl(null)
        });
      } else {
        this.forgotpasswordForm = this.fb.group({
          'empemail': new FormControl(null),
          'newpassword': new FormControl(null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])),
          'confirmpassword': new FormControl(null, Validators.required)
      });
    }
  }
  resetForm() {
    this.forgotpasswordForm.reset();
  }

  checkLinkOnPageLoad(forgotPasswordLink: any) {
    let changePasswordDetailsForApi;
    changePasswordDetailsForApi = {
      ChangePassword: {
        NewPassword: '',
        ForgotPasswordLink: String(forgotPasswordLink).trim()
      }
    };
       // http call starts
      this.forgotPasswordService.changeEmpPassword(changePasswordDetailsForApi)
      .subscribe(
          data => {
            // console.log(data);
            this.msgs = [];
            if (data === 'LinkExpired') {
              this.isTokenLink = 2;
              this.loaderService.display(false);
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
  }
  onSubmit(value: any) {
    // alert('onSubmit');
    if (String(this.forgotpasswordForm.value.empemail).trim().length === 0) {
      this.forgotpasswordForm.controls['empemail'].setErrors({'whitespace': true});
      this.forgotpasswordForm.value.empemail = null;
      return;
    }
    let forgotPasswordDetailsForApi;
    forgotPasswordDetailsForApi = {
      ForgotPassword: {
        PrimaryEmail: this.appCommonService.trimString(this.forgotpasswordForm.value.empemail)
      }
    };
    // console.log(ForgotPasswordDetailsForApi);
    if (this.forgotpasswordForm.valid) {
      // alert('valid');
       // http call starts
       this.loaderService.display(true);
      this.forgotPasswordService.validateEmpForgotPassword(forgotPasswordDetailsForApi)
      .subscribe(
          data => {
            // alert(data);
            // console.log(data);
            this.msgs = [];
            if (String(data).toLocaleUpperCase() === 'SUCCESS') {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.forgotpasswordResources.sendmailsuccess });
              this.resetForm();
              this.loaderService.display(false);
            } else if (data === 'Inactive') {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.forgotpasswordResources.empNotActive });
              this.loaderService.display(false);
            } else if (data === 'EmpNotExist') {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.forgotpasswordResources.empNotExist });
              this.resetForm();
              this.loaderService.display(false);
            } else if (data === 'Failure') {
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
              this.loaderService.display(false);
            }
          },
          error => {
            this.msgs = [];
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
            // http call end
            this.loaderService.display(false);
          });
    } else {
      this.appCommonService.validateAllFields(this.forgotpasswordForm);
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

  changeEmpPassword() {
    const newPassword = this.forgotpasswordForm.value.newpassword;
    const confirmPassword = this.forgotpasswordForm.value.confirmpassword;
    if ((confirmPassword !== '' && confirmPassword !== null)
    && (newPassword !== '' && newPassword !== null)) {
      if ( newPassword !== confirmPassword) {
        this.forgotpasswordForm.controls['confirmpassword'].setErrors({ 'passwordnotmatched': true});
      }
    }
    let changePasswordDetailsForApi;
    changePasswordDetailsForApi = {
      ChangePassword: {
        newPassword: this.encode64(String(this.appCommonService.trimString(this.forgotpasswordForm.value.newpassword))),
        ForgotPasswordLink: this.forgotPasswordLink
      }
    };
    // console.log(ChangePasswordDetailsForApi);
    if (this.forgotpasswordForm.valid) {
       // http call starts
       this.loaderService.display(true);
      this.forgotPasswordService.changeEmpPassword(changePasswordDetailsForApi)
      .subscribe(
          data => {
            // alert(data);
            // console.log(data);
            this.msgs = [];
            if (data === 'Success') {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.forgotpasswordResources.passwordchangesuccess });
              this.resetForm();
              setTimeout(() => {
                if (this.msalService.isOnline()) {
                  this.msalService.logout();
                } else {
                  this.msalService.login();
                }
               // this.router.navigate(['/login']);
              }, 5000);
              this.loaderService.display(false);
            } else if (data === 'LinkExpired') {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.forgotpasswordResources.linkexpired });
              this.loaderService.display(false);
            } else if (data === 'Failure') {
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
              this.loaderService.display(false);
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
      this.appCommonService.validateAllFields(this.forgotpasswordForm);
      this.loaderService.display(false);
    }
  }
}
