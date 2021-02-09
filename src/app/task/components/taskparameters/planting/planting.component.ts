import { AppCommonService } from './../../../../shared/services/app-common.service';
import { TaskResources } from './../../../task.resources';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter, Renderer2, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, NgModel, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Message, SelectItem, ConfirmationService } from 'primeng/api';
import { DropdownValuesService } from '../../../../shared/services/dropdown-values.service';
import { TaskCommonService } from '../../../services/task-common.service';
import { PositiveIntegerValidator } from '../../../../shared/validators/positive-integer.validator';
import { GlobalResources } from '../../../../global resource/global.resource';
import { QuestionControlService } from '../../../../shared/services/question-control.service';
import { QuestionService } from '../../../../shared/services/question.service';
import { QuestionBase } from '../../../../shared/models/question-base';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../../../../shared/models/user.model';
import { DropdwonTransformService } from '../../../../shared/services/dropdown-transform.service';
import { AppConstants } from '../../../../shared/models/app.constants';
import { LotService } from '../../../../lot/services/lot.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { Title } from '@angular/platform-browser';
import { RefreshService } from '../../../../dashboard/services/refresh.service';
import { NewSectionDetailsActionService } from '../../../services/add-section-details.service';

@Component({
  moduleId: module.id,
  selector: 'app-planting',
  templateUrl: './planting.component.html',
  styleUrls: ['./planting.component.css']
})
export class PlantingComponent implements OnInit{
  PLANTING: FormGroup;
  // tslint:disable-next-line:no-input-rename
  @Input('TaskModel') TaskModel: any;
  @Input() PageFlag: any;
  @Input() ParentFormGroup: FormGroup;
  @ViewChild('checkedItems') private checkedElements: ElementRef;


  questions: QuestionBase<any>[];
  public _cookieService: UserModel;
  public assignTaskResources: any;
  public userRoles: any;
  public taskStatus: any;
  public defaultDate: Date = new Date();
  public showPastDateLabel = false;
  public priorities: SelectItem[];
  constructor(
    private fb: FormBuilder,
    private dropdownDataService: DropdownValuesService,
    private qcs: QuestionControlService ,
    private service: QuestionService,
    private taskCommonService: TaskCommonService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private newSectionDetailsActionService: NewSectionDetailsActionService, 
    private router: Router,
    private dropdwonTransformService: DropdwonTransformService,
    private lotService: LotService,
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private refreshService: RefreshService,
    private render: Renderer2,
    private elref: ElementRef
  ) { 
    this._cookieService = this.appCommonService.getUserProfile();
    this.questions = service.getQuestions();
  }
  display = false;
  public sectionList = [];
  public  Fields: any[];
  public strains: any[];
  public employees: any[];
  public globalResource: any;
  public msgs: Message[] = [];
   public taskid: any;
   taskTypeId: any;
  public taskType: any;
  public employeeArray:any=[];
  public strainName: any;
  public plantCount: any;
  public allsectionslist:any;
  private globalData = {
    lots: [],
    employees: [],
    strains: [],
    Fields: [],
  };

  ngOnInit() {
    this.getAllFields();
    this.getAllsectionlist();
    this.employeeListByClient();
    this.assignTaskResources = TaskResources.getResources().en.assigntask;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle(this.assignTaskResources.siftingtitle);
    this.taskStatus = AppConstants.getStatusList;
    this.userRoles = AppConstants.getUserRoles;
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);

    this.route.params.forEach((urlParams) => {
      // Modified by Devdan :: 05-Oct-2018 :: Getting Tasktype and task id from Edit Task Component
      this.taskid = urlParams['id'];
      this.taskType = urlParams['taskType'];
      // Get the task type id from data received from resolver
      if (this.TaskModel.TaskDetails) {
        this.taskTypeId = this.TaskModel.TaskDetails.TaskTypeId;
      }
    });

    
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);
    this.priorities =  [
      {label: 'Normal', value: 'Normal'},
      {label: 'Important', value: 'Important'},
      {label: 'Critical', value: 'Critical'}
    ];

    if (this.PageFlag.page !== 'TaskAction') {
      this.TaskModel.PLANTING = {
        field: '',
        plantCount:'',
        section: '',
        assignedPC: '',
        strain: '',
        employeeList:'',
        startdate: this.TaskModel.startdate,
        enddate: '',
        endtime: '',
        employee: '',
        esthrs: '',
        priority: 'Normal',
        notifymanager: this.TaskModel.IsManagerNotify ? this.TaskModel.IsManagerNotify : false,
        notifyemployee: this.TaskModel.IsEmployeeNotify ? this.TaskModel.IsEmployeeNotify : false,
        usercomment: '',
      };
    }
    this.PLANTING = this.fb.group({
      'strain': new FormControl('', Validators.required),
      'field' : new FormControl('', Validators.required),
      'section': new FormControl('', Validators.required),
      'employee': new FormControl('', Validators.required),
      'estimatedstartdate': new FormControl('',  Validators.compose([Validators.required])),
      'estimatedenddate': new FormControl(''),
      'endtime': new FormControl(''),
      // 'estimatedenddate': new FormControl('',  Validators.compose([Validators.required])),
      'esthrs': new FormControl(''),
      'employeeList': new FormControl('', Validators.required),
     'plantCount' : new FormControl('', Validators.required),
     'assignedPC' : new FormControl('', Validators.required),
      'priority': new FormControl(''),
      'notifymanager': new FormControl(''),
      'notifyemployee': new FormControl(''),
      'comment': new FormControl('', Validators.maxLength(500)),
      'assignwt': new FormControl('', Validators.compose([Validators.required, Validators.min(0.1)]))
    });

    this.ParentFormGroup.addControl('PLANTING', this.PLANTING);
    }

  getAllFields() {
    this.dropdownDataService.getFields().subscribe(
      data => {
        this.globalData.Fields = data;
        this.Fields = this.dropdwonTransformService.transform(data, 'FieldName', 'FieldId', '-- Select --');
       
        console.log("fields"+JSON.stringify(this.Fields));
      } ,
      error => { console.log(error); },
      () => console.log('Get all brands complete'));
  }

  getAllsectionlist()
  {
this.newSectionDetailsActionService.Getsectionlist().subscribe(
  data=>{
    this.allsectionslist=data;
})
  }
//   GetFields() {
//     this.loadService.display(true);
//     this.NewFieldgeneration.GetFieldList().subscribe(data=>{
//       if(data!="No Data found!"){
//         this.allFieldslist=data;
//         this.paginationvalues=AppConstants.getPaginationOptions;
//         if(this.allFieldslist.length>20)
//         {
//           this.paginationvalues[AppConstants.getPaginationOptions.length] = this.allFieldslist.length;
//         }
//       }
//       else{
//         this.allFieldslist=[];
//       }
//       this.loadService.display(false);
//     },
//     error => { console.log(error); this.loadService.display(false); },
//     () => console.log('GetAllFieldsbyClient complete'));
//  }
  getStrainListByTask() {
    this.dropdownDataService.getLotListByTask(this.TaskModel.task).subscribe(
      data => {
        let newdata: any[];
        newdata = this.removeDuplicatesById(data);
        this.globalData.strains = newdata;
        if (data !== 'No data found!') {
          this.strains = this.dropdwonTransformService.transform(newdata, 'StrainName', 'StrainId', '-- Select --');
        } else {
          this.strains = [];
        }
      } ,
      error => { console.log(error); },
      () => console.log('GetPrscrStrainListByTask complete'));
  }

  estStartDate_Select() {
    if (((new Date(this.returnFormattedDate(this.defaultDate)) >
      new Date(this.PLANTING.value.estimatedstartdate)))) {
      this.showPastDateLabel = true;
    } else {
      this.showPastDateLabel = false;
    }
  }

  returnFormattedDate(dateObject) {
    return new Date(dateObject).toLocaleDateString().replace(/\u200E/g, '');
  }

  removeDuplicatesById(dataObject) {
    // To get unique record according brand and strain
    const newArr = [];
    dataObject.forEach((value, key) => {
      let exists = false;
      newArr.forEach((val2, key1) => {
        if (value.StrainId === val2.StrainId) { exists = true; }
      });

      if (exists === false && value.StrainId !== '') { newArr.push(value); }
    });
    return newArr;
    // End of getting unique record accroding brand and strain
  }

  getSectionListByFieldName(event?:any){
    this.sectionList = [];
      for(let sec of this.allsectionslist){
        if(event.value === sec.FieldId){
          this.sectionList.push({label: sec.SectionName, value: sec.SectionId})
        }
      }
    
  }
  getStrainAndPlantCount(event?: any){
    for(let sec of this.allsectionslist){
      if(event.value === sec.SectionId)
      {
        this.strainName = sec.StrainName;
        this.plantCount =sec.PlantsCount;
        this.TaskModel.PLANTING.section = sec.SectionName
        this.TaskModel.PLANTING.strain =  this.strainName
        this.PLANTING.controls["strain"].setValue(this.strainName)
        this.TaskModel.PLANTING.totalPC  = this.plantCount
        this.PLANTING.controls["plantCount"].setValue(this.plantCount)
      }
    }
   
  }
  employeeListByClient() {
    this.dropdownDataService.getEmployeeListByClient().subscribe(
      data => {
        this.globalData.employees = data;
        if (data !== 'No data found!') {
        this.employees = this.dropdwonTransformService.transform(data, 'EmpName', 'EmpId', '-- Select --');
        } else {
          this.employees = [];
        }
      } ,
      error => { console.log(error); },
      () => console.log('Get all employees by client complete'));
  }

  OnSelectingEmployees(event: any, checkedItem: any){
    for(let employee of this.globalData.employees){
      if(event.itemValue === employee.EmpId && this.employeeArray.indexOf(employee.EmpName) === -1){
        this.employeeArray.push(employee.EmpName)
      }
    }
  }
  removeitem(deleteitem){
    this.employeeArray.splice(deleteitem,1)
   let element = this.checkedElements.nativeElement
   console.log(element)
  }
 
}
