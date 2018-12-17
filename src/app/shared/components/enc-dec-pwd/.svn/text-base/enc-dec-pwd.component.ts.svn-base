import { LoaderService } from './../../services/loader.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

declare function unescape(s: string): string;
@Component({
  moduleId: module.id,
  selector: 'app-enc-dec-pwd',
  templateUrl: 'enc-dec-pwd.component.html',
})
export class EncDecPwdComponent implements OnInit {

  pwdForm: FormGroup;
  fromText: string;
  toText: string;
  stringEscapeRegex: any = /[^A-Za-z0-9\+\/\=\!]/g;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.pwdForm = new FormGroup({
      'fromtext': new FormControl(null, Validators.required),
      'totext': new FormControl(null, Validators.required),
    });

    this.loaderService.display(false);
  }

  Encrypt() {
    this.toText = this.encode64(this.fromText);
  }

  Decrypt() {
    this.toText = this.decode64(this.fromText);
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
}
