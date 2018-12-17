import { Injectable } from '@angular/core';
import { DataService } from '../../shared/services/DataService.service';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../../shared/models/user.model';
import { RequestOptions } from '@angular/http';
import { HttpParams } from '@angular/common/http';
import { AppCommonService } from '../../shared/services/app-common.service';

@Injectable()
export class StrainMasterService {
  private _cookieService: any;
  headers: any;

  constructor( private http: DataService,
    private appCommonService: AppCommonService) {
      this._cookieService = this.appCommonService.getUserProfile();
     }
     private options = new RequestOptions({
      headers: this.headers
    });

  getGeneticsList() {
    const url = 'api/Genetics/GetGeneticsList';

    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
    return this.http
    .get(url, {params: params} )
    .map(data => {
      console.log('GetStrainDetailList Service success');
      return data;
    });
  }

  getStrainListByStrainId(StrainId) {
    const url = 'api/Strain/GetStrainDetailListByStrainId';
    let params = new HttpParams();
    params = params.append('StrainId', StrainId);
    return this.http
    .get(url, {params: params})
    .map(data => {
      console.log('GetStrainListByStrainId Service success');
      return data;
    });
  }

}
