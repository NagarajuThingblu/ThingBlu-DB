import { MsalService } from './../azureb2c/msal.service';
import { AppCommonService } from './../shared/services/app-common.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';
import { LoaderService } from '../shared/services/loader.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private msalService: MsalService,
    private appCommonService: AppCommonService
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    // Observable<boolean> | Promise<boolean> |
    state: RouterStateSnapshot):  boolean {
      // if (this.appCommonService.checkCurrentUser() !== false) {
      //   // console.log('authguard true');
      //   this.loaderService.display(true);
      //   return true;
      // } else {
      //   console.log('authguard false');

      //   this.appCommonService.clearUserSession();

      //   this.router.navigated = false;
      //   this.loaderService.display(false);
      //   this.router.navigate(['/login']);
      //   return false;
      // }
      if ((this.msalService.isOnline())) {
        // console.log('authguard true');
        this.loaderService.display(true);
        return true;
      } else {
        console.log('authguard false');

        this.msalService.login();
      }
  }
}
