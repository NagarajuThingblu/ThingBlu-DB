import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { DataService } from '../../shared/services/DataService.service';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../../shared/models/user.model';
import { AppCommonService } from '../../shared/services/app-common.service';

@Injectable()
export class GrowerDetailsActionService {
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

  addLotEntry(lotDetailsForApi: any) {
      const url = 'api/PrcsrLot/SavePrscrLot';

      return this.http.post(url, lotDetailsForApi, this.headers)
      // .do(data =>console.log('All : ' + JSON.stringify(data)))
     .map(data =>  data );
    }

  addRowSuplierDetails(RowSuplierDetailsForApi: any) {
    const url = 'api/Rawsuplr/RawSupplierAddUpdate';

    return this.http.post(url, RowSuplierDetailsForApi, this.headers)
    // .do(data =>console.log('All : ' + JSON.stringify(data)))
    .map(data =>  data );
  }
  addNewUser(employeeForApi: any){
    const url = 'api/Employee/AddNewAzureUser';
    return this.http.post(url, employeeForApi, this.headers)
    .map(data =>  data );
  }
  getEmptyBins(){
    const url = 'api/Grower/GetEmptyBins';
    let params = new HttpParams();
    params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

    return this.http
    .get(url, {params: params})

    .map(data => {
      console.log('GetRowSuplierDetailList Service success');
      return data;
    });
  }
  getRowSuplierDetailList() {
      const url = 'api/Rawsuplr/GetGrowerListByClient';
      let params = new HttpParams();
      params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));

      return this.http
      .get(url, {params: params})

      .map(data => {
        console.log('GetRowSuplierDetailList Service success');
        return data;
      });
    }

    getGrowerListByRawSupId(RawSupId) {
      const url = 'api/Rawsuplr/GetGrowerListByRawSupId';
      let params = new HttpParams();
      params = params.append('RawSupId', RawSupId);
      return this.http
      .get(url, {params: params})
      .map(data => {
        console.log('GetRowSuplierDetailList Service success');
        return data;
      });
    }

    getBrandFromGrower(growerId: string) {
      const url = 'jsonplaceholder.typicode.com/albums';

      return this.http
      .get(url, {})
      // .do(data =>console.log('All : ' + JSON.stringify(data)))
     .map(data => {
      console.log('GetBrandFromGrower Service success');
      return data;
     });
  }

}
