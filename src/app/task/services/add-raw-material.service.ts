import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { DataService } from '../../shared/services/DataService.service';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../../shared/models/user.model';
import { AppCommonService } from '../../shared/services/app-common.service';
import { HttpParams } from '@angular/common/http';



@Injectable()
export class NewARMDetailsActionService {
    private _cookieService: any;
    // constructor(private http: DataService) { }
    constructor(
      private http: DataService,
      private appCommonService: AppCommonService
    ) {
      this._cookieService = this.appCommonService.getUserProfile();
    }
    private headers = new Headers({
      'Content-Type': 'application/json'
    });
  
    private options = new RequestOptions({
      headers: this.headers
    });


    addRawMaterial(newAddRawMaterialsForApi){
        const url = 'api/Grower/AddRawMaterials';

      return this.http.post(url, newAddRawMaterialsForApi, this.headers)
      // .do(data =>console.log('All : ' + JSON.stringify(data)))
     .map(data =>  data );
    }

    GetRawMaterialList(){
        const url='api/Grower/GetRawMaterialsList';
        let params = new HttpParams();
        params=params.append('ClientId',String(this.appCommonService.getUserProfile().ClientId));
        return this.http.get(url,{params: params}).map(data=>data);
    }

}