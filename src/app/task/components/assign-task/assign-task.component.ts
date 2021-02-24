import { element } from 'protractor';
import { AppConstants } from './../../../shared/models/app.constants';
import { AppCommonService } from './../../../shared/services/app-common.service';
import { forEach } from '@angular/router/src/utils/collection';
import { TrimmingComponent } from './../taskparameters/trimming/trimming.component';
import { CookieService } from 'ngx-cookie-service';
import { SelectItem, ConfirmationService } from 'primeng/api';
import { Component, OnInit, Input, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { TaskResources } from '../../task.resources';
import { DateValidators } from '../../../shared/validators/dateCheck.validator';
import { AddComponent } from '../../models/add-component';
import { AdComponent } from '../../interfaces/data.interface';
import { LoadComponentDirective } from '../../directives/load-component.directive';
import { QuarantineComponent } from '../taskparameters/quarantine/quarantine.component';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';

import { TaskCommonService } from '../../services/task-common.service';
import { Message } from 'primeng/api';
import { GlobalResources } from '../../../global resource/global.resource';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { TaskKeysModel } from '../../models/task-keys.model';
import { QuestionService } from '../../../shared/services/question.service';

import * as _ from 'lodash';

import { delay } from 'rxjs/operators';
import { LoaderService } from '../../../shared/services/loader.service';
import { UserModel } from '../../../shared/models/user.model';
import { Title } from '@angular/platform-browser';
import { RefreshService } from '../../../dashboard/services/refresh.service';

@Component({
  moduleId: module.id,
  selector: 'app-assign-task',
  templateUrl: 'assign-task.component.html',
  styles: [
    '.ui-inputtext { border-right: 1px solid #d6d6d6 !important; }'
  ]
  // styleUrls: ['assign-task.component.css']
})
export class AssignTaskComponent implements OnInit, OnDestroy {
  public _cookieService: UserModel;
  public navigationSubscription: any;
  private taskDetails: any;
  connection;
  public assignTask: any = {
    task: '',
    taskcategory:''
  };
  public taskId: any;
  public prodDBRouteParamsArray: any = [];

  // Joint Production Dashboard Redirection Details
  public prodDBRouteParams: any;

  public tampQty: any;
  public labelQty: any;

  public tasktypelist:any;

  constructor(
    private fb: FormBuilder,
    private componentFactoryResolver: ComponentFactoryResolver,
    private dropdownDataService: DropdownValuesService,
    private taskCommonService: TaskCommonService,
    private cookieService: CookieService,
    private router: Router,
    private dropdwonTransformService: DropdwonTransformService,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private refreshService: RefreshService
  ) {
    this._cookieService = <UserModel>this.appCommonService.getUserProfile();
    this.prodDBRouteParams = this.appCommonService.prodDBRouteParams;

    this.prodDBRouteParamsArray.push(this.prodDBRouteParams);
    // http call starts

    // let d = this.route.snapshot.queryParams['inputData'];

    // this.route.queryParamMap.forEach((urlParams) => {
    //   const a = urlParams['id'];
    //   d = urlParams['inputData'];
    // });

    // this.loaderService.display(true);
    this.getAllTasks();
  }

  private submitted: boolean;
  public assignTaskForm: FormGroup;
  public assignTaskResources: any;
  public globalResource: any;

  public tasknames: SelectItem[];
  public taskcategories:SelectItem[];
  // public Lots: SelectItem[];  // Commented by Devdan :: 29-Oct-2018 :: Unused
  // public Employees: SelectItem[]; // Commented by Devdan :: 29-Oct-2018 :: Unused
  // public Priorities: SelectItem[]; // Commented by Devdan :: 29-Oct-2018 :: Unused

  public selectedTask: number;
  public display = false;

  public msgs: Message[] = [];

  public isServiceCallComplete: boolean;
  public map1 = new Map<any, any>();
  public selectedTaskTypeName: string;
  public userRoles: any;

  public globalData: any = {
    taskTypes: []
  };

  public page: any = {
    page: 'AssignTask',
    showmodal: false
  };

  public readonlyFlag: Boolean = false;

  @Input() ads: AddComponent[];
  @ViewChild(LoadComponentDirective) componentHost: LoadComponentDirective;

  initialiseInvites() {
    // Set default values and re-fetch any data you need.
  }
  ngOnInit() {
    // this.connection = this.chatService.getMessages().subscribe(message => {
    // });
    this.assignTaskResources = TaskResources.getResources().en.assigntask;
    this.globalResource = GlobalResources.getResources().en;
    this.userRoles = AppConstants.getUserRoles;
    this.titleService.setTitle(this.assignTaskResources.title);
    if (this.prodDBRouteParams) {
      // console.log(this.prodDBRouteParams);
      this.assignTask.task = this.prodDBRouteParams.TaskTypeId;
      this.assignTask.taskcategory= this.prodDBRouteParams.TaskCateforyID
      this.readonlyFlag = true;
      this.assignTaskForm = this.fb.group({
        'taskname': new FormControl(null, Validators.required),
        'taskCategory':new FormControl(null,Validators.required),
      });

       // add pre value :: 08-april-2019
       if (this.prodDBRouteParams.TampAvlQty) {
        this.tampQty = this.prodDBRouteParams.TampAvlQty;
          }
        if (this.prodDBRouteParams.TubeAvlQty) {
          this.labelQty = this.prodDBRouteParams.TubeAvlQty;
        }
    } else {
      this.assignTaskForm = this.fb.group({
        'taskname': new FormControl(null, Validators.required),
        'taskCategory':new FormControl(null,Validators.required),
      });
    }

    // http call ends
    // this.loaderService.display(false);
    // {validator:  DateValidators.dateCompares('estimatedstartdatetime','estimatedenddatetime')}
    // this.getAllTasks();
    this.loaderService.display(false);
  }

  ngOnDestroy() {
    this.appCommonService.prodDBRouteParams = null;
    this.prodDBRouteParamsArray = null;
    this.prodDBRouteParams = null;
    // this.connection.unsubscribe();
  }

  taskTypeChange() {
    // this.assignTaskForm.removeControl('TRIMMING');
    // this.assignTaskForm.removeControl('SIFTING');
    // this.assignTaskForm.removeControl('BUDPACKAGING');
    // this.assignTaskForm.removeControl('GRINDING');
    // this.assignTaskForm.removeControl('JOINTSCREATION');
    // this.assignTaskForm.removeControl('TAMPING');
    // this.assignTaskForm = this.fb.group({
    //   'taskname': new FormControl(this.assignTask.task, Validators.required),
    // });

    if (this.assignTask.task !== null) {
      // http call starts
      this.loaderService.display(true);

      this.taskCommonService.getTaskTypeSettings(this.assignTask.task)
        .subscribe(
          (data: any) => {
            this.assignTask['IsManagerNotify'] = data[0].IsManagerNotify;
            this.assignTask['IsEmployeeNotify'] = data[0].IsEmployeeNotify;
            this.assignTask['startdate'] = this.appCommonService.calcTime(this._cookieService.UTCTime);

            if (this.globalData.taskTypes.length) {
              this.selectedTaskTypeName = (this.globalData.taskTypes.filter(result => result.TaskTypeId === this.assignTask.task) as any)[0].TaskTypeKey;
            }

            this.assignTask['TaskTypeKey'] = this.selectedTaskTypeName;

            // if (this.selectedTaskTypeName === 'BUDPACKAGING') {
            //   this.selectedTaskTypeName = 'budPackaging';
            // }
            this.assignTaskForm = this.fb.group({
              'taskname': new FormControl(this.assignTask.task, Validators.required),
              'taskCategory': new FormControl(this.assignTask.taskcategory, Validators.required),
            });
            this.isServiceCallComplete = true;
            // http call ends
            setTimeout(() => {
              this.loaderService.display(false);
            }, 500);
          }
        );
    }
  }
  taskcategorychange()
  {
    
    if(this.assignTask.taskcategory!=null){
      
      const categoryname = this.assignTask.taskcategory;
      const categorylist = this.tasktypelist.filter(item=>item.TaskCategoryID==categoryname);
            if((<UserModel>this.appCommonService.getUserProfile()).UserRole === (this.userRoles.Manager) || this.prodDBRouteParams){

this.tasknames=this.dropdwonTransformService.transform(
  categorylist.filter(item =>
    String(item.TaskTypeKey).toLocaleUpperCase() !== 'GRINDING' &&
    String(item.TaskTypeKey).toLocaleUpperCase() !== 'JOINTSCREATION' &&
    String(item.TaskTypeKey).toLocaleUpperCase() !== 'TAMPING' &&
    String(item.TaskTypeKey).toLocaleUpperCase() !== 'TUBING' &&
    String(item.TaskTypeKey).toLocaleUpperCase() !== 'TUBELABELING'
  ),
  'TaskTypeName', 'TaskTypeId', '-- Select --', false);
  this.assignTaskForm = this.fb.group({
    'taskCategory': new FormControl(this.assignTask.taskcategory, Validators.required),
    'taskname': new FormControl(null, Validators.required)
  });
  this.selectedTaskTypeName=null;
}
else{
  this.tasknames=this.dropdwonTransformService.transform(
    categorylist.filter(item =>
      String(item.TaskTypeKey).toLocaleUpperCase() == 'CUSTOMTASK'
    ),
    'TaskTypeName', 'TaskTypeId', '-- Select --', false);
    this.assignTaskForm = this.fb.group({
      'taskCategory': new FormControl(this.assignTask.taskcategory, Validators.required),
      'taskname': new FormControl(null, Validators.required)
    });
    this.selectedTaskTypeName=null;
}
}
  
  }
  // ChangeComponent() {
  //   this.loadComponent(this.assignTask.task);
  // }

  getAllTasks() {
    this.dropdownDataService.getAllTask().subscribe(
      data => {
        this.globalData.taskTypes = data;
        this.tasktypelist=data;
        console.log(data, 'tasks');

        if ((<UserModel>this.appCommonService.getUserProfile()).UserRole === this.userRoles.Manager || this.prodDBRouteParams) {
          if (this.prodDBRouteParams) {
            
            this.tasknames = this.dropdwonTransformService.transform(data, 'TaskTypeName', 'TaskTypeId', '-- Select --', false);
            this.taskcategories=this.dropdwonTransformService.transform(data,'CategoryName','TaskCategoryID','-- Select --', false);
          } else {
            this.tasknames = this.dropdwonTransformService.transform(
              data.filter(item =>
                String(item.TaskTypeKey).toLocaleUpperCase() !== 'GRINDING' &&
                String(item.TaskTypeKey).toLocaleUpperCase() !== 'JOINTSCREATION' &&
                String(item.TaskTypeKey).toLocaleUpperCase() !== 'TAMPING' &&
                String(item.TaskTypeKey).toLocaleUpperCase() !== 'TUBING' &&
                String(item.TaskTypeKey).toLocaleUpperCase() !== 'TUBELABELING'
              ),
              'TaskTypeName', 'TaskTypeId', '-- Select --', false);
              const categories= Array.from(data.reduce((m, t) => m.set(t.CategoryName, t), new Map()).values())
              this.taskcategories=this.dropdwonTransformService.transform(categories,'CategoryName','TaskCategoryID','-- Select --', false);       }
        } else {
          // this.tasknames = this.dropdwonTransformService.transform(
          //   data.filter(item => String(item.TaskTypeKey).toLocaleUpperCase() === 'CUSTOMTASK'),
          //   'TaskTypeName', 'TaskTypeId', '-- Select --', false);
          this.taskcategories= this.dropdwonTransformService.transform(
            data.filter(item => String(item.TaskTypeKey).toLocaleUpperCase() === 'CUSTOMTASK'),
            'CategoryName','TaskCategoryID','-- Select --', false

          );
        }
      },
      error => { console.log(error); },
      () => {
        if (this.prodDBRouteParams) {
          this.taskTypeChange();
        }
      });
  }

  returnFormattedDate(dateObject) {
    return new Date(dateObject).toLocaleDateString().replace(/\u200E/g, '');
  }
  get diagnostic() { return JSON.stringify(this.assignTaskForm.value); }

  onSubmit(assignTaskFormValues: any) {
    this.submitted = true;
console.log(assignTaskFormValues)
    let assignTaskDetailsForWebApi;

    // Added by Devdan :: 11-Oct-2018
    let lotid;
    if (assignTaskFormValues[this.selectedTaskTypeName] !== undefined && this.selectedTaskTypeName === 'SIFTING') {
      lotid = assignTaskFormValues[this.selectedTaskTypeName].lotno.substr(0, assignTaskFormValues[this.selectedTaskTypeName].lotno.indexOf('_'));
    } else if (assignTaskFormValues[this.selectedTaskTypeName] !== undefined) {
      lotid = assignTaskFormValues[this.selectedTaskTypeName].lotno;
    } else {
      lotid = 0;
    }
   

    if (this.assignTaskForm.valid) {
     
      assignTaskDetailsForWebApi = {
        TaskDetails: {
          ClientId: this._cookieService.ClientId,
          VirtualRoleId: this._cookieService.VirtualRoleId,
          TaskTypeId: assignTaskFormValues.taskname,
          LotId: lotid,
          EmpId: assignTaskFormValues[this.selectedTaskTypeName].employee,
          // EstHours: assignTaskFormValues.Trimming.esthrs,
          // EstStartDate: assignTaskFormValues.Trimming.estimatedstartdate.toLocaleDateString(),
          // EstEndDate:assignTaskFormValues.Trimming.estimatedenddate.toLocaleDateString() + ' ' + assignTaskFormValues.Trimming.endtime.toLocaleTimeString(),
          // EstEndTime:  assignTaskFormValues.Trimming.endtime.toLocaleTimeString(),
          // EstHours: 3,
          EstStartDate: assignTaskFormValues[this.selectedTaskTypeName].estimatedstartdate.toLocaleDateString().replace(/\u200E/g, ''),
          // EstEndDate:assignTaskFormValues.Trimming.estimatedenddate.toLocaleDateString() + ' ' + assignTaskFormValues.Trimming.endtime.toLocaleTimeString(),
          // EstEndDate:  assignTaskFormValues[this.selectedTaskTypeName].estimatedstartdate.toLocaleDateString(),
          // EstEndTime: '12:00 PM',
          // EstEmpHourlyCost: 23.50,
          // EstEmpCost: 150,
          Comment: assignTaskFormValues[this.selectedTaskTypeName].comment,
          NotifyEmp: assignTaskFormValues[this.selectedTaskTypeName].notifyemployee,
          NotifyManager: assignTaskFormValues[this.selectedTaskTypeName].notifymanager,
          Priority: assignTaskFormValues[this.selectedTaskTypeName].priority
        }
        // DynamicDetails: {
      };
    

      if (this.selectedTaskTypeName === 'TRIMMING') { // TRIMMING TASK
        assignTaskDetailsForWebApi.TaskDetails['AssignedWt'] = 0;
        assignTaskDetailsForWebApi.TaskDetails['TaskKeyName'] = 'TRIM';

      } else if (this.selectedTaskTypeName === 'SIFTING') { // SIFTING TASK

        assignTaskDetailsForWebApi.TaskDetails['AssignedWt'] = assignTaskFormValues[this.selectedTaskTypeName].assignwt;
        assignTaskDetailsForWebApi.TaskDetails['SkewKeyName'] = this.assignTask[this.selectedTaskTypeName].skewtype;
        assignTaskDetailsForWebApi.TaskDetails['TaskKeyName'] = 'SIFTING';

        if (Number(assignTaskFormValues[this.selectedTaskTypeName].assignwt) > Number(this.assignTask[this.selectedTaskTypeName].lotweight)) {
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.assignwtgreaterthanlotwt });
          return;
        }

      } else if (this.selectedTaskTypeName === 'BUDPACKAGING') { // BUDPACKAGING TASK
        // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
        // let lotDetails = JSON.parse(localStorage.getItem('selectedLotsArray'));
        let lotDetails = null;
        lotDetails = JSON.parse(this.appCommonService.getSessionStorage('selectedLotsArray'));
        //// const uniqueOrderStrains = JSON.parse(localStorage.getItem('uniqueOrderStrains'));

        // if (lotDetails === null) {
        //   this.msgs = [];
        //   this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.lotsnotassigned });
        //   return;
        // }
        assignTaskDetailsForWebApi['LotDetails'] = [];
        assignTaskDetailsForWebApi['ProductTypeDetails'] = [];
        assignTaskDetailsForWebApi.TaskDetails['LotId'] = 0;
        assignTaskDetailsForWebApi.TaskDetails['OrderId'] = assignTaskFormValues[this.selectedTaskTypeName].orderno;

        assignTaskDetailsForWebApi.TaskDetails['TaskKeyName'] = 'A-PACKAGE';

        // A package each unique brand strain lot details
        const lotDetailsOrderGroup = [];
        if (lotDetails !== null) {
            lotDetails
            .forEach((item, index) => {
              if (item !== null && item.length) {
                // tslint:disable-next-line:no-shadowed-variable
                item.forEach((element, lotIndex) => {
                  assignTaskDetailsForWebApi['LotDetails'].push(
                    {
                      LotId: element.LotNo,
                      Weight: element.SelectedWt,
                      ProductTypeId: element.ProductTypeId,
                      UniqueId: element.UniqueId
                    }
                  );
                });
              }
            });
        }
        // Added for grouping same lot wt in singl row on 23-08-2018 by sanjay
        // // if (lotDetails !== null) {
        // //   _.mapValues(_.groupBy(assignTaskDetailsForWebApi['LotDetails'], c => {
        // //     return [c.LotId];
        // //   }),
        // //     (clist, LotObject) => {
        // //       let lotWeight = 0;
        // //       const lotNo = Number(String(LotObject).split(',')[0]);
        // //       clist.map(LotDetails1 => {
        // //         lotWeight += Number(LotDetails1.Weight);
        // //       });
        // //       assignTaskDetailsForWebApi['LotWeightDetails'].push({ LotId: lotNo, Weight: lotWeight });
        // //     });
        // // } else {
        // //   assignTaskDetailsForWebApi['LotWeightDetails'] = [];
        // // }
        // End  Added for grouping same lot wt in singl row on 23-08-2018

        let lotNotExists = false;
        assignTaskFormValues[this.selectedTaskTypeName].allocateEmpArr
          .forEach((item, rowIndex) => {
            if (item !== null && item.assignQty > 0) {
              assignTaskDetailsForWebApi['ProductTypeDetails'].push(
                // { RawSupId: item.brandid, StrainId: item.strainid, PkgTypeId: item.packagetypeid,
                //      UnitValue: item.packageunit, Qty: item.assignPackageWt}
                {
                  ProductTypeId: item.productTypeId,
                  Qty: item.assignQty,
                  EmployeeId: item.employee,
                  UniqueId: item.uniqueId,
                  IndexCode: rowIndex
                }
              );

            // console.log(assignTaskDetailsForWebApi['LotDetails'], item.uniqueId);

                if (!assignTaskDetailsForWebApi['LotDetails']
                .filter(rowItem => rowItem.UniqueId === item.uniqueId).length) {
                  if (!lotNotExists) {
                    (<FormGroup>(<FormArray>(<FormGroup>this.assignTaskForm.controls[this.selectedTaskTypeName])
                    .controls['allocateEmpArr'])
                    .controls[rowIndex])
                    .setErrors({ 'INVALIDROW': true });
                  }

                  lotNotExists = true;

                  // item._status = 'INVALID';
                  // this.msgs = [];
                  // this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.lotsnotassigned });
                }
            }
          });
        if (assignTaskDetailsForWebApi['ProductTypeDetails'].length === 0) {
          this.msgs = [];
          this.msgs.push(
                          {
                            severity: 'warn',
                            summary: this.globalResource.applicationmsg,
                            detail: this.assignTaskResources.productassignqtywarning
                          }
                        );
          return;
        }

        // if (Number(allProductTypesTotalWeight) !== Number(allLotsTotalWeight)) {
        //   this.msgs = [];
        //   this.msgs.push({
        //     severity: 'warn', summary: this.globalResource.applicationmsg,
        //     detail: 'Total lot selection weight is not matching with total order assigned weight.'
        //   });
        //   return;
        // }
        if (lotNotExists) {
          return false;
        }
      } else if (this.selectedTaskTypeName === 'GRINDING') {  // GRINDING TASK
        assignTaskDetailsForWebApi.TaskDetails['AssignedWt'] = assignTaskFormValues[this.selectedTaskTypeName].assignwt;
        assignTaskDetailsForWebApi.TaskDetails['TaskKeyName'] = 'B-GRIND';

        if (Number(assignTaskFormValues[this.selectedTaskTypeName].assignwt) > Number(this.assignTask[this.selectedTaskTypeName].lotweight)) {
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.assignwtgreaterthanlotwt });
          return;
        }

      } else if (this.selectedTaskTypeName === 'JOINTSCREATION') {  // JOINTSCREATION TASK
        assignTaskDetailsForWebApi.TaskDetails['AssignedWt'] = assignTaskFormValues[this.selectedTaskTypeName].assignwt;
        assignTaskDetailsForWebApi.TaskDetails['TaskKeyName'] = 'B-JOINT';
        if (this.prodDBRouteParams) {
            assignTaskDetailsForWebApi.TaskDetails['UnitValue'] = this.prodDBRouteParams.UnitValue;
        }

        if (Number(assignTaskFormValues[this.selectedTaskTypeName].assignwt) > Number(this.assignTask[this.selectedTaskTypeName].lotweight)) {
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.assignwtgreaterthanlotwt });
          return;
        }

        if (Number(assignTaskFormValues[this.selectedTaskTypeName].assignwt) < Number(this.prodDBRouteParams.UnitValue)) {
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.preRollSize});
          return;
        }

      } else if (this.selectedTaskTypeName === 'TAMPING') {  // TAMPING TASK
        assignTaskDetailsForWebApi.TaskDetails['AssignedWt'] = 0;
        assignTaskDetailsForWebApi.TaskDetails['TaskKeyName'] = 'B-TAMP';

      } else if (this.selectedTaskTypeName === 'TUBING') {  // TUBING TASK
        // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
        // let lotDetails = JSON.parse(localStorage.getItem('selectedLotsArray'));
        let lotDetails = JSON.parse(this.appCommonService.getLocalStorage('selectedLotsArray'));

        assignTaskDetailsForWebApi['LotJointsDetails'] = [];
        assignTaskDetailsForWebApi['TubingProductDetails'] = [];
        assignTaskDetailsForWebApi.TaskDetails['LotId'] = 0;
        assignTaskDetailsForWebApi.TaskDetails['StrainId'] = assignTaskFormValues[this.selectedTaskTypeName].strain;

        assignTaskDetailsForWebApi.TaskDetails['TaskKeyName'] = 'B-TUBE';

        // A package each unique brand strain lot details
        let allLotsTotalJoints = 0;
        if (lotDetails !== null) {
          lotDetails = lotDetails
            .forEach((item, index) => {
              if (item !== null && item.length) {
                // tslint:disable-next-line:no-shadowed-variable
                item.forEach((element, lotIndex) => {
                  assignTaskDetailsForWebApi['LotJointsDetails'].push({ LotId: element.LotNo, UnitValue: element.UnitValue, Qty: element.SelectedQty });

                  allLotsTotalJoints += Number(element.SelectedQty);
                });
              }
            });
        } else {
          assignTaskDetailsForWebApi['LotJointsDetails'] = [];
        }

        let allProductTypesTotalJoints = 0;
        assignTaskFormValues[this.selectedTaskTypeName].jointsOrderPackets
          .forEach(item => {
            if (item !== null && item.assignQty > 0) {
              assignTaskDetailsForWebApi['TubingProductDetails'].push(
                // { RawSupId: item.brandid, StrainId: item.strainid, PkgTypeId: item.packagetypeid,
                //      UnitValue: item.packageunit, Qty: item.assignPackageWt}
                {
                  // ProductTypeId: item.productTypeId,
                  StrainId: item.strainid,
                  PkgTypeId: item.pkgTypeId,
                  UnitValue: item.packageunit,
                  ItemQty: item.itemQty,
                  Qty: item.assignQty
                }
              );

              allProductTypesTotalJoints += Number(item.assignQty) * Number(item.itemQty);
            }
          });

        if (assignTaskDetailsForWebApi['TubingProductDetails'].length === 0) {
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.productassignqtywarning });
          return;
        }

        if (lotDetails === null) {
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.lotsnotassigned });
          return;
        }

        if (Number(allProductTypesTotalJoints) !== Number(allLotsTotalJoints)) {
          this.msgs = [];
          this.msgs.push({
            severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: 'Total lot selection joints is not matching with total joints of order.'
          });
          return;
        }

      } else if (this.selectedTaskTypeName === 'OILPACKAGING') { // BUDPACKAGING TASK
        // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
        // let pkgDetails = JSON.parse(localStorage.getItem('selectedPkgsArray'));
        let pkgDetails = JSON.parse(this.appCommonService.getLocalStorage('selectedPkgsArray'));

        //// const uniqueOrderStrains = JSON.parse(localStorage.getItem('uniqueOrderStrains'));

        assignTaskDetailsForWebApi['OilPkgCodeDetails'] = [];
        assignTaskDetailsForWebApi['ProductTypeDetails'] = [];
        assignTaskDetailsForWebApi.TaskDetails['LotId'] = 0;
        assignTaskDetailsForWebApi.TaskDetails['OrderId'] = assignTaskFormValues[this.selectedTaskTypeName].orderno;

        assignTaskDetailsForWebApi.TaskDetails['TaskKeyName'] = 'C-PACK';

        // C package each unique brand strain pkg details
        let allPkgsTotalWeight = 0;
        const tempOilPkgCodeDetails = [];
        if (pkgDetails !== null) {
          pkgDetails = pkgDetails
            .forEach((item, index) => {
              if (item !== null && item.length) {
                // tslint:disable-next-line:no-shadowed-variable
                item.forEach((element, lotIndex) => {
                  tempOilPkgCodeDetails.push({ StrainId: element.StrainId, OilPkgId: element.OilPkgId, OilWt: element.SelectedWt });
                  allPkgsTotalWeight += Number(element.SelectedWt);
                });
              }
            });

          _.mapValues(_.groupBy(tempOilPkgCodeDetails, c => {
            return [c.OilPkgId, c.StrainId];
          }),
            (clist, OilPkgObject) => {
              let oilPkgTotalWt = 0;
              const strainId = Number(String(OilPkgObject).split(',')[1]);
              const oilPkgId = Number(String(OilPkgObject).split(',')[0]);

              clist.map(PkgDetails1 => {
                oilPkgTotalWt += Number(PkgDetails1.OilWt);
              });
              assignTaskDetailsForWebApi['OilPkgCodeDetails'].push({
                StrainId: strainId, OilPkgId: oilPkgId, OilWt: oilPkgTotalWt
              });
            });

        } else {
          assignTaskDetailsForWebApi['OilPkgCodeDetails'] = [];
        }
        // End C package each unique brand strain pkg details

        let allProductTypesTotalWeight = 0;
        assignTaskFormValues[this.selectedTaskTypeName].oilOrderPackets
          .forEach(item => {
            if (item !== null && item.assignPackageWt > 0) {
              assignTaskDetailsForWebApi['ProductTypeDetails'].push(
                // { RawSupId: item.brandid, StrainId: item.strainid, PkgTypeId: item.packagetypeid,
                //      UnitValue: item.packageunit, Qty: item.assignPackageWt}
                { ProductTypeId: item.productTypeId, Qty: item.assignPackageWt }
              );

              allProductTypesTotalWeight += Number(item.assignPackageWt) * Number(item.packageunit);
            }
          });

        if (assignTaskDetailsForWebApi['ProductTypeDetails'].length === 0) {
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.productassignqtywarning });
          return;
        }

        if (pkgDetails === null) {
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.pkgsnotassigned });
          return;
        }

        if (Number(allProductTypesTotalWeight) !== Number(allPkgsTotalWeight)) {
          this.msgs = [];
          this.msgs.push({
            severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: 'Total pkg selection weight is not matching with total order assigned weight.'
          });
          return;
        }

      } else if (this.selectedTaskTypeName === 'CUSTOMTASK') {  // CUSTOM TASK
        // assignTaskDetailsForWebApi.TaskDetails['AssignedWt'] = 0;
        assignTaskDetailsForWebApi.TaskDetails['TaskKeyName'] = 'CUSTOMTASK';
        assignTaskDetailsForWebApi.TaskDetails['LotId'] = 0;
        assignTaskDetailsForWebApi.TaskDetails['EmpId'] = 0;
        assignTaskDetailsForWebApi.TaskDetails['NotifyEmp'] = false;
        assignTaskDetailsForWebApi.TaskDetails['NotifyManager'] = false;
        assignTaskDetailsForWebApi.TaskDetails['Priority'] = '';

      } else if (this.selectedTaskTypeName === 'QACHECK') { // Order Fulfilment/ QA Check Task
        assignTaskDetailsForWebApi['ProductTypeDetails'] = [];

        assignTaskDetailsForWebApi.TaskDetails['OrderId'] = assignTaskFormValues[this.selectedTaskTypeName].orderno;

        assignTaskDetailsForWebApi.TaskDetails['TaskKeyName'] = 'QA-CHECK';

        // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
        // let pkgDetails1: any = JSON.parse(localStorage.getItem('selectedPkgsAssignArray'));
        let pkgDetails1: any = JSON.parse(this.appCommonService.getLocalStorage('selectedPkgsAssignArray'));

        pkgDetails1 = pkgDetails1 ? pkgDetails1 : [];

        Object.keys(pkgDetails1).forEach((data: any) => {
          pkgDetails1[data].forEach(element5 => {
            assignTaskDetailsForWebApi['ProductTypeDetails'].push(
              {
                ProductTypeId: element5.productTypeId,
                LotId: Number(element5.lotId) ? Number(element5.lotId) : 0,
                SkewKeyName: element5.skewKeyName,
                OilPkgId: element5.oilPkgId ? element5.oilPkgId : 0,
                PackageCode: element5.packageCode ? element5.packageCode : '',
                OrdProdItemId: Number(element5.ordProdItemId),
                MixPkgId: element5.mixPkgId ? element5.mixPkgId : 0
              }
            );
          });
        });

        if (assignTaskDetailsForWebApi['ProductTypeDetails'].length === 0) {
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.productassignqtywarning });
          return;
        }
      } else if (this.selectedTaskTypeName === 'REPACK') { // Package Replacement Task
        assignTaskDetailsForWebApi['ProductTypeDetails'] = [];

        assignTaskDetailsForWebApi.TaskDetails['OrderId'] = assignTaskFormValues[this.selectedTaskTypeName].orderno;

        assignTaskDetailsForWebApi.TaskDetails['TaskKeyName'] = 'QAFAIL-REPACK';

        // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
        // let pkgDetails1: any = JSON.parse(localStorage.getItem('selectedPkgsAssignArray'));
        let pkgDetails1: any = JSON.parse(this.appCommonService.getLocalStorage('selectedPkgsAssignArray'));
        pkgDetails1 = pkgDetails1 ? pkgDetails1 : [];

        Object.keys(pkgDetails1).forEach((data: any) => {
          pkgDetails1[data].forEach(element4 => {
            assignTaskDetailsForWebApi['ProductTypeDetails'].push(
              {
                ProductTypeId: element4.productTypeId,
                LotId: Number(element4.lotId) ? Number(element4.lotId) : 0,
                SkewKeyName: element4.skewKeyName,
                OilPkgId: element4.oilPkgId ? element4.oilPkgId : 0,
                PackageCode: element4.packageCode ? element4.packageCode : '',
                OrdProdItemId: Number(element4.ordProdItemId),
                MixPkgId: element4.mixPkgId ? element4.mixPkgId : 0
              }
            );
          });
        });

        if (assignTaskDetailsForWebApi['ProductTypeDetails'].length === 0) {
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.productassignqtywarning });
          return;
        }
      } else if (this.selectedTaskTypeName === 'REBRAND') { // Branding and Label Replacement Task
        assignTaskDetailsForWebApi['ProductTypeDetails'] = [];

        assignTaskDetailsForWebApi.TaskDetails['OrderId'] = assignTaskFormValues[this.selectedTaskTypeName].orderno;

        assignTaskDetailsForWebApi.TaskDetails['TaskKeyName'] = 'QAFAIL-RELABEL';

        // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
        // let pkgDetails1: any = JSON.parse(localStorage.getItem('selectedPkgsAssignArray'));
        let pkgDetails1: any = JSON.parse(this.appCommonService.getLocalStorage('selectedPkgsAssignArray'));
        pkgDetails1 = pkgDetails1 ? pkgDetails1 : [];

        Object.keys(pkgDetails1).forEach((data: any) => {
          pkgDetails1[data].forEach(element3 => {
            assignTaskDetailsForWebApi['ProductTypeDetails'].push(
              {
                ProductTypeId: element3.productTypeId,
                LotId: Number(element3.lotId) ? Number(element3.lotId) : 0,
                SkewKeyName: element3.skewKeyName,
                OilPkgId: element3.oilPkgId ? element3.oilPkgId : 0,
                PackageCode: element3.packageCode ? element3.packageCode : '',
                OrdProdItemId: Number(element3.ordProdItemId),
                MixPkgId: element3.mixPkgId ? element3.mixPkgId : 0
              }
            );
          });
        });

        if (assignTaskDetailsForWebApi['ProductTypeDetails'].length === 0) {
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.productassignqtywarning });
          return;
        }
      } else if (this.selectedTaskTypeName === 'TUBELABELING') {  // Tube Brand & Label TASK
        // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
        // const lotDetails = JSON.parse(localStorage.getItem('selectedLotsArray'));
        const lotDetails = JSON.parse(this.appCommonService.getLocalStorage('selectedLotsArray'));

        assignTaskDetailsForWebApi['LotTubesDetails'] = [];
        assignTaskDetailsForWebApi['ProductTypeDetails'] = [];
        assignTaskDetailsForWebApi['MixPkgDetails'] = [];
        assignTaskDetailsForWebApi.TaskDetails['LotId'] = 0;
        assignTaskDetailsForWebApi.TaskDetails['OrderId'] = assignTaskFormValues[this.selectedTaskTypeName].orderno;

        assignTaskDetailsForWebApi.TaskDetails['TaskKeyName'] = 'B-TUBE-BRAND';

        // A package each unique brand strain lot details
        let allLotsTotalTubes = 0;
        let lotDetails1 = [];
        let lotDetails2 = [];

        if (lotDetails !== null) {
          lotDetails1 = lotDetails
            .forEach((item, index) => {
              if (item !== null && item.lotDetails !== null && item.lotDetails.length) {
                item.lotDetails.forEach((element2, lotIndex) => {
                  assignTaskDetailsForWebApi['LotTubesDetails'].push({
                    LotId: element2.LotNo,
                    StrainId: element2.StrainId,
                    PkgTypeId: element2.PkgTypeId,
                    UnitValue: element2.UnitValue,
                    ItemQty: element2.ItemQty,
                    Qty: element2.SelectedQty
                  });

                  allLotsTotalTubes += Number(element2.SelectedQty);
                });
              }
            });

          lotDetails2 = lotDetails
            .forEach((item, index) => {
              if (item !== null && item.mixPkgDetails !== null && item.mixPkgDetails.length) {
                item.mixPkgDetails.forEach((element1, lotIndex) => {
                  assignTaskDetailsForWebApi['MixPkgDetails'].push({
                    // ProductTypeId: element.ProductTypeId,
                    StrainId: element1.StrainId,
                    PkgTypeId: element1.PkgTypeId,
                    UnitValue: element1.UnitValue,
                    ItemQty: element1.ItemQty,
                    MixPkgId: element1.MixPkgId,
                    Qty: element1.SelectedQty
                  });

                  allLotsTotalTubes += 1;
                });
              }
            });
        } else {
          assignTaskDetailsForWebApi['LotTubeDetails'] = [];
        }

        let allProductTypesTotalTubes = 0;
        assignTaskFormValues[this.selectedTaskTypeName].tubeOrderPackets
          .forEach(item => {
            if (item !== null && item.assignQty > 0) {
              assignTaskDetailsForWebApi['ProductTypeDetails'].push(
                // { RawSupId: item.brandid, StrainId: item.strainid, PkgTypeId: item.packagetypeid,
                //      UnitValue: item.packageunit, Qty: item.assignPackageWt}
                {
                  ProductTypeId: item.productTypeId,
                  Qty: item.assignQty
                }
              );

              allProductTypesTotalTubes += Number(item.assignQty);
            }
          });

        if (assignTaskDetailsForWebApi['ProductTypeDetails'].length === 0) {
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.productassignqtywarning });
          return;
        }

        if (lotDetails1 === null && lotDetails2 === null) {
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.lotsnotassigned });
          return;
        }

        if (Number(allProductTypesTotalTubes) !== Number(allLotsTotalTubes)) {
          this.msgs = [];
          this.msgs.push({
            severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: 'Total lot selection tubes is not matching with total tubes of order.'
          });
          return;
        }

      }
      else if (this.selectedTaskTypeName === 'INDEPENDENT') {  // CUSTOM TASK
        // assignTaskDetailsForWebApi.TaskDetails['AssignedWt'] = 0;
        assignTaskDetailsForWebApi.TaskDetails['TaskKeyName'] = 'INDEPENDENT';
        assignTaskDetailsForWebApi.TaskDetails['LotId'] = 0;
        assignTaskDetailsForWebApi.TaskDetails['NotifyEmp'] = false;
        assignTaskDetailsForWebApi.TaskDetails['NotifyManager'] = false;
        assignTaskDetailsForWebApi.TaskDetails['Priority'] = '';

      }

      else if (this.selectedTaskTypeName === 'PLANTING') { // PLANTING TASK
       let plantingDataForApi = {
        Plants: {
          "ClientId": assignTaskDetailsForWebApi.TaskDetails.ClientId,
          "SectionId": assignTaskFormValues.PLANTING.section,
          "AssignedPlantsCount": assignTaskFormValues.PLANTING.assignedPC,
          "TaskTypeId":assignTaskDetailsForWebApi.TaskDetails.TaskTypeId,
          "EstStartDate":assignTaskDetailsForWebApi.TaskDetails.EstStartDate ,
          "Priority":assignTaskDetailsForWebApi.TaskDetails.Priority === ""? null: assignTaskDetailsForWebApi.TaskDetails.Priority  ,
          "VirtualRoleId":assignTaskDetailsForWebApi.TaskDetails.VirtualRoleId,
          "Comment": assignTaskDetailsForWebApi.TaskDetails.Comment,
          "NotifyManager": assignTaskDetailsForWebApi.TaskDetails.NotifyManager? 1:0,
          "NotifyEmp":assignTaskDetailsForWebApi.TaskDetails.NotifyEmp? 1:0
       },
       EmployeeTypes:[]
      };
      assignTaskFormValues[this.selectedTaskTypeName].employeeList
      .forEach((element, index) => {
        plantingDataForApi.EmployeeTypes.push({
          "EmpId" : assignTaskFormValues.PLANTING.employeeList[index] 
        });
      });
       this.loaderService.display(true);
      this.taskCommonService.assignPlantTask(plantingDataForApi).
      subscribe(
        data => {
          this.msgs = [];
          if (String(data[0]. RESULTKEY).toLocaleUpperCase() === 'SUCCESS') {
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
            detail: this.assignTaskResources.taskassignedsuccessfully});
            this.assignTask.task = null;
            this.assignTask.taskcategory=null;
            this.selectedTaskTypeName = '';
            this.isServiceCallComplete = false;
            this.assignTaskForm = this.fb.group({
              'taskname': new FormControl(null, Validators.required),
              'taskCategory':new FormControl(null,Validators.required),
            });
            // this.loaderService.display(false);
        }
        else if (String(data[0]. RESULTKEY).toLocaleUpperCase() === 'FAILURE') {
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
        }
        else if (String(data[0]. RESULTKEY) === 'Assigned Plant Count Greater than Total Plant Count') {
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.assignedcountmore });
         
        }
        this.loaderService.display(false);
        });
    
      }

      //Harvesting Task

      else if (this.selectedTaskTypeName === 'HARVESTING') { // HARVESTING TASK
        let harvestingDataForApi = {
          Harvesting: {
           "ClientId": assignTaskDetailsForWebApi.TaskDetails.ClientId,
           "SectionId": assignTaskFormValues.HARVESTING.section,
           "AssignedPlantsCount": assignTaskFormValues.HARVESTING.assignedPC,
           "TaskTypeId":assignTaskDetailsForWebApi.TaskDetails.TaskTypeId,
           "EstStartDate":assignTaskDetailsForWebApi.TaskDetails.EstStartDate ,
           "Priority": assignTaskDetailsForWebApi.TaskDetails.Priority === ""? null: assignTaskDetailsForWebApi.TaskDetails.Priority ,
           "VirtualRoleId":assignTaskDetailsForWebApi.TaskDetails.VirtualRoleId,
           "Comment": assignTaskDetailsForWebApi.TaskDetails.Comment,
           "NotifyManager": assignTaskDetailsForWebApi.TaskDetails.NotifyManager? 1:0,
           "NotifyEmp":assignTaskDetailsForWebApi.TaskDetails.NotifyEmp? 1:0
        },
        EmployeeTypes:[]
       };
       assignTaskFormValues[this.selectedTaskTypeName].employeeList
       .forEach((element, index) => {
        harvestingDataForApi.EmployeeTypes.push({
           "EmpId" : assignTaskFormValues.HARVESTING.employeeList[index] 
         });
       });
        this.loaderService.display(true);
       this.taskCommonService.assignHarvestTask(harvestingDataForApi).
       subscribe(
         data => {
           this.msgs = [];
           if (String(data[0]. RESULTKEY).toLocaleUpperCase() === 'SUCCESS') {
             this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
             detail: this.assignTaskResources.taskassignedsuccessfully});
             this.assignTask.task = null;
             this.assignTask.taskcategory=null;
             this.selectedTaskTypeName = '';
             this.isServiceCallComplete = false;
             this.assignTaskForm = this.fb.group({
               'taskname': new FormControl(null, Validators.required),
               'taskCategory':new FormControl(null,Validators.required),
             });
            
         }
         else if (String(data).toLocaleUpperCase() === 'FAILURE') {
           this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
         }
         else if (String(data[0]. RESULTKEY) === 'Assigned Plant Count Greater than Total Plant Count') {
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.assignedcountmore });
         
        }
        this.loaderService.display(false);
         });
     
       }
       
       else if (this.selectedTaskTypeName === 'PREBUCKING') { 
        let prebuckingDataForApi = {
          PreBucking: {
            "ClientId": assignTaskDetailsForWebApi.TaskDetails.ClientId,
            "StrainId": assignTaskFormValues.PREBUCKING.strain,
            "TaskTypeId":assignTaskDetailsForWebApi.TaskDetails.TaskTypeId,
            "EstStartDate":assignTaskDetailsForWebApi.TaskDetails.EstStartDate ,
            "Priority": assignTaskDetailsForWebApi.TaskDetails.Priority ,
            "VirtualRoleId":assignTaskDetailsForWebApi.TaskDetails.VirtualRoleId,
            "Comment": assignTaskDetailsForWebApi.TaskDetails.Comment,
            "NotifyManager": assignTaskDetailsForWebApi.TaskDetails.NotifyManager? 1:0,
            "NotifyEmp":assignTaskDetailsForWebApi.TaskDetails.NotifyEmp? 1:0
          },
          EmployeeTypes:[]
        };
        assignTaskFormValues[this.selectedTaskTypeName].employeeList
        .forEach((element, index) => {
          prebuckingDataForApi.EmployeeTypes.push({
            "EmpId" : assignTaskFormValues.PREBUCKING.employeeList[index] 
          });
        });
         this.loaderService.display(true);
        this.taskCommonService.assignPrebuckingTask(prebuckingDataForApi).
        subscribe(
          data => {
            this.msgs = [];
            if (String(data[0]. RESULTKEY).toLocaleUpperCase() === 'SUCCESS') {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.assignTaskResources.taskassignedsuccessfully});
              this.assignTask.task = null;
              this.assignTask.taskcategory=null;
              this.selectedTaskTypeName = '';
              this.isServiceCallComplete = false;
              this.assignTaskForm = this.fb.group({
                'taskname': new FormControl(null, Validators.required),
                'taskCategory':new FormControl(null,Validators.required),
              });
              this.loaderService.display(false);
          }
          else if (String(data).toLocaleUpperCase() === 'FAILURE') {
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
            this.loaderService.display(false);
          }
          else if (String(data) === 'Something went wrong  at server side!'){
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
            this.loaderService.display(false);
          }
          });
      

       }
       else if (this.selectedTaskTypeName === 'BUCKING') {
        let buckingDataForApi = {
          Bucking:{
            "ClientId": assignTaskDetailsForWebApi.TaskDetails.ClientId,
            "BinId": assignTaskFormValues.BUCKING.bins,
            "EmpId": assignTaskFormValues.BUCKING.employeeList,
            "TaskTypeId":assignTaskDetailsForWebApi.TaskDetails.TaskTypeId,
            "EstStartDate":assignTaskDetailsForWebApi.TaskDetails.EstStartDate ,
            "Priority": assignTaskDetailsForWebApi.TaskDetails.Priority === ""? null: assignTaskDetailsForWebApi.TaskDetails.Priority ,
            "VirtualRoleId":assignTaskDetailsForWebApi.TaskDetails.VirtualRoleId,
            "Comment": assignTaskDetailsForWebApi.TaskDetails.Comment,
            "NotifyManager": assignTaskDetailsForWebApi.TaskDetails.NotifyManager? 1:0,
            "NotifyEmp":assignTaskDetailsForWebApi.TaskDetails.NotifyEmp? 1:0
          }
        };
        this.loaderService.display(true);
        this.taskCommonService.assignbuckingTask(buckingDataForApi).
        subscribe(
          data => {
            this.msgs = [];
            if (String(data[0]. RESULTKEY).toLocaleUpperCase() === 'SUCCESS') {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.assignTaskResources.taskassignedsuccessfully});
              this.assignTask.task = null;
              this.assignTask.taskcategory=null;
              this.selectedTaskTypeName = '';
              this.isServiceCallComplete = false;
              this.assignTaskForm = this.fb.group({
                'taskname': new FormControl(null, Validators.required),
                'taskCategory':new FormControl(null,Validators.required),
              });
              this.loaderService.display(false);
            }
          }
        )
        }

          // http call starts
        
   if(this.selectedTaskTypeName != 'PREBUCKING' && this.selectedTaskTypeName != 'HARVESTING' && this.selectedTaskTypeName != 'PLANTING' && this.selectedTaskTypeName != 'BUCKING'){

   
          this.loaderService.display(true);
          this.taskCommonService.assignTask(assignTaskDetailsForWebApi)
            .subscribe(
              data => {
                // this.router.navigate(['']);
                
                if (String(data[0]['Result']).toLocaleUpperCase() === 'NOBALANCE') {
                  this.msgs = [];
                  this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.incorrectassignwt });
                } if (String(data[0]['Result']).toLocaleUpperCase() === 'NOTASSIGNED') {
                  this.msgs = [];
                  if (this.selectedTaskTypeName === 'TUBELABELING') {
                    this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.tasknotassigned });
                  } else {
                    this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.tasknotassigned });
                  }
                } else if (String(data[0]['Result']).toLocaleUpperCase() === 'FAILURE' || String(data[0]['Result']).toLocaleUpperCase() === 'ERROR') {
                  this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
                } else if (String(data[0]['Result']).toLocaleUpperCase() === 'TRIMCOMPLETED') {
                  this.msgs = [];
                  this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.trimcompleted });
                } else if (String(data[0]['Result']).toLocaleUpperCase() === 'LOTDELETED') {
                  this.msgs = [];
                  this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.lotdeleted });
                } else if (String(data[0]['Result']).toLocaleUpperCase() === 'JOINTSHORTAGE') {
                  this.msgs = [];
                  this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.jointshortage });

                  this.assignTask.task = null;
                  this.selectedTaskTypeName = '';
                  this.isServiceCallComplete = false;

                  this.assignTaskForm = this.fb.group({
                    'taskname': new FormControl(null, Validators.required),
                    'taskCategory':new FormControl(null,Validators.required),
                  });

                  this.taskcategorychange();
                } else if (String(data[0]['Result']).toLocaleUpperCase() === 'A-PACKAGE') {
                  this.msgs = [];
                  this.msgs.push({
                    severity: 'warn',
                    summary: this.globalResource.applicationmsg,
                    detail: data[0]['ErrMsg']
                 });

                 let deleteRowIndex = 0;
                 let deleteItemCount = 0;
                  if (String(data[0]['ErrName']).toLocaleUpperCase() === 'REQUIREDQTYNOTAVAILABLE') {
                    (<FormArray>(<FormGroup>this.assignTaskForm.controls[this.selectedTaskTypeName])
                          .controls['allocateEmpArr']).controls
                    .forEach((item, rowIndex) => {
                      if (item !== null && Number(item.value.productTypeId) === Number(data[0]['ErrRowIndex'])) {
                        if (item.value.parentUniqueId) {
                          deleteItemCount += 1;
                          // (<FormArray>(<FormGroup>this.assignTaskForm.controls[this.selectedTaskTypeName])
                          // .controls['allocateEmpArr']).removeAt(rowIndex);

                        } else {
                          deleteRowIndex = rowIndex + 1;
                          (<FormGroup>(<FormArray>(<FormGroup>this.assignTaskForm.controls[this.selectedTaskTypeName])
                          .controls['allocateEmpArr'])
                          .controls[rowIndex]).controls['assignQty'].patchValue(item.value.requiredQty);
                        }
                      }
                    });

                    for (let i = 0; i < deleteItemCount; i++) {
                      (<FormArray>(<FormGroup>this.assignTaskForm.controls[this.selectedTaskTypeName])
                      .controls['allocateEmpArr']).removeAt(deleteRowIndex);

                      // (<FormArray>(<FormGroup>this.assignTaskForm.controls[this.selectedTaskTypeName])
                      // .controls['allocateEmpArr']).removeAt(i);
                    }
                  }
                } else {
                  this.msgs = [];
                  this.msgs.push({
                    severity: 'success',
                    summary: this.globalResource.applicationmsg,
                    detail: this.assignTaskResources.taskassignedsuccessfully
                  });

                  this.assignTask.task = null;
                  this.assignTask.taskcategory=null;
                  this.selectedTaskTypeName = '';
                  this.isServiceCallComplete = false;
                  this.assignTaskForm = this.fb.group({
                    'taskname': new FormControl(null, Validators.required),
                    'taskCategory':new FormControl(null,Validators.required),
                  });

                  if (this.prodDBRouteParams) {
                    setTimeout(() => {
                      // this.router.navigate(['home/jointsproductiondashboard']);
                      this.router.navigate(['../home/taskaction',
                        String(data[0]['TaskKeyName']).toLocaleUpperCase(), data[0]['TaskId']]);

                    }, 2000);
                  }
                  this.taskcategorychange();
                }
                // http call ends
                // Commented by DEVDAN :: 26-Sep2018 :: Optimizing API Calls
                // this.refreshService.PushChange().subscribe(
                //   msg => {
                //   });
                this.loaderService.display(false);
              },
          
              error => {
                this.msgs = [];
                this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
                // http call ends
                this.loaderService.display(false);
              });
            }
          }
      //   },
      //   reject: () => {
      //     // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
      //   }
      // });
     else {
      this.appCommonService.validateAllFields(this.assignTaskForm);
    }
  }

  resetForm() {
    this.assignTask.task = null;
    this.selectedTaskTypeName = '';
    this.isServiceCallComplete = false;
    this.assignTaskForm = this.fb.group({
      'taskname': new FormControl(null, Validators.required),
    });

    this.taskTypeChange();
  }

}
