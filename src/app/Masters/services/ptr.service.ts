import { Injectable } from '@angular/core';
import { DataService } from '../../shared/services/DataService.service';
import { UserModel } from '../../shared/models/user.model';
import { HttpParams } from '@angular/common/http';
import { AppCommonService } from '../../shared/services/app-common.service';

@Injectable()
export class PTRService {
    private _cookieService: any;
    constructor(private http: DataService,
        private appCommonService: AppCommonService
      ) {
        this._cookieService = <UserModel>this.appCommonService.getUserProfile();
       }
       private headers = new Headers({ 'Content-Type': 'application/json' });

       addPTRDetails(PTRDetailsForApi: any) {
        const url = 'api/Grower/TerminationReasonAddUpdate';
    
        return this.http.post(url, PTRDetailsForApi, this.headers)
        // .do(data =>console.log('All : ' + JSON.stringify(data)))
       .map(data =>  data );
      }
      GetAllPTRListByClient(){
        const url = 'api/Grower/GetTerminationReasons';
        let params = new HttpParams();
        params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
    
        return this.http
        .get(url, {params: params})
    
        .map(data => {
    
          console.log('GetAllPTRListByClient Service success');
          // console.log(data);
          return data;
        });
      }

      getAllSubCrewList(){
        const url = 'api/employee/GetSubCrewList';
        let params = new HttpParams();
        params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
    
        return this.http
        .get(url, {params: params})
    
        .map(data => {
    
        console.log('GetAllSWubCrewListByClient Service success');
      // console.log(data);
        return data;
    });
    
      }
}