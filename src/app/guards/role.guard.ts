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
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.cookieuserRole = this.appCommonService.getUserProfile().UserRole;
    this.userRoles = AppConstants.getUserRoles;
    this.menuItems = [];
    if (this.appCommonService.getRoleAccess()) {
      this.menuItems = this.appCommonService.getRoleAccess();
    }
    if (this.menuItems.length > 0) {
      if ((this.menuItems.filter(R => R.RouterLink === next.routeConfig.path).length)) {
        return true;
      } else if ('lotentry' === next.routeConfig.path && (this.menuItems.filter(R => R.RouterLink === next.routeConfig.path).length <= 0)) {
        let SubMenu = [];
        SubMenu = this.menuItems.filter(r => r.IsDefaultPage === 1);
        if (SubMenu.length > 0) {
          this.router.navigated = false;
          this.loaderService.display(false);
          this.router.navigate(['home/' + SubMenu[0].RouterLink]);
          return false;
        } else {
          this.router.navigated = false;
          this.loaderService.display(false);
          this.router.navigate(['home/erroraccessdenieded']);
          return false;
        }
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
      if (this.userRoles.SuperAdmin === this.cookieuserRole) {
        this.router.navigated = false;
        this.loaderService.display(false);
        this.router.navigate(['home/masteruserroleaccess']);
        return false;
      } else {
        this.router.navigated = false;
        this.loaderService.display(false);
        this.router.navigate(['home/erroraccessdenieded']);
        return false;
      }
    }
  }
}
