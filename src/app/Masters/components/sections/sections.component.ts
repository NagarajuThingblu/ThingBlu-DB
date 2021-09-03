
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';
import { GlobalResources } from '../../../global resource/global.resource';
import { MastersResource } from '../../master.resource';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { AppCommonService } from './../../../shared/services/app-common.service';
import { Input, EventEmitter } from '@angular/core';
import { ConfirmationService, Confirmation } from 'primeng/api';
import { AppComponent } from '../../../app.component';
import { ScrollTopService } from '../../../shared/services/ScrollTop.service';
import { AppConstants } from '../../../shared/models/app.constants';
import * as _ from 'lodash';
import { routing } from '../../../app.routing';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { NewSectionDetailsActionService } from '../../../task/services/add-section-details.service';
import { element } from 'protractor';
import { PTRService } from '../../../Masters/services/ptr.service';

@Component({
  moduleId: module.id,
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.css']
})
export class SectionsComponent implements OnInit {


  clear: any;
  paginationValues: any;
  chkSelectAll: any;
  public newSectionEntryForm: FormGroup;
  TerminationReasons: FormGroup;
  Fields: any[];
  chkIsActive: boolean;
  strains: any[];
  // section: any[];
  public saveButtonText = 'save';
  public Phases:any;
  public newProductTypeResources: any;
  public newSectionResources: any;
  public globalResource: any;
  public _cookieService: any;
  public newSectionForm_copy: any;
  public msgs: any[];
  public SectionOnEdit: any;
  public plusOnEdit: boolean = true;
  submitted: boolean;
  public Year: any;
  public SectionIdForUpdate: any = 0;
  public IsDeletedForUpdate: any = 0;
  public duplicateSection: any;
  public ActiveInActiveForUpdate: any = 0;
  public event: any;
  public popupTerminationReason: boolean = false
  public fieldname:any;
  public sectionname:any;
  public strainname:any;
  public tpc:any;
  public year:any;
  public ld:any;
  public TerminatioReasons: any[];
  pageheading: any;
  collapsed: any;
  sysmbol:any;
  newSectionDetails = {
      Field: null,
      section: null,
      strain: null,
      plantcount: null,
      year: null,
      // Year: new Date().getFullYear()
      
    };
    private globalData = {
      Fields: [],
    };
   
  public newEmployeeResources: any;
  public allsectionslist:any;

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private cookieService: CookieService,
    private newSectionDetailsActionService: NewSectionDetailsActionService, 
    private dropdownDataService: DropdownValuesService, 
    private dropdwonTransformService: DropdwonTransformService,
    private appCommonService: AppCommonService,
    private appComponentData: AppComponent,
    private scrolltopservice: ScrollTopService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private ptrActionService: PTRService,
    private cdr: ChangeDetectorRef
  ) {
    
   
  }
  items = new FormArray([], this.customGroupValidation );
  arrayItems: FormArray;
  removeDuplicatesById(dataObject) {
   
    const newArr = [];
    dataObject.forEach((value, key) => {
      let exists = false;
      newArr.forEach((val2, key1) => {
        if (value.Field === val2.FieldId) { exists = true; }
      });

      if (exists === false && value.FieldId !== '') { newArr.push(value); }
    });
    return newArr;
   
  }
 
  getAllFields() {
    this.dropdownDataService.getFields().subscribe(
      data => {
        this.globalData.Fields = data;
        this.Fields = this.dropdwonTransformService.transform(data, 'FieldName', 'FieldId', '-- Select --');
       
        // console.log("fields"+JSON.stringify(this.Fields));
      } ,
      error => { console.log(error); },
      () => console.log('Get all brands complete'));
  }
 
  getAllStrains() {
    this.dropdownDataService.getStrains().subscribe(
      data => {
        
        if (data) {
        
        this.strains = this.dropdwonTransformService.transform(data, 'StrainName', 'StrainId', '-- Select --');
        }
      } ,
      error => { console.log(error); },
      () => console.log('Get all strains complete'));
  }
  getAllsectionlist()
  {
this.newSectionDetailsActionService.Getsectionlist().subscribe(
  data=>{
    if (data !== 'No Data Found') {
      this.allsectionslist=data;
      this.paginationValues = AppConstants.getPaginationOptions;
    if (this.allsectionslist.length > 20) {
      this.paginationValues[AppConstants.getPaginationOptions.length] = this.allsectionslist.length;
    }
  } else {
    this.allsectionslist = [];
   }
   this.loaderService.display(false);
  },
   error => { console.log(error);  this.loaderService.display(false); },
   () => console.log('getAllStrainsbyClient complete'));
  }

  
 resetForm() {
    this.newSectionEntryForm.reset({ chkSelectAll: true });
    
this.saveButtonText ="Save"
this.pageheading = "Add New Section"
this.Year = new Date().getFullYear();
    const control = <FormArray>this.newSectionEntryForm.controls['items'];
    
    let length = control.length;
    while (length > 0) {
      length = Number(length) - 1;
      this.deleteItemAll(length);
    }
   
    this.addItem();
  }
  doOPenPanel() {
    this.collapsed = false;
    this.resetForm();
  }
 
    onSubmit(value: string) {
      this.submitted = true;
      let newSectionForApi;
      newSectionForApi = {
        Sections: {
         
            ClientId: Number(this._cookieService.ClientId),
            FieldId: Number(this.newSectionEntryForm.value.Field),
            VirtualRoleId: Number(this._cookieService.VirtualRoleId),
            TerminatedPlantCount:0,
            TerminationReasonId:0,
            IsTaskCompleted:0,
            TaskTypeId:0,
            TerminationSectionMapId:0
           
           
        },
        SectionsTypeDetails: [],
        TerminationTypeDetails:[]
      };
      newSectionForApi.TerminationTypeDetails.push({
        TerminationSectionMapId:0,
        TerminatedPlantCount: 0,
        TerminationReasonId:0
  
       });

    this.SectionDetailsArr.controls.forEach((element, index) => {
      this.duplicateSection = element.value.section
        newSectionForApi.SectionsTypeDetails.push({
          SectionId: this.SectionIdForUpdate,
            SectionName: element.value.section,
            StrainId:  element.value.strain,
            IsActive: element.value.chkSelectAll ? 1 : 0,
            PlantsCount:element.value.plantcount,
            year:element.value.year,
            IsDeleted:this.IsDeletedForUpdate,
            IsLightDeprevation:element.value.lightDept? 1: 0,
            ActiveInactive:this.ActiveInActiveForUpdate

            
         });
    
     });
    
      this.newSectionForm_copy = JSON.parse(JSON.stringify(Object.assign({}, this.newSectionEntryForm.value)));

      if (this.newSectionEntryForm.valid) {
       
         this.loaderService.display(true);
        this.newSectionDetailsActionService.addNewSectionEntry(newSectionForApi)
        .subscribe(
            data => {
            
              this.msgs = [];
              if (String(data[0].RESULTKEY).toLocaleUpperCase() === 'SUCCESS') {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.newSectionResources.newsectionsavedsuccess });
               
                this.resetForm();
                this.getAllsectionlist();
                this.SectionIdForUpdate = 0;
              } else if (String(data[0].RESULTKEY).toLocaleUpperCase() === 'UPDATED') {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.newSectionResources.updated });
               
                this.resetForm();
                this.getAllsectionlist();
                this.SectionIdForUpdate = 0;
              } else if (String(data).toLocaleUpperCase()  === this.duplicateSection+" Section Already Existed") {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.duplicateSection+this.newSectionResources.duplicateSection });
              } else if (String(data).toLocaleUpperCase() === 'already deleted') {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.newSectionResources.alreadydeleted });
              }else if (String(data).toLocaleUpperCase() === 'FAILURE') {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
              } else if (String(data[0].RESULTKEY).toUpperCase() === 'INUSE') {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                    detail: this.newProductTypeResources.producttypeisassigned });
              } else if (String(data[0].RESULTKEY).toUpperCase() === 'NOTPRESENT') {
                if (data[0].NoBrand === 1) {
                  this.newSectionEntryForm.controls['brand'].setErrors({ 'brandnotpresent': true });
                  this.loaderService.display(false);
                }
                if (data[0].NoSubBrand === 1) {
                  this.newSectionEntryForm.controls['subBrand'].setErrors({ 'subbrandnotpresent': true });
                  this.loaderService.display(false);
                }
                if (data[0].NoStrain === 1) {
                  this.newSectionEntryForm.controls['strain'].setErrors({ 'strainnotpresent': true });
                  this.loaderService.display(false);
                } if (data[0].NoPkgType === 1) {
                  this.newSectionEntryForm.controls['packageType'].setErrors({ 'pkgtypenotpresent': true });
                  this.loaderService.display(false);
                } if (data[0].NoSkew === 1) {
                  this.newSectionEntryForm.controls['skewType'].setErrors({ 'skewnotpresent': true });
                  this.loaderService.display(false);
                }
              } else if (String(data[0].RESULTKEY).toLocaleUpperCase() === 'DUPLICATE') {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.duplicateSection+this.newSectionResources.duplicateSection });
                this.loaderService.display(false);
                // data.forEach(dataItem => {
                // let formGroup;
                // formGroup = (<FormGroup>this.newSectionEntryForm.get('items.' + dataItem.IndexCode));

                // (formGroup as FormGroup).setErrors({ 'prototypenotpresent': true });
                // this.loaderService.display(false);
                // });

                
              } else {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
              }
             
                this.loaderService.display(false);
            },
            error => {
              this.msgs = [];
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
             
              this.loaderService.display(false);
            });
      } else {
        this.appCommonService.validateAllFields(this.newSectionEntryForm);
      }
    }
 
    onPageChange(e) {
      this.event = e;
    }
    customGroupValidation (formArray) {
      let isError = false;
      const result = _.groupBy( formArray.controls , c => {
        return [c.value.section];
      });

      for (const prop in result) {
          if (result[prop].length > 1 && result[prop][0].controls['section'].value !== null) {
            isError = true;
              _.forEach(result[prop], function (item: any, index) {
               
                item._status = 'INVALID';
              });
          } else {
              result[prop][0]._status = 'VALID';
              
          }
      }
      if (isError) { return {'duplicate': 'duplicate entries'}; }
  }

  ngOnInit() {
    console.log("Field list "+this.globalData.Fields);
    this.saveButtonText = 'Save';
    this.pageheading="Add New Section";
    this.clear = 'Clear';
    this.newEmployeeResources = MastersResource.getResources().en.addnewemployee;
    this.newProductTypeResources = MastersResource.getResources().en.newproductype;
    this.newSectionResources = MastersResource.getResources().en.addnewsection;
    this.globalResource = GlobalResources.getResources().en;
    this.appComponentData.setTitle('Sections');
    this._cookieService = this.appCommonService.getUserProfile();
    this.getAllFields();
    this.getAllStrains();
    this.getAllsectionlist();
    setTimeout(() => {this.loaderService.display(true);
    }, 0);
    
  this.newSectionEntryForm = this.fb.group({
    'Field': new FormControl(null, Validators.required),
      items: new FormArray([], this.customGroupValidation),
  });
  this.TerminationReasons = this.fb.group({
    'phase': new FormControl(null, Validators.required),
    'completed':new FormControl(null),
    'cpc':new FormControl(null),
    'Terminationreason':new FormControl(null),
    'tpc':new FormControl(null),
  })
  this.addItem();
  this.Year = new Date().getFullYear();
  if (this.appCommonService.ProductTypeBackLink && this.appCommonService.ProductTypeFormDetail) {
        this.newSectionEntryForm = this.appCommonService.ProductTypeFormDetail;
        this.appCommonService.ProductTypeFormDetail = null;
  } else if (this.appCommonService.TPProcessorBackLink && this.appCommonService.ProductTypeFormDetail) {
        this.newSectionEntryForm = this.appCommonService.ProductTypeFormDetail;
        this.appCommonService.ProductTypeFormDetail = null;
  } else if (this.appCommonService.lotPageBackLink && this.appCommonService.ProductTypeFormDetail) {
        this.newSectionEntryForm = this.appCommonService.ProductTypeFormDetail;
        this.appCommonService.ProductTypeFormDetail = null;
  }

  setTimeout(() => {
    this.loaderService.display(false);
  }, 500);
  this.Phases =  [
    {label: '--Select--', value: 'null'},
    {label: 'Planting', value: 'Planting'},
    {label: 'Harvesting', value: 'Harvesting'}
  ];
  }

  get SectionDetailsArr(): FormArray {
    return this.newSectionEntryForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      section: new FormControl(null, Validators.compose([Validators.required, Validators.max(99999), Validators.min(0.1)])),
      strain: new FormControl(null, Validators.compose([Validators.required, Validators.max(99999), Validators.min(0.1)])),
      plantcount: new FormControl(null, Validators.compose([Validators.required, Validators.max(999999999999999), Validators.min(0.1)])),
      year: new FormControl(null, Validators.compose([ Validators.max(99999), Validators.min(0.1)])),
      lightDept: new FormControl(false),
      chkSelectAll: new FormControl(true)
    });
  }
  addItem(): void {
    this.sysmbol=0;
    // this.SectionDetailsArr.push(this.createItem());
    this.arrayItems = this.newSectionEntryForm.get('items') as FormArray;
    this.arrayItems.push(this.createItem());
  }
  deleteItem(index: number) {
    
    const control = <FormArray>this.newSectionEntryForm.controls['items'];
   
    if (control.length !== 1) {
      control.removeAt(index);
    }
    console.log(this.newSectionEntryForm.get('items'))
   
  }
  deleteItemAll(index: number) {
   
    const control = <FormArray>this.newSectionEntryForm.controls['items'];
    control.removeAt(index);
  }

  

 

  // viewAllBrands() {
  //   this.appCommonService.ProductTypeBackLink = true;
  //   this.appCommonService.ProductTypeFormDetail = this.newSectionEntryForm;
  //   this.router.navigate(['../home/addnewbrand']);
  // }

 

  // viewAllStrains() {
  // this.appCommonService.ProductTypeBackLink = true;
  // this.appCommonService.ProductTypeFormDetail = this.newSectionEntryForm;
  //   this.router.navigate(['../home/master/strainmaster']);
  // }
  // getSectionOnEdit(SectionId) {
  //   this.plusOnEdit = false;
  //   console.log(this.allsectionslist)
  //   const data = this.allsectionslist.filter(x => x.SectionId === SectionId);
  //   console.log(data);
  //   var itemlist = this.newSectionEntryForm.get('items')['controls'];
  //    if (data !== 'No data found!') {
  //      this.SectionIdForUpdate = SectionId;
  //      this.SectionOnEdit = data;
  //      const fieldName = this.newSectionEntryForm.controls['Field'];
  //      const sectionName = itemlist[0].controls['section'];
  //      const strainName =  itemlist[0].controls["strain"];
  //      const plantsCount =  itemlist[0].controls["plantcount"];
  //      const year = itemlist[0].controls["year"];
  //      const lightDept =  itemlist[0].controls["lightDept"];
  //      const chkIsActive =   itemlist[0].controls["chkSelectAll"];
        
  //      fieldName.patchValue(this.SectionOnEdit[0].FieldId);
  //      sectionName.patchValue(this.SectionOnEdit[0].SectionName);
  //      strainName.patchValue(this.SectionOnEdit[0].StrainId);
  //      plantsCount.patchValue(this.SectionOnEdit[0].PlantsCount);
  //      lightDept.patchValue(this.SectionOnEdit[0].IsLightDeprevation);
  //      year.patchValue(this.SectionOnEdit[0].Year);
  //       chkIsActive.patchValue(this.SectionOnEdit[0].IsActive);
       
  //       this.clear = 'Cancel';
  //      this.saveButtonText = 'Update';
  //      this.pageheading = 'Edit Section';

      
       
  //    } else {
  //    this.allsectionslist = [];
  //    }
  //    this.loaderService.display(false);
  //   //  this.cdr.detectChanges();
  // }
  showConformationMessaegForDeactive(SectionId, section, rowIndex, IsDeleted, ActiveInactiveFlag) {
    console.log(section);
    let strMessage: any;
    if (this.allsectionslist[rowIndex].IsActive === true) {
      strMessage = this.newSectionResources.activeSectionMsg ;
    } else {
      strMessage = this.newSectionResources.deactivateSectionMsg ;
    }
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
         this.activateDeleteSection(SectionId, section, IsDeleted, ActiveInactiveFlag);
        },
        reject: () => {
          section.IsActive = !section.IsActive;
        }
    });
  }
  showConformationMessaegForDelete(SectionId,section, IsDeleted: number, ActiveInactiveFlag) {
    let strMessage: any;
    strMessage = this.newSectionResources.deleteSectionMsg;
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.activateDeleteSection(SectionId, section, IsDeleted, ActiveInactiveFlag);
      },
      reject: () => {
      }
    });
}
activateDeleteSection(SectionId, section, IsDeleted, ActiveInactiveFlag){
  let newSectionDetailsForApi;
  // console.log(value);
  newSectionDetailsForApi= {
    Sections: {
        ClientId: Number(this._cookieService.ClientId),
        FieldId: section.FieldId,
        VirtualRoleId:  Number(this._cookieService.VirtualRoleId),
        TerminatedPlantCount:0,
            TerminationReasonId:0,
            IsTaskCompleted:0,
            TaskTypeId:0,
            TerminationSectionMapId:0
        // ActiveInactive: ActiveInactiveFlag,
        // IsDeleted: IsDeleted,
        // IsActive: section.IsActive,
       
    },
    SectionsTypeDetails: [],
    TerminationTypeDetails:[]
  };
  newSectionDetailsForApi.TerminationTypeDetails.push({
    TerminationSectionMapId:0,
    TerminatedPlantCount: 0,
    TerminationReasonId:0

   });
  this.SectionDetailsArr.controls.forEach((element, index) => {

    newSectionDetailsForApi.SectionsTypeDetails.push({
        SectionId: SectionId,
        SectionName: section.SectionName,
        StrainId:section.StrainId,
        IsActive:section.IsActive,
        PlantsCount:section.PlantsCount,
        LightDept:section.LightDept? 1: 0,
        year:section.Year,
        IsDeleted:IsDeleted,
        ActiveInactive:ActiveInactiveFlag
        
     });

 });
  this.loaderService.display(true);
  this.newSectionDetailsActionService.addNewSectionEntry(newSectionDetailsForApi)
  .subscribe(
    data => {
   
      this.msgs = [];
      if (String(data[0].RESULTKEY).toLocaleUpperCase() === 'SUCCESS' && IsDeleted === 1) {
      
        this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
        detail: this.newSectionResources.newsectiondeletedsuccess  });
        
        this.resetForm();
        this.getAllsectionlist();
        
      } else if (String(data[0].RESULTKEY).toLocaleUpperCase() === 'INUSE') {
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
        detail: this.newSectionResources.sectionisassigned });
        this.loaderService.display(false);
      }
      else if (String(data[0].RESULTKEY) === 'The Section Is In Use you Cannot delete') {
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
        detail: data[0].RESULTKEY });
        this.loaderService.display(false);
      }  else if (String(data[0].RESULTKEY).toLocaleUpperCase() === 'SUCCESS' && ActiveInactiveFlag === 1) {
        if (section.IsActive === true) {
          this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
          detail: this.newSectionResources.sectionactivatesuccess });
          this.resetForm();
         
          this.loaderService.display(false);
        } else {
          this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
          detail: this.newSectionResources.sectiondeactivatesuccess });
          this.resetForm();
         
          this.loaderService.display(false);
        }
      } else {
        this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
      }
        
        this.loaderService.display(false);
    },
    error => {
      this.msgs = [];
      this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
      
      this.loaderService.display(false);
    });

}

showTerminationReasonPopup(section){
  this.router.navigate(['../home/master/taskupdate', section]);
}
showSectionDetails(section){
  this.router.navigate(['../home/master/infoofsection', section]);
}
getAllTerminationReasons(){
  this.ptrActionService.GetAllPTRListByClient().subscribe(
    data => {
      if(data != 'No Data Found!'){
        this.TerminatioReasons = this.dropdwonTransformService.transform(data, 'TerminationReason', 'TerminationId', '-- Select --',false);
      }
      else{
        this.TerminatioReasons = [];
      }
     
     } ,
     error => { console.log(error);  this.loaderService.display(false); },
     () => console.log('getTerminationReasons complete'));
}
closePopUp(){
  this.popupTerminationReason = false
}
submitCompleteParameter(value: string){
console.log("hi")
}
}
 