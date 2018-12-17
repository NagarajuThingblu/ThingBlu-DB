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

  getJointsProductionDashboardDetails() {
    const url = 'api/Task/GetJointsProductionDashboardDetails';
    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
    .get(url, {params: params})

   .map(data => {
    return data;
   });
}

}
