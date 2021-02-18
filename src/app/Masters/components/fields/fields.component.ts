import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { LoaderService } from '../../../shared/services/loader.service';
import { AppCommonService } from '../../../shared/services/app-common.service'

import { NewFieldGenerationService } from '../../../task/services/new-field-generation.service';
import { NewRoomGenerationService } from '../../../task/services/new-room-generation.service';
import { CookieService } from 'ngx-cookie-service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { ConfirmationService, Confirmation } from 'primeng/api';
import { AppConstants } from '../../../shared/models/app.constants';
import { AppComponent } from '../../../../app/app.component';
import { stringify } from 'querystring';
import { flatMap } from 'rxjs/operators';
// import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.css']
})
export class FieldsComponent implements OnInit {
  public newFieldresource:any;
  // public Roomtypemassterform:any;
  public globalResource:any;
  public submitted: boolean;
  public _Cookieservice: any;
  public allFieldslist: any
  public msg: any[];
  // public RoomTypeforupdate: any = 0;
  // public RoomTypeEdit: any;
  public saveButtontext = 'save';
  public clear = 'Clear';
  paginationvalues: any;
  chkIsActive: any;
  public event: any;
  newFielddetails: {
    Description: null,
    Acres:null,
    FieldName: null
}
  pageheading: any;
public RoomTypes:any[];
public Zonestypes:any[];
public FieldOnEdit:any;
public RoomTypeDisabled:any;
  Fieldtypemassterform: FormGroup;
  Fieldforupdate:  any = 0;
  constructor(private fb: FormBuilder,
    private loadService: LoaderService,
    private Cookieservice: CookieService,
    private appcomponent: AppComponent,
    private appCommonservice: AppCommonService,
    private NewFieldgeneration: NewFieldGenerationService,
    private NewRoomgeneration: NewRoomGenerationService,
    private Confirmationservice: ConfirmationService,
    // private dropdwonTransformService: DropdwonTransformService,
    private appCommonService: AppCommonService,
    private confirmationService: ConfirmationService,
    private router: Router) { }

  ngOnInit() {
    this.chkIsActive=1;
    this.pageheading="Add New Field";
    this.appcomponent.setTitle('Fields');
    this.newFieldresource=MastersResource.getResources().en.addNewFields;
    this.globalResource=GlobalResources.getResources().en;
    this.loadService.display(false);
    this._Cookieservice=this.appCommonservice.getUserProfile();
    // this.GetRoomTypes();
    // this.GetZones();
    this.GetFields();
    this.Fieldtypemassterform= this.fb.group({
      'FieldName': new FormControl(null,[Validators.required]),
      'Acres': new FormControl(null,[Validators.required]),
      'description': new FormControl(null,[Validators.maxLength(500)]),
      'chkIsActive': new FormControl(null)
      
    });

  }
  GetFields() {
    this.loadService.display(true);
    this.NewFieldgeneration.GetFieldList().subscribe(data=>{
      if(data!="No Data found!"){
        this.allFieldslist=data;
        this.paginationvalues=AppConstants.getPaginationOptions;
        if(this.allFieldslist.length>20)
        {
          this.paginationvalues[AppConstants.getPaginationOptions.length] = this.allFieldslist.length;
        }
      }
      else{
        this.allFieldslist=[];
      }
      this.loadService.display(false);
    },
    error => { console.log(error); this.loadService.display(false); },
    () => console.log('GetAllFieldsbyClient complete'));
 }

  SaveFields(frommodel){
    console.log(this.Fieldtypemassterform);
    if (String(this.Fieldtypemassterform.value.FieldName).trim().length == 0) {
      this.Fieldtypemassterform.controls['FieldName'].setErrors({ 'whitespace': true });
      this.Fieldtypemassterform.value.FieldName = null;
      return;
   }
    const FieldDetailsForAPI = {
      fields: {
        FieldId: this.Fieldforupdate,
        FieldName: this.appCommonservice.trimString(this.Fieldtypemassterform.value.FieldName),
        Acres:this.Fieldtypemassterform.value.Acres,
        FieldDescription: this.appCommonservice.trimString(this.Fieldtypemassterform.value.description),
        VirtualRoleId: this._Cookieservice.VirtualRoleId,
        IsActive: this.Fieldtypemassterform.value.chkIsActive,
        ClientId: this._Cookieservice.ClientId,
        // RoomTypeId:this.Roomtypemassterform.value.RoomType
    
      }
    }
    console.log(FieldDetailsForAPI)
    if(this.Fieldtypemassterform.valid)
    {
      this.loadService.display(false);
      this.NewFieldgeneration.addNewField(FieldDetailsForAPI).subscribe(data=>{
        this.msg=[];
        if (data[0]['Result'] == 'Success') {
          this.msg.push({
            severity: 'success', summary: this.globalResource.applicationmsg,
            detail: this.newFieldresource.newFieldSavedSuccess
          });
          this.resetAll();
          this.GetFields();
        }
        else if (data == 'failue') {
          this.msg.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.error })
        }
        else if (data == 'Duplicate') {
          this.msg.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.newFieldresource.FieldAlreadyExists })
        }
        else if (String(data === 'NOTUPDATED')) {
          this.msg.push({
            severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.newFieldresource.noupdate
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
      this.appCommonservice.validateAllFields(this.Fieldtypemassterform);
    }
  }
  resetAll() {
    // this.RoomTypeforupdate = 0;
    this.saveButtontext = 'Save';
    this.pageheading = 'Add New Field';
    this.clear = 'Clear';
    this.resetForm();
  }
  resetForm() {
    this.Fieldtypemassterform.reset({ chkIsActive: true });
    this.newFielddetails = {
      Description: null,
      Acres: null,
      FieldName: null
  }
   
  }
  getFieldOnEdit(FieldId)
  {
    const data = this.allFieldslist.filter(x => x.FieldId === FieldId);
    console.log(data);
     if (data !== 'No data found!') {
       this.Fieldforupdate = FieldId;
       this.FieldOnEdit = data;
       const Field = this.Fieldtypemassterform.controls['FieldName'];
       const Acres = this.Fieldtypemassterform.controls['Acres'];
       const description = this.Fieldtypemassterform.controls['description'];
     
       const chkIsActive = this.Fieldtypemassterform.controls['chkIsActive'];
        
       Field.patchValue(this.FieldOnEdit[0].FieldName);
       Acres.patchValue(this.FieldOnEdit[0].Acres);
       description.patchValue(this.FieldOnEdit[0].Description);
        chkIsActive.patchValue(this.FieldOnEdit[0].IsActive);
       
        this.clear = 'Cancel';
       this.saveButtontext = 'Update';
       this.pageheading = 'Edit Field';

      
       
     } else {
     this.allFieldslist = [];
     }
     this.loadService.display(false);
  }
  showConformationMessaegForDelete(FieldId, Field, IsDeleted, ActiveInactiveFlag) {
    let strMessage: any;
    strMessage = this.newFieldresource.deleteFieldMsg;
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.activateDeleteRoom(FieldId, Field, IsDeleted, ActiveInactiveFlag);
      },
      reject: () => {
      }
  });
  }
  activateDeleteRoom(FieldId, Field,IsDeleted, ActiveInactiveFlag) {
    this.submitted = true;
    // tslint:disable-next-line:prefer-const
    // console.log(Strain);

      const FieldDetailsForApi = {
      fields: {
        FieldId: FieldId,
        VirtualRoleId: this._Cookieservice.VirtualRoleId,
        IsDeleted: IsDeleted,
        IsActive: Field.IsActive,
        ActiveInactive: ActiveInactiveFlag,
        ClientId: this._Cookieservice.ClientId,
      }
    };
      // console.log(strainDetailsForApi);
      this.loadService.display(true);
      this.NewFieldgeneration.addNewField(FieldDetailsForApi)
      .subscribe(
          data => {
            // console.log(data);
            this.msg = [];
            if (data[0]['Result'] === 'Success' && ActiveInactiveFlag === 1) {
              if (Field.IsActive === true) {
                this.msg.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail:  this.newFieldresource.newFieldActivated});
                this.resetAll();
                this.GetFields();
                this.loadService.display(false);
              } else {
                this.msg.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail:  this.newFieldresource.newFieldInactivated});
                this.resetAll();
                this.GetFields();
                this.loadService.display(false);
              }
            } else if (data[0]['Result'] === 'Success' && IsDeleted === 1) {
              this.msg.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail:  this.newFieldresource.FieldDeletedSuccess});
              this.resetAll();
              this.GetFields();
              this.loadService.display(false);
            } else if (String(data) === 'NOTUPDATED') {
              if (IsDeleted === 1) {
                this.msg.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newFieldresource.notdeleted });
                this.loadService.display(false);
              } else if (Field.IsActive === true) {
                this.msg.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newFieldresource.notactivated });
                Field.IsActive = !Field.IsActive;
                this.loadService.display(false);
              } else {
                this.msg.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newFieldresource.notinactivated });
                Field.IsActive = !Field.IsActive;
                this.loadService.display(false);
              }
            } else if (String(data) === 'ROOMTYPEORZONEISINACTIVE') {
                this.msg.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newFieldresource.FieldIsInactive });
                Field.IsActive = !Field.IsActive;
                this.loadService.display(false);
            } else if (data === 'Failure') {
              this.msg.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
            } else if (data === 'Duplicate') {
              this.msg.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.newFieldresource.FieldAlreadyExists });
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
  onPageChange(e) {
    this.event = e;
  }
  showConformationMessaegForDeactive(FieldId, Field, rowIndex, IsDeleted, ActiveInactiveFlag) {
    console.log(Field);
    let strMessage: any;
    if (this.allFieldslist[rowIndex].IsActive === true) {
      strMessage = this.newFieldresource.activeFieldMsg ;
    } else {
      strMessage = this.newFieldresource.deactivateFieldMsg ;
    }
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
         this.activateDeleteRoom(FieldId, Field, IsDeleted, ActiveInactiveFlag);
        },
        reject: () => {
          Field.IsActive = !Field.IsActive;
        }
    });
  }

  }
