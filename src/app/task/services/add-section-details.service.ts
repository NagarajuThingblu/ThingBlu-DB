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
export class NewSectionDetailsActionService {
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

  addNewSectionEntry(NewSectionForApi: any) {
      const url = 'api/Grower/AddUpdateSections';

      return this.http.post(url, NewSectionForApi, this.headers)
      // .do(data =>console.log('All : ' + JSON.stringify(data)))
     .map(data =>  data );
    }
    updateTermination(newUpdateTerminationForApi: any) {
      const url = 'api/Grower/UpdateTaskStatus';

      return this.http.post(url, newUpdateTerminationForApi, this.headers)
      // .do(data =>console.log('All : ' + JSON.stringify(data)))
     .map(data =>  data );
    }

    Getsectionlist()
    {
      const url='api/Grower/GetSectionsList';
  let params = new HttpParams();
  params=params.append('ClientId',String(this.appCommonService.getUserProfile().ClientId));
  return this.http.get(url,{params: params}).map(data=>data);

    }

    GetDetailsOnTaskType(taskid){
      const url='api/Grower/GetFieldSectionDetails';
  let params = new HttpParams();
  params=params.append('ClientId',String(this.appCommonService.getUserProfile().ClientId));
  params=params.append('TaskTypeId',taskid);
  return this.http.get(url,{params: params}).map(data=>data);
    }
    GetSectionDetails(SectionId, TaskName){
      const url='api/Grower/GetTerminatedPlantCount';
      let params = new HttpParams();
      params=params.append('ClientId',String(this.appCommonService.getUserProfile().ClientId));
      params=params.append('SectionId',SectionId);
      params=params.append('TaskTypeId',TaskName);
      return this.http.get(url,{params: params}).map(data=>data);
    
    }
    GetUpdatedTerminationList(sectionid)
    {
      const url='api/Grower/GetTerminatedPlantCount';
  let params = new HttpParams();
  params=params.append('ClientId',String(this.appCommonService.getUserProfile().ClientId));
  params=params.append('SectionId',sectionid);
  return this.http.get(url,{params: params}).map(data=>data);

    }
    GetPhasesInfo(sectionid){
      const url='api/Grower/GetSectionDetails';
  let params = new HttpParams();
  params=params.append('SectionId',sectionid);
  return this.http.get(url,{params: params}).map(data=>data);
    }
    GetCompleteInfo(sectionid,TaskTypeId){
      const url='api/Grower/GetTerminationDetails';
  let params = new HttpParams();
  params=params.append('SectionId',sectionid);
  params=params.append('TaskTypeId',TaskTypeId);
  return this.http.get(url,{params: params}).map(data=>data);
    }
    getFieldsInGrowers() {
  const url = 'api/Grower/GetFieldsSectionList';

      let params = new HttpParams();
      params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
    .get(url, {params: params})

   .map(data => {
    // console.log('Brands Service success');
    return data;
   });
}
}
