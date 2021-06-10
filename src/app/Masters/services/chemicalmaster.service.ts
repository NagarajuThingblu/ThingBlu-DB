import { Injectable } from '@angular/core';
import { DataService } from '../../shared/services/DataService.service';
import { UserModel } from '../../shared/models/user.model';
import { HttpParams } from '@angular/common/http';
import { AppCommonService } from '../../shared/services/app-common.service';

@Injectable()
export class ChemicalMasterService {
    private _cookieService: any;
    constructor(private http: DataService,
        private appCommonService: AppCommonService
      ) {
        this._cookieService = <UserModel>this.appCommonService.getUserProfile();
       }
       private headers = new Headers({ 'Content-Type': 'application/json' });

       addChemicalMasterDetails(ChemicalDetailsForApi: any) {
        const url = 'api/Grower/AddUpdateChemicalType';
    
        return this.http.post(url, ChemicalDetailsForApi, this.headers)
        // .do(data =>console.log('All : ' + JSON.stringify(data)))
       .map(data =>  data );
      }
      addChemicalPurchaseDetails(ChemicalpurchaseDetailsForApi: any) {
        const url = 'api/Grower/AddUpdateChemicalPurchase';
    
        return this.http.post(url, ChemicalpurchaseDetailsForApi, this.headers)
        // .do(data =>console.log('All : ' + JSON.stringify(data)))
       .map(data =>  data );
      }
      GetAllChemicalTypeListByClient(){
        const url = 'api/Grower/GetChemicalType';
        let params = new HttpParams();
        params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
    
        return this.http
        .get(url, {params: params})
    
        .map(data => {
    
          console.log('GetAllChemicalTypeListByClient Service success');
          // console.log(data);
          return data;
        });
      }

      GetAllChemicalPurchaseListByClient(){
        const url = 'api/Grower/GetChemicalPurchaseDetails';
        let params = new HttpParams();
        params = params.append('ClientId', String(this.appCommonService.getUserProfile().ClientId));
    
        return this.http
        .get(url, {params: params})
    
        .map(data => {
    
          console.log('GetAllChemicalPurchaseListByClient Service success');
          // console.log(data);
          return data;
        });
      }

}