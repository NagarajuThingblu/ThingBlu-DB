import { Injectable, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControlName, FormControl, FormControlDirective } from '@angular/forms';
import { environment } from './../../../environments/environment';
import * as crypto from 'crypto-js';
import { CookieService } from '../../../../node_modules/ngx-cookie-service';
import { UserModel } from '../models/user.model';
import { ConfirmationService } from 'primeng/api';

const originFormControlNameNgOnChanges = FormControlName.prototype.ngOnChanges;
const originFormControlNgOnChanges = FormControlDirective.prototype.ngOnChanges;

FormControlDirective.prototype.ngOnChanges = function () {
  this.form.nativeElement = this.valueAccessor._elementRef.nativeElement;
  return originFormControlNgOnChanges.apply(this, arguments);
};

FormControlName.prototype.ngOnChanges = function () {
  const result = originFormControlNameNgOnChanges.apply(this, arguments);

  if (this.valueAccessor._elementRef !== undefined) {
    this.control.nativeElement = this.valueAccessor._elementRef.nativeElement;
  } else if (this.valueAccessor.focusViewChild !== undefined) {
    this.control.nativeElement = this.valueAccessor.focusViewChild.nativeElement;
  } else if (this.valueAccessor.inputfieldViewChild !== undefined) {
    this.control.nativeElement = this.valueAccessor.inputfieldViewChild.nativeElement;
    console.log(this.valueAccessor);
  }
  return result;
};

declare function unescape(s: string): string;

@Injectable()
export class AppCommonService implements OnChanges, OnInit {

  // Production dashboard route parameter data after click on claim
  prodDBRouteParams: any;
  // Added by DEVDAN ::: 27-Sep-2018 :: Variable to set the encryption key after user authentication.
  public encryptDecryptKey: string;
  // Get the ParentEncryption Key to Decrypt Or Encrypt 'EncryptDecryptKey'
  parentEncryption = environment.parentEncryptionKey;
  // Commented by Devdan :: 27-Sep-2018 :: Getting key from database instead of environment.
  // encryptDecryptKey = environment.encryptDecryptKey;
  public firstInvalidFieldFocus = false;
  // public _cookieService: UserModel;
  // private headers = new Headers({ 'Content-Type': 'application/json' });
  stringEscapeRegex: any = /[^A-Za-z0-9\+\/\=\!]/g;

  public empAssignKey: string;


  public strainFormDetail: FormGroup; // add by :: swapnil :: 02-april-2019
  public strainPageBackLink = false; // add by :: swapnil :: 02-april-2019
  public addRawMaterialPageBackLink = false;
  public employeePageBackLink = false;
  public ChemicalPurchasePageBackLink = false;
  public lotPageBackLink = false;
  public lotFormDetail: FormGroup;
  public TPProcessorBackLink = false;
  public TPProcessorFormDetail: FormGroup;
  public ProductTypeBackLink = false;
  public ProductTypeFormDetail: FormGroup;
  public skillFormDetail: FormGroup; 

  public LotBackLink = false;
  public costoflot: any;
  public shortageoverage: any;
  public AzureEmpData: any;


  public navDraftOrder = {
    isBackClicked: false,
  } ;

  public navIncomingOrder = {
    isBackClicked: false,
  } ;

  public navChangeOrder = {
    isBackClicked: false,
  } ;

  constructor(
    private cookieService: CookieService,
    private confirmationService: ConfirmationService
  ) {
    this.firstInvalidFieldFocus = false;
    // this.encryptDecryptKey = this.getLocalStorage('EncryptDecryptKey');
    // this._cookieService = <UserModel>this.appCommonService.getUserProfile();

  }

  ngOnChanges(): void {
    this.firstInvalidFieldFocus = false;
  }

  ngOnInit() {
    // alert(this.encryptDecryptKey);
    // this.encryptDecryptKey = this.getLocalStorage('EncryptDecryptKey');
    // alert(this.encryptDecryptKey);
  }
   // function to calculate local time
// in a different city
// given the city's UTC offset
calcTime(offset) {

  // create Date object for current location
  const d = new Date();

  // convert to msec
  // add local time zone offset
  // get UTC time in msec
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);

  // create new Date object for different city
  // using supplied offset
  const nd = new Date(utc + (3600000 * Number(offset)));

  // return time as a string
  // return 'The local time in ' + city + ' is ' + nd.toLocaleString();
  return nd;
}

   // function to calculate local time
// in a different city
// given the city's UTC offset
calcUTCTime(date1, offset) {

  // create Date object for current location
  const d = new Date(date1);

  const nd = new Date(d.getTime() + (3600000 * Number(-(offset))));
  // return time as a string
  // return 'The local time in ' + city + ' is ' + nd.toLocaleString();
  return nd;
}

  validateAllFields_1(formGroup: FormGroup) {
    if (!Object.values) { Object.values = o => Object.keys(o).map(k => o[k]); }

    (<any>Object).values(formGroup.controls).forEach((control, index) => {
      // control.markAsTouched();

      if (control instanceof FormGroup ) {
        this.validateAllFields_1(control);
      } else if (control.controls) {
          // Object.keys(control.controls).forEach(c => this.validateAllFields(c));
          Object.keys(control.controls).forEach(field => {
              const formControl = (<FormGroup>control).get(field);
              if (formControl instanceof FormControl) {
                // formControl.markAsTouched();
                formControl.markAsDirty();
              } else if (formControl instanceof FormGroup ) {
                  this.validateAllFields_1(formControl);
              }
          });
        } else if (!control.valid && this.firstInvalidFieldFocus === false && control.enabled ) {
          control.markAsDirty();
        //  control.nativeElement.focus();
          this.firstInvalidFieldFocus = true;
          return false;
        }

      // if (control.nativeElement && !control.valid && this.firstInvalidFieldFocus === false && control.enabled ) {
      //   control.markAsDirty();
      //    control.nativeElement.focus();
      //   this.firstInvalidFieldFocus = true;
      //   return false;
      // }
      // (<any>this.orderRequestForm.controls['retailers']).nativeElement.focus();
    });

  //   Object.keys(formGroup.controls).forEach(field => {
  //     const control = formGroup.get(field);
  //     if (control instanceof FormControl) {
  //         control.markAsTouched({ onlySelf: true });
  //         control.markAsDirty({ onlySelf: true });
  //     } else if (control instanceof FormGroup ) {
  //         this.validateAllFields(control);
  //     }
  // });
  }

  validateAllFields(formGroup: FormGroup) {
    this.firstInvalidFieldFocus = false;
      this.validateAllFields_1(formGroup);
  }

  trimString(inputString: string) {
    if (String(inputString).trim() === '' || String(inputString) === '' || String(inputString).trim() === 'null') {
      return '';
    } else {
      return String(inputString).trim().replace(/ +/g, ' ');
    }
  }

  replaceStringChars(inputString: string) {
      if (inputString) {
        return inputString.replace(/\u200E/g, '');
      }
  }

  Encrypt(value: string ) {
    return crypto.AES.encrypt(value, this.encryptDecryptKey).toString();
   }
   Decrypt(value: string ) {
      try {
        if (!this.encryptDecryptKey) {
          this.encryptDecryptKey = this.DecryptKey(localStorage.getItem('EncryptDecryptKey'));
        }
              return crypto.AES.decrypt(value, this.encryptDecryptKey).toString(crypto.enc.Utf8);
     } catch (exx) {
      this.clearUserSession();
      }
   }

  EncryptKey(value: string ) {
    return crypto.AES.encrypt(value, this.parentEncryption).toString();
   }
  DecryptKey(value: string ) {
    try {
      return crypto.AES.decrypt(value, this.parentEncryption).toString(crypto.enc.Utf8);
    } catch (exx) {
      this.clearUserSession();
    }
  }

  getUserProfile() {
    if (this.cookieService.get('userProfile' + environment.clientCode) !== '') {
     
     return <UserModel>JSON.parse(this.Decrypt(this.cookieService.get('userProfile' + environment.clientCode)));
    } else {
        return <UserModel>JSON.parse(null);
    }
  }

  // ######### CODE ADDED BY DEVDAN ::: 27-SEP-2018 ::: Common Methods to get and set Local Storage
  // Encrypt and decrypt local storage
  getLocalStorage(key: string): string {
    if (localStorage.getItem(key + String(this.getEnvData().clientCode)) === null) {
      return null;
    } else {
      return this.Decrypt(localStorage.getItem(key + String(this.getEnvData().clientCode)));
    }
  }
  setLocalStorage(key: string, value: string) {
      localStorage.setItem(key + String(this.getEnvData().clientCode), this.Encrypt(value));
  }

  getSessionStorage(key: string): string {
    if (sessionStorage.getItem(key + String(this.getEnvData().clientCode)) === null) {
      return null;
    } else {
      return this.Decrypt(sessionStorage.getItem(key + String(this.getEnvData().clientCode)));
    }
  }

  setSessionStorage(key: string, value: string) {
    sessionStorage.setItem(key + String(this.getEnvData().clientCode), this.Encrypt(value));
  }

  removeSessionItem(key: string) {
    sessionStorage.removeItem(key + String(this.getEnvData().clientCode));
  }

  removeItem(key: string) {
    localStorage.removeItem(key + String(this.getEnvData().clientCode));
  }

  setCookie(cname, cvalue, expiretime) {
    const expires = 'expires=' + expiretime;
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
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

 // Decode Base64 PASSWORD
 decode64 (input) {
  let output = '';
  let chr1: any = '', chr2: any = '', chr3: any = '' ;
  let enc1: any = '', enc2: any = '', enc3: any = '', enc4: any = '' ;
  let i = 0;
  const keyStr = 'ABCDEFGHIJKLMNOP' + 'QRSTUVWXYZabcdef' + 'ghijklmnopqrstuv' + 'wxyz0123456789+/' + '=';

  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  const base64test = /[^A-Za-z0-9\+\/\=\!]/g;
  if (base64test.exec(input)) {
      alert('There were invalid base64 characters in the input text.\n'
        + 'Valid base64 characters are A-Z, a-z, 0-9, \'+\', \'/\',and \'=\'\n' + 'Expect errors in decoding.');
  }
  input = input.replace(/[^A-Za-z0-9\+\/\=\!]/g, '');

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

  isString(value) {return typeof value === 'string'; }
  isNumber(value) {return typeof value === 'number'; }

  checkCurrentUser() {
    return this.cookieService.check('currentUser' + environment.clientCode);
 }

 getCurrentUser() {
  if (this.cookieService.get('currentUser' + environment.clientCode) !== '') {
    return JSON.parse(this.Decrypt(this.cookieService.get('currentUser' + environment.clientCode)));
   } else {
       return JSON.parse(null);
   }
 }

 clearUserSession() {
  document.cookie = 'currentUser' + environment.clientCode + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'userProfile' + environment.clientCode + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  this.cookieService.delete('currentUser' + environment.clientCode, './');
  this.cookieService.delete('userProfile' + environment.clientCode, './');

  this.removeItem('RoleAccess');
  this.removeItem('JPDFilters');
  this.removeItem('JPDTabIndex');
 }

  getEnvData() {
    return JSON.parse(JSON.stringify(environment));
  }

  getRoleAccess() {
   return JSON.parse(this.getLocalStorage('RoleAccess'));
  }

  /**
 * generate a random integer between min and max
 * @param {Number} min
 * @param {Number} max
 * @return {Number} random generated integer
 */
 randomNumber(min?: number, max?: number) {
  min = min ? min : 1000;
  max = max ? max : 900000;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

getDefaultPageSize() {
  return 10; // this.getUserProfile().DefaultPageSize;
}

canDeactivate(customForm: FormGroup): Promise<boolean> | boolean {
  if (!customForm.dirty) {
    return true;
  }
  return new Promise((resolve, reject) => {
    this.confirmationService.confirm({
        message: 'You have unsaved changes. Are you sure you want to leave this page?',
        header: 'Confirmation',
        key: 'leavePageConfirmBox',
        icon: 'fa fa-exclamation-triangle',
        accept: () => {
            resolve(true);
            // return true;
        },
        reject: () => {
          resolve(false);
          // return false;
        }
    });
  });
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

}
