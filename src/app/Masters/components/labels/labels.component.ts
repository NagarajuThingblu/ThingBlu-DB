
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Table } from 'primeng/table';

@Component({
    moduleId: module.id,
    selector: 'app-labels',
    templateUrl: './labels.component.html',
    styleUrls: ['./labels.component.css']
  })
 
  export class LabelsComponent implements OnInit {
   

  // @Input() NewProductTypeSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('dtLabelList') table: Table
  clear: any;
  paginationValues: any;
  chkSelectAll: any;
  public newLabelsEntryForm: FormGroup;
  strains: any[];
  Fields= [];
  SectionsList: any[];
  Sections: any[];
  sectionids = [];
  public lightDept = [];
  public edit:boolean = false;
  public LD= [];
  public sectionData: any;
  TaskType: any[];
  public taskid;
  public taskType;
  public multiselector : boolean = true;
  public categoryName:any;
  public visible: boolean = false
  public TaskTypeID: any = 0;
  public TaskTypeName: any = '';
  public LabelOnEdit: any;
  public LabelOnEditSectionandField:any[]; 
  public allDetailsBasedOnTaskType: any;
  public skewtypes:any[];
  public tasktypes: any[];
  skewtype: any[];
  sectionsFilter : any[];
  fieldsFilter : any[];
  batchIdsList : any[];
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
  public batchIds : any[];
  taskTypeValueAndLabelMap: Map<number,string> = new Map<number,string>()
  pageheading: any;
  public placeholder ='-- Select --';
  public taskKeyName: any = '';
  public strainName: any;
  public strainId: any;
  public lightDep:any;
  public TotalList:any
  public allLabelslist:any;
  public allLabelslistSectionsandFields: any;
  public count:number = 0;
  public popupTaskType: any;
  public popupbinNo: any;
  public popupStrain:any;
  public popupSkew:any;
  public backUrl: boolean;
  public popupld:any;
  public popupTm:any;
  public enableFieldSection: boolean = true;
    public selectedValues = [];
    public selectedSections = [];
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
    // this.GetFields();
  
   
  
    this.getAllTaskType();
    this.getAllSkew();
    this.getAllLabelslist();
    this.GetAllSections()
    // this.getAllPackageType();
  // this.skewType_InChange();
  //this. TaskType_InChange(this.LabelOnEdit[0].TaskTypeId);
  }
  items = new FormArray([], this.customGroupValidation );
  arrayItems: FormArray;
 doOPenPanel() {
    this.collapsed = false;
    // this.resetForm();
  }
  ngOnInit() {
    this.backUrl = this.appCommonService.addRawMaterialPageBackLink;
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
      'strain':new FormControl(null, Validators.compose([Validators.required, Validators.max(99999), Validators.min(0.1)])),
      'field': new FormControl(null, Validators.required),
      'Section':new FormControl(null, Validators.required),
      'lightdept':new FormControl(null, Validators.required),
      items: new FormArray([], this.customGroupValidation),
      // 'bincount':  new FormControl(null),
      
      // items1: new FormArray([]),
    });
    // if(this.edit){
    //   this. TaskType_InChange(this.LabelOnEdit[0].TaskTypeId);
    // }
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
  }
  get labelDetailsArr(): FormArray {
    return this.newLabelsEntryForm.get('items') as FormArray;
  }
  backtotaskpage(){
    this.back(this.e)
  }

    GetAllSections(){
 
  this.newSectionDetailsActionService.Getsectionlist().subscribe(
   data=>{
     if (data !== 'No Data Found') {
      this.sectionData = data;
      this.getAllStrains();
   } 
    this.loaderService.display(false);
   },
    error => { console.log(error);  this.loaderService.display(false); },
    () => console.log('getAllStrainsbyClient complete'));
   
 }



  back(e){
    if(e.TaskTypeKey!= null){
      this.router.navigate(['home/task/taskaction/', e.TaskTypeKey, e.TaskId]);
    }
    else{
      this.router.navigate(['home/master/addrawmaterial']);
    }
  }
createItem(): FormGroup {
  return this.fb.group({
    binNo: new FormControl(null, Validators.compose([Validators.required])),
    bincount: new FormControl(null, Validators.compose([Validators.min(1)])),
    // strain:new FormControl(null, Validators.compose([Validators.required, Validators.max(99999), Validators.min(0.1)])),
    skewType: new FormControl(
      this.taskTypeNameValue === 'Trimmed' ? Validators.compose([Validators.required, Validators.max(99999), Validators.min(0.1)]) : null),
    // lightDept: new FormControl(false),
    TrimmingMethod: new FormControl(
      this.taskTypeNameValue === 'Trimmed' ? Validators.compose([Validators.required, Validators.max(99999), Validators.min(0.1)]) : null),
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
    
   this.strains = this.dropdwonTransformService.transform(this.sectionData,'StrainName', 'StrainId', '-- Select --');
   const strainfilter = Array.from(this.strains.reduce((m, t) => m.set(t.label, t), new Map()).values())
   this.strains = this.dropdwonTransformService.transform(strainfilter,'label', 'value')
  
  }
  onStrainSelect(event?: any){
    this.enableFieldSection = false;
this.Fields = null;
this.newLabelsEntryForm.controls['lightdept'].patchValue(null);
     this.lightDept = null;
    this.lightDept = [];
    if(this.categoryName === "Pre-Bucked"){
      for(let lightdept of this.sectionData){
        if(lightdept.StrainId === event.value || lightdept.StrainId === event ){
          this.lightDept.push({label: lightdept.IsLightDeprevation, value:lightdept.IsLightDeprevation})
        }
      }
      const ldfilter = Array.from(this.lightDept.reduce((m, t) => m.set(t.label, t), new Map()).values())
      this.lightDept = this.dropdwonTransformService.transform(ldfilter,'label', 'value', '-- Select --',false)
    }
  else{
    for(let lightdept of this.allDetailsBasedOnTaskType){
      if(event.value === lightdept.StrainId || lightdept.StrainId === event){
        this.lightDept.push({label: lightdept.IsLightDeprevation, value:lightdept.IsLightDeprevation})
      }
    }
    const ldfilter = Array.from(this.lightDept.reduce((m, t) => m.set(t.label, t), new Map()).values())
    this.lightDept = this.dropdwonTransformService.transform(ldfilter,'label', 'value', '-- Select --',false)
  }
  if(this.lightDept.length === 3){
    this.LD=[
      {label: 'true', value: true},
      {label: 'false', value: false},
    ]
  }
    else if(this.lightDept[1].value === true)
    {
      this.LD=[
        {label: 'true', value: true},
      ]
      // this.newLabelsEntryForm.controls.lightdept.patchValue(this.LD[0].value)
    }
    else 
    {
      this.LD=[
        {label: 'false', value: false},
      ]
      // this.newLabelsEntryForm.controls.lightdept.patchValue(this.LD[0].value)
    }
  }
  onLDSelect(event?: any){
     this.Sections = null;
    // this.Sections = []
    this.selectedValues = []
    this.Fields = [];
    if(this.categoryName === "Pre-Bucked"){
      for(let i of this.sectionData){
        if((i.IsLightDeprevation === event.value || i.IsLightDeprevation === event || i.IsLightDeprevation === this.newLabelsEntryForm.value.lightdept) && (i.StrainId === this.newLabelsEntryForm.value.strain) ){
          this.Fields.push({label: i.FieldName, value:i.FieldId})
          const Fieldfilter = Array.from(this.Fields.reduce((m, t) => m.set(t.label, t), new Map()).values())
          this.Fields = this.dropdwonTransformService.transform(Fieldfilter,'label', 'value')
        }
      }
    }
    else{
      for(let i of this.allDetailsBasedOnTaskType){
        if((i.IsLightDeprevation === event.value || i.IsLightDeprevation === event) && (i.StrainId === this.newLabelsEntryForm.value.strain) ){
          this.Fields.push({label: i.Fields, value:i.FieldUniqueId})
          const Fieldfilter = Array.from(this.Fields.reduce((m, t) => m.set(t.label, t), new Map()).values())
          this.Fields = this.dropdwonTransformService.transform(Fieldfilter,'label', 'value')
           
        }
      }
     
    }
   
  
  }
  onFieldSelect(event?: any){
    this.selectedSections = [];
    this.Sections = null;
    this.batchIds = []
    this.SectionsList = []
      this.Sections = [];
     this.sectionids = [];
    var CategoryName:any;
    CategoryName = this.TaskType.filter(x =>x.value ==this.newLabelsEntryForm.value.TaskType   )

if(CategoryName[0].label === "Pre-Bucked"){
 for(let j of event.value){
  for(let i of this.sectionData){
    if((i.FieldId === j|| i.FieldId === event) && (i.StrainId === this.newLabelsEntryForm.value.strain) && (i.IsLightDeprevation === this.newLabelsEntryForm.value.lightdept)){
          this.SectionsList.push({label: i.SectionName, value:i.SectionId})
    }
  }
 } 
 for(let index of this.SectionsList){
  if( this.Sections.indexOf(index.Value) === -1){
    this.Sections.push(index)
  }

}
}
else{
  for(let id of this.allDetailsBasedOnTaskType){
    if(id.FieldUniqueId === event.value || id.FieldUniqueId === event){
      this.batchIds.push( id.BatchId)
    }
  }
  for(let j of this.batchIds){
    for(let i of this.allDetailsBasedOnTaskType){
      if(j === i.BatchId){
        this.Sections.push({label: i.Sections, value:i.SectionUniqueId})
        this.sectionids.push( i.SectionId)
      }
    }
    
    const Sectionfilter = Array.from(this.Sections.reduce((m, t) => m.set(t.label, t), new Map()).values())
    this.Sections = this.dropdwonTransformService.transform(Sectionfilter,'label', 'value')
   } 
}

  }
  onSectionSelect(event?: any){
    this.sectionids = [];
    if(this.categoryName != "Pre-Bucked"){
      for(let i of this.allDetailsBasedOnTaskType){
        if(event.value === i.SectionUniqueId){
          if(this.sectionids.indexOf(i.SectionId)=== -1){
            this.sectionids.push(i.SectionId)
          }
        }
      }
    }
  }
onFieldEdit(fieldid){
  this.Sections = this.Sections || [];
  if(this.categoryName === "Pre-Bucked"){
    for(let i of this.sectionData){
      if((i.FieldId === fieldid) && (i.StrainId === this.newLabelsEntryForm.value.strain) && (i.IsLightDeprevation === this.newLabelsEntryForm.value.lightdept)){
        this.Sections.push({label: i.SectionName, value:i.SectionId})
        console.log(this.Sections)
  }
    }
  }
else{
  for(let i of this.allDetailsBasedOnTaskType){
    if((i.FieldUniqueId === fieldid) && (i.StrainId === this.newLabelsEntryForm.value.strain) && (i.IsLightDeprevation === this.newLabelsEntryForm.value.lightdept)){
      this.Sections.push({label: i.Sections, value:i.SectionUniqueId})
}
  }
}
  const Sectionfilter = Array.from(this.Sections.reduce((m, t) => m.set(t.label, t), new Map()).values())
  this.Sections = this.dropdwonTransformService.transform(Sectionfilter,'label', 'value')
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
    this.TotalList = []
    this.newLabelDetailsActionService.GetLabelslist().subscribe(
      data=>{
        if(data != 'No Data Found'){
          this.allLabelslist=data.Table;
          //this.allLabelslist=data.Table1;
          this.allLabelslistSectionsandFields=data.Table1
        
          this.fieldsFilter = this.dropdwonTransformService.transform(this.allLabelslist, 'Fields', 'Fields');
          // this.sectionsFilter = this.dropdwonTransformService.transform(this.allLabelslist, 'Sections', 'Sections');
          const Ffilter = Array.from(this.fieldsFilter.reduce((m, t) => m.set(t.label, t), new Map()).values())
          this.fieldsFilter = this.dropdwonTransformService.transform(Ffilter,'label', 'value')
          // const Sfilter = Array.from(this.sectionsFilter.reduce((m, t) => m.set(t.label, t), new Map()).values())
          // this.sectionsFilter = this.dropdwonTransformService.transform(Sfilter,'label', 'value')
        }
       else{
         this.allLabelslist = [];
       }
    })
  }
  addItem(): void {
  
   this.count++; 
 
    console.log(this.count)
    this.arrayItems = this.newLabelsEntryForm.get('items') as FormArray;
    this.arrayItems.push(this.createItem());
  }

  createBulkBins(index): void {
    
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
    // this.strains =  null;
    // this.lightDept = null;
    const id = event.value? event.value :event;
    this.allDetailsBasedOnTaskType = [];
  this.enableFieldSection = false;
  
    for(let item of this.TaskType){
      this.taskTypeValueAndLabelMap.set(item.value,item.label)
    }
    this.categoryName = this.taskTypeValueAndLabelMap.get(event.value)
    if(this.categoryName === "Pre-Bucked"){
      this.multiselector = true
    }
    else{
      this.multiselector = false
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
   
    if(this.taskTypeValueAndLabelMap.get(id) === "Bucked" || this.taskTypeValueAndLabelMap.get(id) === "Trimmed" ){
      this.newSectionDetailsActionService.GetDetailsOnTaskType(id).subscribe(
        data=>{
          if (data !== 'No Data Found') {
           
            // this.Fields = null;
            // this.Sections = null;
                  this.allDetailsBasedOnTaskType = data
                  this.strains = this.dropdwonTransformService.transform(this.allDetailsBasedOnTaskType, 'StrainName', 'StrainId', '-- Select --');
                  const strainfilter = Array.from(this.strains.reduce((m, t) => m.set(t.label, t), new Map()).values())
                  this.strains = this.dropdwonTransformService.transform(strainfilter,'label', 'value')
                } 
                if(this.edit && data!="No Data Found"){
                  if(this.LabelOnEdit[0].TaskTypeName === 'Trimmed'){
                    this.enableDropDown = false
                }
                  this.onStrainSelect(this.LabelOnEdit[0].StrainId)
                }
                if(this.edit && data!="No Data Found"){
                  this.onLDSelect(this.LabelOnEdit[0].IsLightDeprevation)
                }
                if(this.edit && data!="No Data Found"){
                  // for( let k of this.Fields){
                  //   if(this.selectedValues.indexOf(k.label) === -1){
                  //     this.selectedValues = this.selectedValues.concat(k.label);
                  //   }
                  // }
                for( let k of this.LabelOnEditSectionandField){
                  if(this.selectedValues.indexOf(k.FieldUniqueId) === -1){
                    this.selectedValues = this.selectedValues.concat(k.FieldUniqueId);
                  }
                }
             
            for( let l of this.selectedValues){
              this.onFieldEdit(l)
            }
            //const section =this.newLabelsEntryForm.controls['Section'];
          //   for(let i of this.allDetailsBasedOnTaskType){
          //     if((i.Sections === fieldid) && (i.StrainId === this.newLabelsEntryForm.value.strain) && (i.IsLightDeprevation === this.newLabelsEntryForm.value.lightdept)){
          //       this.Sections.push({label: i.Sections, value:i.Sections})
          // }
          //   }
            // section.patchValue(this.LabelOnEditSectionandField[0].SkewType);
            for( let m of this.LabelOnEditSectionandField){
              if(this.selectedSections.indexOf(m.SectionUniqueId) === -1){
                this.selectedSections = this.selectedSections.concat(m.SectionUniqueId);
              }
            }  

           // section.patchValue(this.selectedSections[0]);
            // this.LabelOnEditSectionandField.filter(x => x.BatchId === LabelId)
                   }
        }
        
      )
      
     
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
            IsLd: this.newLabelsEntryForm.value.lightdept,
            StrainId: this.newLabelsEntryForm.value.strain,
      },
      FieldSectiondetails:[],
      BinLabelsTypeDetails:[]
    };
 
    if( this.categoryName === "Pre-Bucked"){
      for(let j of this.newLabelsEntryForm.value.Section){
      
        newLabelForApi.FieldSectiondetails.push({
          FieldId: 0,
          SectionId: j
        })
      }
    }
   else{
     for(let j of this.sectionids){
      newLabelForApi.FieldSectiondetails.push({
        FieldId: 0,
        SectionId: j
      })
     }
   }
    this.labelDetailsArr.controls.forEach((element, index) => 
    {
      
      newLabelForApi.BinLabelsTypeDetails.push({
          LabelId: this.LabelIdForUpdate,
          BinNo: element.value.binNo,
          StrainId: null,
          SkewType: this.enableDropDown == true? null:element.value.skewType,
          SkewTypeId: this.skewTypeID,
          IsLightDeprevation:null,
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
          this.sectionData = null
         this.Sections = null;
          this.resetForm();
          this.getAllLabelslist();
          this.LabelIdForUpdate = 0;
          this.viewNoOfBins = true;
          this.Sections = [];
          this.multiselector = true;
        } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'UPDATED') {
          this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
          detail: this.newLabelResources.updated });
          this.Sections = null;
          this.resetForm();
          this.getAllLabelslist();
          this.LabelIdForUpdate = 0;
          this.Sections = [];
          this.multiselector = true
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

                
              }
              else if (String(data[0].ResultKey) === 'Strain Not Existed') {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail:"Strain not available"});

                
              }else if (String(data[0].ResultKey) === 'already deleted') {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail:"Strain already deleted"});

              }else if (String(data[0].ResultKey) === 'Some bins are in Use So You Can not Edit This Bin') {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail:"Some bins are in use so you can not edit this bin"});

                
              }else if (String(data[0].ResultKey) === 'This bin used so you can not delete this bin') {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail:"This bin was used so you can not delete now"});

                
              }else if (String(data[0].RESULTKEY) === 'Label Already Existed with') {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: "Label Already Existed with" + ' '+ data[0].RESULTKEY });

                
              } else if (String(data[0].RESULTKEY).toLocaleUpperCase() === 'Not Existed') {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg,
                detail: data[0].ResultMsg + ' '+ data[0].RESULTKEY });

                
              }else {
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
    //  this.LD = null
    this.edit = false;
    this.multiselector = true;
    this.saveButtonText ="Save"
    this.pageheading = "Add New Bin"
    this.enableDropDown = true;
    this.GetAllSections()
    this.viewNoOfBins = true;
    this.newLabelsEntryForm.reset({ chkSelectAll: true });
   this.plusOnEdit = true;
this.strainName = null
this.Sections = [];
this.enableFieldSection = true;
this.LabelIdForUpdate = 0
// this.lightDep = false;
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
    
    this.edit = true
    this.selectedValues = [];
    this.selectedSections = [];
    this.LabelOnEditSectionandField = [];
   this.GetAllSections()
    this.plusOnEdit = false;
    this.viewNoOfBins = false;
    this.enableDropDown = true;
    this.enableFieldSection = false;
    console.log(this.allLabelslist)
    const data = this.allLabelslist.filter(x => x.LabelId === LabelId);
        console.log(data);
    var itemlist = this.newLabelsEntryForm.get('items')['controls'];
    if (data !== 'No data found!') {
      this.LabelIdForUpdate = LabelId;
      this.LabelOnEdit = data;
      this.categoryName = this.LabelOnEdit[0].TaskTypeName;
      if(this.categoryName != "Pre-Bucked"){
        this.TaskType_InChange(this.LabelOnEdit[0].TaskTypeId)
       }
    for(let i of this.LabelOnEdit){
      for(let j of this.allLabelslistSectionsandFields)
      if(i.FieldSectionMapId === j.BatchId){
        this.LabelOnEditSectionandField.push({BatchId : j.BatchId, FieldName :j.FieldId, SectionId :j.SectionId, SectionName : j.SectionName, Fields : j.Fields, Sections : j.Sections, FieldUniqueId : j.FieldUniqueId, SectionUniqueId : j.SectionUniqueId })
      }
    }
      const taskType = this.newLabelsEntryForm.controls['TaskType'];
      const strainName = this.newLabelsEntryForm.controls["strain"];
      const lightDept =  this.newLabelsEntryForm.controls["lightdept"];
      const field =this.newLabelsEntryForm.controls['field'];
      const section =this.newLabelsEntryForm.controls['Section'];
      const binNo = itemlist[0].controls['binNo'];
      const bincount = itemlist[0].controls['bincount'];
      const skewType =  itemlist[0].controls["skewType"];
      const TrimminMethod =  itemlist[0].controls["TrimmingMethod"];
      const chkIsActive =   itemlist[0].controls["chkSelectAll"];

      taskType.patchValue(this.LabelOnEdit[0].TaskTypeId);
      binNo.patchValue(this.LabelOnEdit[0].BinNo);
      bincount.patchValue(this.LabelOnEdit[0].NoOfBins);
       strainName.patchValue(this.LabelOnEdit[0].StrainId);
      
       if(this.categoryName === "Pre-Bucked"){
        this.onStrainSelect(strainName.value);
       }
       if(this.categoryName === "Pre-Bucked"){
         this.multiselector = true
       }
       else{
         this.multiselector = false
       }
       skewType.patchValue(this.LabelOnEdit[0].SkewType);
       lightDept.patchValue(this.LabelOnEdit[0].IsLightDeprevation);
       TrimminMethod.patchValue(this.LabelOnEdit[0].TrimmingMethod);
       if(this.categoryName === "Pre-Bucked"){
      this.onLDSelect(lightDept.value)
      
    for( let k of this.LabelOnEditSectionandField){
      if(this.selectedValues.indexOf(k.FieldName) === -1){
        this.selectedValues = this.selectedValues.concat(k.FieldName);
      }
    }
for( let l of this.selectedValues){
  this.onFieldEdit(l)
}
for( let m of this.LabelOnEditSectionandField){
  if(this.selectedSections.indexOf(m.SectionId) === -1){
    this.selectedSections = this.selectedSections.concat(m.SectionId);
  }
}  
       }
     
     
        chkIsActive.patchValue(this.LabelOnEdit[0].IsActive);
        

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
        // FieldId:label.FieldId,
        // SectionId:label.SectionId,
        IsLd:label.IsLightDeprevation? 1: 0,
            StrainId: label.StrainId,
      },
      FieldSectiondetails:[],
      BinLabelsTypeDetails:[]
    };
    // for(let j of this.newLabelsEntryForm.value.Section){
      
    //   newLabelDetailsForApi.FieldSectiondetails.push({
    //     FieldId: 0,
    //     SectionId: j
    //   })
    // }
    this.labelDetailsArr.controls.forEach((element, index) => 
    {
      
      newLabelDetailsForApi.BinLabelsTypeDetails.push({
          LabelId:LabelId,
          BinNo: label.BinNo,
          StrainId: null,
          SkewType: label.SkewType,
          SkewTypeId: label.SkewTypeId,
          IsLightDeprevation:null,
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


  showLabelDetails(label){
    this.router.navigate(['../home/master/sectionsMergeinfo', label]);
  }

  // filetrFields(event: any){
  //   this.batchIdsList= []
  //   for(let i of this.allLabelslistSectionsandFields){
  //     if(event.value === i.FieldUniqueId){
  //     return this.batchIdsList.push({batchId : i.BatchId})
  //     }
  //   }

  // }
  filterSections(event:any){
    this.sectionsFilter = []
    this.table.filterGlobal(event.value, 'contains')
    for(let i of this.allLabelslist){
      if(i.Fields === event.value){
        this.sectionsFilter.push({label:i.Sections,value:i.Sections,})
        
      }
    }
    const Sfilter = Array.from(this.sectionsFilter.reduce((m, t) => m.set(t.label, t), new Map()).values())
        this.sectionsFilter = this.dropdwonTransformService.transform(Sfilter,'label', 'value')
  }
}




