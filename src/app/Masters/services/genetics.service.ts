import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { DataService } from '../../shared/services/DataService.service';
import { UserModel } from '../../shared/models/user.model';
import { AppCommonService } from '../../shared/services/app-common.service';

@Injectable()
export class GeneticsService {

  private _cookieService: any;

  constructor(
    private http: DataService,
    private appCommonService: AppCommonService
  ) {
    this._cookieService = this.appCommonService.getUserProfile();
  }

  private headers = new Headers({ 'Content-Type': 'application/json' });

  getGeneticsDetails() {
    const url = 'api/Genetics/GetGeneticsDetailsList';

    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
    return this.http

    .get(url , { params: params})
    .map(data => {
      console.log('Get Genetics Details Service success');
      // console.log(data);
      return data;
    });
  }
}
