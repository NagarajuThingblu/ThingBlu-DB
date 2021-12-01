import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GlobalResources } from '../../../global resource/global.resource';
import { OSService } from '../../services/otherSource.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { MastersResource } from '../../master.resource';
import { AppConstants } from '../../../shared/models/app.constants';
import { ScrollTopService } from '../../../shared/services/ScrollTop.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-othersource',
  templateUrl: './othersource.component.html',
  styleUrls: ['./othersource.component.css']
})
export class OthersourceComponent implements OnInit {
  othersourceForm: FormGroup;
  //variables
  pageheading = 'Add New Source';
  IsActive: boolean;
  globalResource: any;
  submitted: boolean;
  public _cookieService: any;
  SaveButtonText = 'Save';
  Clear = 'Clear';
  osResources: any;
  public msgs: any[];
  OSId=0;
  public allOSList: any;
  PaginationValues: any;
  event: any;
  newOSdetails: {
    description: null,
    othersourceName: null,
}
  constructor( 
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private appCommonService: AppCommonService,
    private OSService: OSService,
    private scrolltopservice: ScrollTopService,
    private confirmationService: ConfirmationService,) { }

  ngOnInit() {
    this.IsActive = true;
    this.globalResource = GlobalResources.getResources().en;
    this._cookieService = this.appCommonService.getUserProfile();
    this.osResources = MastersResource.getResources().en.os;
    this.othersourceForm = this.fb.group({
      'othersourceName': new FormControl(null, Validators.required),
      'description': new FormControl(null),
      'chkIsActive': new FormControl(null)
    })
    this.getOSDetailListByClient()
    this.loaderService.display(false);
  }

  onSubmit(value: string){
    this.submitted = true;
    let OtherSourceDetailsForApi;
    OtherSourceDetailsForApi = {
      OtherSourceDetailsForApi:{
        "OSId": this.OSId,
        "ClientId": this._cookieService.ClientId,
        "OSName": this.othersourceForm.value.othersourceName,
        "Description":this.othersourceForm.value.description,
        "VirtualRoleId": this._cookieService.VirtualRoleId,
        "IsActive":this.othersourceForm.value.chkIsActive ? 1 : 0,
        "IsDeleted": 0,
        "ActiveInactive": 0
      }

    };
    if (this.othersourceForm.valid) {
      this.loaderService.display(true);
      this.OSService.addOSDetails(OtherSourceDetailsForApi)
      .subscribe(
        data => {
          this.msgs = [];
          if (data[0].RESULTKEY === 'SUCCESS') {
            if (this.OSId === 0 ) {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.osResources.contractorsuccess });
            }
            else{
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.osResources.updateSuccess });
            }
            this.ResetForm();
           this.getOSDetailListByClient();
          }
          if(data[0].RESULTKEY === ' Duplicate record found'){
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg , detail: this.osResources.duplicate });
          }
          if(data[0].RESULTKEY === 'Already Deleted'){
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg , detail: this.osResources.AlreadyDeleted });
          }
          this.loaderService.display(false);
        }
      )
    }
  }

  ResetForm(){
    this.othersourceForm.reset({ chkIsActive: true });
    this.pageheading = 'Add New Source';
  this.Clear = 'Clear';
  this.SaveButtonText = 'Save';
  this.newOSdetails = {
    description: null,
    othersourceName:null
}
  this.OSId = 0;
  }

  getOSDetailListByClient(){
    this.loaderService.display(true);
    this.OSService.GetAllosListByClient().subscribe(
      data => {
        if (data !== 'No Data Found!') {
           this.allOSList = data;
          
           this.PaginationValues = AppConstants.getPaginationOptions;
           if (this.allOSList.length > 20) {
             this.PaginationValues[AppConstants.getPaginationOptions.length] = this.allOSList.length;
           }
        } else {
         this.allOSList = [];
        }
        this.loaderService.display(false);
       } ,
       error => { console.log(error);  this.loaderService.display(false); },
       () => console.log('getOtherSourceDetailListByClient complete'));
  }

  GetOSOnEdit(OSId){
    event.stopPropagation();
    const data = this.allOSList.filter(x => x.OSId === OSId);
    if (data !== null) {
      this.OSId = OSId
      this.othersourceForm.patchValue({
        othersourceName  :data[0].OSName,
        description: data[0].Description,
        chkIsActive: data[0].IsActive
      });
      this.SaveButtonText = 'Update';
      this.pageheading = 'Edit Source Details';
      this.Clear = 'Cancel';
      this.scrolltopservice.setScrollTop();
    } else {
      this.allOSList = [];
      }
      this.loaderService.display(false);
  }

  onPageChange(e) {
    this.event = e;
  }

  ShowConformationMessaegForDelete(OSId,os, IsDeleted, ActiveInactiveFlag){
    event.stopPropagation();
    let strMessage: any;
  
      strMessage = 'Do you want to delete this Source?';
  
    
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.ActivateDeleteSource(OSId,os,  IsDeleted, ActiveInactiveFlag);
      },
      reject: () => {
      }
    });
  }
  ShowConformationMessaegForDeactive(OSId,os,  rowIndex, IsDeleted, ActiveInactiveFlag){
    event.stopPropagation();
    let strMessage: any;
    if (this.allOSList[rowIndex].IsActive === true) {
        strMessage = 'Do you want to activate this Source?';
    } else {
        strMessage = 'Do you want to inactivate this Source?';
    }
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
         this.ActivateDeleteSource(OSId,os,  IsDeleted, ActiveInactiveFlag);
        },
        reject: () => {
          os.IsActive = !os.IsActive;
        }
    });
  }

  ActivateDeleteSource(OSId, os, IsDeleted, ActiveInactiveFlag) {
    this.submitted = true;
    let OtherSourceDetailsForApi;
    // console.log(this.growerForm.value);
  
    OtherSourceDetailsForApi = {
      OtherSourceDetailsForApi:{
      OSId:OSId,
      OSName:os.OSName,
        ClientId:this._cookieService.ClientId,
        VirtualRoleId:this._cookieService.VirtualRoleId,
        IsActive:os.IsActive == true?1:0,
        IsDeleted:IsDeleted,
        Description:os.Description,
        ActiveInactive:ActiveInactiveFlag
      },
    
    };
  
    this.loaderService.display(true);
    this.OSService.addOSDetails(OtherSourceDetailsForApi)
    .subscribe(
     
      data => {
        // console.log(data);
        this.msgs = [];
        if (data[0]. RESULTKEY === 'SUCCESS' && ActiveInactiveFlag === 1) {
          if (os.IsActive !== true) {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.osResources.inactivated });
            
            this.getOSDetailListByClient();
            this.loaderService.display(false);
          } else {
            
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.osResources.activated });
            
            this.getOSDetailListByClient();
            this.loaderService.display(false);
          }
        } if (data[0]. RESULTKEY === 'SUCCESS' && IsDeleted === 1) {
          
       
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
            detail: this.osResources.deletedSuccess });
          
            this.getOSDetailListByClient();
            this.loaderService.display(false);
        } else if (data[0]. RESULTKEY === 'NotUpdated') {
          if (IsDeleted === 1) {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.osResources.cannotdelete });
            
          } else if (os.IsActive === 1) {
            
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.osResources.cannotInactivate });
            
            os.IsActive = !os.IsActive;
          } else {
           
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.osResources.cannotActivate });
           
            os.IsActive = !os.IsActive;
          }
        } else if (data[0]. RESULTKEY === 'Already Deleted') {
          this.msgs = [];
          
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.osResources.alreadydlt });
          
          
        }else if (data[0]. RESULTKEY === 'InUse') {
          this.msgs = [];
          
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.osResources.inuse });
          
          
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
