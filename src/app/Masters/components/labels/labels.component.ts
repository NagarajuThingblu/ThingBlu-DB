
import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';
import { GlobalResources } from '../../../global resource/global.resource';
import { MastersResource } from '../../master.resource';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray, FormArrayName } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { AppCommonService } from './../../../shared/services/app-common.service';
import { Input, EventEmitter } from '@angular/core';
import { ConfirmationService, Confirmation } from 'primeng/api';
import { NewProductTypeService } from '../../services/new-product-type.service';
import { AppComponent } from '../../../app.component';
import { ScrollTopService } from '../../../shared/services/ScrollTop.service';
import { AppConstants } from '../../../shared/models/app.constants';
import * as _ from 'lodash';
import { routing } from '../../../app.routing';
import { NewSectionDetailsActionService } from '../../../task/services/add-section-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NewFieldGenerationService } from '../../../task/services/new-field-generation.service';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import {NewLabelDetailsActionService} from '../../../task/services/add-label-details.service'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
    moduleId: module.id,
    selector: 'app-labels',
    templateUrl: './labels.component.html',
    styleUrls: ['./labels.component.css']
  })
 
  export class LabelsComponent implements OnInit {
   

  // @Input() NewProductTypeSave: EventEmitter<any> = new EventEmitter<any>();
  clear: any;
  paginationValues: any;
  chkSelectAll: any;
  public newLabelsEntryForm: FormGroup;
  strains: any[];
  Fields: any[];
  Sections: any[];
  public sectionData: any;
  TaskType: any[];
  public taskid;
  public taskType;
  public visible: boolean = false
  public TaskTypeID: any = 0;
  public TaskTypeName: any = '';
  public LabelOnEdit: any;
  public skewtypes:any[];
  public tasktypes: any[];
  skewtype: any[];
  public displayPopUp: boolean = false;
  public skewTypeID: any = 0;
  TaskTypeDetails: any;
  public event: any;
  chkIsActive: boolean;
  public saveButtonText: any;
  public newLabelResources: any;
  public globalResource: any;
  public _cookieService: any;
  public msgs: any[];
  public LabelIdForUpdate: any = 0;
  public IsDeletedForUpdate: any =0;
  public ActiveInActiveForUpdate: any = 0;
  public newLabelForm_copy: any;
  public plusOnEdit: boolean = true;
  submitted: boolean;
  collapsed: any;
  public viewNoOfBins:boolean = true;
  taskTypeNameValue = '';
  enableDropDown = true
  enabletextbox = true;
  public defaultValue: number =1;
  public e:any;
  public allFieldslist:any;
  HT: String 
  taskTypeValueAndLabelMap: Map<number,string> = new Map<number,string>()
  pageheading: any;
  public placeholder ='-- Select --';
  public taskKeyName: any = '';
  public strainName: any;
  public lightDep:any;
  public allLabelslist:any;
  public count:number = 0;
  public popupTaskType: any;
  public popupbinNo: any;
  public popupStrain:any;
  public popupSkew:any;
  public popupld:any;
  public popupTm:any;

  TrimmingMethods =['HT','MT']
  private globalData = {
    TaskType: [],
  };
  

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private newSectionDetailsActionService: NewSectionDetailsActionService, 
    private cookieService: CookieService,
    private dropdownDataService: DropdownValuesService, // For common used dropdown service
    private dropdwonTransformService: DropdwonTransformService,
    private appCommonService: AppCommonService,
    private appComponentData: AppComponent,
    private newLabelDetailsActionService: NewLabelDetailsActionService,
    private confirmationService: ConfirmationService,
    private scrolltopservice: ScrollTopService,
    private NewFieldgeneration: NewFieldGenerationService,
    private router: Router
  ) {
    this.route.params.forEach((urlParams) => {
      this.e = urlParams
      this.visible = true;
      this.taskid = urlParams['TaskTypeId'];
      this.taskType = urlParams['TaskTypeKey'];
    });
    this.GetFields();
    this.getAllStrains();
    this.getAllTaskType();
    this.getAllSkew();
    this.getAllLabelslist();
    // this.getAllPackageType();
  // this.skewType_InChange();
  // this. TaskType_InChange();
  }
  items = new FormArray([], this.customGroupValidation );
  arrayItems: FormArray;
 doOPenPanel() {
    this.collapsed = false;
    // this.resetForm();
  }
  ngOnInit() {
    console.log("TaskType list "+this.globalData.TaskType);
    this.saveButtonText = 'Save';
    this.pageheading="Add Bin";
    this.clear = 'Clear';
    this.newLabelResources = MastersResource.getResources().en.newlabel;
    // this.newProductTypeResources = MastersResource.getResources().en.newproductype;
    this.globalResource = GlobalResources.getResources().en;
    this.appComponentData.setTitle('Labels');
    this._cookieService = this.appCommonService.getUserProfile();
    setTimeout(() => {this.loaderService.display(true);
    }, 0);
    this.newLabelsEntryForm = this.fb.group({
      'TaskType': new FormControl(null, Validators.required),
      'field': new FormControl(null, Validators.required),
      'Section':new FormControl(null, Validators.required),
      items: new FormArray([], this.customGroupValidation),
      // 'bincount':  new FormControl(null),
      
      // items1: new FormArray([]),
    });
    
    this.addItem();
    if (this.appCommonService.ProductTypeBackLink && this.appCommonService.ProductTypeFormDetail) {
      this.newLabelsEntryForm = this.appCommonService.ProductTypeFormDetail;
      this.appCommonService.ProductTypeFormDetail = null;
} else if (this.appCommonService.TPProcessorBackLink && this.appCommonService.ProductTypeFormDetail) {
      this.newLabelsEntryForm = this.appCommonService.ProductTypeFormDetail;
      this.appCommonService.ProductTypeFormDetail = null;
} else if (this.appCommonService.lotPageBackLink && this.appCommonService.ProductTypeFormDetail) {
      this.newLabelsEntryForm = this.appCommonService.ProductTypeFormDetail;
      this.appCommonService.ProductTypeFormDetail = null;
}
   
  setTimeout(() => {
    this.loaderService.display(false);
  }, 500);

  // this.tasktypes =  [
  //   {label: 'Trimming', value: 'Trimming'},
  //   {label: 'Bucking', value: 'Bucking'},
  //   {label: 'PreBucking', value: 'PreBucking'}
  // ];
  }
  get labelDetailsArr(): FormArray {
    return this.newLabelsEntryForm.get('items') as FormArray;
  }
  backtotaskpage(){
    this.back(this.e)
   
    // this.router.navigate(['../home/taskaction', e.TaskTypeKey, e.TaskId]);
  }
  GetFields() {
    this.loaderService.display(true);
    this.NewFieldgeneration.GetFieldList().subscribe(data=>{
      if(data!="No Data Found"){
        this.allFieldslist=data;
        this.Fields = this.dropdwonTransformService.transform(data, 'FieldName', 'FieldId', '-- Select --');
       
      }
     
      this.loaderService.display(false);
    },
    error => { console.log(error); this.loaderService.display(false); },
    () => console.log('GetAllFieldsbyClient complete'));
 }

 
 onFieldSelection(event: any)
 {

this.newSectionDetailsActionService.Getsectionlist().subscribe(
 data=>{
   if (data !== 'No Data Found') {
    this.sectionData = data;
    this.Sections = this.dropdwonTransformService.transform(data.filter(x => x.FieldId === event.value), 'SectionName', 'SectionId', '-- Select --');

 } 
  this.loaderService.display(false);
 },
  error => { console.log(error);  this.loaderService.display(false); },
  () => console.log('getAllStrainsbyClient complete'));
 }

 onSectionSelection(event: any){

for(let sec of this.sectionData ){
  if(event.value === sec.SectionId){
    this.strainName = sec.StrainName;
    this.lightDep =sec.IsLightDeprevation;
    this.newLabelsEntryForm.controls.items['controls'][0].controls['strain'].setValue(this.strainName)
    this.newLabelsEntryForm.controls.items['controls'][0].controls['lightDept'].setValue(this.lightDep)
  }
}
 }

  back(e){
    if(e.TaskTypeKey!= null){
      this.router.navigate(['home/taskaction/', e.TaskTypeKey, e.TaskId]);
    }
    else{
      this.router.navigate(['home/addrawmaterial']);
    }
  }
createItem(): FormGroup {
  return this.fb.group({
    binNo: new FormControl(null, Validators.compose([Validators.required])),
    bincount: new FormControl(null),
    strain:new FormControl(null, Validators.compose([Validators.required, Validators.max(99999), Validators.min(0.1)])),
    skewType: new FormControl(
      this.taskTypeNameValue === 'Trimming' ? Validators.compose([Validators.required, Validators.max(99999), Validators.min(0.1)]) : null),
    lightDept: new FormControl(false),
    TrimmingMethod: new FormControl(
      this.taskTypeNameValue === 'Trimming' ? Validators.compose([Validators.required, Validators.max(99999), Validators.min(0.1)]) : null),
    chkSelectAll: new FormControl(true)
  });
  
}
// createItem1(): FormGroup {
//   return this.fb.group({
//     bincount: new FormControl(null),
//   });
  
// }

    
  getAllTaskType() {
    this.dropdownDataService.getAllTask().subscribe(
      data => {
        
        if (data) {
          let category 
         category = data.filter(item=>item.CategoryName == 'Processing');
        this.TaskType = this.dropdwonTransformService.transform(category, 'TaskTypeValue', 'TaskTypeId', '-- Select --');
        console.log(this.TaskType) 
        this.tasktypes = this.TaskType.filter(x =>x.label == 'Trimmed' ||x.label == 'Bucked' || x.label == 'Pre-Bucked'  )
        console.log(this.tasktypes) 
      }
      } ,
      error => { console.log(error); },
      () => console.log('Get all TaskType complete'));
  }
  onPageChange(e) {
    this.event = e;
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
  getAllSkew() {
    this.dropdownDataService.getSkewListByClient().subscribe(
      data => {
        if(data != 'No data found!'){
          this.skewtype = data;
          this.skewtype = this.dropdwonTransformService.transform(data, 'SkwTypeName', 'SkwTypeName', '-- Select --');
          console.log( this.skewtype )
          this.skewtypes = this.skewtype.filter(x => x.label == 'Shakes' || x.label == 'A Buds' ||x.label == 'Smalls' )
          console.log(this.skewtypes);
        }
        else{
          this.skewtypes = [];
        }
      
    },
      error => { console.log(error); },
      () => console.log('Get all skew types complete'));
  }
  getAllLabelslist(){
    this.newLabelDetailsActionService.GetLabelslist().subscribe(
      data=>{
        if(data != 'No Data Found'){
          this.allLabelslist=data;
        }
       else{
         this.allLabelslist = [];
       }
    })
  }
  addItem(): void {
    // this.sysmbol=0;
    // this.SectionDetailsArr.push(this.createItem());
   this.count++; 
  //  this.placeholder = 
    console.log(this.count)
    this.arrayItems = this.newLabelsEntryForm.get('items') as FormArray;
    this.arrayItems.push(this.createItem());
  }

  createBulkBins(index): void {
    // this.arrayItems = this.newLabelsEntryForm.get('items1') as FormArray;
    // this.arrayItems.push(this.createItem1());
    this.displayPopUp = true;
    this.popupTaskType = this.newLabelsEntryForm.value.TaskType;
    this.popupbinNo = this.newLabelsEntryForm.value.items[index].binNo;
    this.popupStrain = this.newLabelsEntryForm.value.items[index].strain;
    this.popupSkew = this.newLabelsEntryForm.value.items[index].skewType != null?this.newLabelsEntryForm.value.items[index].skewType :'';
    this.popupTm = this.newLabelsEntryForm.value.items[index].TrimmingMethod!= null?this.newLabelsEntryForm.value.items[index].TrimmingMethod :'';
    this.popupld = this.newLabelsEntryForm.value.items[index].lightDept;
  }
  closepopup(){
    this.displayPopUp = false;
  }
  customGroupValidation (formArray) {
    let isError = false;
    const result = _.groupBy( formArray.controls , c => {
      return [c.value.binNo];
    });

    for (const prop in result) {
        if (result[prop].length > 1 && result[prop][0].controls['binNo'].value !== null) {
          isError = true;
            _.forEach(result[prop], function (item: any, index) {
              // alert(index);
              item._status = 'INVALID';
            });
        } else {
            result[prop][0]._status = 'VALID';
            // console.log(result[prop].length);
        }
    }
    if (isError) { return {'duplicate': 'duplicate entries'}; }
  }
  TaskType_InChange(event?: any){
    // let taskTypes = this.TaskType;
    // let taskTypeID = this.newLabelsEntryForm.value.TaskType
    for(let item of this.TaskType){
      this.taskTypeValueAndLabelMap.set(item.value,item.label)
    }
    if(event && event.value && this.taskTypeValueAndLabelMap.get(event.value) === 'Trimmed')
    {
     
      this.taskTypeNameValue = "Trimmed"
      this.enableDropDown = false;
      this.HT = "HT"
    }
    else{
      this.enableDropDown = true;
      this.HT = ""
    }
  }

 
  onSubmit(value: string)
  {
    console.log(this.newLabelsEntryForm)
    this.submitted = true;
    let newLabelForApi;
    newLabelForApi = {
      BinLabels: {
            ClientId: Number(this._cookieService.ClientId),
            TaskTypeId: Number(this.newLabelsEntryForm.value.TaskType),
            VirtualRoleId: Number(this._cookieService.VirtualRoleId),
      },
      BinLabelsTypeDetails:[]
    };
    this.labelDetailsArr.controls.forEach((element, index) => 
    {
      
      newLabelForApi.BinLabelsTypeDetails.push({
          LabelId: this.LabelIdForUpdate,
          BinNo: element.value.binNo,
          StrainId:  element.value.strain,
          SkewType: this.enableDropDown == true? null:element.value.skewType,
          SkewTypeId: this.skewTypeID,
          IsLightDeprevation:element.value.lightDept? 1: 0,
          IsHandTrimmed:this.enableDropDown == true? 0:element.value.TrimmingMethod == 'HT'? 1:0,
          IsMachineTrimmed:this.enableDropDown == true? 0:element.value.TrimmingMethod == 'MT'? 1:0,
          IsActive: element.value.chkSelectAll ? 1 : 0,
          IsDeleted:this.IsDeletedForUpdate,
          NoOfBins:element.value.bincount ? element.value.bincount : 1,
          ActiveInactive:this.ActiveInActiveForUpdate
        });
    });
   this.newLabelForm_copy = JSON.parse(JSON.stringify(Object.assign({}, this.newLabelsEntryForm.value)));

   if (this.newLabelsEntryForm.valid) {
    this.loaderService.display(true);
    this.newLabelDetailsActionService.addNewLabelEntry(newLabelForApi)
    .subscribe(
      data => {

        this.msgs = [];
        if (String(data[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
          this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
          detail: this.newLabelResources.newlabelsavedsuccess });
         
          this.resetForm();
          this.getAllLabelslist();
          this.LabelIdForUpdate = 0;
          this.viewNoOfBins = true;
        } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'UPDATED') {
          this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
          detail: this.newLabelResources.updated });
         
          this.resetForm();
          this.getAllLabelslist();
          this.LabelIdForUpdate = 0;
        } else if (String(data).toLocaleUpperCase() === 'FAILURE') {
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
        } else if (String(data[0].ResultKey).toUpperCase() === 'INUSE') {
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.newLabelResources.producttypeisassigned });
        } else if (String(data[0].ResultKey).toUpperCase() === 'NOTPRESENT') {
          if (data[0].NoBrand === 1) {
            this.newLabelsEntryForm.controls['brand'].setErrors({ 'brandnotpresent': true });
                  this.loaderService.display(false);
                }
                if (data[0].NoSubBrand === 1) {
                  this.newLabelsEntryForm.controls['subBrand'].setErrors({ 'subbrandnotpresent': true });
                  this.loaderService.display(false);
                }
                if (data[0].NoStrain === 1) {
                  this.newLabelsEntryForm.controls['strain'].setErrors({ 'strainnotpresent': true });
                  this.loaderService.display(false);
                } if (data[0].NoPkgType === 1) {
                  this.newLabelsEntryForm.controls['packageType'].setErrors({ 'pkgtypenotpresent': true });
                  this.loaderService.display(false);
                } if (data[0].NoSkew === 1) {
                  this.newLabelsEntryForm.controls['skewType'].setErrors({ 'skewnotpresent': true });
                  this.loaderService.display(false);
                }
              } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'DUPLICATE') {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg,
                detail: data[0].ResultMsg + ' '+ this.newLabelResources.duplicate });

                
              }else if (String(data[0].RESULTKEY).toLocaleUpperCase() === 'Not Existed') {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg,
                detail: data[0].ResultMsg + ' '+ data[0].RESULTKEY });

                
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
   }
   resetForm() {
    this.saveButtonText ="save"
    this.pageheading = "Add New Bin"
    this.enableDropDown = true;
    this.viewNoOfBins = true;
    this.newLabelsEntryForm.reset({ chkSelectAll: true });
   this.plusOnEdit = true;
this.strainName = null
this.lightDep = false;
    const control = <FormArray>this.newLabelsEntryForm.controls['items'];
    
    let length = control.length;
    while (length > 0) {
      length = Number(length) - 1;
      this.deleteItemAll(length);
    }
   
    this.addItem();
  }
  deleteItemAll(index: number) {
   
    const control = <FormArray>this.newLabelsEntryForm.controls['items'];
    control.removeAt(index);
  }
  deleteItem(index: number) {
    
    const control = <FormArray>this.newLabelsEntryForm.controls['items'];
   
    if (control.length !== 1) {
      control.removeAt(index);
    }
    console.log(this.newLabelsEntryForm.get('items'))
   
  }
  getLabelsOnEdit(LabelId){
    this.plusOnEdit = false;
    this.viewNoOfBins = false;
    this.enableDropDown = true;
    console.log(this.allLabelslist)
    const data = this.allLabelslist.filter(x => x.LabelId === LabelId);
    console.log(data);
    var itemlist = this.newLabelsEntryForm.get('items')['controls'];
    if (data !== 'No data found!') {
      this.LabelIdForUpdate = LabelId;
      this.LabelOnEdit = data;
      const taskType = this.newLabelsEntryForm.controls['TaskType'];
      const field =this.newLabelsEntryForm.controls['field'];
      const section =this.newLabelsEntryForm.controls['Section'];
      const binNo = itemlist[0].controls['binNo'];
      const bincount = itemlist[0].controls['bincount'];
      const strainName =  itemlist[0].controls["strain"];
      const skewType =  itemlist[0].controls["skewType"];
      const lightDept =  itemlist[0].controls["lightDept"];
      const TrimminMethod =  itemlist[0].controls["TrimmingMethod"];
      const chkIsActive =   itemlist[0].controls["chkSelectAll"];

      taskType.patchValue(this.LabelOnEdit[0].TaskTypeId);
      field.patchValue(this.LabelOnEdit[0].FieldId);
      section.patchValue(this.LabelOnEdit[0].SectionId);
      binNo.patchValue(this.LabelOnEdit[0].BinNo);
      bincount.patchValue(this.LabelOnEdit[0].NoOfBins);
       strainName.patchValue(this.LabelOnEdit[0].StrainName);
       skewType.patchValue(this.LabelOnEdit[0].SkewType);
       lightDept.patchValue(this.LabelOnEdit[0].IsLightDeprevation);
       TrimminMethod.patchValue(this.LabelOnEdit[0].TrimmingMethod);
        chkIsActive.patchValue(this.LabelOnEdit[0].IsActive);
        if(this.LabelOnEdit[0].TaskTypeName === 'Trimming'){
            this.enableDropDown = false
        }

        this.clear = 'Cancel';
       this.saveButtonText = 'Update';
       this.pageheading = 'Edit Bin';
     
      
    }else {
      this.allLabelslist = [];
      }
      
      this.loaderService.display(false);
  }
  showConformationMessaegForDelete(LabelId,label, IsDeleted: number, ActiveInactiveFlag){
    let strMessage: any;
    strMessage = this.newLabelResources.deleteLabelMsg;
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.activateDeleteLabel(LabelId, label, IsDeleted, ActiveInactiveFlag);
      },
      reject: () => {
      }
    });
  }

  showConformationMessaegForDeactive(LabelId,label,rowIndex, IsDeleted, ActiveInactiveFlag){
    console.log(label);
    let strMessage: any;
    if (this.allLabelslist[rowIndex].IsActive === true) {
      strMessage = this.newLabelResources.activeLabelMsg ;
    } else {
      strMessage = this.newLabelResources.deactivateLabelMsg ;
    }
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
         this.activateDeleteLabel(LabelId, label, IsDeleted, ActiveInactiveFlag);
        },
        reject: () => {
          label.IsActive = !label.IsActive;
        }
    });
  }

  activateDeleteLabel(LabelId, label, IsDeleted, ActiveInactiveFlag) {
    let newLabelDetailsForApi;
    newLabelDetailsForApi= {
      BinLabels: {
        ClientId: Number(this._cookieService.ClientId),
        TaskTypeId:label.TaskTypeId,
        VirtualRoleId: Number(this._cookieService.VirtualRoleId),
      },
      BinLabelsTypeDetails:[]
    };
    this.labelDetailsArr.controls.forEach((element, index) => 
    {
      
      newLabelDetailsForApi.BinLabelsTypeDetails.push({
          LabelId:LabelId,
          BinNo: label.BinNo,
          StrainId:  label.StrainId,
          SkewType: label.SkewType,
          SkewTypeId: label.SkewTypeId,
          IsLightDeprevation:label.IsLightDeprevation? 1: 0,
          IsHandTrimmed:label.TrimmingMethod == 'HT'? 1:0,
          IsMachineTrimmed:label.TrimmingMethod == 'MT'? 1:0,
          IsActive: label.IsActive? 1:0,
          IsDeleted:IsDeleted,
          ActiveInactive:ActiveInactiveFlag
        });
    });
    this.loaderService.display(true);
    this.newLabelDetailsActionService.addNewLabelEntry(newLabelDetailsForApi)
    .subscribe(
      data => {
        this.msgs = [];
      if (String(data[0].ResultKey).toLocaleUpperCase() === 'SUCCESS' && IsDeleted === 1) {
      
        this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
        detail: this.newLabelResources.newlabeldeletedsuccess  });
        
        this.resetForm();
        this.getAllLabelslist();
        
      } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'INUSE') {
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
        detail: this.newLabelResources.sectionisassigned });
        this.loaderService.display(false);
      } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'SUCCESS' && ActiveInactiveFlag === 1) {
        if (label.IsActive!== true) {
          this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
          detail: this.newLabelResources.labeldeactivatesuccess });
          this.resetForm();
         
          this.loaderService.display(false);
        } else {
          this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
          detail: this.newLabelResources.labelactivatesuccess });
          this.resetForm();
         
          this.loaderService.display(false);
        }
      }else if(String(data[0].ResultKey) === 'This bin used so you can not delete this bin'){
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
        detail: this.newLabelResources.binisbeingused });
        this.loaderService.display(false);
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
}




