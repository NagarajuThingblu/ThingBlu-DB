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
export class NewLabelDetailsActionService {
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
  
    addNewLabelEntry(NewSectionForApi: any) {
        const url = 'api/Grower/AddUpdateBinLabels';
  
        return this.http.post(url, NewSectionForApi, this.headers)
        // .do(data =>console.log('All : ' + JSON.stringify(data)))
       .map(data =>  data );
      }
  
      GetLabelslist()
      {
        const url='api/Grower/GetBinLabelsList';
    let params = new HttpParams();
    params=params.append('ClientId',String(this.appCommonService.getUserProfile().ClientId));
    return this.http.get(url,{params: params}).map(data=>data);
  
      }
      GetLabelsInfo(binid){
        const url='api/Grower/GetSectionMergeDetails';
        let params = new HttpParams();
        params=params.append('ClientId',String(this.appCommonService.getUserProfile().ClientId));
        params=params.append('BinId',binid)
        return this.http.get(url,{params: params}).map(data=>data);
      }
  }