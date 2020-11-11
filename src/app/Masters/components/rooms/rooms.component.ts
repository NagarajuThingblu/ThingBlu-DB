import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { LoaderService } from '../../../shared/services/loader.service';
import { AppCommonService } from '../../../shared/services/app-common.service'
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
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  public newRoomtyperesource:any;
  public Roomtypemassterform:any;
  public globalResource:any;
  public submitted: boolean;
  public _Cookieservice: any;
  public allRoomtypelist: any
  public msg: any[];
  public RoomTypeforupdate: any = 0;
  public RoomTypeEdit: any;
  public saveButtontext = 'save';
  public clear = 'Clear';
  paginationvalues: any;
  chkIsActive: any;
  public event: any;
  newRoomTypedetails: {
    roomType: null,
    Description: null

  }
  pageheading: any;
public RoomTypes:any[];
public Zonestypes:any[];
public RoomOnEdit:any;
public RoomTypeDisabled:any;
  constructor(private fb: FormBuilder,
    private loadService: LoaderService,
    private Cookieservice: CookieService,
    private appcomponent: AppComponent,
    private appCommonservice: AppCommonService,
    private NewRoomgeneration: NewRoomGenerationService,
    private Confirmationservice: ConfirmationService,
    private dropdwonTransformService: DropdwonTransformService,
    private appCommonService: AppCommonService,
    private confirmationService: ConfirmationService,
    private router: Router) { }

  ngOnInit() {
    this.chkIsActive=1;
    this.pageheading="Add New Room";
    this.appcomponent.setTitle('Rooms');
    this.newRoomtyperesource=MastersResource.getResources().en.addNewRooms;
    this.globalResource=GlobalResources.getResources().en;
    this.loadService.display(false);
    this._Cookieservice=this.appCommonservice.getUserProfile();
    this.GetRoomTypes();
    this.GetZones();
    this.GetRooms();
    this.Roomtypemassterform= this.fb.group({
      'RoomType': new FormControl(null,[Validators.required]),
      'Zones': new FormControl(null,[Validators.required]),
      'RoomName': new FormControl(null,[Validators.required,Validators.minLength(1),Validators.maxLength(50)]),
      'description': new FormControl(null,[Validators.maxLength(500)]),
      'chkIsActive': new FormControl(null)

    });

  }
  GetRoomTypes()
  {
    this.loadService.display(true);
    this.NewRoomgeneration.GetRoomTypes().subscribe(data=>{
      if(data!="No Data found!"){
        this.RoomTypes=this.dropdwonTransformService.transform(data, 'RoomTypeName', 'RoomTypeId', '-- Select --');;
        this.paginationvalues=AppConstants.getPaginationOptions;
        if(this.RoomTypes.length>20)
        {
          this.paginationvalues[AppConstants.getPaginationOptions.length] = this.allRoomtypelist.length;
        }
      }
      else{
        this.RoomTypes=[];
      }
      this.loadService.display(false);
    },
    error => { console.log(error); this.loadService.display(false); },
    () => console.log('GetAllRoom complete'));
  }
  GetZones()
  {
    this.loadService.display(true);
    this.NewRoomgeneration.GetZonelist().subscribe(data=>{
      if(data!="No Data found!"){
        this.Zonestypes=this.dropdwonTransformService.transform(data, 'ZoneName', 'ZoneId', '-- Select --');;
        this.paginationvalues=AppConstants.getPaginationOptions;
        if(this.Zonestypes.length>20)
        {
          this.paginationvalues[AppConstants.getPaginationOptions.length] = this.allRoomtypelist.length;
        }
      }
      else{
        this.Zonestypes=[];
      }
      this.loadService.display(false);
    },
    error => { console.log(error); this.loadService.display(false); },
    () => console.log('GetAllZones complete'));
  }
  GetRooms() {
    this.loadService.display(true);
    this.NewRoomgeneration.GetRoomList().subscribe(data=>{
      if(data!="No Data found!"){
        this.allRoomtypelist=data;
        this.paginationvalues=AppConstants.getPaginationOptions;
        if(this.allRoomtypelist.length>20)
        {
          this.paginationvalues[AppConstants.getPaginationOptions.length] = this.allRoomtypelist.length;
        }
      }
      else{
        this.allRoomtypelist=[];
      }
      this.loadService.display(false);
    },
    error => { console.log(error); this.loadService.display(false); },
    () => console.log('GetAllRoomTbyClient complete'));
 }
 SaveRooms(frommodel){
  if (String(this.Roomtypemassterform.value.Room).trim().length == 0) {
    this.Roomtypemassterform.controls['Room'].setErros({ 'whitespace': true });
    this.Roomtypemassterform.value.Zone = null;
    return;
 }
 const RoomDetailsForAPI = {
  Rooms: {
    RoomId: this.RoomTypeforupdate,
    RoomName: this.appCommonservice.trimString(this.Roomtypemassterform.value.RoomName),
    Description: this.appCommonservice.trimString(this.Roomtypemassterform.value.description),
    VirtualRoleId: this._Cookieservice.VirtualRoleId,
    IsActive: this.Roomtypemassterform.value.chkIsActive,
    ClientId: this._Cookieservice.ClientId,
    ZoneId:this.Roomtypemassterform.value.Zones,
    RoomTypeId:this.Roomtypemassterform.value.RoomType

  }
}
  if(this.Roomtypemassterform.valid)
  {
    this.loadService.display(false);
    this.NewRoomgeneration.addNewRoom(RoomDetailsForAPI).subscribe(data=>{
      this.msg=[];
      if (data[0]['Result'] == 'success') {
        this.msg.push({
          severity: 'success', summary: this.globalResource.applicationmsg,
          detail: this.newRoomtyperesource.newRoomSavedSuccess
        });
        this.resetAll();
        this.GetRooms();
      }
      else if (data == 'failue') {
        this.msg.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.error })
      }
      else if (data == 'duplicate') {
        this.msg.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.newRoomtyperesource.RoomAlreadyExists })
      }
      else if (String(data.toLocaleUpperCase() === 'NOTUPDATED')) {
        this.msg.push({
          severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.newRoomtyperesource.noupdate
        });
      }
      else {
        this.msg.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
      }

      this.loadService.display(false);
    },
    
    error => {
      this.msg = [];
      this.msg.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
      // http call end
      this.resetAll();
      this.loadService.display(false);
    })
  }
  else{
    this.appCommonservice.validateAllFields(this.Roomtypemassterform);
  }
}
  resetAll() {
    this.RoomTypeforupdate = 0;
    this.saveButtontext = 'save';
    this.pageheading = 'Add New Room';
    this.clear = 'Clear';
    this.resetForm();
  }
  resetForm() {
    this.Roomtypemassterform.reset({ chkIsActive: true });
    this.newRoomTypedetails = {
      roomType: null,
      Description: null
    }
  }
  getRoomOnEdit(RoomId)
  {
    const data = this.allRoomtypelist.filter(x => x.RoomId === RoomId);
    console.log(data);
     if (data !== 'No data found!') {
       this.RoomTypeforupdate = RoomId;
       this.RoomOnEdit = data;
       const Roomtype = this.Roomtypemassterform.controls['RoomType'];
       const Zone = this.Roomtypemassterform.controls['Zones'];
       const Room = this.Roomtypemassterform.controls['RoomName'];
       const description = this.Roomtypemassterform.controls['description'];
     
       const chkIsActive = this.Roomtypemassterform.controls['chkIsActive'];
        
       Room.patchValue(this.RoomOnEdit[0].RoomName);
       
        chkIsActive.patchValue(this.RoomOnEdit[0].IsActive);
        description.patchValue(this.RoomOnEdit[0].Description);
        this.clear = 'Cancel';
       this.saveButtontext = 'Update';
       this.pageheading = 'Edit Room';

      
       if (!this.RoomTypes.filter(item => item.value === this.RoomOnEdit[0].RoomTypeId).length) {
        this.RoomTypes.push({ label: this.RoomOnEdit[0].RoomTypeName, value: this.RoomOnEdit[0].RoomTypeId });
       }
     
        Roomtype.patchValue(this.RoomOnEdit[0].RoomTypeId);

        // let geneticsNewData: any;
        // geneticsNewData = [
        //  { label: this.RoomOnEdit[0].ZoneName, value: this.RoomOnEdit[0].ZoneId }
        // ];
        // this.Zonestypes = [];
        // this.Zonestypes = geneticsNewData;
        Zone.patchValue(this.RoomOnEdit[0].ZoneId);
       this.RoomTypeDisabled = true;
       
     } else {
     this.allRoomtypelist = [];
     }
     this.loadService.display(false);
  }
  viewZoneList() {
    this.appCommonService.strainFormDetail = this.Roomtypemassterform;
    this.appCommonService.strainPageBackLink = true;
    this.router.navigate(['../home/addnewsgenetics']);
  }
  showConformationMessaegForDelete(RoomID, Room, IsDeleted, ActiveInactiveFlag) {
    let strMessage: any;
    strMessage = this.newRoomtyperesource.deleteRoomMsg;
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.activateDeleteRoom(RoomID, Room, IsDeleted, ActiveInactiveFlag);
      },
      reject: () => {
      }
  });
  }
  activateDeleteRoom(StrainId, Strain, IsDeleted, ActiveInactiveFlag) {
    this.submitted = true;
    // tslint:disable-next-line:prefer-const
    // console.log(Strain);

      const RoomDetailsForApi = {
      Rooms: {
        RoomId: StrainId,
        RoomTypeId: Strain.RoomTypeId,
        ZoneId: Strain.ZoneId,
        VirtualRoleId: this._Cookieservice.VirtualRoleId,
        IsDeleted: IsDeleted,
        IsActive: Strain.IsActive,
        ActiveInactive: ActiveInactiveFlag,
        ClientId: this._Cookieservice.ClientId,
      }
    };
      // console.log(strainDetailsForApi);
      this.loadService.display(true);
      this.NewRoomgeneration.addNewRoom(RoomDetailsForApi)
      .subscribe(
          data => {
            // console.log(data);
            this.msg = [];
            if (data[0]['Result'] === 'success' && ActiveInactiveFlag === 1) {
              if (Strain.IsActive === true) {
                this.msg.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail:  this.newRoomtyperesource.newRoomActivated});
                this.resetAll();
                this.GetRooms();
                this.loadService.display(false);
              } else {
                this.msg.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail:  this.newRoomtyperesource.newRoomInactivated});
                this.resetAll();
                this.GetRooms();
                this.loadService.display(false);
              }
            } else if (data[0]['Result'] === 'success' && IsDeleted === 1) {
              this.msg.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail:  this.newRoomtyperesource.RoomDeletedSuccess});
              this.resetAll();
              this.GetRooms();
              this.loadService.display(false);
            } else if (String(data.toLocaleUpperCase()) === 'NOTUPDATED') {
              if (IsDeleted === 1) {
                this.msg.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newRoomtyperesource.notdeleted });
                this.loadService.display(false);
              } else if (Strain.IsActive === true) {
                this.msg.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newRoomtyperesource.notactivated });
                Strain.IsActive = !Strain.IsActive;
                this.loadService.display(false);
              } else {
                this.msg.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newRoomtyperesource.notinactivated });
                Strain.IsActive = !Strain.IsActive;
                this.loadService.display(false);
              }
            } else if (String(data.toLocaleUpperCase()) === 'ROOMTYPEORZONEISINACTIVE') {
                this.msg.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newRoomtyperesource.roomtypeOrZonesIsInactive });
                Strain.IsActive = !Strain.IsActive;
                this.loadService.display(false);
            } else if (data === 'Failure') {
              this.msg.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
            } else if (data === 'Duplicate') {
              this.msg.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.newRoomtyperesource.RoomAlreadyExists });
            } else if (data === 'InUse') {
              this.msg = [];
              this.msg.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: 'Can`t delete. Record is in use.'});
            } else {
              this.msg.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
            }
              // http call end
              this.loadService.display(false);
          },
          error => {
            this.msg = [];
            this.msg.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
            // http call end
            this.resetAll();
            this.loadService.display(false);
          });
  }

  showConformationMessaegForDeactive(StrainId, Strain, rowIndex, IsDeleted, ActiveInactiveFlag) {
    console.log(Strain);
    let strMessage: any;
    if (this.allRoomtypelist[rowIndex].IsActive === true) {
      strMessage = this.newRoomtyperesource.activeRoomMsg ;
    } else {
      strMessage = this.newRoomtyperesource.deactivateRoomMsg ;
    }
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
         this.activateDeleteRoom(StrainId, Strain, IsDeleted, ActiveInactiveFlag);
        },
        reject: () => {
          Strain.IsActive = !Strain.IsActive;
        }
    });
  }

}
