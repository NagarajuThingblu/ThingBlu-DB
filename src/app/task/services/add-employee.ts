import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { DataService } from '../../shared/services/DataService.service';
import { UserModel } from '../../shared/models/user.model';
import{HttpParams} from '@angular/common/http';
import { AppCommonService } from '../../shared/services/app-common.service';

@Injectable()
export class NewEmployeeActionService {
  private _cookieService: any;
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

  addNewEmployee(NewEmployeeForApi: any) {
      const url = 'api/Employee/AddUpdateEmployee';

      return this.http.post(url, NewEmployeeForApi, this.headers)
      // .do(data =>console.log('All : ' + JSON.stringify(data)))
     .map(data =>  data );
    }

    GetSkillslist(){
      const url='api/Grower/GetSkillsDetails';
      let params = new HttpParams();
      params=params.append('ClientId',String(this.appCommonService.getUserProfile().ClientId));
      return this.http.get(url,{params: params}).map(data=>data);
    }
  SkillslistForEmp(){
      const url='api/Grower/GetSkillsListForEmployee';
      let params = new HttpParams();
      params=params.append('ClientId',String(this.appCommonService.getUserProfile().ClientId));
      return this.http.get(url,{params: params}).map(data=>data);
    }
    addNewSkills(skillDetauilsForApi){
      const url = 'api/Grower/AddUpdateSkills';

      return this.http.post(url, skillDetauilsForApi, this.headers)
      // .do(data =>console.log('All : ' + JSON.stringify(data)))
     .map(data =>  data );
    }
}
