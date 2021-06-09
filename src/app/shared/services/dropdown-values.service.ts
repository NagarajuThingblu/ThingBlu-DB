import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { DataService } from './DataService.service';
import { RequestOptions } from '@angular/http';
import { UserModel } from '../models/user.model';
import { AppCommonService } from './app-common.service';


@Injectable()
export class DropdownValuesService {
  private _cookieService: any;
  // constructor(private http: DataService) { }
  constructor(
    private http: DataService,
    private appCommonService: AppCommonService
  ) {
    this._cookieService = this.appCommonService.getUserProfile();
  }

  private headers = new Headers({ 'Content-Type': 'application/json' });

  getGrowers(RawSupId) {
      const url = 'api/RawSuplr/GetGrowerListByClientId';
      let params = new HttpParams();
      params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
      params = params.append('RawSupId', RawSupId);
      return this.http
      .get(url, {params: params})
      .map(
        data => {
          // console.log('Growers Service success');
          return data;
        }
      );
    //   .get<any>(url)
    // //   // .do(data =>console.log('All : ' + JSON.stringify(data)))
    //  .map(data => {
    // //   console.log('Growers Service success');
    //   return data;
    //  })
  }
  getAllDetails(){
    const url = 'api/Grower/GetStrainDetailsLD';
    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
  
    return this.http
    .get(url, {params: params})
  
    .map(data => {
  
      console.log('GetAllDetails Service success');
      // console.log(data);
      return data;
    });

  }

  getAllTask() {
    const url = 'api/TaskType/GetTaskTypeByClient';
    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
    .get(url, {params: params})

   .map(data => {
    // console.log('GetAllTask Service success');
    return data;
   });
}

getEmployeeListByClient() {
    const url = 'api/Employee/GetEmployeeListByClient';
    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
    .get(url, {params: params})

  .map(data => {
    // console.log('GetEmployeeListByClient Service success');
    return data;
  });
}

GetAllRetailerListByClient(){
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


getEmployeeListByTaskTypeKey(TaskTypeKey: any) {
  const url = 'api/Employee/GetEmployeeListByTaskTypeKey';
  let params = new HttpParams();
  params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
  params = params.append('TaskTypeKey', TaskTypeKey);

  return this.http
  .get(url, {params: params})

.map(data => {
  // console.log('GetEmployeeListByTaskTypeKey Service success');
  return data;
});
}

// Lot List By Task
getLotListByTask(TaskTypeId, TaskId = 0) {
  const url = 'api/PrcsrLot/GetPrscrLotListByTask';
  let params = new HttpParams();
  params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
  params = params.append('TasktypeId', TaskTypeId);
  params = params.append('TaskId', String(TaskId));

  return this.http
  .get(url, {params: params})

.map(data => {
  // console.log('GetLotListByTask Service success');
  return data;
});
}

getBrands() {
  const url = 'api/Brand/GetBrandList';

      let params = new HttpParams();
      params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
    .get(url, {params: params})

   .map(data => {
    // console.log('Brands Service success');
    return data;
   });
}
getFields() {
  const url = 'api/Grower/GetFieldsList';

      let params = new HttpParams();
      params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
    .get(url, {params: params})

   .map(data => {
    // console.log('Brands Service success');
    return data;
   });
}
getBins(TaskId) {
  const url = 'api/Grower/GetBinsByTaskId';

      let params = new HttpParams();
      params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
      params = params.append('TaskId', TaskId);
    return this.http
    .get(url, {params: params})

   .map(data => {
    // console.log('Brands Service success');
    return data;
   });
}

getBinsAtReview(){
  const url='api/Grower/GetBinLabelsList';
    let params = new HttpParams();
    params=params.append('ClientId',String(this.appCommonService.getUserProfile().ClientId));
    return this.http.get(url,{params: params}).map(data=>data);
}
getFieldsSectionsInGrowers(TaskTypeId) {
  const url = 'api/Grower/GetFieldsSectionList';

      let params = new HttpParams();
      params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
      params = params.append('TaskTypeId', TaskTypeId);
    return this.http
    .get(url, {params: params})

   .map(data => {
    // console.log('Brands Service success');
    return data;
   });
}

getEmpAlreadyWorkingOnATask(sectionId){
  const url = 'api/Grower/GetEmpListBySectionId';

  let params = new HttpParams();
  params = params.append('SectionId', sectionId);
return this.http
.get(url, {params: params})

.map(data => {
// console.log('Brands Service success');
return data;
});
}
getTaskType() {
  const url = 'api/Grower/GetFieldsList';

      let params = new HttpParams();
      params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
    .get(url, {params: params})

   .map(data => {
    // console.log('Brands Service success');
    return data;
   });
}

  getStrains() {
    const url = 'api/Strain/GetStrainList';

      let params = new HttpParams();
      params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

      return this.http
      .get(url, {params: params})
     .map(data => {
      // console.log('Strains Service success');
      return data;
     });
  }

  getStrainsByTaskType(TaskTypeId) {
    const url = 'api/Grower/GetBinsDataByTaskType';

      let params = new HttpParams();
      params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
      params = params.append('TaskTypeId', TaskTypeId);
      return this.http
      .get(url, {params: params})
     .map(data => {
      // console.log('Strains Service success');
      return data;
     });
  }
  getStrainsForLotEdit(StrainId) {
    const url = 'api/Strain/GetStrainListForLotEdit';

      let params = new HttpParams();
      params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
      params = params.append('StrainId', StrainId);
      return this.http
      .get(url, {params: params})
     .map(data => {
      // console.log('Strains Service success');
      return data;
     });
  }

  getStrainsOnSelectBrand() {
    const url = 'http://jsonplaceholder.typicode.com/albums';

    return this.http
    .get(url)
   .map(data => {
    // console.log('Strains Service success');
    return data;
   });
}

getSkewListByClient() {
  const url = 'api/Skew/GetSkewListByClient';
  let params = new HttpParams();
  params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

  return this.http
  .get(url, {params: params})

 .map(data => {
  // console.log('GetSkewListByClient Service success');
  return data;
 });
}

getQAIssueTypes(): Observable<any> {
  return Observable.of(
    [
      // Table: [
        { IssueName: 'Label Replace', IssueCode: 'RELABEL', SkewKeyName: ''},
        { IssueName: 'Package Replace', IssueCode: 'REPACK', SkewKeyName: ''},
        { IssueName: 'Bud Replace', IssueCode: 'MATERIALCHANGE', SkewKeyName: 'BUD'},
        { IssueName: 'Joints Replace', IssueCode: 'MATERIALCHANGE', SkewKeyName: 'JOINTS'},
        { IssueName: 'Oil Replace', IssueCode: 'MATERIALCHANGE', SkewKeyName: 'OIL'},
      // ]
    ]
  );
}


getStrainType() {
  const url = 'api/StrainType/GetStrainTypeList';

    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
    return this.http
    .get(url, {params: params})
   .map(data => {
    // // console.log('Strains Service success');
    return data;
   });
}
getChemicalTypes(){
  const url = 'api/Grower/GetChemicalType';

  let params = new HttpParams();
  params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
  return this.http
  .get(url, {params: params})
 .map(data => {
  // // console.log('Strains Service success');
  return data;
 });
}

getPackageTypeList() {
  const url = 'api/PackagingTypes/GetPackagingTypesList';
  let params = new HttpParams();
  params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

  return this.http
  .get(url, {params: params})

 .map(data => {
  // console.log('GetPackagingTypesList Service success');
  return data;
 });
}

getClientList() {
  const url = 'api/Client/GetClientList';

  return this.http
  .get(url)

 .map(data => {
  // console.log('GetClientList Service success');
  return data;
 });
}

getCountryList() {
  const url = 'api/country/GetCountryList';

  return this.http
  .get(url)

 .map(data => {
  // console.log('GetCountryList Service success');
  return data;
 });
}
getUOM(){
  const url = 'api/Grower/GetUnitofMeasures';
  return this.http
    .get(url)
   .map(data => {
    // console.log('Strains Service success');
    return data;
   });
}
getStatesList() {
  const url = 'api/State/GetStateList';

  return this.http
  .get(url)

 .map(data => {
  // console.log('GetStatesList Service success');
  return data;
 });
}

getCitiesList() {
  const url = 'api/City/GetCityList';

  return this.http
  .get(url)

 .map(data => {
  // console.log('GetCityList Service success');
  return data;
 });
}
getRetailerTypeList() {
  const url = 'api/Retailer/GetRetailerTypes';
  let params = new HttpParams();
  params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
  return this.http
  .get(url, {params: params})

 .map(data => {
  // console.log('GetRetailerTypeList Service success');
  return data;
 });
}

getRoleList() {
  const url = 'api/Role/GetRoleList';
  let params = new HttpParams();
  params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
  return this.http
  .get(url, {params: params})
 .map(data => {
  // console.log('GetRoleList Service success');
  return data;
 });
}
getNewTaskType() {
  const url = 'api/TaskType/GetTaskCategory';
  let params = new HttpParams();
  params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
    return this.http
    .get(url, {params: params})
   .map(data => {
    // // console.log('Strains Service success');
    return data;
   });
}
getManagerList() {
  const url = 'api/Employee/GetManagerList';
  let params = new HttpParams();
  params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
  return this.http
  .get(url, {params: params})
 .map(data => {
  // console.log('GetRoleList Service success');
  return data;
 });
}
GetFLClist() {
  const url = 'api/Grower/GetFLCList';
  let params = new HttpParams();
  params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
  return this.http
  .get(url, {params: params})
 .map(data => {
  // console.log('GetRoleList Service success');
  return data;
 });
}
}
