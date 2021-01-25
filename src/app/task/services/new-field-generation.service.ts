import { Injectable } from '@angular/core';
import{Headers,RequestOptions}from '@angular/http'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import {DataService} from '../../shared/services/DataService.service';
import{HttpParams} from '@angular/common/http';
import{AppCommonService} from '../../shared/services/app-common.service';


@Injectable()
export class NewFieldGenerationService {
 
private _cookieservice:any;
  constructor(private http:DataService,private appcommonservice:AppCommonService,private appCommonService: AppCommonService) 
  {
    this._cookieservice=appcommonservice.getUserProfile();
   }
   private headers=new Headers({
    'Content-Type': 'application/json'
   })
   private options = new RequestOptions({
    headers: this.headers
  });
//#region RoomType
addNewField(Fieldtypemassterform:any)
{
  const url='api/Grower/AddUpdateFields';

  return this.http.post(url, Fieldtypemassterform, this.headers).map(data =>  data );
}
GetFieldList()
{
  const url='api/RoomType/GetFieldsList';
    let params = new HttpParams();
    params=params.append('ClientId',String(this.appCommonService.getUserProfile().ClientId));
    return this.http.get(url,{params: params}).map(data=>data);
}
}
