import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { DataService } from '../../shared/services/DataService.service';
import { UserModel } from '../../shared/models/user.model';
import { AppCommonService } from '../../shared/services/app-common.service';

@Injectable()
export class NewEmployeeService {

  private _cookieService: any;

  constructor(
    private http: DataService,
    private appCommonService: AppCommonService
  ) {
    this._cookieService = <UserModel>this.appCommonService.getUserProfile();
  }

  private headers = new Headers({ 'Content-Type': 'application/json' });

  // Lot List By Client
  getAllEmployeeList() {
    const url = 'api/Employee/GetEmployeeList';

    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
    return this.http

    .get(url , { params: params})
    // return this.http
    // .get(url)
    .map(data => {
      console.log('GetEmployeeList Service success');
      // console.log(data);
      return data;
    });
  }

  getAllCityList() {
    const url = 'api/City/GetCityList';

    return this.http
    .get(url)
    .map(data => {
      console.log('GetAllCityList Service success');
      // console.log(data);
      return data;
    });
  }
}
