import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';
import { LoaderService } from '../shared/services/loader.service';
import { AppCommonService } from '../shared/services/app-common.service';
import { AppConstants } from '../shared/models/app.constants';

@Injectable()
export class RoleGuard implements CanActivate {
  public menuItems: any = [];
  public userRoles: any;
  public cookieuserRole: any;
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.cookieuserRole = this.appCommonService.getUserProfile().UserRole;
    this.userRoles = AppConstants.getUserRoles;
    this.menuItems = [];
    if (this.cookieService.get('RoleAccess')) {
      this.menuItems = JSON.parse(this.appCommonService.Decrypt(this.cookieService.get('RoleAccess')));
    }
    if (this.menuItems.length > 0) {
      if ((this.menuItems.filter(R => R.routerLink === next.routeConfig.path).length)) {
        return true;
      } else if ('masteruserroleaccess' === next.routeConfig.path) {
        if (this.userRoles.SuperAdmin !== this.cookieuserRole) {
          this.router.navigated = false;
          this.loaderService.display(false);
          this.router.navigate(['home/erroraccessdenieded']);
          return false;
        } else {
          return true;
        }

      } else {
        this.router.navigated = false;
        this.loaderService.display(false);
        this.router.navigate(['home/erroraccessdenieded']);
        return false;
      }
    } else {
      return true;
    }
  }
}
