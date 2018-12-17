import { DataService } from './../../shared/services/DataService.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../../shared/models/user.model';
import { AppCommonService } from '../../shared/services/app-common.service';

@Injectable()
export class OilService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private _cookieService: UserModel;

  constructor(
    private http: DataService,
    private appCommonService: AppCommonService
  ) {
    this._cookieService = this.appCommonService.getUserProfile();
  }

  getOilProcessingLotDetails(): Observable<any> {
    //  return Observable.of(
    //     {
    //       'Table': [
    //             {'StrainId': '1', 'StrainName': 'xxx', 'LotId': '22', 'GrowerLotNo': 'Lot001', 'AvailableWt': 10},
    //             {'StrainId': '1', 'StrainName': 'xxx', 'LotId': '223', 'GrowerLotNo': 'Lot3001', 'AvailableWt': 410},
    //             {'StrainId': '2', 'StrainName': 'ddf', 'LotId': '236', 'GrowerLotNo': 'Lot0402', 'AvailableWt': 204},
    //             {'StrainId': '2', 'StrainName': 'ddf', 'LotId': '2333', 'GrowerLotNo': 'Lot0025', 'AvailableWt': 220}
    //       ]
    //     }
    //   );

    const url = 'api/TPProcessor/GetLotListForOilOutwordByClient';
    let params = new HttpParams();

    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
      .get(url, { params: params })

      .map(data => {
        console.log('Get Processors Service success');
        return data;
      });
  }

  getProcessorDetails(ProcessorId): Observable<any> {

    const url = 'api/TPProcessor/GetLotListForOilInwordByTP';
    let params = new HttpParams();

    params = params.append('TPId', ProcessorId);

    return this.http
      .get(url, { params: params })

      .map(data => {
        console.log('Get Processors Service success');
        return data;
      });
  }

  getProcessors(): Observable<any> {
    const url = 'api/TPProcessor/GetTPListByClient';
    let params = new HttpParams();

    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
      .get(url, { params: params })

      .map(data => {
        console.log('Get Processors Service success');
        return data;
      });
  }

  getProcessorsForInward(): Observable<any> {
    const url = 'api/TPProcessor/GetTPListForInwardListing';
    let params = new HttpParams();

    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
      .get(url, { params: params })

      .map(data => {
        console.log('Get Processors for inward Service success');
        return data;
      });
  }

  getPaymentModes() {

    // return Observable.of(
    //   [
    //     { label: '-- Select --', value: null },
    //     { label: 'Money', value: 1 },
    //     { label: 'Material %', value: 2 },
    //   ]
    // );
    const url = 'api/PaymentTypes/GetPaymentTypesByClient';
    let params = new HttpParams();

    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
      .get(url, { params: params })

      .map(data => {
        console.log('Get Payment Modes success');
        return data;
      });
  }

  saveOilOutwordDetails(oilProcessingDetailsForApi) {
    const url = 'api/TPProcessor/SaveOilOutwordLotDetails';
    oilProcessingDetailsForApi.OilOutwordDetails.VirtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;

    return this.http.post(url, oilProcessingDetailsForApi, this.headers)
      .map(data => data);

  }

  saveOilInWordDetails(oilProcessedDetailsForApi) {
    const url = 'api/TPProcessor/SaveOilInwordDetails';
    oilProcessedDetailsForApi.OilInwordDetails.VirtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;

    return this.http.post(url, oilProcessedDetailsForApi, this.headers)
      .map(data => data);

  }

  getOilOutwordDetails() {
    const url = 'api/TPProcessor/GetOilOutwordListByClient';
    let params = new HttpParams();

    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
      .get(url, { params: params })

      .map(data => {
        console.log('Get Oil Outword Details success');
        return data;
      });
  }

  getTPProcessorInfo(ProcessorId) {
    const url = 'api/TPProcessor/GetOilOutwordListByClient';
    let params = new HttpParams();

    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
      .get(url, { params: params })

      .map(data => {
        console.log('Get Oil Outword Details success');
        return data;
      });
  }

  getOilInwordDetails() {
    const url = 'api/TPProcessor/GetOilInwordListByClient';
    let params = new HttpParams();

    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
      .get(url, { params: params })

      .map(data => {
        console.log('Get Oil Outword Details success');
        return data;
      });
  }

}
