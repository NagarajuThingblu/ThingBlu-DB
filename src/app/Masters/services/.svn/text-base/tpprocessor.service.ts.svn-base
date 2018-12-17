import { Injectable } from '@angular/core';
import { DataService } from '../../shared/services/DataService.service';
import { UserModel } from '../../shared/models/user.model';
import { HttpParams } from '@angular/common/http';
import { AppCommonService } from '../../shared/services/app-common.service';

@Injectable()
export class TpprocessorService {
  private _cookieService: any;

  constructor( private http: DataService,
    private appCommonService: AppCommonService
  ) {
    this._cookieService = this.appCommonService.getUserProfile();
   }
   private headers = new Headers({ 'Content-Type': 'application/json' });

  // Lot List By Client
  getAlltpProcessorListByClient() {
    const url = 'api/TPProcessor/GetTPListByClient';
    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
    .get(url, {params: params})

    .map(data => {

      console.log('GetAlltpProcessorListByClient Service success');
      // console.log(data);
      return data;
    });
  }

  addTPProcessorDetails(TPProcessorDetailsForApi: any) {
    const url = 'api/TPProcessor/TPProcessorAddUpdate';

    return this.http.post(url, TPProcessorDetailsForApi, this.headers)
    // .do(data =>console.log('All : ' + JSON.stringify(data)))
   .map(data =>  data );
  }
}
