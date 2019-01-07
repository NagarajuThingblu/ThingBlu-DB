import { style } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppCommonService } from '../../services/app-common.service';
import { AppConstants } from '../../models/app.constants';
import { MastersResource } from '../../../Masters/master.resource';
import { GlobalResources } from '../../../global resource/global.resource';

@Component({
  selector: 'app-error-access-denieded',
  templateUrl: './error-access-denieded.component.html',
  styleUrls: ['./error-access-denieded.component.css']
})
export class ErrorAccessDeniededComponent implements OnInit {
  public userRoles: any;
  public cookieuserRole: any;
  accessdeniedResources: any;
  globalResource: any;

  constructor(private router: Router,
    private cookieService: CookieService,
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
  ) { }

  ngOnInit() {
    this.accessdeniedResources = MastersResource.getResources().en.erroraccessdenied;
    this.globalResource = GlobalResources.getResources().en;
    this.cookieuserRole = this.appCommonService.getUserProfile().UserRole;
    this.userRoles = AppConstants.getUserRoles;
    this.loaderService.display(false);
  }
  redirectClick() {

    let menuItems = [];
    if ( this.appCommonService.getRoleAccess()) {
      menuItems = this.appCommonService.getRoleAccess();
    }
    if (menuItems.length > 0) {
      menuItems = menuItems.filter(r => r.IsDefaultPage === 1);
      let routeName;
      if (menuItems.length > 0) {
        routeName = menuItems[0].RouterLink;
        this.router.navigate(['home/' + routeName]);
      } else {
        this.router.navigate(['home/erroraccessdenieded']);
      }
    }
  }
}

