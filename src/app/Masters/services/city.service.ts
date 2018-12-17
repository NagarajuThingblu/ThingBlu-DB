import { Injectable } from '@angular/core';
import { DataService } from '../../shared/services/DataService.service';
import { UserModel } from '../../shared/models/user.model';
import { AppCommonService } from '../../shared/services/app-common.service';

@Injectable()
export class CityService {
  private _cookieService: any;
  constructor(
    private http: DataService,
    private appCommonService: AppCommonService
  ) {
    this._cookieService = this.appCommonService.getUserProfile();
  }
  private headers = new Headers({ 'Content-Type': 'application/json' });

  addCityDetails(CityDetailsForApi: any) {
    const url = 'api/City/AddUpdateCity';

    return this.http.post(url, CityDetailsForApi, this.headers)
    // .do(data =>console.log('All : ' + JSON.stringify(data)))
   .map(data =>  data );
  }

  addCountryDetails(CountryDetailsForApi: any) {
    const url = 'api/Country/AddUpdateCountry';

    return this.http.post(url, CountryDetailsForApi, this.headers)
    // .do(data =>console.log('All : ' + JSON.stringify(data)))
   .map(data =>  data );
  }

  addStateDetails(StateDetailsForApi: any) {
    const url = 'api/State/AddUpdateState';

    return this.http.post(url, StateDetailsForApi, this.headers)
    // .do(data =>console.log('All : ' + JSON.stringify(data)))
   .map(data =>  data );
  }

  getAllCityList() {
    const url = 'api/City/GetCityList';

    return this.http
    .get(url)
    .map(data => {
      console.log('GetAllCityList Service success');
      // console.log(data);
      return data;
    });
  }
}
