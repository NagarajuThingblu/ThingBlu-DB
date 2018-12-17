import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { DataService } from '../../shared/services/DataService.service';
import { UserModel } from '../../shared/models/user.model';
import { AppCommonService } from '../../shared/services/app-common.service';

@Injectable()
export class NewBrandService {

  private _cookieService: any;

  constructor(
    private http: DataService,
    private appCommonService: AppCommonService
  ) {
    this._cookieService = this.appCommonService.getUserProfile();
  }

  private headers = new Headers({ 'Content-Type': 'application/json' });

  getAllBrandList() {
    const url = 'api/Brand/GetBrandList';

    return this.http
    .get(url)
    .map(data => {
      console.log('Get Barnd Service success');
      // console.log(data);
      return data;
    });
  }

  getBrandDetails() {
    const url = 'api/Brand/GetBrandDetails';

    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
    return this.http

    .get(url , { params: params})
    .map(data => {
      console.log('Get Barnd Service success');
      // console.log(data);
      return data;
    });
  }
}
