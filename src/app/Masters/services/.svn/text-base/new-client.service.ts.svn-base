import { Injectable } from '@angular/core';
import { DataService } from '../../shared/services/DataService.service';
import { UserModel } from '../../shared/models/user.model';
import { HttpParams } from '@angular/common/http';
import { AppCommonService } from '../../shared/services/app-common.service';

@Injectable()
export class NewClientService {
  private _cookieService: any;
  constructor(private http: DataService,
    private appCommonService: AppCommonService) {
      this._cookieService = <UserModel>this.appCommonService.getUserProfile();
     }
     private headers = new Headers({ 'Content-Type': 'application/json' });
     getAllClientList() {
      const url = 'api/Client/GetClientList ';
      return this.http

      .get(url)
      .map(data => {
        console.log('GetAllClientList Service success');
        // console.log(data);
        return data;
      });
    }
    addClientDetails(ClientDetailsForApi: any) {
      const url = 'api/Client/ClientAddUpdate';
      return this.http.post(url, ClientDetailsForApi, this.headers)
      // .do(data =>console.log('All : ' + JSON.stringify(data)))
     .map(data =>  data );
    }

    getUTCTimeZoneNameValue() {
      const url = 'api/Client/GetUTCTimeZoneNameValue ';
      return this.http

      .get(url)
      .map(data => {
        console.log('GetUTCTimeZoneNameValue Service success');
        // console.log(data);
        return data;
      });
    }

    getDateFormat() {
      const url = 'api/Client/GetDateFormat ';
      return this.http

      .get(url)
      .map(data => {
        console.log('GetDateFormat Service success');
        // console.log(data);
        return data;
      });
    }

}
