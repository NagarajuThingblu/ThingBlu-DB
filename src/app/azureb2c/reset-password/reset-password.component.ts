import { LoaderService } from './../../shared/services/loader.service';

import { Component, OnInit } from '@angular/core';
import { MsalService } from '../msal.service';
import { HttpMethodsService } from '../../shared/services/http-methods.service';
import { ResetPasswordMsalService } from '../reset-password-msal.service';
import { IdleUserService } from '../../idle-user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {

  constructor(private loaderService: LoaderService,
    private msalService: MsalService,
    private httpMethodsService: HttpMethodsService,
    private resetPasswordMsalService: ResetPasswordMsalService,
    private idleUserService: IdleUserService,
    ) { }

  ngOnInit() {
     this.loaderService.display(false);
  }
  redirectClick() {
    this.resetPasswordMsalService.resetPassword();
    // location.reload();
      }
}
