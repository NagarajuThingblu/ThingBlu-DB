import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators,FormArray } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { CookieService } from 'ngx-cookie-service';
import { NewStrainTypeActionService } from '../../../task/services/new-strain-type-action.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { ConfirmationService } from 'primeng/api';
import { AppComponent } from '../../../app.component';
import{ NewTaskActionService } from '../../../task/services/new-task-action.service';
import { StrainTypeService } from '../../services/strain-type.service';
import { AddGeneticsActionService } from '../../../task/services/add-genetics-action.service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { GeneticsService } from '../../services/genetics.service';
import { AppConstants } from '../../../shared/models/app.constants';
import { ActivatedRoute,Router } from '@angular/router';
import * as _ from 'lodash';
import { Title } from '@angular/platform-browser';
import { NewSectionDetailsActionService } from '../../../task/services/add-section-details.service';
import { PTRService } from '../../../Masters/services/ptr.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
@Component({
  selector: 'app-update-terminationreason',
  templateUrl: './update-terminationreason.component.html',
  styleUrls: ['./update-terminationreason.component.css']
})
export class UpdateTerminationreasonComponent implements OnInit {
  public taskid;
  public taskType;
  globalResource: any;
  public sectionId:any;
  public _cookieService: any;
  public allUpdatedTerminationlist:any;
  public AllSectionData: any;
  public TaskName:any;
  public sectionDetails:any;
  public viewdata:boolean= false;
  pageheading: any;
  public phases:any;
  public Phases:any;
  public msgs: any[];
  public enabledisablefields: boolean = true
  public enabledisableTerminationFields:boolean =false
  public TerminatioReasons: any[];
  public editSection: boolean = true;
  public editYear: boolean = true;
  public editTPC: boolean = true;
  public TerminationSectionMapId = 0;
  // public showStraintext: "visible"
  // public showStrainDropdown: "hidden";
  public showStrainText: boolean = true;
  public showLDText: boolean = true;
  public showStrainDropdown:boolean = false;
  public showLDDropdown: boolean = false;
  public plusOnEdit: boolean = true;
  sysmbol:any;
  strains: any[];
  ld: any[];
  paginationValues: any;
  public sectionid:any
  collapsed: any;
  updateTerminationReason:FormGroup;
  constructor( 
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private cookieService: CookieService,
    private appComponentData: AppComponent,
    private geneticsService: GeneticsService,
    private dropdwonTransformService: DropdwonTransformService,
    private dropdownDataService: DropdownValuesService, 
    // tslint:disable-next-line:no-shadowed-variable
    private addGeneticsActionService: AddGeneticsActionService,
    private confirmationService: ConfirmationService,
    private appCommonService: AppCommonService,
    private router: Router,
    private titleService: Title,
    private newSectionDetailsActionService: NewSectionDetailsActionService,
    private ptrActionService: PTRService,
    private newTaskActionService: NewTaskActionService

    ) {
      this.route.params.forEach((urlParams) => {
       this.sectionId = urlParams['SectionId'];
        this.sectionDetails = urlParams
        console.log(urlParams)
      });
   }
   items = new FormArray([], this.customGroupValidation );
   arrayItems: FormArray;

  ngOnInit() {
    this.pageheading="Section Details";
    this.getAllTerminationReasons();
    // this.getPhases();
    this.getAllUpdateTerminationlist();
    this.getStrains();
    this.ld=
      [
        {label: 'true', value: 'true'},
        {label: 'false', value: 'false'},
      ];
    
    this.globalResource = GlobalResources.getResources().en;
    this._cookieService = this.appCommonService.getUserProfile();
    this.titleService.setTitle("Update Termination");
    this.updateTerminationReason = this.fb.group({
      'phase': new FormControl(null, Validators.required),
      'completed':new FormControl(null),
      'cpc':new FormControl(0),
     
      'deliverydate':new FormControl(null),
      'section':new FormControl(),
      'TPC':new FormControl(),
      'year':new FormControl(),
      'strain':new FormControl(null),
      'ld':new FormControl(),
      items: new FormArray([], this.customGroupValidation),
    })

    this.addItem();
    setTimeout(() => {
      this.loaderService.display(false);
    }, 500);
    this.Phases =  [
      {label: '--Select--', value: 'null'},
      // {label: 'Planting', value: 'Planting'},
      // {label: 'Harvesting', value: 'Harvesting'}
    ];
    this.sectionid=Number(this.sectionDetails.SectionId)
  }
  
  get SectionDetailsArr(): FormArray {
    return this.updateTerminationReason.get('items') as FormArray;
  }
  addItem(): void {
    this.sysmbol=0;
    // this.SectionDetailsArr.push(this.createItem());
    this.arrayItems = this.updateTerminationReason.get('items') as FormArray;
    this.arrayItems.push(this.createItem());
  }
  createItem(): FormGroup {
    return this.fb.group({
       'Terminationreason':new FormControl(0),
      'tpc':new FormControl(0),
    });
  }
  customGroupValidation (formArray) {
    let isError = false;
    const result = _.groupBy( formArray.controls , c => {
      return [c.value.Terminationreason];
    });

    for (const prop in result) {
        if (result[prop].length > 1 && result[prop][0].controls['Terminationreason'].value !== null) {
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
deleteItem(index: number) {
    
  const control = <FormArray>this.updateTerminationReason.controls['items'];
 
  if (control.length !== 1) {
    control.removeAt(index);
  }
  console.log(this.updateTerminationReason.get('items'))
 
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
  // getPhases(){
  //   this.loaderService.display(true);
  //   this.newTaskActionService.getTaskDetailList().subscribe(
  //     data=>{
  //       if(data!=='No data found')
  //       {
  //         // this.Phases=data;
  //         let category 
  //         category = data.filter(item=>item.CategoryName == 'Growing');
  //         this.phases = this.dropdwonTransformService.transform(category, 'TaskTypeName', 'TaskTypeId', '-- Select --');
  //         console.log(this.phases) 
  //         this.Phases = this.phases.filter(x =>x.label == 'Planting' ||x.label == 'Growing' || x.label == 'Harvesting' || x.value == null )
  //         console.log(this.Phases)
  //       }
       
  //       this.loaderService.display(false);
  //     },
  //     error=>{ console.log(error);  this.loaderService.display(false); },
  //     () => console.log('getAllTasksbyClient complete'));
  // }
  doOPenPanel() {
    this.collapsed = false;
  }
  enableAndDisableFields(event:any){
    if(event){
this.enabledisablefields = false;
this.enabledisableTerminationFields = true
    }
    else{
      this.enabledisablefields = true;
      this.enabledisableTerminationFields = false
    }
console.log(event);
  }
  editSectionInfo(){
this.editSection = false
  }
  editTPCInfo(){
this.editTPC = false
  }
  editYearInfo(){
this.editYear = false
  }
  editStrainInfo(){
    // const fieldName = this.newSectionEntryForm.controls['Field'];
    // fieldName.patchValue(this.SectionOnEdit[0].FieldId);
    this.showStrainText = false;
    this.showStrainDropdown = true;
    const strainname = this.updateTerminationReason.controls['strain'];
    strainname.patchValue(this.AllSectionData.StrainId); 
  }
  editLD(){
this.showLDText = false;
this.showLDDropdown =true;
const ld = this.updateTerminationReason.controls['ld'];
ld.patchValue(this.AllSectionData.IsLightDeprevation); 
  }
  getStrains(){
    this.dropdownDataService.getStrains().subscribe(
      data => {
        
        if (data) {
        
        this.strains = this.dropdwonTransformService.transform(data, 'StrainName', 'StrainId', '-- Select --');
      
      }
      } ,
      error => { console.log(error); },
      () => console.log('Get all strains complete'));
     
     
  }
  // resetForm() {
  //   this.updateTerminationReason.value.Terminationreason = null
  //   this.updateTerminationReason.value.tpc = 0
  // }


  onSubmit(value: string){
    let newUpdateTerminationForApi;
    newUpdateTerminationForApi = {
      Sections: {
        ClientId: Number(this._cookieService.ClientId),
        FieldId:this.AllSectionData.FieldId,
        TerminatedPlantCount:Number(this.updateTerminationReason.value.tpc),
        TerminationReasonId:this.updateTerminationReason.value.Terminationreason === null? 0 : this.updateTerminationReason.value.Terminationreason,
        VirtualRoleId:Number(this._cookieService.VirtualRoleId),
        IsTaskCompleted:this.updateTerminationReason.value.completed === null? 0:1,
        TaskTypeId:this.updateTerminationReason.value.phase,
        TerminationSectionMapId:this.TerminationSectionMapId
      },
      SectionsTypeDetails: []
    };
    this.SectionDetailsArr.controls.forEach((element, index) => {
      newUpdateTerminationForApi.SectionsTypeDetails.push({
        SectionId:Number(this.AllSectionData.SectionId),
        SectionName:this.updateTerminationReason.value.section === null? this.AllSectionData.SectionName : this.updateTerminationReason.value.section,
        StrainId:this.updateTerminationReason.value.strain === null? this.AllSectionData.StrainId :this.updateTerminationReason.value.strain ,
        IsActive:this.AllSectionData.IsActive === true? 1: 0,
        PlantsCount:this.updateTerminationReason.value.TPC === null? this.AllSectionData.TotalPlantCount : this.updateTerminationReason.value.TPC,
        year:this.updateTerminationReason.value.year === null? this.AllSectionData.Year:this.updateTerminationReason.value.year ,
        IsLightDeprevation:this.updateTerminationReason.value.ld === null?this.AllSectionData.IsLightDeprevation === true? 1:0 :this.updateTerminationReason.value.ld === true? 1: 0 ,
        IsDeleted:0,
        ActiveInactive:0,
      });
    });
  
    if (this.updateTerminationReason.valid) {
      this.loaderService.display(true);
      this.newSectionDetailsActionService.addNewSectionEntry(newUpdateTerminationForApi)
        .subscribe(
          data => {
            this.msgs = [];
             if(String(data[0].RESULTKEY) === 'Updated'){
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail:'Section Details Saved Successfully'});
              this.getAllUpdateTerminationlist();
              this.backToSectionsPge();
              this.TerminationSectionMapId = 0;
              this.loaderService.display(false);
            }
            else if(String(data[0].RESULTKEY) === 'Terminated Plantcount is Greater than Available Plantcount'){
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail:'Terminated Plantcount is Greater than Available Plantcount' });
              this.loaderService.display(false);
            }
            else if(String(data[0].RESULTKEY) === 'Task has already Completed'){
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail:'Phase is completed' });
              this.loaderService.display(false);
            }
            else if(String(data[0].RESULTKEY) === 'Failure'){
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg,
              detail:'Failure' });
              this.loaderService.display(false);
            }
            else if(String(data[0].RESULTKEY) === 'Something went wrong at server side!'){
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg,
              detail:'Something went wrong at server side!' });
              this.loaderService.display(false);
            }
            else {
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
              this.loaderService.display(false);
            } 
          }, 
          error => {
            this.msgs = [];
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
           
            this.loaderService.display(false);
          });
    }
    else {
      this.appCommonService.validateAllFields(this.updateTerminationReason);
    }
  }
  getAllUpdateTerminationlist()
  {
this.newSectionDetailsActionService.GetUpdatedTerminationList(this.sectionDetails.SectionId).subscribe(
  data=>{
    if (data !== 'No Data Found') {
      this.allUpdatedTerminationlist=data.Table;
      this.Phases = this.dropdwonTransformService.transform(data.Table1, 'TaskTypeName', 'TaskTypeId', '-- Select --');
      this.paginationValues = AppConstants.getPaginationOptions;
    if (this.allUpdatedTerminationlist.length > 20) {
      this.paginationValues[AppConstants.getPaginationOptions.length] = this.allUpdatedTerminationlist.length;
    }
  } else {
    this.allUpdatedTerminationlist = [];
   }
   this.loaderService.display(false);
  },
   error => { console.log(error);  this.loaderService.display(false); },
   () => console.log('getAllStrainsbyClient complete'));
  }

  backToSectionsPge(){
    this.router.navigate(['../home/sections']);
  }
  GetAllDetails(){
this.TaskName = this.updateTerminationReason.value.phase
    this.newSectionDetailsActionService.GetSectionDetails(this.sectionDetails.SectionId, this.TaskName).subscribe(
      data=>{
        if (data !== 'No Data Found') {
          this.viewdata = true;
          this.AllSectionData=data[0];

      } else {
        this.AllSectionData = [];
        this.viewdata = false;
       }
       this.loaderService.display(false);
      },
       error => { console.log(error);  this.loaderService.display(false); },
       () => console.log('getAllStrainsbyClient complete'));
  }

  editTerminationdata(terminationData){
    const terminatePC = this.updateTerminationReason.controls['tpc'];
    terminatePC.patchValue(terminationData.TerminatedPlantCount); 
    const terminateReason = this.updateTerminationReason.controls['Terminationreason'];
    terminateReason.patchValue(terminationData.TerminationReasonId); 
    this.TerminationSectionMapId =terminationData.Id
  }
}
