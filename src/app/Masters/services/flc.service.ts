import { Injectable } from '@angular/core';
import { DataService } from '../../shared/services/DataService.service';
import { UserModel } from '../../shared/models/user.model';
import { HttpParams } from '@angular/common/http';
import { AppCommonService } from '../../shared/services/app-common.service';

@Injectable()
export class FLCService {
    private _cookieService: any;
    constructor(private http: DataService,
        private appCommonService: AppCommonService
      ) {
        this._cookieService = <UserModel>this.appCommonService.getUserProfile();
       }
       private headers = new Headers({ 'Content-Type': 'application/json' });

       addFlcDetails(FlcDetailsForApi: any) {
        const url = 'api/Grower/FLCAddUpdate';
    
        return this.http.post(url, FlcDetailsForApi, this.headers)
        // .do(data =>console.log('All : ' + JSON.stringify(data)))
       .map(data =>  data );
      }
      GetAllFLCListByClient(){
        const url = 'api/Grower/GetFLCList';
    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
    .get(url, {params: params})

    .map(data => {

      console.log('GetAllFLCListByClient Service success');
      // console.log(data);
      return data;
    });

      }
}