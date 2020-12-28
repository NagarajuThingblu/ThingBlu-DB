import { Injectable } from '@angular/core';
import { DataService } from '../../shared/services/DataService.service';
import { HttpParams } from '@angular/common/http';
import { UserModel } from '../../shared/models/user.model';
import { AppCommonService } from '../../shared/services/app-common.service';

@Injectable()
export class DashobardService {

  constructor(
    private http: DataService,
    private appCommonService: AppCommonService
  ) {
   }

  getJointsProductionDashboardDetails(filterSectionModels, TaskTypeKey = '') {
    const url = 'api/Task/GetJointsProductionDashboardDetails';
    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    params = params.append('OrdersBy', filterSectionModels.viewOrdersBy);

    if (filterSectionModels.viewOrdersBy === 'DD') {
      params = params.append('StartDate', new Date(filterSectionModels.deliveryDate).toLocaleDateString().replace(/\u200E/g, ''));
      params = params.append('EndDate', null);
    } else if (filterSectionModels.viewOrdersBy === 'DDR') {
      params = params.append('StartDate', new Date(filterSectionModels.beginDate).toLocaleDateString().replace(/\u200E/g, ''));
      params = params.append('EndDate', new Date(filterSectionModels.endDate).toLocaleDateString().replace(/\u200E/g, ''));
    } else {
      params = params.append('StartDate', null);
      params = params.append('EndDate', null);
    }

    // Adding tasktypekey to parameters
    params = params.append('TaskTypeKey', TaskTypeKey);

    return this.http
    .get(url, {params: params})

   .map(data => {
    return data;
   });
}

getproductionDashboardDetails()
{
const url="api/Task/GetProductionDashboardDetails";
let params = new HttpParams();
params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
return this.http
    .get(url, {params: params})

   .map(data => {
    return data;
   });
}

getytdprodcutstatsDetails()
{
  const url="api/Task/GetYTDProductivityStatistics";
  let params = new HttpParams();
  params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
  return this.http
      .get(url, {params: params})
  
     .map(data => {
      return data;
     });
}
GetTasktypeTotaltime()
{
  const url = 'api/Task/GetTaskTypeTotalTime';
  let params = new HttpParams();
  params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
  params = params.append('EmpId', '111');
  params = params.append('FilterType', String('MTD'));
  params=params.append("EmpfilterId",'126');
  params=params.append("showall",'false');
  return this.http
  .get(url, {params: params})

 .map(data => {
  return data;
 });
}

GetemployeeList()
{
  const url="api/Employee/GetEmployeeListByClientRole";
  let param= new HttpParams();
  param=param.append('ClientId',String(this.appCommonService.getUserProfile().ClientId))
  param= param.append('ManagerId',String(this.appCommonService.getUserProfile().EmpId))
  return this.http.get(url,{params: param}).map(data=>{
    return data;
  });
}
GetProductivityStatistics()
{
  const url="api/Task/GetProductivityStatistics";
  let param= new HttpParams();
  //param= param.append('EmpId',String(this.appCommonService.getUserProfile().EmpId))
  param= param.append('EmpId','111');
  param=param.append('ClientId',String(this.appCommonService.getUserProfile().ClientId))
  param=param.append("FilterempId",'0');
  param=param.append("showAll",'true');
  return this.http.get(url,{params: param}).map(data=>{
    return data;
  });
}

}
