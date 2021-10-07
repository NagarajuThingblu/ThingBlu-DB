import { Injectable } from '@angular/core';
import { DataService } from '../../shared/services/DataService.service';
import { UserModel } from '../../shared/models/user.model';
import { AppCommonService } from '../../shared/services/app-common.service';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class CrewService {
    private _cookieService: any;
    constructor(
      private http: DataService,
      private appCommonService: AppCommonService
    ) {
      this._cookieService = this.appCommonService.getUserProfile();
    }
    private headers = new Headers({ 'Content-Type': 'application/json' });

    addCrewDetails(crewDetailsForApi: any) {
        const url = 'api/employee/AddUpdateCrew';
    
        return this.http.post(url, crewDetailsForApi, this.headers)
        // .do(data =>console.log('All : ' + JSON.stringify(data)))
       .map(data =>  data );
      }

      
 
  getAllCrewList(){
    const url = 'api/employee/GetCrewList';
    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
    .get(url, {params: params})

    .map(data => {

    console.log('GetAllCrewListByClient Service success');
  // console.log(data);
    return data;
});

  }
}