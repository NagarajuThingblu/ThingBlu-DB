import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { CookieService } from 'ngx-cookie-service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { AppComponent } from '../../../app.component';
import { ScrollTopService } from '../../../shared/services/ScrollTop.service';
import { ConfirmationService } from 'primeng/api';
import { AppConstants } from '../../../shared/models/app.constants';
import { PTRService } from '../../services/ptr.service';

@Component({
  moduleId: module.id,
  selector: 'app-plant-termination-reasons',
  templateUrl: './plant-termination-reasons.component.html',
  styles: [`
  .clsTableSelection tr.ui-state-highlight {
    background: transparent !important;
    color: #222222 !important;
    cursor: pointer;
  }

  .clsTableSelection tr:nth-child(even).ui-state-highlight {
    background: transparent !important;
    color: #222222 !important;
    cursor: pointer;
  }

  .clsTableSelection .ui-state-highlight a {
      color: #222222 !important;
  }
`]
})
export class PlantTerminationReasonsComponent implements OnInit {
  ptrForm: FormGroup;
  globalResource: any;
  public _cookieService: any;
  pageheading = 'Add New Plant Termination Reason';
  public msgs: any[];
  submitted: boolean;
  IsActive: boolean;
  SaveButtonText = 'Save';
  event: any;
  Clear = 'Clear';
  TerminationId: any = 0;
  ptrResources: any;
  public allptrList: any;
  PaginationValues: any;
  // TerminationId: any = 0;
  newPtrdetails: {
    description: null,
    terminationReason: null,
}
  constructor(
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private appCommonService: AppCommonService,
    private cookieService: CookieService,
    private ptrActionService: PTRService,
    private dropdwonTransformService: DropdwonTransformService,
    private dropdownDataService: DropdownValuesService, // For common used dropdown service
    private AppComponentData: AppComponent,
    private confirmationService: ConfirmationService,
    private scrolltopservice: ScrollTopService
  ) { }

  ngOnInit() {
    this.IsActive = true;
    this.globalResource = GlobalResources.getResources().en;
    this.AppComponentData.setTitle('Plant Termination Reasons');
    this._cookieService = this.appCommonService.getUserProfile();
    this.ptrResources = MastersResource.getResources().en.ptr;
    this.getPTRDetailListByClient()
    this.ptrForm = this.fb.group({
      'terminationReason': new FormControl(null, Validators.required),
      'description': new FormControl(null),
      'chkIsActive': new FormControl(null)
    })
    this.loaderService.display(false);
  }
  getPTRDetailListByClient(){
    this.loaderService.display(true);
    this.ptrActionService.GetAllPTRListByClient().subscribe(
      data => {
        if (data !== 'No Data Found!') {
           this.allptrList = data;
          
           this.PaginationValues = AppConstants.getPaginationOptions;
           if (this.allptrList.length > 20) {
             this.PaginationValues[AppConstants.getPaginationOptions.length] = this.allptrList.length;
           }
        } else {
         this.allptrList = [];
        }
        this.loaderService.display(false);
       } ,
       error => { console.log(error);  this.loaderService.display(false); },
       () => console.log('getPTRDetailListByClient complete'));
  }

  onSubmit(value: string){
    this.submitted = true;
    let PTRDetailsForApi;
    PTRDetailsForApi = {
      Termination:{
        TerminationId:this.TerminationId,
        ClientId:this._cookieService.ClientId,
        VirtualRoleId:this._cookieService.VirtualRoleId,
        TerminationReason:this.ptrForm.value.terminationReason,
        Description:this.ptrForm.value.description,
        IsActive:this.ptrForm.value.chkIsActive ? 1 : 0,
        IsDeleted:0,
        ActiveInactive:0
      },
    };
    if (this.ptrForm.valid) {
      this.loaderService.display(true);
      this.ptrActionService.addPTRDetails(PTRDetailsForApi)
      .subscribe(
        data => {
          this.msgs = [];
          if (data[0].RESULTKEY === 'SUCCESS') {
            if (this.TerminationId === 0 ) {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.ptrResources.contractorsuccess });
            }
            else{
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.ptrResources.updateSuccess });
            }
            this.ResetForm();
            this.getPTRDetailListByClient();
          }
          if(data[0].RESULTKEY === ' Duplicate record found'){
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg , detail: this.ptrResources.duplicate });
          }
          if(data[0].RESULTKEY === 'Already Deleted'){
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg , detail: this.ptrResources.AlreadyDeleted });
          }
          this.loaderService.display(false);
        }
      )
    }
  }
  ResetForm(){
    this.ptrForm.reset({ chkIsActive: true });
    this.pageheading = 'Add New Plant Termination Reason';
  this.Clear = 'Clear';
  this.SaveButtonText = 'Save';
  this.newPtrdetails = {
    description: null,
    terminationReason:null
}
  this.TerminationId = 0;
  }

  GetPtrOnEdit(TerminationId){
    event.stopPropagation();
    const data = this.allptrList.filter(x => x.TerminationId === TerminationId);
    if (data !== null) {
      this.TerminationId = TerminationId
      this.ptrForm.patchValue({
        terminationReason:data[0].TerminationReason,
        description: data[0].Description,
        chkIsActive: data[0].IsActive
      });
      this.SaveButtonText = 'Update';
      this.pageheading = 'Edit Plant Termination Reason';
      this.Clear = 'Cancel';
      this.scrolltopservice.setScrollTop();
    } else {
      this.allptrList = [];
      }
      this.loaderService.display(false);
  }

  ShowConformationMessaegForDelete(TerminationId, ptr, IsDeleted, ActiveInactiveFlag){
    event.stopPropagation();
    let strMessage: any;
  
      strMessage = 'Do you want to delete this Termination Reason?';
  
    
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.ActivateDeletePTR(TerminationId, ptr, IsDeleted, ActiveInactiveFlag);
      },
      reject: () => {
      }
    });
  }
  onPageChange(e) {
    this.event = e;
  }

  ShowConformationMessaegForDeactive(TerminationId, ptr, rowIndex, IsDeleted, ActiveInactiveFlag){
    event.stopPropagation();
    let strMessage: any;
    if (this.allptrList[rowIndex].IsActive === true) {
        strMessage = 'Do you want to activate this Termination Reason?';
    } else {
        strMessage = 'Do you want to inactivate this Termination Reason?';
    }
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
         this.ActivateDeletePTR(TerminationId, ptr, IsDeleted, ActiveInactiveFlag);
        },
        reject: () => {
          ptr.IsActive = !ptr.IsActive;
        }
    });
  }

  ActivateDeletePTR(TerminationId, ptr, IsDeleted, ActiveInactiveFlag) {
    this.submitted = true;
    let PTRDetailsForApi;
    // console.log(this.growerForm.value);
  
        PTRDetailsForApi = {
     Termination:{
        TerminationId:TerminationId,
        ClientId:this._cookieService.ClientId,
        VirtualRoleId:this._cookieService.VirtualRoleId,
        IsActive:ptr.IsActive,
        IsDeleted:IsDeleted,
        TerminationReason:ptr.terminationReason,
        Description:ptr.description,
        ActiveInactive:ActiveInactiveFlag
      },
    
    };
  
    this.loaderService.display(true);
    this.ptrActionService.addPTRDetails(PTRDetailsForApi)
    .subscribe(
      data => {
        // console.log(data);
        this.msgs = [];
        if (data[0]. RESULTKEY === 'SUCCESS' && ActiveInactiveFlag === 1) {
          if (ptr.IsActive !== true) {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.ptrResources.ptrinactivated });
            
            this.getPTRDetailListByClient();
            this.loaderService.display(false);
          } else {
            
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.ptrResources.activated });
            
            this.getPTRDetailListByClient();
            this.loaderService.display(false);
          }
        } if (data[0]. RESULTKEY === 'SUCCESS' && IsDeleted === 1) {
          
       
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
            detail: this.ptrResources.deletedSuccess });
          
            this.getPTRDetailListByClient();
            this.loaderService.display(false);
        } else if (data[0]. RESULTKEY === 'NotUpdated') {
          if (IsDeleted === 1) {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.ptrResources.cannotdelete });
            
          } else if (ptr.IsActive === 1) {
            
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.ptrResources.cannotInactivate });
            
            ptr.IsActive = !ptr.IsActive;
          } else {
           
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.ptrResources.cannotActivate });
           
            ptr.IsActive = !ptr.IsActive;
          }
        } else if (data[0]. RESULTKEY === 'Already Deleted') {
          this.msgs = [];
          
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.ptrResources.alreadydlt });
          
          
        }else if (data[0]. RESULTKEY === 'InUse') {
          this.msgs = [];
          
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.ptrResources.inuse });
          
          
        }
          this.loaderService.display(false);
      },
      error => {
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
        this.loaderService.display(false);
      }
    );
  }

}
