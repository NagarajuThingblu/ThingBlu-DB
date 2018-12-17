import { Injectable } from '@angular/core';
import { DataService } from '../../shared/services/DataService.service';
import { AppCommonService } from '../../shared/services/app-common.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserRolePermissionService {

  private _cookieService: any;
  constructor(private http: DataService,
    private appCommonService: AppCommonService) {
    this._cookieService = this.appCommonService.getUserProfile();
  }
  private headers = new Headers({ 'Content-Type': 'application/json' });

  getMasterPageListByUserRoleId(userRoleId) {
    const url = 'api/Role/GetMasterPageListByRoleId';
    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
   // params = params.append('UserRoleId', String(this.appCommonService.getUserProfile().VirtualRoleId));
   params = params.append('UserRoleId', String(userRoleId));
    return this.http
      .get(url, { params: params })
      .map(
        data => {
          console.log('Get userWise Menu  Service success');
          return data;
        }
      );
  }

  createuserRolePermissionDetails(createRolePermissionApi: any) {
    const url = 'api/Role/userRolePermissionAddUpdate';
    return this.http.post(url, createRolePermissionApi, this.headers)
   .map(data =>  data );
  }

  getRolewiseMenuItem() {
    const url = 'api/Role/GetRolewiseMenuList';
    let params = new HttpParams();
    params = params.append('VirtualRoleId', String(this.appCommonService.getUserProfile().VirtualRoleId));
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
    return this.http
    .get(url, {params: params})
    .map(
      data => {
        console.log('Get userWise Menu  Service success');
        return data;
      }
    );
}

  getasterPageList() {
    return Observable.of({
      'data':
        [ {
            'label': 'Pictures',
            'expandedIcon': 'fa fa-folder-open',
            'collapsedIcon': 'fa fa-folder',
            'children': [
              { 'label': 'barcelona.jpg'   },
              { 'label': 'logo.jpg' },
              { 'label': 'primeui.png' }]
          },
          {
            'label': 'Movies',
            'expandedIcon': 'fa fa-folder-open',
            'collapsedIcon': 'fa fa-folder',
            'children': [{
              'label': 'Al Pacino',
            },
            {
              'label': 'Robert De Niro',
            }]
          }
        ]
    });

  }
}
