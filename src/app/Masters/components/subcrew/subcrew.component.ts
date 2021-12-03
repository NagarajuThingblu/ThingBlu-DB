import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators,FormArray, FormArrayName  } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { AppComponent } from '../../../app.component';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { CrewService } from '../../services/crew.service';
import { AppConstants } from '../../../shared/models/app.constants';
import { ConfirmationService, Confirmation } from 'primeng/api';
import * as _ from 'lodash';
import { HttpHandler } from '@angular/common/http';
import { NewEmployeeService } from '../../services/new-employee.service';


@Component({
  selector: 'app-subcrew',
  templateUrl: './subcrew.component.html',
  styleUrls: ['./subcrew.component.css']
})
export class SubcrewComponent implements OnInit {

  pageheading = 'Add New Sub Crew';
  SubCrewForm: FormGroup;
  SubCrewResources: any;
  globalResource: any;
  public _Cookieservice: any;
  public Crewlist: any;
  public Managerlist:any;
  public FilteredManager:any;
  public Emplist:any;
  items = new FormArray([], this.customGroupValidation );
  arrayItems: FormArray;
  public plusOnEdit: boolean = true;
  public bindEmpNmaes: boolean = false;
  public saveButtonText: any;
  public clear:any;
  public allSubCrewlist: any;
  public listLinkingData:any;
  paginationValues: any;
  public EmployeesOnPopUP:any[];
  public event: any;
  public openEmpPopUp: boolean = false;
  public subcrewName:any;
  public msgs: any[];
  public SubCrewIDForUpdate=0;
  public SubCrewOnEdit:any;
  public selectedEmps = [];
  public allEmployeeList: any;

  constructor(
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private appComponentData: AppComponent,
    private dropdownDataService: DropdownValuesService,
    private dropdwonTransformService: DropdwonTransformService,
    private appCommonservice: AppCommonService,
    private subcrewService: CrewService,
    private confirmationService: ConfirmationService,
    private newEmployeeService: NewEmployeeService,
  ) {
    this.getCrewList();
    this.GetManagerlist();
    this.GetSubCrewList();
    this.GetEmpList();
   }
   EmpForEachRow: Map<number, any> = new Map<number, any>()
  ngOnInit() {
    this.saveButtonText = 'Save';
    this.pageheading="Add New Sub Crew";
    this.clear = 'Clear';

    this.SubCrewResources = MastersResource.getResources().en.addNewSubCrew
    this.globalResource = GlobalResources.getResources().en;
    this._Cookieservice=this.appCommonservice.getUserProfile();
    this.appComponentData.setTitle('SubCrew');
    this.SubCrewForm = this.fb.group({
      'crew': new FormControl(null, Validators.required ),
      'primarySupervisor': new FormControl(null, Validators.required ),
      items: new FormArray([], this.customGroupValidation),
    });
    this.addItem();
    this.loaderService.display(false);
  }

  get subcrewDetailsArr(): FormArray {
    return this.SubCrewForm.get('items') as FormArray;
  }

  customGroupValidation (formArray) {
    let isError = false;
    const result = _.groupBy( formArray.controls , c => {
      return [c.value.subcrew];
    });

    for (const prop in result) {
        if (result[prop].length > 1 && result[prop][0].controls['subcrew'].value !== null) {
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

  addItem(): void {
     this.arrayItems = this.SubCrewForm.get('items') as FormArray;
     this.arrayItems.push(this.createItem());
     let index =  this.arrayItems.length-1
     if(index >0){
      this.filterEmployees(index)
     }
   }

   createItem(): FormGroup {
    return this.fb.group({
      subcrew: new FormControl(null),
      emp: new FormControl(null),
      monitor:new FormControl(0),
      chkSelectAll: new FormControl(true)
    });
    
  }
  getCrewList(){
    this.loaderService.display(true);
    this.subcrewService.getAllCrewList().subscribe(data=>{
      if(data!="No Data Found"){
        this.Crewlist=this.dropdwonTransformService.transform(data, 'CrewName', 'CrewID', '-- Select --')
      }
    },
    error => { console.log(error); },
    () => console.log('Get all country complete'));
  }

  GetManagerlist()
  {
    this.dropdownDataService.getManagerList().subscribe(data=>{
      this.Managerlist=this.dropdwonTransformService.transform(data,'ManagerName','ManagerId','--Select--');
    }
    ,
        error => { console.log(error);
          this.loaderService.display(false); },
        () => console.log('Get all Managerlist complete'));
        
    
  }
  popupManager(event:any){
    let filterdata
    filterdata =  this.allSubCrewlist.filter(x=>x.CrewID == event.value)
    const primarySupervisor = this.SubCrewForm.controls['primarySupervisor'];
    if(filterdata.length >0){
      primarySupervisor.patchValue(filterdata[0].LeadsupID);
    }
    else{
      primarySupervisor.patchValue(null);
    }
  }
  GetEmpList(){
    this.dropdownDataService.getAllEmpList().subscribe(data=>{
      if(data !="No data found!"){
        this.Emplist=this.dropdwonTransformService.transform(data,'EmpName','EmpId','--Select--');
      }
     else{
      this.Emplist=[]
     }
   this.EmpForEachRow.set(0,this.Emplist)
    }
    ,
        error => { console.log(error);
          this.loaderService.display(false); },
        () => console.log('Get all employeelist complete'));

  }
  filterEmployees(indexValue){
    var Emplistfilter=[]
    Emplistfilter =this.Emplist
    for(let i of this.SubCrewForm.value.items[indexValue-1].emp){
      for(let j of this.Emplist){
        if(i == j.value){
          let Empindex = Emplistfilter.indexOf(j)
          Emplistfilter.splice(Empindex,1)
          this.EmpForEachRow.set(indexValue,Emplistfilter)
        }
      }
      // index = Emplistfilter.indexOf(i)
      // Emplistfilter.slice(index)
    }
   
  }
  resetForm(){
    this.GetEmpList()
    this.selectedEmps=[];
    this.bindEmpNmaes=false
    this.pageheading="Add New Sub Crew";
    this.saveButtonText = 'Save';
    this.plusOnEdit = true;
    this.SubCrewForm.reset({ chkSelectAll: true });
    const control = <FormArray>this.SubCrewForm.controls['items'];
    
    let length = control.length;
    while (length > 0) {
      length = Number(length) - 1;
      this.deleteItemAll(length);
    }
   
    this.addItem();
  }
  deleteItemAll(index: number) {
   
    const control = <FormArray>this.SubCrewForm.controls['items'];
    control.removeAt(index);
  }

  deleteItem(index: number) {
    this.GetEmpList()
    const control = <FormArray>this.SubCrewForm.controls['items'];
   
    if (control.length !== 1) {
      control.removeAt(index);
    }
    console.log(this.SubCrewForm.get('items'))
   
  }

  bindEmpFotParticularRow(i){
    this.EmpForEachRow.set(i,this.Emplist)
  }
  GetSubCrewList(){
    this.loaderService.display(true);
    this.subcrewService.getAllSubCrewList().subscribe(data=>{
      if(data!="No Data Found"){
        this.allSubCrewlist=data.Table;
        this.listLinkingData=data.Table1;
        this.paginationValues=AppConstants.getPaginationOptions;
        if(this.allSubCrewlist.length>20)
        {
          this.paginationValues[AppConstants.getPaginationOptions.length] = this.allSubCrewlist.length;
        }
      }
      else{
        this.allSubCrewlist=[];
      }
      this.loaderService.display(false);
    },
    error => { console.log(error); this.loaderService.display(false); },
    () => console.log('GetAllCrewListbyClient complete'));
  }
  openEmployeesPopUp(SubCrewID){
    this.EmployeesOnPopUP = []
    this.openEmpPopUp = true;
    
      for(let i of this.listLinkingData){
        if(SubCrewID === i.SubCrewID){
         this.subcrewName = i.SubCrewName
          this.EmployeesOnPopUP.push({EmpID:i.EmpID, EmpName:i.EmpName})
        }
      }
  }

  onPageChange(e) {
    this.event = e;
  }
  onSubmit(value: string){
    let newSubCrewForApi;
    var indexValue=0;
    newSubCrewForApi = {
      Crew: {
            ClientId: Number(this._Cookieservice.ClientId),
            CrewID: Number(this.SubCrewForm.value.crew),
            VirtualRoleId: Number(this._Cookieservice.VirtualRoleId),
            LeadSupervisorID: this.SubCrewForm.value.primarySupervisor,
            
      },
      SubCrewList:[],
      EmpList:[],
    };
    this.subcrewDetailsArr.controls.forEach((element, index) => 
    {
      newSubCrewForApi.SubCrewList.push({
          SubCrewID: this.SubCrewIDForUpdate,
          SubSupID : element.value.monitor,
          SubCrewName:element.value.subcrew,
          IsDeleted:0,
          IsActive:element.value.chkSelectAll === true?1:0,
          ActiveInactive:0,
          UniqueId:index+1,
        });
    });
  
    for(let i  of  this.subcrewDetailsArr.value){
      indexValue= indexValue+1
      for(let j of i.emp){
        newSubCrewForApi.EmpList.push({
          EmpID:j,
          UniqueId :indexValue,
        });
      }
     
    }
      

    
    if (this.SubCrewForm.valid) {
      this.loaderService.display(true);
      this.subcrewService.addSubCrewDetails(newSubCrewForApi)
      .subscribe(
        data => {
          this.msgs = [];
          if (data.Table[0]['RESULTKEY'].toLocaleUpperCase() == 'SUCCESS') {
            this.msgs.push({
              severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.SubCrewResources.subcrewsaved
            });
            this.resetForm();
            this.GetEmpList();
            this.GetSubCrewList();
            this.SubCrewIDForUpdate=0;
          }
          else if(data.Table[0]['RESULTKEY'].toLocaleUpperCase() == 'UPDATED'){
            this.msgs.push({
              severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.SubCrewResources.subCrewUpdated
            });
            this.resetForm();
            this.GetEmpList();
            this.GetSubCrewList();
            this.SubCrewIDForUpdate=0;
          }
          else if(data.Table[0]['RESULTKEY'] == 'Duplicate Sub Crews'){
            this.msgs.push({
              severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: data.Table[0]['ResultMsg'] +" is a Duplicate Sub Crew"
            });
          }
          else {
            this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
          }
          this.loaderService.display(false);
        },
        error => {
          this.msgs = [];
          this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
          // http call end
          this.resetForm();
          this.loaderService.display(false);
        })
    }
  }

  getAllEmployee() {
      this.dropdownDataService.getAllEmployeeList().subscribe(data=>{
        this.allEmployeeList = data.Table;
        this.Emplist=this.dropdwonTransformService.transform(this.allEmployeeList,'EmpName','EmpId','--Select--');
        // const EmpFilter = Array.from(this.Emplist.reduce((m, t) => m.set(t.label, t), new Map()).values())
        // this.Emplist = this.dropdwonTransformService.transform(EmpFilter,'label', 'value')
      }
      ,
          error => { console.log(error);
            this.loaderService.display(false); },
          () => console.log('Get all employeelist complete'));
  }

  GetSubCrewOnEdit(SubCrewID){
    this.bindEmpNmaes = true
    this.plusOnEdit=false;
    this.selectedEmps = [];
    this.pageheading="Edit Sub Crew"
    this.saveButtonText="Update"
    this.getAllEmployee()
    const data = this.allSubCrewlist.filter(x => x.SubCrewID === SubCrewID);
    const emplist = this.listLinkingData.filter(x =>x.SubCrewID === SubCrewID)
    console.log(data);
    var itemlist = this.SubCrewForm.get('items')['controls'];
    if (data != 'No data found!') {
      this.SubCrewIDForUpdate = SubCrewID;
      this.SubCrewOnEdit = data;
      const crew = this.SubCrewForm.controls['crew'];
      const primarySupervisor = this.SubCrewForm.controls['primarySupervisor'];
      const subcrew = itemlist[0].controls['subcrew'];
      const emp = itemlist[0].controls['emp'];
      const monitor = itemlist[0].controls['monitor'];
      const chkSelectAll = itemlist[0].controls['chkSelectAll'];
       
      crew.patchValue(this.SubCrewOnEdit[0].CrewID);
      primarySupervisor.patchValue(this.SubCrewOnEdit[0].LeadsupID);
      subcrew.patchValue(this.SubCrewOnEdit[0].SubCrewName);
       //emp.patchValue(null);
      monitor.patchValue(this.SubCrewOnEdit[0].subsupID);
      chkSelectAll.patchValue(this.SubCrewOnEdit[0].IsActive);

      for( let m of emplist){
        if(this.selectedEmps.indexOf(m.EmpID) === -1){
          this.selectedEmps = this.selectedEmps.concat(m.EmpID);
        }
      } 
      
    }
  }

  showConformationMessaegForDeactive(SubCrewID, SubCrew, rowIndex, IsDeleted, ActiveInactiveFlag){
    console.log(SubCrewID);
    let strMessage: any;
    if (this.allSubCrewlist[rowIndex].IsActive === true) {
      strMessage = this.SubCrewResources.activesubCrewMsg ;
    } else {
      strMessage = this.SubCrewResources.deactivatesubCrewMsg ;
    }
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
         this.activateDeleteCrew(SubCrewID, SubCrew, IsDeleted, ActiveInactiveFlag);
        },
        reject: () => {
          SubCrew.IsActive = !SubCrew.IsActive;
        }
    });
  }

  ShowConformationMessaegForDelete(SubCrewID, SubCrew, IsDeleted, ActiveInactiveFlag){
    let strMessage: any;
    strMessage = this.SubCrewResources.deletesubCrewMsg;
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.activateDeleteCrew(SubCrewID, SubCrew, IsDeleted, ActiveInactiveFlag);
      },
      reject: () => {
      }
  });
  }

  activateDeleteCrew(SubCrewID, SubCrew,IsDeleted, ActiveInactiveFlag) {
    //this.submitted = true;
  let EmpData = this.listLinkingData.filter(x =>x.SubCrewID == SubCrewID)
      const SubCrewDetailsForApi = {
        Crew: {
          ClientId:this._Cookieservice.ClientId,
          CrewID : SubCrew.CrewID,
          LeadSupervisorID:SubCrew.LeadsupID,
          VirtualRoleId: this._Cookieservice.VirtualRoleId, 
      },
      SubCrewList:[],
      EmpList:[],
    };

    SubCrewDetailsForApi.SubCrewList.push({
      SubCrewID:SubCrewID,
      SubSupID :SubCrew.subsupID,
      SubCrewName:SubCrew.SubCrewName,
      IsDeleted:IsDeleted,
      IsActive:SubCrew.IsActive == true?1:0,
      ActiveInactive:ActiveInactiveFlag,
      UniqueId:1,
    }),
    EmpData.forEach((element, index) => 
    SubCrewDetailsForApi.EmpList.push({
      EmpID:element.EmpID,
      UniqueId:1,
    })
    )
   
    
      // console.log(strainDetailsForApi);
      this.loaderService.display(true);
      this.subcrewService.addSubCrewDetails(SubCrewDetailsForApi)
      .subscribe(
          data => {
            // console.log(data);
            this.msgs = [];
            if (data.Table[0]['RESULTKEY'].toLocaleUpperCase()  === 'SUCCESS' && ActiveInactiveFlag === 1) {
              if (SubCrew.IsActive === true) {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail:  this.SubCrewResources.activated});
                this.resetForm();
              this.GetSubCrewList();
                this.loaderService.display(false);
              } else {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail:this.SubCrewResources.inactivated});
                this.resetForm();
              this.GetSubCrewList();
                this.loaderService.display(false);
              }
            } else if (data.Table[0]['RESULTKEY'].toLocaleUpperCase()  === 'SUCCESS' && IsDeleted === 1) {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.SubCrewResources.deletedSuccess});
              this.resetForm();
              this.GetSubCrewList();
              this.loaderService.display(false);
            } else if(data.Table[0]['RESULTKEY'] === "Duplicate Sub Crews"){
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail:data.Table[0]['ResultMsg'] + " is Duplicate Sub Crew"});
              this.resetForm();
              this.GetSubCrewList();
              this.loaderService.display(false);
            }
              else if (String(data.Table[0]['RESULTKEY']) === 'NOTUPDATED') {
              if (IsDeleted === 1) {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.SubCrewResources.notdeleted});
                this.loaderService.display(false);
              } else if (SubCrew.IsActive === true) {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.SubCrewResources.notactivated });
                SubCrew.IsActive = !SubCrew.IsActive;
                this.loaderService.display(false);
              } else {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.SubCrewResources.notinactivated });
                SubCrew.IsActive = !SubCrew.IsActive;
                this.loaderService.display(false);
              }
            }  else if (data === 'Failure') {
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
            } else if (data.Table[0]['RESULTKEY'] === 'Duplicate') {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.SubCrewResources.subCrewAlreadyExists });
            } else if (data.Table[0]['RESULTKEY'] === 'InUse') {
              this.msgs = [];
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: 'Can`t delete. Record is in use.'});
            } else {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: data });
            }
              // http call end
              this.loaderService.display(false);
          },
          error => {
            this.msgs = [];
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
            // http call end
            this.resetForm();
            this.loaderService.display(false);
          });
  }
}
