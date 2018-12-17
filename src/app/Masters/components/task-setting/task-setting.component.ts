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
import { SelectItem, ConfirmationService } from 'primeng/api';
import { AppConstants } from '../../../shared/models/app.constants';
import { UserModel } from '../../../shared/models/user.model';
import { TaskSettingService } from '../../services/tasksetting.service';

@Component({
  selector: 'app-task-setting',
  templateUrl: './task-setting.component.html',
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
export class TaskSettingComponent implements OnInit {
  taskSettingForm: FormGroup;
  taskSettingResources: any;
  globalResource: any;
  selectedTask: number;
  // IsReviewAvail: any; // Commented by Devdan :: 31-Oct-2018 :: Unused
  // IsNotificationAvail: any; // Commented by Devdan :: 31-Oct-2018 :: Unused
  public msgs: any[];
  public _cookieService: any;
  public taskSettingForm_copy: any;
  public allTasksList: any;
  saveButtonText = 'Save';
  clear = 'Clear';
  pageheading = 'Task Setting';
  // TaskId: any = 0;  // Commented by Devdan :: 31-Oct-2018 :: Unused
  event: any;
  paginationValues: any;
  public userRoles: any;
  public globalData: any = {
    taskTypes: []
  };
  public taskTypes: SelectItem[];
  taskTypeId = 0;
  constructor(
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private appCommonService: AppCommonService,
    private cookieService: CookieService,
    private dropdwonTransformService: DropdwonTransformService,
    private dropdownDataService: DropdownValuesService, // For common used dropdown service
    private appComponentData: AppComponent,
    private scrolltopservice: ScrollTopService,
    private taskSettingService: TaskSettingService
  ) {
    this._cookieService = <UserModel>this.appCommonService.getUserProfile();
    this.getAllTasks();
    this.getTaskListByClientForTaskSetting();
  }

  ngOnInit() {
    this.globalResource = GlobalResources.getResources().en;
    this.taskSettingResources = MastersResource.getResources().en.taskSetting;
    this.userRoles = AppConstants.getUserRoles;
    this.appComponentData.setTitle('TaskSetting');

    this._cookieService = this.appCommonService.getUserProfile();
    this.taskSettingForm = this.fb.group({
      'taskType': new FormControl(null, Validators.required),
      'IsReview': new FormControl(null),
      'IsNotification': new FormControl(null)
    });
    this.loaderService.display(false);
  }

  getAllTasks() {
    this.dropdownDataService.getAllTask().subscribe(
      data => {
        this.globalData.TaskTypes = data;
        this.taskTypes = this.dropdwonTransformService.transform(data, 'TaskTypeName', 'TaskTypeId', '-- Select --', false) ;

      } ,
      error => {
        console.log(error);
      },
    );
  }
  resetForm() {
    this.taskSettingForm.reset({TrimmedYesNo: false });
    this.pageheading = 'Task Setting';
    this.clear = 'Clear';
    this.saveButtonText = 'Save';
    this.taskSettingForm.controls['IsReview'].enable();
    this.taskSettingForm.controls['IsNotification'].enable();
    this.taskSettingForm.controls['taskType'].enable();
  }

  taskChange() {
    this.taskTypeId = 0;
    const temptaskId = this.taskSettingForm.value.taskType;
    const data = this.globalData.TaskTypes.filter(x => x.TaskTypeId === temptaskId);
    this.setHardcodeConditions(data);
  }

  editTaskSetting(taskTypeId) {
    event.stopPropagation();
    this.loaderService.display(true);
    const data = this.allTasksList.filter(x => x.TaskTypeId === taskTypeId);
    if (data !== null) {
      this.taskTypeId = data[0].TaskMappingId;
      this.taskSettingForm.patchValue({
        taskType: data[0].TaskTypeId,
        IsReview: data[0].IsReviewFlag,
        IsNotification: data[0].IsNotificationFlag,
      });
      this.loaderService.display(false);
      this.saveButtonText = 'Update';
      this.pageheading = 'Edit Task Settings';
      this.clear = 'Cancel';
      this.scrolltopservice.setScrollTop();
      this.setHardcodeConditions(data);
      this.taskSettingForm.controls['taskType'].disable();
    } else {
      this.allTasksList = [];
      this.loaderService.display(false);
      this.taskTypeId = 0;
    }
  }

  setHardcodeConditions(data) {
    // Hardcoded conditions for some tasks
    // Always Disable IsReview for QA check,Pckg Rep, Lbl Rep and it will be false only
    if (data[0].TaskTypeKey === 'QACHECK' || data[0].TaskTypeKey === 'REPACK' || data[0].TaskTypeKey === 'REBRAND') {
      this.taskSettingForm.controls['IsReview'].patchValue(false);
      this.taskSettingForm.controls['IsReview'].disable();
      this.taskSettingForm.controls['IsNotification'].enable();
    } else if (data[0].TaskTypeKey === 'TRIMMING') { // Review will always be true and disabled for Trimming
      this.taskSettingForm.controls['IsReview'].patchValue(true);
      this.taskSettingForm.controls['IsReview'].disable();
      this.taskSettingForm.controls['IsNotification'].enable();
    } else if (data[0].TaskTypeKey === 'CUSTOMTASK') { // Notification is always false disabled for Custom tasks
      this.taskSettingForm.controls['IsNotification'].patchValue(false);
      this.taskSettingForm.controls['IsNotification'].disable();
      this.taskSettingForm.controls['IsReview'].enable();
    } else {
      this.taskSettingForm.controls['IsReview'].enable();
      this.taskSettingForm.controls['IsNotification'].enable();
    }
  }

  getTaskListByClientForTaskSetting() {
    this.loaderService.display(true);
    this.taskSettingService.getTaskListByClientForTaskSetting().subscribe(
      data => {
       if (data !== 'No data found!') {
          this.allTasksList = data;
          this.paginationValues = AppConstants.getPaginationOptions;
          if (this.allTasksList.length > 20) {
            this.paginationValues[AppConstants.getPaginationOptions.length] = this.allTasksList.length;
          }
       } else {
        this.allTasksList = [];
       }
       this.loaderService.display(false);
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('getTaskListByClientForTaskSetting complete'));
  }

  onSubmit(value) {
    if (this.taskSettingForm.valid) {
      this.taskSettingForm.getRawValue();
      let taskSettingDetails;
      taskSettingDetails = {
        TaskSetting: {
            TaskMapId: this.taskTypeId,
            TaskTypeId: this.taskSettingForm.getRawValue().taskType,
            ClientId: this.appCommonService.getUserProfile().ClientId,
            VirtualRoleId: this._cookieService.VirtualRoleId,
            IsReview: this.taskSettingForm.getRawValue().IsReview,
            IsNotification: this.taskSettingForm.getRawValue().IsNotification,
        }
      };
      this.loaderService.display(true);
      this.taskSettingService.addUpdateTaskSetting(taskSettingDetails)
        .subscribe(data => {
          this.msgs = [];
          if (data === 'Success') {
            if (this.taskTypeId > 0) {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.taskSettingResources.updatesuccess });
            } else {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.taskSettingResources.savedsuccess });
            }
            this.resetForm();
            this.getTaskListByClientForTaskSetting();
          } else if (data === 'Duplicate') {
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg , detail: this.taskSettingResources.alreadyexist });
            this.resetForm();
          } else if (data === 'NotExists') {
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg , detail: this.taskSettingResources.notexists });
            this.resetForm();
          } else {
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
          }
          this.loaderService.display(false);
        },
        error => {
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });

          // http call end
          this.loaderService.display(false);
        }
      );
    } else {
      this.appCommonService.validateAllFields(this.taskSettingForm);
    }
  }
}
