import { Injectable } from '@angular/core';
import { DataService } from '../../shared/services/DataService.service';
import { UserModel } from '../../shared/models/user.model';
import { HttpParams } from '@angular/common/http';
import { AppCommonService } from '../../shared/services/app-common.service';

@Injectable()
export class RetailerService {
  private _cookieService: any;

  constructor(private http: DataService,
    private appCommonService: AppCommonService
  ) {
    this._cookieService = <UserModel>this.appCommonService.getUserProfile();
   }
   private headers = new Headers({ 'Content-Type': 'application/json' });

   GetAllRetailerListByClient() {
    const url = 'api/Retailer/GetRetailerListByClient';
    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
    .get(url, {params: params})

    .map(data => {

      console.log('GetAllRetailerListByClient Service success');
      // console.log(data);
      return data;
    });
  }

  addRetailerDetails(RetailerDetailsForApi: any) {
    const url = 'api/Retailer/RetailerAddUpdate';

    return this.http.post(url, RetailerDetailsForApi, this.headers)
    // .do(data =>console.log('All : ' + JSON.stringify(data)))
   .map(data =>  data );
  }
  RetailerDeleteActive(RetailerDetailsForApi: any) {
    const url = 'api/Retailer/RetailerDeleteActive';

    return this.http.post(url, RetailerDetailsForApi, this.headers)
    // .do(data =>console.log('All : ' + JSON.stringify(data)))
   .map(data =>  data );
  }

}
