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
import { SelectItem } from 'primeng/api';
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
import { templateSourceUrl } from '@angular/compiler';
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
  public TaskId:any;
  public sectionDetails:any;
  public viewdata:boolean= false;
  public viewDefaultData: boolean = true;
  public viewTable:boolean = false;
  pageheading: any;

  public Phases: SelectItem[];
  public completeSectionName: string;
  public inputtextbox1: String ='inputtextbox1'
  public inputtextbox2: String ='inputtextbox1'
  public inputtextbox3: String ='inputtextbox1'
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
  public TerminationOnEdit: any;
  public shoesectionCompleteName:boolean = false
  public shoesectionCompleteNameInput:boolean = true
  public selectedForEditSection: boolean = false;
  public selectedForNoEditSection: boolean = true;
  public selectedForEditStrain: boolean = false;
  public selectedForNoEditStrain: boolean = true;
  public selectedForEditTPC: boolean = false;
  public selectedForNoEditTPC: boolean = true;
  public selectedForEditYEAR: boolean = false;
  public selectedForNoEditYEAR: boolean = true;
  public selectedForEditLD: boolean = false;
  public selectedForNoEditLD: boolean = true;
  public disableStrainDropdown: boolean = false;
  public disableLDDropdown: boolean = false;
  public showPhses:boolean = false;
  public errormsg:boolean = false;
  public errormsg1:boolean = false;
  public errormsg2:boolean = false;
public data = 0;
  public topTaskTypeId:any;
  public topTaskTypeName:any;
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
    this.AllSectionData = this.sectionDetails
    // this.getAllUpdateTerminationlist();
    this.getStrains();
    this.ld=
      [
        {label: 'true', value: true},
        {label: 'false', value: false},
      ];
    
    this.globalResource = GlobalResources.getResources().en;
    this._cookieService = this.appCommonService.getUserProfile();
    this.titleService.setTitle("Update Termination");
    this.updateTerminationReason = this.fb.group({
      'phase': new FormControl(null),
      'completed':new FormControl(null),
      'cpc':new FormControl(0),
     
      'deliverydate':new FormControl(null),
      'section':new FormControl(null, Validators.required),
      'TPC':new FormControl(0, Validators.required),
      'year':new FormControl(0, Validators.required),
      'strain':new FormControl(null),
      'ld':new FormControl(),
      items: new FormArray([], this.customGroupValidation),
    })

    this.addItem();
    this.getPhases();
    setTimeout(() => {
      this.loaderService.display(false);
    }, 500);
    // this.Phases =  [
    //   {label: '--Select--', value: 'null'},
    //   // {label: 'Planting', value: 'Planting'},
    //   // {label: 'Harvesting', value: 'Harvesting'}
    // ];

    // this.updateTerminationReason.get('items')['controls'][0]['controls']['tpc'].statusChanges
    // .subscribe(value =>{
    //   const termpc = this.updateTerminationReason.get('items')['controls'][0]['controls']['Terminationreason'];
    //   console.log(value)
    //   if(value > 0){
    //     termpc.setValidators(Validators.required)
    //   }
    //   else{
    //   termpc.clearValidators();
    //   }
    //   termpc.updateValueAndValidity();
    // });
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
      
      'tpc':new FormControl(0),
      'Terminationreason':new FormControl(0),
     
    });
  }
  onKeypressEvent(event: any){
    if(Number(event.target.value) > 0){
      const tpc = this.updateTerminationReason.get('items')['controls'][0]['controls']['tpc'];
      const termpc = this.updateTerminationReason.get('items')['controls'][0]['controls']['Terminationreason'];
      tpc.setValidators([Validators.required]);
      termpc.setValidators([Validators.required]);
      termpc.updateValueAndValidity();
    }
  
    // if(Number(event.target.value) === 0){
    //   const termpc = this.updateTerminationReason.get('items')['controls'][0]['controls']['Terminationreason'];
    //   this.updateTerminationReason.get('items')['controls'][0]['controls']['tpc'].valueChanges
    //   .subscribe(tpc => {
    //     if (tpc > 0) {
    //       termpc.setValidators([Validators.required]);
    //     }
    //   });
    // }
  
  
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
  getPhases(){
    this.loaderService.display(true);
    this.newTaskActionService.getPhases(this.sectionDetails.SectionId).subscribe(
      data=>{
        if(data!=='No Data Found')
        {
          // this.Phases=data;
          // let category 
          // category = data.filter(item=>item.CategoryName == 'Growing');
          // this.Phases = this.dropdwonTransformService.transform(data, 'TaskName', 'TaskTypeId','',false);
        this.showPhses = true;
          this.topTaskTypeId = data[0].TaskTypeId
          this.topTaskTypeName = data[0].TaskName
          this.GetAllDetails( this.topTaskTypeId);
          // this.Phases = this.phases.filter(x =>x.label == 'Planting' ||x.label == 'Growing' || x.label == 'Harvesting' || x.value == null )
          // console.log(this.Phases)
        }
        else{
        this.AllSectionData = this.sectionDetails
          this.topTaskTypeId =0;
          this.topTaskTypeName = null
        }
       
        this.loaderService.display(false);
      },
      error=>{ console.log(error);  this.loaderService.display(false); },
      () => console.log('getAllTasksbyClient complete'));
  }
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
this.selectedForEditSection = true
this.shoesectionCompleteNameInput = true;
this.shoesectionCompleteName = false
this.selectedForNoEditSection =false;
this.inputtextbox1 = ""
  }
  closeEditSection(){
    this.errormsg = false;
    this.shoesectionCompleteNameInput = false
    this.shoesectionCompleteName = true
    this.editSection = true;
    this.selectedForEditSection = false;
    this.selectedForNoEditSection =true;
    this.inputtextbox1="inputtextbox1";
    this.completeSectionName = this.updateTerminationReason.value.section
    if(this.updateTerminationReason.value.section === ""){
       this.errormsg = true;
      // this.updateTerminationReason.controls['section'] = new FormControl(Validators.required)
    }
  }

  editTPCInfo(){
    this.selectedForNoEditTPC = false
    this.selectedForEditTPC = true;
    this.editTPC = false
    this.inputtextbox2 = ""
  }
  closeEditTPC(){
    this.errormsg1 = false;
    this.editTPC = true
    this.selectedForNoEditTPC = true
    this.selectedForEditTPC = false;
    this.inputtextbox2 ="inputtextbox1"
    if(this.updateTerminationReason.value.TPC === ""){
      this.errormsg1 = true;
     // this.updateTerminationReason.controls['section'] = new FormControl(Validators.required)
   }
  }

  editYearInfo(){
    
    this.selectedForNoEditYEAR = false;
    this.selectedForEditYEAR = true;
this.editYear = false;
this.inputtextbox3 = ""
  }
  closeEditYEAR(){
    this.errormsg2 = false;
    this.selectedForNoEditYEAR = true;
    this.selectedForEditYEAR = false;
    this.editYear = true
    this.inputtextbox3="inputtextbox1"
    if(this.updateTerminationReason.value.year === ""){
      this.errormsg2 = true;
     // this.updateTerminationReason.controls['section'] = new FormControl(Validators.required)
   }
  }

  editStrainInfo(){
    // const fieldName = this.newSectionEntryForm.controls['Field'];
    // fieldName.patchValue(this.SectionOnEdit[0].FieldId);
    this.showStrainText = false;
    this.showStrainDropdown = true;
    this.disableStrainDropdown = false;
    this.selectedForEditStrain = true
    this.selectedForNoEditStrain =false;
    const strainname = this.updateTerminationReason.controls['strain'];
    strainname.patchValue(this.AllSectionData.StrainId); 
  }
  closeEditStrain(){
    this.selectedForEditStrain = false
    this.selectedForNoEditStrain =true;
    this.disableStrainDropdown = true;
  }
  editLD(){
this.showLDText = false;
this.showLDDropdown =true;
this.selectedForNoEditLD = false;
this.selectedForEditLD = true;
this.disableLDDropdown = false;
const ld = this.updateTerminationReason.controls['ld'];
ld.patchValue(this.AllSectionData.IsLightDeprevation); 
  }
  closeEditLD(){
    this.selectedForNoEditLD = true;
this.selectedForEditLD = false;

this.disableLDDropdown = true;
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
        VirtualRoleId:Number(this._cookieService.VirtualRoleId),
        IsTaskCompleted:this.updateTerminationReason.value.completed === true? 1:0,
        TaskTypeId: this.topTaskTypeId,
      
      },
      SectionsTypeDetails: [],
      TerminationTypeDetails: []
    };
    newUpdateTerminationForApi.SectionsTypeDetails.push({
      SectionId:Number(this.AllSectionData.SectionId),
      SectionName:this.updateTerminationReason.value.section === null? this.AllSectionData.SectionName : this.updateTerminationReason.value.section,
      StrainId:this.updateTerminationReason.value.strain === null? this.AllSectionData.StrainId :this.updateTerminationReason.value.strain ,
      IsActive:this.AllSectionData.IsActive === true? 1: 0,
      PlantsCount:this.updateTerminationReason.value.TPC === null? this.AllSectionData.TotalPlantCount : this.updateTerminationReason.value.TPC,
      year:this.updateTerminationReason.value.year === null? this.AllSectionData.Year:this.updateTerminationReason.value.year ,
      IsLightDeprevation:this.updateTerminationReason.value.ld === null?this.AllSectionData.IsLightDeprevation === true || "true"? 1:0 :this.updateTerminationReason.value.ld === true? 1: 0 ,
      IsDeleted:0,
      ActiveInactive:0,
    });
    this.SectionDetailsArr.controls.forEach((element, index) => {
      newUpdateTerminationForApi.TerminationTypeDetails.push({
        TerminationSectionMapId:this.TerminationSectionMapId,
        TerminatedPlantCount: element.value.tpc,
        TerminationReasonId: element.value.Terminationreason,
  
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
              // this.getAllUpdateTerminationlist();
              this.loaderService.display(false);
              this.TerminationSectionMapId = 0;
              setTimeout(() => {
                this.backToSectionsPge();
              }, 500);
              

              
             
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
            else if(String(data[0].RESULTKEY) === 'There are employees still working on this section'){
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail:data[0].RESULTMSG + '  still working on this section' });
              this.loaderService.display(false);
            }
            else if(String(data[0].RESULTKEY) === 'Failure'){
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg,
              detail:'Failure' });
              this.loaderService.display(false);
            }
            else if(String(data[0].RESULTKEY) === 'Please Select Termination Reason'){
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail:'Please Select Termination Reason' });
              this.loaderService.display(false);
            }
            else if(String(data[0].RESULTKEY) === 'Please Enter Terminated Plant Count'){
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail:'Please Enter Terminated Plant Count' });
              this.loaderService.display(false);
            }
            else if(String(data[0].RESULTKEY) === 'Enter the required fields'){
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail:'Please Enter Both Terminated PlantCount And Termination Reason' });
              this.loaderService.display(false);
            }
            else if(String(data) === 'Something went wrong  at server side!'){
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg,
              detail:'Something went wrong at server side!' });
              this.loaderService.display(false);
            }
            else {
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: 'Something went wrong  at server side!' });
              this.loaderService.display(false);
            } 
          }, 
          error => {
            this.msgs = [];
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail:'Something went wrong  at server side!' });
           
            this.loaderService.display(false);
          });
    }
    
    else {
      this.appCommonService.validateAllFields(this.updateTerminationReason);
    }
  }
//   getAllUpdateTerminationlist()
//   {
// this.newSectionDetailsActionService.GetUpdatedTerminationList(this.sectionDetails.SectionId).subscribe(
//   data=>{
//     if (data !== 'No Data Found') {
//       this.allUpdatedTerminationlist=data.Table;
//       // this.Phases = this.dropdwonTransformService.transform(data.Table1, 'TaskTypeName', 'TaskTypeId', '-- Select --');
//       this.paginationValues = AppConstants.getPaginationOptions;
//     if (this.allUpdatedTerminationlist.length > 20) {
//       this.paginationValues[AppConstants.getPaginationOptions.length] = this.allUpdatedTerminationlist.length;
//     }
//   } else {
//     this.allUpdatedTerminationlist = [];
//    }
//    this.loaderService.display(false);
//   },
//    error => { console.log(error);  this.loaderService.display(false); },
//    () => console.log('getAllStrainsbyClient complete'));
//   }

  backToSectionsPge(){
    this.router.navigate(['../home/sections']);
  }
//   GetAllDetails(){
//     if(this.topTaskTypeId === null){
//       this.TaskName = this.updateTerminationReason.value.phase
//     }
// else{
//   this.TaskName = this.updateTerminationReason.value.phase
// }
//     this.newSectionDetailsActionService.GetSectionDetails(this.sectionDetails.SectionId, this.TaskName).subscribe(
//       data=>{
//         this.viewdata = true;
//           this.AllSectionData=data[0];
//        this.loaderService.display(false);
//       },
//        error => { console.log(error);  this.loaderService.display(false); },
//        () => console.log('getAllStrainsbyClient complete'));
//   }
      GetAllDetails(taskId){
  this.viewdata = false;
  this.viewDefaultData = true;
  this.viewTable =  false;
  // this.TaskId = this.updateTerminationReason.value.phase === null?  this.topTaskTypeId : this.updateTerminationReason.value.phase;
  this.newSectionDetailsActionService.GetSectionDetails(this.sectionDetails.SectionId,taskId).subscribe(
    data=>{
      if(data){
        this.AllSectionData = data.Table[0]
      
        this.viewDefaultData = false;
        this.allUpdatedTerminationlist=data.Table1;
      }
    if(this.AllSectionData){
      this.viewdata = true;
    }
      console.log(this.AllSectionData)
  
  if(data.Table1.length > 0 ){
    this.viewTable = true;
  }
    }
  )
  console.log("hi")
}

  editTerminationdata(TerminationReasonId){
    const control = <FormArray>this.updateTerminationReason.controls['items'];
    
    let length = control.length;
    while (length > 0) {
      length = Number(length) - 1;
      this.deleteItem(length);
    }
   
    // this.addItem();
    this.plusOnEdit = false;
    const data = this.allUpdatedTerminationlist.filter(x => x.TerminationReasonId === TerminationReasonId);
    var itemlist = this.updateTerminationReason.get('items')['controls'];
    if (data !== 'No data found!') {
this.TerminationOnEdit = data;
this.TerminationSectionMapId = this.TerminationOnEdit[0].Id;
const terminatePC = itemlist[0].controls['tpc'];
const terminateReason = itemlist[0].controls['Terminationreason'];
terminatePC.patchValue(this.TerminationOnEdit[0].TerminatedPlantCount); 
terminateReason.patchValue(this.TerminationOnEdit[0].TerminationReasonId); 
    }
    else {
         this.allUpdatedTerminationlist = [];
         }
         this.loaderService.display(false);
  }

}
