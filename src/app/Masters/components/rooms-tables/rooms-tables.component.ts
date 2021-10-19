import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { LoaderService } from '../../../shared/services/loader.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { NewRoomGenerationService } from '../../../task/services/new-room-generation.service';
import { CookieService } from 'ngx-cookie-service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { ConfirmationService, Confirmation } from 'primeng/api';
import { AppConstants } from '../../../shared/models/app.constants';
import { AppComponent } from '../../../../app/app.component';
import { stringify } from 'querystring';
import { flatMap } from 'rxjs/operators';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-rooms-tables',
  templateUrl: './rooms-tables.component.html',
  styleUrls: ['./rooms-tables.component.css']
})
export class RoomsTablesComponent implements OnInit {
public newRoomTableresource:any;
public RoomtableMasterform:any;
public globalresource:any;
public submitted:boolean;
public _Cookieservice:any;
public allRoomTablelist:any;
public msg:any[];
public RoomTableforupdate:any=0;
public RoomTableEdit:any;
public savebuttontext='save';
public clear='Clear';
paginationvalues:any;
chkIsActive:any;
public event:any;
newRoomTabledetails:{
  RoomTable:null;
  Description:null;
}
pageheading:any;
public Roomlist:any[];
public Zonelist:any[];
public RoomtableonEdit:any;
public RoomTypeDisable:any;
public RoomTableList: any;
public selectedRoom: any;
public allRoomList:any;
public allzonelist:any;
public ZoneVisible:boolean=false;

  constructor(private loaderservice:LoaderService, private fb:FormBuilder,private cookieService:CookieService,
     private appcomponent: AppComponent,private appComonservice:AppCommonService,
     private NewRoomgeneration: NewRoomGenerationService,private Confirmationservice: ConfirmationService,
     private dropdwonTransformService: DropdwonTransformService,
     private appCommonService: AppCommonService,
     private confirmationService: ConfirmationService,
     private router: Router ) { }

  ngOnInit() {
    this.loaderservice.display(false);
    this.chkIsActive=1;
    this.pageheading="Add New RoomTable";
    this.appcomponent.setTitle("RoomTable");
    this.newRoomTableresource=MastersResource.getResources().en.addNewRoomTable;
    this.globalresource=GlobalResources.getResources().en;
    this._Cookieservice=this.appComonservice.getUserProfile();
    this.GetRoomTables();
    this.GetRoomTableMaplist();
   // this.GetZones();
    this.RoomtableMasterform=this.fb.group({
      'Roomlist':new FormControl(null,[Validators.required]),
      'Zonelist': new FormControl(null,Validators.required),
      'RoomTable': new FormControl(null,[Validators.required,Validators.minLength(1),Validators.maxLength(50)]),
      'Length': new FormControl(null),
      'Width': new FormControl(null),
       'Height': new FormControl(null),
      'description': new FormControl(null),
      'chkIsActive': new FormControl(null)
    })

  }

GetRoomTables()
{
  //this.RoomTableList=[]
this.loaderservice.display(true);
this.NewRoomgeneration.GetRoomTableList().subscribe(data=>{
  if(data!='No data found!')
  {
    this.RoomTableList=data;
    this.paginationvalues=AppConstants.getPaginationOptions;
        if(this.RoomTableList.length>20)
        {
          this.paginationvalues[AppConstants.getPaginationOptions.length] = this.allRoomTablelist.length;
        }
      }
        else{
          this.RoomTableList=[]
        }
      this.loaderservice.display(false);
  
})
}
onPageChange(e) {
  this.event = e;
}
GetRoomTableMaplist()
{
this.loaderservice.display(true);
this.NewRoomgeneration.GetRoomTableMaplist().subscribe(data=>{
  if(data!="No data found")
  {
    this.allRoomList=data;
    this.Roomlist=this.dropdwonTransformService.transform(data,'RoomName','RoomId','-- Select --')
  }
  else
  {
    this.Roomlist=[]
  }

  this.loaderservice.display(false);
})
}
GetZones()
{
this.loaderservice.display(true);
this.NewRoomgeneration.GetZonelist().subscribe(data=>{
  if(data!="No data found")
  {
this.Zonelist= this.dropdwonTransformService.transform(data,'ZoneName','ZoneId','--select--')
  }
  else{
this.Zonelist=[]
  }
  this.loaderservice.display(false);
})
}

selectZones(RoomID)
{
  this.allzonelist= this.allRoomList.filter(fltr=>fltr.RoomId==RoomID);
  if(this.allzonelist[0].ZoneName!="Unknown")
  {
    this.ZoneVisible=true;
     this.Zonelist=this.dropdwonTransformService.transform(this.allzonelist,'ZoneName','ZoneId','--select--');
  }
  else{
    this.ZoneVisible=false;
    this.RoomtableMasterform.value.Zonelist=null;
  }
}

saveRoomtble(FormModel)
{
  if (String(this.RoomtableMasterform.value.RoomTable).trim().length == 0) {
    this.RoomtableMasterform.controls['RoomTable'].setErros({ 'whitespace': true });
    this.RoomtableMasterform.value.Zone = null;
    return;
 }
 const RoomTableForAPI={
   RoomTables:{
RoomTableId:this.RoomTableforupdate,
TableName:this.appCommonService.trimString(this.RoomtableMasterform.value.RoomTable),
RoomId:this.RoomtableMasterform.value.Roomlist,
ZoneId:this.RoomtableMasterform.value.Zonelist,
Description:this.RoomtableMasterform.value.description,
VirtualRoleId: this._Cookieservice.VirtualRoleId,
IsActive: this.RoomtableMasterform.value.chkIsActive,
ClientId: this._Cookieservice.ClientId,
TbLen:this.RoomtableMasterform.value.Length,
TbWid:this.RoomtableMasterform.value.Width,
TbHeight:this.RoomtableMasterform.value.Height

   }
 }

 if(this.RoomtableMasterform.valid)
 {
   this.loaderservice.display(false);
   this.NewRoomgeneration.addNewRoomTable(RoomTableForAPI).subscribe(data=>{
this.msg=[];
if (data[0]['Result'] == 'success') {
  this.msg.push({
    severity: 'success', summary: this.globalresource.applicationmsg,
    detail: this.newRoomTableresource.newRoomTableSavedSuccess
  });
  this.resetAll();
  this.GetRoomTables();
}
else if (data == 'failue') {
  this.msg.push({ severity: 'error', summary: this.globalresource.applicationmsg, detail: this.globalresource.error })
}
else if (data == 'duplicate') {
  this.msg.push({ severity: 'warn', summary: this.globalresource.applicationmsg, detail: this.newRoomTableresource.RoomTableAlreadyExists })
}
else if (String(data.toLocaleUpperCase() === 'NOTUPDATED')) {
  this.msg.push({
    severity: 'warn', summary: this.globalresource.applicationmsg,
    detail: this.newRoomTableresource.noupdate
  });
}
else {
  this.msg.push({ severity: 'error', summary: this.globalresource.applicationmsg, detail: data });
}

this.loaderservice.display(false);
   },
   error => {
    this.msg = [];
    this.msg.push({ severity: 'error', summary: this.globalresource.applicationmsg, detail: error.message });
    // http call end
    this.resetAll();
    this.loaderservice.display(false);
  }
   
   )

 }
 else
 {
   this.appCommonService.validateAllFields(this.RoomtableMasterform);
 }

}
  resetAll() {
    this.RoomTableforupdate=0;
    this.savebuttontext='save';
    this.pageheading="Add New RoomTable";
    this.clear='Clear';
    this.resetForm();   
  }
  resetForm()
  {
this.RoomtableMasterform.reset({chkIsActive: true})
}
GetRoomTableOnEdit(TableId)
{
const data = this.RoomTableList.filter(x=>x.TableId==TableId)
if(data!='No data found')
{
  this.RoomTableforupdate = TableId;
  this.RoomtableonEdit=data;
  const RoomName = this.RoomtableMasterform.controls["Roomlist"];
  const zoneName = this.RoomtableMasterform.controls["Zonelist"];
  const TableName = this.RoomtableMasterform.controls["RoomTable"];
  const description = this.RoomtableMasterform.controls["description"];
  const chkIsActive = this.RoomtableMasterform.controls["chkIsActive"];
  const Length = this.RoomtableMasterform.controls["Length"];
  const width = this.RoomtableMasterform.controls["Width"];
  const height = this.RoomtableMasterform.controls["Height"];

  RoomName.patchValue(this.RoomtableonEdit[0].RoomId)
  zoneName.patchValue(this.RoomtableonEdit[0].ZoneId)
  TableName.patchValue(this.RoomtableonEdit[0].TableName)
  description.patchValue(this.RoomtableonEdit[0].TableDescription)
  chkIsActive.patchValue(this.RoomtableonEdit[0].IsActive)
  Length.patchValue(this.RoomtableonEdit[0].RmTblLength)
  width.patchValue(this.RoomtableonEdit[0].RmTblWidth)
  height.patchValue(this.RoomtableonEdit[0].RmTblHeight)

  this.clear='Cancel'
  this.savebuttontext = 'Update';
  this.pageheading = 'Edit RoomTable';



}
else {
  this.RoomTableList = [];
}
this.loaderservice.display(false);
}

showConformationMessaegForDelete(RoomTableID, Roomtable, IsDeleted, ActiveInactiveFlag)
{
  let strmessage:any;
  strmessage=this.newRoomTableresource.deleteRoomTableMsg;
  this.confirmationService.confirm({
    message: strmessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.activateDeleteRoom(RoomTableID, Roomtable, IsDeleted, ActiveInactiveFlag);
      },
      reject: () => {
      }
  });
}
activateDeleteRoom(RoomtableID, RoomTable, IsDeleted, ActiveInactiveFlag)
{
this.submitted=true;
const RoomTablesforAPI={
  RoomTables:{
    RoomTableId:RoomtableID,
    RoomId:RoomTable.RoomId,
    ZoneId:RoomTable.ZoneId,
    VirtualRoleId: this._Cookieservice.VirtualRoleId,
    IsDeleted: IsDeleted,
    IsActive: RoomTable.IsActive,
    ActiveInactive: ActiveInactiveFlag,
    ClientId: this._Cookieservice.ClientId,
  }
};
this.loaderservice.display(true);
this.NewRoomgeneration.addNewRoomTable(RoomTablesforAPI).subscribe(data=>{
  this.msg=[];
  if (data[0]['Result'] === 'success' && ActiveInactiveFlag === 1) {
    if (RoomTable.IsActive === true) {
      this.msg.push({severity: 'success', summary: this.globalresource.applicationmsg,
      detail:  this.newRoomTableresource.newRoomTableActivated});
      this.resetAll();
      this.GetRoomTables();
      this.loaderservice.display(false);
    } else {
      this.msg.push({severity: 'success', summary: this.globalresource.applicationmsg,
      detail:  this.newRoomTableresource.newRoomTableInactivated});
      this.resetAll();
      this.GetRoomTables();
      this.loaderservice.display(false);
    }
  } else if (data[0]['Result'] === 'success' && IsDeleted === 1) {
    this.msg.push({severity: 'success', summary: this.globalresource.applicationmsg,
    detail:  this.newRoomTableresource.newRoomTableDeleted});
    this.resetAll();
    this.globalresource();
    this.loaderservice.display(false);
  }else if (String(data.toLocaleUpperCase()) === 'NOTUPDATED') {
    if (IsDeleted === 1) {
      this.msg.push({severity: 'warn', summary: this.globalresource.applicationmsg,
      detail: this.newRoomTableresource.notdeleted });
      this.loaderservice.display(false);
    } else if (RoomTable.IsActive === true) {
      this.msg.push({severity: 'warn', summary: this.globalresource.applicationmsg,
      detail: this.newRoomTableresource.notactivated });
      RoomTable.IsActive = !RoomTable.IsActive;
      this.loaderservice.display(false);
    } else {
      this.msg.push({severity: 'warn', summary: this.globalresource.applicationmsg,
      detail: this.newRoomTableresource.notinactivated });
      RoomTable.IsActive = !RoomTable.IsActive;
      this.loaderservice.display(false);
    }
  }
    else if (String(data.toLocaleUpperCase()) === 'RoomOrZonesIsInactive') {
      this.msg.push({severity: 'warn', summary: this.globalresource.applicationmsg,
      detail: this.newRoomTableresource.roomtypeOrZonesIsInactive });
      RoomTable.IsActive = !RoomTable.IsActive;
      this.loaderservice.display(false);
  }
  else if (data === 'Failure') {
    this.msg.push({severity: 'error', summary: this.globalresource.applicationmsg, detail: this.globalresource.serverError });
  } else if (data === 'Duplicate') {
    this.msg.push({severity: 'warn', summary: this.globalresource.applicationmsg, detail: this.newRoomTableresource.RoomAlreadyExists });
  } else if (data === 'InUse') {
    this.msg = [];
    this.msg.push({severity: 'warn', summary: this.globalresource.applicationmsg,
    detail: 'Can`t delete. Record is in use.'});
  } else {
    this.msg.push({severity: 'error', summary: this.globalresource.applicationmsg, detail: data });
  }
    // http call end
    this.loaderservice.display(false);
  
}, error => {
  this.msg = [];
  this.msg.push({severity: 'error', summary: this.globalresource.applicationmsg, detail: error.message });
  // http call end
  this.resetAll();
  this.loaderservice.display(false);
}

)
}
showConformationMessaegForDeactive(RoomTableId, Roomtable, rowIndex, IsDeleted, ActiveInactiveFlag)
{
  let strMessage: any;
  if (this.RoomTableList[rowIndex].IsActive === true) {
    strMessage = this.newRoomTableresource.activeRoomTableMsg ;
  } else {
    strMessage = this.newRoomTableresource.deactivateRoomTableMsg ;
  }
  this.confirmationService.confirm({
    message: strMessage,
    header: 'Confirmation',
    icon: 'fa fa-exclamation-triangle',
    accept: () => {
       this.activateDeleteRoom(RoomTableId, Roomtable, IsDeleted, ActiveInactiveFlag);
      },
      reject: () => {
        Roomtable.IsActive = !Roomtable.IsActive;
      }
  });
}

}