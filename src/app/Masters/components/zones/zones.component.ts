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

@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.css']
})
export class ZonesComponent implements OnInit {
  public newzonetypeResource: any;
  public ZonetypeMasterform: any;
  public globalResource: any;
  public submitted: boolean;
  public _Cookieservice: any;
  public allZonestypelist: any
  public msg: any[];
  public ZoneTypeforupdate: any = 0;
  public ZoneTypeEdit: any;
  public saveButtontext = 'Save';
  public clear = 'Clear';
  public paginationValues: any;
  chkIsActive: any;
  public event: any;
  newZoneTypedetails: {
    ZoneType: null,
    Description: null

  }
  public Roomlist:any;
  pageHeader: any;
  public zonearray:any=[ ];
  public zonelisterror: String = 'Zone name already exist';
  public dataExist =true;
  public zoneListBox: boolean= true;
  constructor(
    private fb: FormBuilder,
    private loadService: LoaderService,
    private Cookieservice: CookieService,
    private appcomponent: AppComponent,
    private appCommonservice: AppCommonService,
    private NewRoomgeneration: NewRoomGenerationService,
    private Confirmationservice: ConfirmationService,
    private dropdwonTransformService: DropdwonTransformService

  ) { }

  ngOnInit() {
    this.chkIsActive = 1;
    this.pageHeader = 'Add New Zone';
    this.appcomponent.setTitle("Zone");
    this.newzonetypeResource = MastersResource.getResources().en.addNewzones;
    this.globalResource = GlobalResources.getResources().en;
    this.loadService.display(false);
    this._Cookieservice = this.appCommonservice.getUserProfile();
    this.GetZones();
    this.GetRoomlist();

    this.ZonetypeMasterform = this.fb.group({
      'Zone': new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
      'description': new FormControl(null, [Validators.maxLength(500)]),
      'chkIsActive': new FormControl(null),
      'Roomlist': new FormControl(null,Validators.required)
    });

  }

  onPageChange(e) {
    this.event = e;
  }

  GetRoomlist()
  {
this.NewRoomgeneration.GetRoomList().subscribe(data=>{
if(data!="No data found")
{
this.Roomlist=this.dropdwonTransformService.transform(data,"RoomName","RoomId",'-- Select --')
}
});

  }
  
  removeitem(deleteitem){
    this.zonearray.splice(deleteitem,1)
  }
  SaveZones(formModel) {
    if (String(this.ZonetypeMasterform.value.Zone).trim().length == 0) {
      this.ZonetypeMasterform.controls['Zone'].setErros({ 'whitespace': true });
      this.ZonetypeMasterform.value.Zone = null;
      return;
    }
  if(this.ZoneTypeforupdate!=0){
    this.zonearray.push(this.appCommonservice.trimString(this.ZonetypeMasterform.value.Zone));
    this.zoneListBox= false;
   
    }
   const ZoneDetailsForAPI = {
      Zone: {
        ZonesTypeId: this.ZoneTypeforupdate,
        ZonesName: this.zonearray,
        Description: this.appCommonservice.trimString(this.ZonetypeMasterform.value.description),
        VirtualRoleId: this._Cookieservice.VirtualRoleId,
        IsActive: this.ZonetypeMasterform.value.chkIsActive,
        ClientId: this._Cookieservice.ClientId,
        RoomId:this.ZonetypeMasterform.value.Roomlist

      }
    }
    if (this.ZonetypeMasterform.valid) {
      this.loadService.display(false);
      this.NewRoomgeneration.addNewZones(ZoneDetailsForAPI).subscribe(data => {
        this.msg = [];
        if (data[0]['Result'] == 'success') {
          this.msg.push({
            severity: 'success', summary: this.globalResource.applicationmsg,
            detail: this.newzonetypeResource.newZoneSavedSuccess
          });
          this.resetAll();
          this.GetZones();
        }
        else if (data == 'failue') {
          this.msg.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.error })
        }
        else if (data == 'duplicate') {
          this.msg.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.newzonetypeResource.ZoneAlreadyExists })
        }
        else if (String(data.toLocaleUpperCase() === 'NOTUPDATED')) {
          this.msg.push({
            severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.newzonetypeResource.noupdate
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
    else {
      this.appCommonservice.validateAllFields(this.ZonetypeMasterform);
    }

  }
  resetAll() {
    this.ZoneTypeforupdate = 0;
    this.saveButtontext = 'save';
    this.pageHeader = 'Add New Zone';
    this.clear = 'Clear';
    this.zonearray.length = 0;
    this.resetForm();

  }
  addzoneslist(prozone){
    const proroom = this.ZonetypeMasterform.value.Roomlist
    const zonecheck = this.allZonestypelist.filter(rt => rt.RoomId == proroom &&   rt.ZoneName === prozone.value);
    if (prozone.value.length>0 && zonecheck.length===0  ){
        this.zonearray.push(prozone.value);
      prozone.value='';
      this.dataExist = true;
    }
    else if(zonecheck.length!=0){
      this.dataExist = false;
    }
    console.log(this.zonelisterror);
  }
  resetForm() {
    this.ZonetypeMasterform.reset({ chkIsActive: true });
    this.newZoneTypedetails = {
      ZoneType: null,
      Description: null
    }
  }
  GetZones() {
    this.loadService.display(true);
    this.NewRoomgeneration.GetZonelist().subscribe(data => {
      if (data !== 'No Data found') {
        this.allZonestypelist = data;
        this.paginationValues = AppConstants.getPaginationOptions;
        if (this.allZonestypelist.length > 20) {
          this.paginationValues[AppConstants.getPaginationOptions.length] = this.allZonestypelist.length;

        }
      }
      else {
        this.allZonestypelist = [];
      }
      this.loadService.display(false);
    },

      error => { console.log(error); this.loadService.display(false); },
      () => console.log('GetAllRoomTypesbyClient complete'));

  }

  GetZoneonEdit(ZoneID) {
    this.pageHeader = 'Edit Zone';
    this.clear = 'Cancel';

    const data = this.allZonestypelist.filter(rt => rt.ZoneId == ZoneID)
    if (data != 'No Data Found') {
      this.ZoneTypeforupdate = ZoneID;
      this.ZoneTypeEdit = data;
      const Room = this.ZonetypeMasterform.controls['Roomlist'];
      const Zone = this.ZonetypeMasterform.controls['Zone'];
      const description = this.ZonetypeMasterform.controls['description'];
      const chkIsActive = this.ZonetypeMasterform.controls['chkIsActive'];

      Room.patchValue(this.ZoneTypeEdit[0].RoomId);
      Zone.patchValue(this.ZoneTypeEdit[0].ZoneName);
      description.patchValue(this.ZoneTypeEdit[0].Description);
      chkIsActive.patchValue(this.ZoneTypeEdit[0].IsActive);
      this.saveButtontext = 'Update';
    }
    else {
      this.allZonestypelist = [];
    }
    this.loadService.display(false);
  }

  showConformationMessaegForDelete(ZoneId, Zone, IsDeleted, ActivateInactivateKey) {
    let strMessage: any;
    strMessage = 'Do you want to delete the Zone?';
    this.Confirmationservice.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.activateDeleteStrainType(ZoneId, Zone, IsDeleted, ActivateInactivateKey);
      },
      reject: () => {
      }
    });
  }
  activateDeleteStrainType(ZoneId: any, Zone: any, IsDeleted: any, ActivateInactivateKey: any) {
    this.submitted = true;
    let ZoneDetailsforAPI = {
      Zone: {
        ZonesTypeId: ZoneId,
        ZonesName: this.appCommonservice.trimString(this.ZonetypeMasterform.value.Zone),
        RoomId:  Zone.RoomId,         
        Description: this.appCommonservice.trimString(this.ZonetypeMasterform.value.description),
        VirtualRoleId: this._Cookieservice.VirtualRoleId,
        Isdeleted: IsDeleted,
        IsActive: Zone.IsActive,
        ActiveInactive: ActivateInactivateKey,
        ClientId: this._Cookieservice.ClientId
      }
    };
    this.loadService.display(true);
    this.NewRoomgeneration.addNewZones(ZoneDetailsforAPI).subscribe(data => {
      this.msg = [];
      if (data[0]['Result'] === 'success' && IsDeleted == 1) {
        this.msg.push({
          severity: 'success', summary: this.globalResource.applicationmsg,
          detail: this.newzonetypeResource.newZoneDeleted
        });
        this.GetZones();
      }
      else if (String(data[0]['Result']) === 'success' && ActivateInactivateKey === 1) {
        if (Zone.IsActive !== true) {
          this.msg.push({
            severity: 'success', summary: this.globalResource.applicationmsg,
            detail: this.newzonetypeResource.newZoneInactivated
          });
          this.resetAll();
          this.GetZones();
          this.loadService.display(false);
        }
        else {
          this.msg.push({
            severity: 'success', summary: this.globalResource.applicationmsg,
            detail: this.newzonetypeResource.newZoneActivated
          });
          this.resetAll();
          this.GetZones();
          this.loadService.display(false);
        }
      }
      else if (String(data.toLocaleUpperCase()) === 'NOTUPDATED') {
        if (IsDeleted === 1) {
          this.msg.push({
            severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.newzonetypeResource.notdeleted
          });
          this.loadService.display(false);
        } else if (Zone.IsActive === true) {
          this.msg.push({
            severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.newzonetypeResource.notactivated
          });
          Zone.IsActive = !Zone.IsActive;
          this.loadService.display(false);
        } else {
          this.msg.push({
            severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.newzonetypeResource.notinactivated
          });
          Zone.IsActive = !Zone.IsActive;
          this.loadService.display(false);
        }
      }
      else if (String(data.toLocaleUpperCase()) === 'ZoneINACTIVE') {
        // alert('in in use');
        this.msg.push({
          severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.newzonetypeResource.ZoneIsInactive
        });
        Zone.IsActive = !Zone.IsActive;
        this.loadService.display(false);
      }
      else if (data === 'Failure') {
        this.msg.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
      } else if (String(data.toLocaleUpperCase()) === 'INUSE') {
        this.msg.push({
          severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.newzonetypeResource.ZoneAssigned
        });
      } else {
        this.msg.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
      }
      // http call end
      this.loadService.display(false);



    },
      error => {
        this.msg = [];
        this.msg.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
        // http call end
        this.loadService.display(false);
      });
  }
  showConformationMessaegForDeactive(ZoneId, Zone, rowIndex, IsDeleted: number, ActiveAction: number) {
    let strMessage: any;
    if (Zone.IsActive === true) {
      strMessage = 'Do you want to activate Zone?';
    } else {
      strMessage = 'Do you want to inactivate Zone? Room associated with this Zone will also be inactivated.';
    }

    this.Confirmationservice.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {

        this.activateDeleteStrainType(ZoneId, Zone, IsDeleted, ActiveAction);
      },
      reject: () => {
        Zone.IsActive = !Zone.IsActive;
      }
    });
  }

}
