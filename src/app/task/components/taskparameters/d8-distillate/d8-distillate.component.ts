import { AppCommonService } from './../../../../shared/services/app-common.service';
import { TaskResources } from './../../../task.resources';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter, Renderer2, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, NgModel, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import * as _ from 'lodash';
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
import { filter } from 'rxjs/operator/filter';
import { NewClientService } from '../../../../Masters/services/new-client.service';
import { FormArray } from '@angular/forms'

@Component({
  selector: 'app-d8-distillate',
  templateUrl: './d8-distillate.component.html',
  styleUrls: ['./d8-distillate.component.css']
})
export class D8DistillateComponent implements OnInit {
  D8DISTILLATE: FormGroup;

  @Input() BinData: any;
  @Input() TaskModel: any;
  @Input() PageFlag: any;
  @Input() ParentFormGroup: FormGroup;
  @Input() questions: any[];
  @ViewChild('checkedItems') private checkedElements: ElementRef;
  @Output() TaskCompleteOrReviewed: EventEmitter<any> = new EventEmitter<any>();

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
   }
   items = new FormArray([], this.customGroupValidation );
   arrayItems: FormArray;
   display = false;
   public strainid: any[];
   public sections: any[];
   public strainId:any;
   public lightdept: boolean;
   public bins: any[];
   public employees: any[];
   public leademplist: any[];
   public globalResource: any;
   public msgs: Message[] = [];
   public taskid: any;
   public plusOnEdit: boolean = true;
    taskTypeId: any;
   public taskType: any;
   public taskCompletionModel: any;
   public taskReviewModel: any;
   public employeeArray:any=[];
 //  public leademplist:[];
   public strainName: any;
   public defaultWtWeight = 0;
   public defaulDryWeight = 0;
   public pagename: 'taskaction/D8DISTILLATE'
   public defaultWasteWeight = 0;
   private globalData = {
    employees: [],
    sections: [],
    leademplist:[],
  };
  isRActSecsDisabled: boolean;

  ngOnInit() {
    this.binsListByClient()
    this.employeeListByClient();
    this.assignTaskResources = TaskResources.getResources().en.assigntask;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle('D8 Distillate');
    this.taskStatus = AppConstants.getStatusList;
    this.userRoles = AppConstants.getUserRoles;
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);
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
    // this.completionForm = this.fb.group({
    //   items: new FormArray([], this.customGroupValidation),
    // });

    this.priorities =  [
      {label: 'Normal', value: 'Normal'},
      {label: 'Important', value: 'Important'},
      {label: 'Critical', value: 'Critical'}
    ];

    if (this.PageFlag.page !== 'TaskAction') {
      this.TaskModel.D8DISTILLATE = {
        bins:'',
        employeeList:'',
        startdate: this.TaskModel.startdate,
        enddate: '',
        endtime: '',
        employee: '',
        leademp:'',
        esthrs: '',
        priority: 'Normal',
        notifymanager: this.TaskModel.IsManagerNotify ? this.TaskModel.IsManagerNotify : false,
        notifyemployee: this.TaskModel.IsEmployeeNotify ? this.TaskModel.IsEmployeeNotify : false,
        usercomment: '',
      };
      this.D8DISTILLATE = this.fb.group({
        'bins': new FormControl('', Validators.required),
        'estimatedstartdate': new FormControl('',  Validators.compose([Validators.required])),
        'employeeList': new FormControl('', Validators.required),
        'leademp':new FormControl('', Validators.required),
        'priority': new FormControl(''),
        'notifymanager': new FormControl(''),
        'notifyemployee': new FormControl(''),
        'comment': new FormControl('', Validators.maxLength(500)),
      });
      this.ParentFormGroup.addControl('D8DISTILLATE', this.D8DISTILLATE);
    }
    else{

    }
  }

  customGroupValidation (formArray) {
    let isError = false;
    const result = _.groupBy( formArray.controls , c => {
      return [c.value.binId];
    });

    for (const prop in result) {
        if (result[prop].length > 1 && result[prop][0].controls['binId'].value !== null) {
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
  binsListByClient() {
    
    let TaskTypeId = this.ParentFormGroup != undefined?
    this.ParentFormGroup.controls.taskname.value : this.TaskModel.TaskTypeId
    this.dropdownDataService. getStrainsByTaskType(TaskTypeId).subscribe(
      data => {
       
        if (data !== 'No Data Found') {
          this.bins = this.dropdwonTransformService.transform(data, 'LabelName', 'BinId', '-- Select --');
        } else {
          this.bins = [];
        }
      } ,
      error => { console.log(error); },
      () => console.log('GetPrscrStrainListByTask complete'));
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
          this.globalData.leademplist.push(employee)
          this.leademplist = this.dropdwonTransformService.transform( this.globalData.leademplist, 'EmpName', 'EmpId', '-- Select --');
          
          return;
       }
       else{
         if(event.itemValue === employee.EmpId){
           let index = this.employeeArray.indexOf(employee.EmpName);
           let index1 = this.leademplist.findIndex(x => x.value === employee.EmpId);
           let index2 = this.globalData.leademplist.findIndex(x => x.EmpId === employee.EmpId);
           this.employeeArray.splice(index,1)
           this.leademplist.splice(index1,1)
           this.globalData.leademplist.splice(index2,1)
         }
       }
      }
  }

}
