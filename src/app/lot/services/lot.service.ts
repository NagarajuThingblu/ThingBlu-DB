import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { DataService } from '../../shared/services/DataService.service';
import { UserModel } from '../../shared/models/user.model';
import { Observable } from 'rxjs/Observable';
import { AppCommonService } from '../../shared/services/app-common.service';

@Injectable()
export class LotService {

  private _cookieService: any;

  constructor(
    private http: DataService,
    private appCommonService: AppCommonService
  ) {
    this._cookieService = this.appCommonService.getUserProfile();
  }

  private headers = new Headers({ 'Content-Type': 'application/json' });

  // Lot List By Client
  getAllLotListByClient() {
    const url = 'api/PrcsrLot/GetPrscrLotListByClient';
    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
    .get(url, {params: params})

    .map(data => {
      console.log('GetAllLotListByClient Service success');
      return data;
    });
  }

    // Lot List By Client
    getLotNotes(LotId) {
      const url = 'api/PrcsrLot/GetPrscrLotNotesByLot';
      let params = new HttpParams();
      params = params.append('LotId', LotId);

      return this.http
      .get(url, {params: params})

      .map(data => {
        console.log('GetLotNotes Service success');
        return data;
      });
    }

    getInventorywiseOpenTaskListByLotId(LotId , InventoryType) {
      const url = 'api/PrcsrLot/InventorywiseOpenTaskListByLotId';
      let params = new HttpParams();
      params = params.append('LotId', LotId);
      params = params.append('InventoryType', InventoryType);

      return this.http
      .get(url, {params: params})

      .map(data => {
        console.log('GetInventorywiseOpenTaskListByLotId Service success');
        return data;
      });
    }

  // For completion of task
  saveLotNote(lotNoteDetailsForApi: any) {
    const apiUrl = 'api/PrcsrLot/SavePrscrLotNotes';

    lotNoteDetailsForApi.LotNotes.VirtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
    return this.http.post(apiUrl, lotNoteDetailsForApi, this.headers)
    .map(data =>  data );
  }

  getThreasholdForLot(): Observable<any> {
    // const apiUrl = 'api/PrcsrLot/SavePrscrLotNotes';

    // lotNoteDetailsForApi.LotNotes.VirtualRoleId = <UserModel>this.appCommonService.getUserProfile().VirtualRoleId;
    // return this.http.post(apiUrl, lotNoteDetailsForApi, this.headers)
    // .map(data =>  data );

    return Observable.of(
        {
          'Threshold': 5
        }
      );
  }

  // Added By Bharat T on 13th-July-2018
  getPrscrLotDetailsByLotId(LotId) {
    const url = 'api/PrcsrLot/GetPrscrLotDetailsByLotId';
    let params = new HttpParams();
    params = params.append('LotId', LotId);

    return this.http
    .get(url, {params: params})

    .map(data => {
      console.log('Get Prscr Lot Details By LotId Service success');
      return data;
    });
  }

  prscrLotDelete(LotId) {
    const apiUrl = 'api/PrcsrLot/PrscrLotDelete';

   const LotDeleteObj = {
      VirtualRoleId: this.appCommonService.getUserProfile().VirtualRoleId,
      LotId: LotId
   };
    return this.http.post(apiUrl, LotDeleteObj, this.headers)
    .map(data =>  data );
  }
  // End of Added By Bharat T on 13th-July-2018

  getLotInventoryDetailsByLotId(LotId) {
    const url = 'api/PrcsrLot/GetLotInventoryDetailsByLotId';
    let params = new HttpParams();
    params = params.append('LotId', LotId);

    return this.http
    .get(url, {params: params})

    .map(data => {
      console.log('GetLotInventoryDetailsByLotId Service success');
      return data;
    });
  }

  getLotShrinkageDetailsByLotId(LotId) {
    const url = 'api/PrcsrLot/GetLotShrikageDetailsByLotId';
    let params = new HttpParams();
    params = params.append('LotId', LotId);

    return this.http
    .get(url, {params: params})

    .map(data => {
      console.log('GetLotShrinkageDetailsByLotId Service success');
      return data;
    });
  }

  // For Shrinkage of lot
  saveLotShrinkageDetails(lotShrinkageDetailsForApi: any) {
    const apiUrl = 'api/PrcsrLot/SaveLotShrinkageDetails';
    return this.http.post(apiUrl, lotShrinkageDetailsForApi, this.headers)
    .map(data =>  data );
  }

}
