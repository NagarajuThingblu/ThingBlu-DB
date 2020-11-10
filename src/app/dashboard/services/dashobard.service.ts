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

}
