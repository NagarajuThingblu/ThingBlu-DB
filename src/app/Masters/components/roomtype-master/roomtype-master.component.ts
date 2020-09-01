import { Component, OnInit } from '@angular/core';
import{ FormGroup,FormBuilder,FormControl,Validators }from '@angular/forms';
import{LoaderService} from '../../../shared/services/loader.service';
import{CookieService}from 'ngx-cookie-service';
import{NewRoomGenerationService} from '../../../task/services/new-room-generation.service';
import{AppCommonService} from '../../../shared/services/app-common.service';
import{MastersResource} from  '../../master.resource';
import{GlobalResources}from '../../../global resource/global.resource';
import { ConfirmationService } from 'primeng/api';
import{AppConstants}from '../../../shared/models/app.constants';
import{AppComponent} from '../../../../app/app.component';


@Component({
  moduleId: module.id,
  selector: 'app-roomtype-master',
  templateUrl: './roomtype-master.component.html',
  styleUrls: ['./roomtype-master.component.css']
})
export class RoomtypeMasterComponent implements OnInit {
public newroomtypeResource:any;
public RoomtypeMasterform:FormGroup;
public globalresource:any;
submitted:boolean;
public _cookieservice:any;
public allRoomTypeList:any;
public msgs: any[];
public RoomTypeonEdit:any[];
public RoomForupdate:any=0;
public saveButtonText: any = 'Save';
  clear: any = 'Clear';
  paginationValues: any;
  chkIsActive: any;
  public event: any;
  newRoomTypeDetails:{
    roomtype:null,
    description:null
  }
  pageheader:any;
  constructor(
private fb:FormBuilder,
private loaderService:LoaderService,
private Cookieservice:CookieService,
private appComponent:AppComponent,
private appCommonService:AppCommonService,
private NewRoomgeneration:NewRoomGenerationService,
private ConfirmationService:ConfirmationService

  ) { }

  ngOnInit() {
    this.chkIsActive=1;
    this.pageheader="Add New Room Type";
    this.appComponent.setTitle("Room Type");
    this.newroomtypeResource=MastersResource.getResources().en.addNewRoomType;
    this.globalresource= GlobalResources.getResources().en;
    this.loaderService.display(false);
    this._cookieservice=this.appCommonService.getUserProfile();
    this.GetAllRoomTypes();

    this.RoomtypeMasterform=this.fb.group({
      'roomtype': new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
      'description': new FormControl(null, [Validators.maxLength(500)]),
      'chkIsActive': new FormControl(null)
    })
  }
resetAll()
{
  this.RoomForupdate=0;
  this.saveButtonText='Save',
  this.clear='Clear',
  this.pageheader = 'Add New Room Type';
    this.resetForm();

}
  resetForm()
  {
this.RoomtypeMasterform.reset({chkIsActive:true});
this.newRoomTypeDetails={
roomtype:null,
description:null
}
  }
onPageChange(e) {
  this.event = e;
}


SaveRoomTypeName(formMaodel)
  {
    if(String(this.RoomtypeMasterform.value.roomtype).trim().length==0)
    {
      this.RoomtypeMasterform.controls['roomtype'].setErrors({'whitespace':true});
      this.RoomtypeMasterform.value.roomtype=null;
      return;
    }
    const RoomTypeDetailsForAPi={
      RoomType:{
        RoomTypeId:this.RoomForupdate,
        RoomTypeName:this.appCommonService.trimString(this.RoomtypeMasterform.value.roomtype),
        description:this.appCommonService.trimString(this.RoomtypeMasterform.value.description),
        virtualRoleId:this._cookieservice.VirtualRoleId,
        IsActive:this.RoomtypeMasterform.value.chkIsActive,
        ClientId:this._cookieservice.ClientId
            }
    }
    if(this.RoomtypeMasterform.valid)
    {
      this.loaderService.display(true)
      this.NewRoomgeneration.addNewRoomType(RoomTypeDetailsForAPi).subscribe(data=>{
        this.msgs=[];
        if(data[0]['Result']=='success')
        {
this.msgs.push({severity: 'success', summary: this.globalresource.applicationmsg,
detail: this.newroomtypeResource.newRoomTypeSavedSuccess});
this.resetAll();
this.GetAllRoomTypes();
        }
        else if(data=="Failure")
        {
          this.msgs.push({severity:'error',summary:this.globalresource.applicationmsg,detail:this.globalresource.error})
        }
        else if (data === 'Duplicate') {
          this.msgs.push({severity: 'warn', summary: this.globalresource.applicationmsg, detail: this.newroomtypeResource.RoomTypeAlreadyExists });
        } else if (String(data.toLocaleUpperCase() === 'NOTUPDATED')) {
          this.msgs.push({severity: 'warn', summary: this.globalresource.applicationmsg,
          detail: this.newroomtypeResource.noupdate });
        } else {
          this.msgs.push({severity: 'error', summary: this.globalresource.applicationmsg, detail: data });
        }
          // http call end
          this.loaderService.display(false);

      },
      
      error => {
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: this.globalresource.applicationmsg, detail: error.message });
        // http call end
        this.resetAll();
        this.loaderService.display(false);
      });
    } else {
      this.appCommonService.validateAllFields(this.RoomtypeMasterform);
    }
  }
  GetAllRoomTypes() {
    this.loaderService.display(true);
    this.NewRoomgeneration.getRoomTypedetails().subscribe(data=>{

      if(data !== 'No data found!')
      {
        this.allRoomTypeList=data;
        this.paginationValues = AppConstants.getPaginationOptions;
        if(this.allRoomTypeList.length>20)
        {
          this.paginationValues[AppConstants.getPaginationOptions.length]=this.allRoomTypeList.length;
        }
       
      }
      else{
        this.allRoomTypeList=[];
      }
      this.loaderService.display(false);
    },
    
    error=>{console.log(error);  this.loaderService.display(false);},
    ()=>console.log('GetAllRoomTypesbyClient complete'));
    ;
    
  }

  GetroomtypeonEdit(roomtypeId)
  {
    this.pageheader="Edit Room Type";
    this.clear='Cancel';

    const data= this.allRoomTypeList.filter(rt=>rt.RoomTypeId==roomtypeId);

    if (data !='No Data found') {
      this.RoomForupdate = roomtypeId;
         this.RoomTypeonEdit = data;
         const roomtype = this.RoomtypeMasterform.controls['roomtype'];
         const description = this.RoomtypeMasterform.controls['description'];
         const chkIsActive = this.RoomtypeMasterform.controls['chkIsActive'];

          roomtype.patchValue(this.RoomTypeonEdit[0].RoomTypeName);
          description.patchValue(this.RoomTypeonEdit[0].RoomDescription);
          chkIsActive.patchValue(this.RoomTypeonEdit[0].IsActive);
          this.saveButtonText = 'Update';
    }
    else {
      this.allRoomTypeList = [];
      }
      this.loaderService.display(false);
  }
  showConformationMessaegForDelete(RoomTypeId, RoomType, IsDeleted, ActivateInactivateKey) {
    let strMessage: any;
    strMessage = 'Do you want to delete the Room type?';
    this.ConfirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.activateDeleteStrainType(RoomTypeId, RoomType, IsDeleted , ActivateInactivateKey);
      },
      reject: () => {
      }
  });
  }
  activateDeleteStrainType(RoomTypeId, RoomType, IsDeleted, ActivateInactivateKey) {
    this.submitted=true;
    let rowSuplierDetailsForApi;

    const roomtypedetailsForAPI={
      RoomType:{
        RoomTypeId: RoomTypeId,
        RoomTypeName: this.appCommonService.trimString(this.RoomtypeMasterform.value.roomtype),
        Description: this.appCommonService.trimString(this.RoomtypeMasterform.value.description),
        VirtualRoleId: this._cookieservice.VirtualRoleId,
        IsDeleted: IsDeleted,
        IsActive: RoomType.IsActive,
        ActiveInactive: ActivateInactivateKey,
        ClientId:this._cookieservice.ClientId
      }
    };
    this.loaderService.display(true);
    this.NewRoomgeneration.addNewRoomType(roomtypedetailsForAPI)
    .subscribe(data=>{
     this.msgs=[];
     if(data[0]['Result']==='success' && IsDeleted==1)
     {
      this.msgs.push({severity: 'success', summary: this.globalresource.applicationmsg,
      detail: this.newroomtypeResource.newRoomTypeDeleted});
    this.GetAllRoomTypes();
     }else if (String(data[0]['Result']) === 'success' && ActivateInactivateKey === 1) {
      if (RoomType.IsActive !== true) {
        this.msgs.push({severity: 'success', summary: this.globalresource.applicationmsg,
        detail: this.newroomtypeResource.newRoomTypeInactivated });
        this.resetAll();
        this.GetAllRoomTypes();
        this.loaderService.display(false);
      }else{
        this.msgs.push({severity: 'success', summary: this.globalresource.applicationmsg,
        detail: this.newroomtypeResource.newRoomTypeActivated });
        this.resetAll();
        this.GetAllRoomTypes();
        this.loaderService.display(false);
      }
     }
      else if (String(data.toLocaleUpperCase()) === 'NOTUPDATED') {
        if (IsDeleted === 1) {
          this.msgs.push({severity: 'warn', summary: this.globalresource.applicationmsg,
          detail: this.newroomtypeResource.notdeleted });
          this.loaderService.display(false);
        } else if (RoomType.IsActive === true) {
          this.msgs.push({severity: 'warn', summary: this.globalresource.applicationmsg,
          detail: this.newroomtypeResource.notactivated });
          RoomType.IsActive = !RoomType.IsActive;
          this.loaderService.display(false);
        }else {
          this.msgs.push({severity: 'warn', summary: this.globalresource.applicationmsg,
          detail: this.newroomtypeResource.notinactivated });
          RoomType.IsActive = !RoomType.IsActive;
          this.loaderService.display(false);
        }
      }
        else if (String(data.toLocaleUpperCase()) === 'RommTypeINACTIVE') {
          // alert('in in use');
          this.msgs.push({severity: 'warn', summary: this.globalresource.applicationmsg,
          detail: this.newroomtypeResource.RoomtypeIsInactive });
          RoomType.IsActive = !RoomType.IsActive;
          this.loaderService.display(false);
        } 
       else if (data === 'Failure') {
        this.msgs.push({severity: 'error', summary: this.globalresource.applicationmsg, detail: this.globalresource.serverError });
      } else if (String(data.toLocaleUpperCase()) === 'INUSE') {
        this.msgs.push({severity: 'warn', summary: this.globalresource.applicationmsg,
        detail: this.newroomtypeResource.RoomTypeAssigned});
      } else {
        this.msgs.push({severity: 'error', summary: this.globalresource.applicationmsg, detail: data });
      }
        // http call end
        this.loaderService.display(false);
     
      
    },
    error => {
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: this.globalresource.applicationmsg, detail: error.message });
      // http call end
      this.loaderService.display(false);
    });
    
  }
  showConformationMessaegForDeactive(RoomTypeId, RoomType, rowIndex, IsDeleted: number, ActiveAction: number) {
    let strMessage: any;
    if (RoomType.IsActive === true) {
      strMessage = 'Do you want to activate Room type?';
    } else {
      strMessage = 'Do you want to inactivate Room type? Room associated with this Room type will also be inactivated.';
    }

    this.ConfirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {

         this.activateDeleteStrainType(RoomTypeId, RoomType, IsDeleted, ActiveAction);
        },
        reject: () => {
          RoomType.IsActive = !RoomType.IsActive;
        }
    });
  }

}
