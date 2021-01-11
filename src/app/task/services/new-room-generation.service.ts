import { Injectable } from '@angular/core';
import{Headers,RequestOptions}from '@angular/http'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import {DataService} from '../../shared/services/DataService.service';
import{HttpParams} from '@angular/common/http';
import{AppCommonService} from '../../shared/services/app-common.service';


@Injectable()
export class NewRoomGenerationService {
 
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
   addNewRoomType(RoomtypeMasterform:any)
   {
     const url='api/RoomType/AddUpdateRoomType';

     return this.http.post(url, RoomtypeMasterform, this.headers).map(data =>  data );
   }
   getRoomTypedetails()
   {
     const url='api/RoomType/GetRoomTypeList';
     let params = new HttpParams();
     params=params.append('ClientId',String(this.appCommonService.getUserProfile().ClientId));
     return this.http.get(url,{params: params}).map(data=>data);
   }
//#endregion RoomType

//#region Zones
addNewZones(ZoneTypeMasterform:any)
{
  const url='api/RoomType/AddUpdateZones';

  return this.http.post(url,ZoneTypeMasterform,this.headers).map(data=>data);
}

GetZonelist()
{
  const url='api/RoomType/GetZones';
  let params = new HttpParams();
  params=params.append('ClientId',String(this.appCommonService.getUserProfile().ClientId));
  return this.http.get(url,{params: params}).map(data=>data);

}
//#endregion

////#region Room 
addNewRoom(RoomtypeMasterform:any)
{
  const url='api/RoomType/AddUpdateRooms';

  return this.http.post(url,RoomtypeMasterform,this.headers).map(data=>data);
}
GetRoomList()
{
  const url='api/RoomType/GetRoomsList';
    let params = new HttpParams();
    params=params.append('ClientId',String(this.appCommonService.getUserProfile().ClientId));
    return this.http.get(url,{params: params}).map(data=>data);
}
GetRoomTypes()
{
  const url='api/RoomType/GetRoomTypeList';
    let params = new HttpParams();
    params=params.append('ClientId',String(this.appCommonService.getUserProfile().ClientId));
    return this.http.get(url,{params: params}).map(data=>data);
}

////#region 


GetRoomTableList() {
  const url='api/RoomType/GetRoomTables';
    let params = new HttpParams();
    params=params.append('ClientId',String(this.appCommonService.getUserProfile().ClientId));
    return this.http.get(url,{params: params}).map(data=>data);
}
addNewRoomTable(RoomTableMasterform:any)
{
  const url='api/RoomType/AddUpdateRoomTables';
  console.log(RoomTableMasterform);
  return this.http.post(url,RoomTableMasterform,this.headers).map(data=>data);
}
GetRoomTableMaplist()
{
  const url='api/RoomType/GetRoomTableMaplist';
    let params = new HttpParams();
    params=params.append('ClientId',String(this.appCommonService.getUserProfile().ClientId));
    return this.http.get(url,{params: params}).map(data=>data);
}
}
