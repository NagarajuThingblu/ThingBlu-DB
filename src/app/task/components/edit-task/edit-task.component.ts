import { UserModel } from './../../../shared/models/user.model';
import { forEach } from '@angular/router/src/utils/collection';
import { TrimmingComponent } from './../taskparameters/trimming/trimming.component';
import { CookieService } from 'ngx-cookie-service';
import { SelectItem, ConfirmationService } from 'primeng/api';
import { Component, OnInit, Input, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
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
import { Title } from '@angular/platform-browser';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { parse } from 'querystring';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {

  public _cookieService: UserModel;
  public navigationSubscription: any;
  private taskDetails: any;
  public assignTask: any = {
    task: ''
  };
  public taskId: any;
  // Added by Devdan
  private additionalTaskDetails: any;
  constructor(
    private fb: FormBuilder,
    private componentFactoryResolver: ComponentFactoryResolver,
    private dropdownDataService: DropdownValuesService,
    private taskCommonService: TaskCommonService,
    private appCommonService: AppCommonService,
    private router: Router,
    private dropdwonTransformService: DropdwonTransformService,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private titleService: Title,
    private confirmationService: ConfirmationService,
  ) {
    this._cookieService = this.appCommonService.getUserProfile();
    // this.taskDetails = this.route.snapshot.data.data.Table[0];
    // this.taskId = this.route.snapshot.params['taskId'];
    this.taskId = this.route.snapshot.params['id'];

    this.route.data.subscribe(result => {
      this.taskDetails = result.data.Table[0];
      this.additionalTaskDetails = result.data;
    });
  }

  private submitted: boolean;
  public assignTaskForm: FormGroup;
  public assignTaskResources: any;
  public globalResource: any;

  public tasknames: SelectItem[];
  // public Lots: SelectItem[];  // Commented by Devdan :: 29-Oct-2018 :: Unused
  // public Employees: SelectItem[]; // Commented by Devdan :: 29-Oct-2018 :: Unused
  // public Priorities: SelectItem[]; // Commented by Devdan :: 29-Oct-2018 :: Unused

  public selectedTask: number;
  public display = false;

  public msgs: Message[] = [];

  public isServiceCallComplete: boolean;
  public map1 = new Map<any, any>();
  public selectedTaskTypeName: string;

  public globalData: any = {
    taskTypes: []
  };

  public page: any = {
    page: 'AssignTask',
    showmodal: false
  };

  @Input() ads: AddComponent[];
  @ViewChild(LoadComponentDirective) componentHost: LoadComponentDirective;

  initialiseInvites() {
    // Set default values and re-fetch any data you need.
  }
  ngOnInit() {
    this.assignTaskResources = TaskResources.getResources().en.assigntask;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle(this.assignTaskResources.edittasktitle);
    this.assignTaskForm = this.fb.group({
      'taskname': new FormControl(null, Validators.required),
    });

    this.getAllTasks();
    // if (this.taskId) {
    //   this.assignTask.task = this.taskDetails['TaskTypeId'];
    //   this.taskTypeChange();
    // }
    // http call ends
    // this.loaderService.display(false);
    // {validator:  DateValidators.dateCompares('estimatedstartdatetime','estimatedenddatetime')}
    // this.getAllTasks();
  }

  taskTypeChange() {
      if (this.assignTask.task !== null) {
        // http call starts
        this.loaderService.display(true);

        this.taskCommonService.getTaskTypeSettings(this.assignTask.task)
          .subscribe(
            (data: any) => {
              this.assignTask['IsManagerNotify'] = data[0].IsManagerNotify;
              this.assignTask['IsEmployeeNotify'] = data[0].IsEmployeeNotify;
              this.assignTask['startdate'] = new Date();
              this.selectedTaskTypeName = (this.globalData.taskTypes.filter(result => result.TaskTypeId === this.assignTask.task) as any)[0].TaskTypeKey;

              // if (this.selectedTaskTypeName === 'BUDPACKAGING') {
              //   this.selectedTaskTypeName = 'budPackaging';
              // }
              this.assignTaskForm = this.fb.group({
                'taskname': new FormControl(this.assignTask.task, Validators.required),
              });


              if (this.taskId) {
                this.assignTask['IsManagerNotify'] = this.taskDetails['IsManagerNotify'];
                this.assignTask['IsEmployeeNotify'] = this.taskDetails['IsEmpNotify'];
                this.assignTask['startdate'] = new Date(this.taskDetails['EstStartDate']);

                // Added by Devdan :: 09-Oct-2018 :: Set the task details object
                this.assignTask['TaskDetails'] = this.taskDetails;
                // Added by Devdan :: 10-Oct-2018 :: set the additional task details in object
                if (this.taskDetails.TaskTypeKey === 'SIFTING') {
                  this.assignTask['SiftingTaskDetails'] = this.additionalTaskDetails.Table1[0];
                } else if (this.taskDetails.TaskTypeKey === 'GRINDING') {
                  this.assignTask['GrindingTaskDetails'] = this.additionalTaskDetails.Table1[0];
                  this.assignTask['GrindingTaskWeightDetails'] = this.additionalTaskDetails.Table2[0];
                } else if (this.taskDetails.TaskTypeKey === 'JOINTSCREATION') {
                  this.assignTask['JCTaskDetails'] = this.additionalTaskDetails.Table1[0];
                  this.assignTask['JCTaskWeightDetails'] = this.additionalTaskDetails.Table2[0];
                } else if (this.taskDetails.TaskTypeKey === 'TAMPING') {
                  this.assignTask['TampingTaskDetails'] = this.additionalTaskDetails.Table1[0];
                } else if (this.taskDetails.TaskTypeKey === 'BUDPACKAGING') {
                  this.assignTask['BudPckgTaskDetails'] = this.additionalTaskDetails.Table1[0];
                  this.assignTask['BudPckgOrderDetails'] = this.additionalTaskDetails.Table2;
                  this.assignTask['BudPckgLotDetails'] = this.additionalTaskDetails.Table3;
                } else if (this.taskDetails.TaskTypeKey === 'OILPACKAGING') {
                  this.assignTask['OilPckgTaskDetails'] = this.additionalTaskDetails.Table1[0];
                  this.assignTask['OilPckgOrderDetails'] = this.additionalTaskDetails.Table2;
                  this.assignTask['OilPckgDetails'] = this.additionalTaskDetails.Table3;
                } else if (this.taskDetails.TaskTypeKey === 'QACHECK') {
                  this.assignTask['QACheckTaskDetails'] = this.additionalTaskDetails.Table1[0];
                  this.assignTask['QACheckOrderDetails'] = this.additionalTaskDetails.Table2;
                  this.assignTask['QACheckBudPkgDetails'] = this.additionalTaskDetails.Table3;
                  this.assignTask['QACheckJointPkgDetails'] = this.additionalTaskDetails.Table4;
                  this.assignTask['QACheckOilPkgDetails'] = this.additionalTaskDetails.Table5;
                  this.assignTask['QACheckBudMixPkgDetails'] = this.additionalTaskDetails.Table6;
                  this.assignTask['QACheckJointMixPkgDetails'] = this.additionalTaskDetails.Table7;
                } else if (this.taskDetails.TaskTypeKey === 'REPACK') {
                  this.assignTask['RepackTaskDetails'] = this.additionalTaskDetails.Table1[0];
                  this.assignTask['RepackOrderDetails'] = this.additionalTaskDetails.Table2;
                  this.assignTask['RepackBudPkgDetails'] = this.additionalTaskDetails.Table3;
                  this.assignTask['RepackJointPkgDetails'] = this.additionalTaskDetails.Table4;
                  this.assignTask['RepackOilPkgDetails'] = this.additionalTaskDetails.Table5;
                  this.assignTask['RepackBudMixPkgDetails'] = this.additionalTaskDetails.Table6;
                  this.assignTask['RepackJointMixPkgDetails'] = this.additionalTaskDetails.Table7;
                } else if (this.taskDetails.TaskTypeKey === 'REBRAND') {
                  this.assignTask['RebrandTaskDetails'] = this.additionalTaskDetails.Table1[0];
                  this.assignTask['RebrandOrderDetails'] = this.additionalTaskDetails.Table2;
                  this.assignTask['RebrandBudPkgDetails'] = this.additionalTaskDetails.Table3;
                  this.assignTask['RebrandJointPkgDetails'] = this.additionalTaskDetails.Table4;
                  this.assignTask['RebrandOilPkgDetails'] = this.additionalTaskDetails.Table5;
                  this.assignTask['RebrandBudMixPkgDetails'] = this.additionalTaskDetails.Table6;
                  this.assignTask['RebrandJointMixPkgDetails'] = this.additionalTaskDetails.Table7;
                } else if (this.taskDetails.TaskTypeKey === 'TUBING') {
                  this.assignTask['TubingTaskDetails'] = this.additionalTaskDetails.Table1[0];
                  this.assignTask['TubingProductDetails'] = this.additionalTaskDetails.Table2[0];
                  this.assignTask['TubingLotDetails'] = this.additionalTaskDetails.Table3;
                  this.assignTask['TubingLotWiseProductDetails'] = this.additionalTaskDetails.Table4;
                  this.assignTask['TubingMixPackageDetails'] = this.additionalTaskDetails.Table5;
                } else if (this.taskDetails.TaskTypeKey === 'TUBELABELING') {
                  this.assignTask['TubeLabelingTaskDetails'] = this.additionalTaskDetails.Table1[0];
                  this.assignTask['TubeLabelingProductDetails'] = this.additionalTaskDetails.Table2;
                  this.assignTask['TubeLabelingLotDetails'] = this.additionalTaskDetails.Table3;
                  this.assignTask['TubeLabelingMixPackageDetails'] = this.additionalTaskDetails.Table4;
                  this.assignTask['TubeLabelingLotWiseProductDetails'] = this.additionalTaskDetails.Table5;
                }

                this.isServiceCallComplete = true;
                // setTimeout(() => {
                //   this.map1 = (TaskKeysModel.TaskKeys.get(this.taskDetails['TaskTypeKey']) as Map<any, any>);

                //   for (const [key, value] of Array.from(this.map1.entries())) {
                //     this.assignTask[(this.taskDetails['TaskTypeKey'] as string).toUpperCase()][key] = this.taskDetails[value];
                //   }
                // }, 500);
              }
              // http call ends
              setTimeout(() => {
                this.loaderService.display(false);
                this.assignTaskForm.controls['taskname'].disable();
              }, 500);
            }
          );
      }
    // }
  }
  // ChangeComponent() {
  //   this.loadComponent(this.assignTask.task);
  // }

  getAllTasks() {
    this.dropdownDataService.getAllTask().subscribe(
      data => {
        this.globalData.taskTypes = data;
        this.tasknames = this.dropdwonTransformService.transform(data, 'TaskTypeName', 'TaskTypeId', '-- Select --');

        // Calling code after successfull execution of above call
        if (this.taskId) {
          this.assignTask.task = this.taskDetails['TaskTypeId'];
          this.taskTypeChange();
        }
      },
      error => { console.log(error); },
      () => console.log('sucess'));
  }

  get diagnostic() { return JSON.stringify(this.assignTaskForm.value); }

  onSubmit(assignTaskFormValues: any) {
    this.submitted = true;

    let assignTaskDetailsForWebApi;
    // this.appCommonService.validateAllFields(this.assignTaskForm);

    // Added by Devdan :: 10-Oct-2018
    let lotid;
    if (this.selectedTaskTypeName === 'SIFTING') {
      if (!this.assignTaskForm.valid) {
        this.appCommonService.validateAllFields(this.assignTaskForm);
        return;
      }
      lotid = assignTaskFormValues[this.selectedTaskTypeName].lotno.substr(0, assignTaskFormValues[this.selectedTaskTypeName].lotno.indexOf('_'));
    } else {
      lotid = assignTaskFormValues[this.selectedTaskTypeName].lotno;
    }

    assignTaskDetailsForWebApi = {
      TaskDetails: {
        TaskId: this.taskId,
        ClientId: this._cookieService.ClientId,
        VirtualRoleId: this._cookieService.VirtualRoleId,
        TaskTypeId: this.assignTaskForm.getRawValue().taskname,
        // Commented by Dev ::: 09-Oct-2018 :: Get the task type id from disabled drop down list
        // TaskTypeId: assignTaskFormValues.taskname,
        LotId: lotid, // Assigning new lotid which was taken by spliting the lot id and skew type :: 10-Oct-2018
        EmpId: assignTaskFormValues[this.selectedTaskTypeName].employee,
        EstStartDate: assignTaskFormValues[this.selectedTaskTypeName].estimatedstartdate.toLocaleDateString().replace(/\u200E/g, ''),
        Comment: assignTaskFormValues[this.selectedTaskTypeName].comment,
        NotifyEmp: assignTaskFormValues[this.selectedTaskTypeName].notifyemployee,
        NotifyManager: assignTaskFormValues[this.selectedTaskTypeName].notifymanager,
        Priority: assignTaskFormValues[this.selectedTaskTypeName].priority
      }
    };

    if (this.selectedTaskTypeName === 'TRIMMING') {
      assignTaskDetailsForWebApi.TaskDetails['AssignedWt'] = 0;
      assignTaskDetailsForWebApi.TaskDetails['TaskKeyName'] = 'TRIM';

    } else if (this.selectedTaskTypeName === 'SIFTING') {

      assignTaskDetailsForWebApi.TaskDetails['AssignedWt'] = assignTaskFormValues[this.selectedTaskTypeName].assignwt;
      assignTaskDetailsForWebApi.TaskDetails['SkewKeyName'] = this.assignTask.SIFTING.skewtype;
      assignTaskDetailsForWebApi.TaskDetails['TaskKeyName'] = 'SIFTING';

      if (Number(assignTaskFormValues[this.selectedTaskTypeName].assignwt) > Number(this.assignTask[this.selectedTaskTypeName].lotweight)) {
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.assignwtgreaterthanlotwt });
        return;
      }

    } else if (this.selectedTaskTypeName === 'BUDPACKAGING') {
      // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
      // let lotDetails = JSON.parse(localStorage.getItem('selectedLotsArray'));
      const lotDetails = JSON.parse(this.appCommonService.getLocalStorage('selectedLotsArray'));

      assignTaskDetailsForWebApi['LotDetails'] = [];
      assignTaskDetailsForWebApi['ProductTypeDetails'] = [];
      assignTaskDetailsForWebApi.TaskDetails['LotId'] = 0;
      assignTaskDetailsForWebApi.TaskDetails['OrderId'] = assignTaskFormValues[this.selectedTaskTypeName].orderno;

      assignTaskDetailsForWebApi.TaskDetails['TaskKeyName'] = 'A-PACKAGE';

      // A package each unique brand strain lot details
      // Added by Devdan :: 17-Oct-2018 :: Validate Assigned wt against assigned qty
      let assingedWt = 0;
      let assignedQty = 0;
      const  lotDetailsOrderGroup = [];
      if (lotDetails !== null) {
        lotDetails.forEach((item, index) => {
          if (item !== null && item.length) {
            item.forEach((element, lotIndex) => {
              assingedWt = assingedWt + parseFloat(element.SelectedWt);
              // Modified by Devdan :: 15-Oct-2018 :: Added lotListId key pair for bud packaging edit functionality
              // assignTaskDetailsForWebApi['LotDetails'].push({ LotId: element.LotNo, Weight: element.SelectedWt, LotListId: element.LotListId });
              // assignTaskDetailsForWebApi['LotDetails'].push({ LotId: element.LotNo, Weight: element.SelectedWt });
              lotDetailsOrderGroup.push({ LotId: element.LotNo, Weight: element.SelectedWt});
            });
          }
        });
      } else {
        assignTaskDetailsForWebApi['LotDetails'] = [];
      }

      assignTaskFormValues[this.selectedTaskTypeName].budOrderPackets
        .forEach(item => {
          if (item !== null && item.assignPackageWt > 0) {
            // Added by Devdan :: Set the AssignedQty
            assignedQty = assignedQty + (parseFloat(item.assignPackageWt) * parseFloat(item.packageunit) * Number(item.itemQty));
            // Modified by Devdan :: 15-Oct-2018 :: Added bud packaging detail id key pair for bud packaging edit functionality
            assignTaskDetailsForWebApi['ProductTypeDetails'].push(
              {
                RawSupId: item.brandid, StrainId: item.strainid, PkgTypeId: item.packagetypeid,
                // UnitValue: item.packageunit, Qty: item.assignPackageWt, TBPDId: item.TBPDId, ProductTypeId: item.productTypeId
                UnitValue: item.packageunit, Qty: item.assignPackageWt, ProductTypeId: item.productTypeId
              }
            );
          }
        });

        // Added for grouping same lot wt in singl row on 23-08-2018 by sanjay
        if (lotDetails !== null) {
          _.mapValues(_.groupBy(lotDetailsOrderGroup, c => {
            return [c.LotId];
            }),
            (clist, LotObject) => {
            let lotWeight = 0;
            const lotNo = Number(String(LotObject).split(',')[0]);
            clist.map(LotDetails1 => {
              lotWeight += Number(LotDetails1.Weight);
            });
                 assignTaskDetailsForWebApi['LotDetails'].push({ LotId: lotNo, Weight: lotWeight});
            });
          } else {
          assignTaskDetailsForWebApi['LotDetails'] = [];
          }
        // End  Added for grouping same lot wt in singl row on 23-08-2018

      // Calculate assigned wight as per the genetics id :: By Devdan :: 22-Nov-2018
      let lotWeightError = false;
      if (lotDetails) {
        let geneticWiseAssignedWt = 0;
        let geneticWiseAssignedQty = 0;
        _.mapValues(_.groupBy(assignTaskFormValues[this.selectedTaskTypeName].budOrderPackets, 'geneticsId'),
        (clist, geneticsId) => {
          geneticWiseAssignedQty = 0;
          clist.forEach(orderlist => {
            if (orderlist !== null && orderlist.assignPackageWt > 0) {
              geneticWiseAssignedQty = geneticWiseAssignedQty +
                                        (parseFloat(orderlist.assignPackageWt) * parseFloat(orderlist.packageunit) * Number(orderlist.itemQty));
            }
          });
          // console.log(assignTaskFormValues[this.selectedTaskTypeName].budOrderPackets.filter(x => x.geneticsId === geneticsId));
          assignTaskFormValues[this.selectedTaskTypeName].budOrderPackets
          .forEach(order => {
            if (order !== null && order.assignPackageWt > 0 && Number(order.geneticsId) === Number(geneticsId)) {
              geneticWiseAssignedWt = 0;
              lotDetails.forEach((lot, index) => {
                if (lot !== null && lot.length) {
                  lot.forEach((element, lotIndex) => {
                    if (order.geneticsId === element.GeneticsId) {
                      geneticWiseAssignedWt = geneticWiseAssignedWt + parseFloat(element.SelectedWt);
                    }
                  });
                }
              });
              if (geneticWiseAssignedWt !== geneticWiseAssignedQty) {
                lotWeightError = true;
              }
              console.log(geneticWiseAssignedWt);
              console.log(geneticWiseAssignedQty);
            }
        });
      });

      }
      if (lotWeightError) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: 'Genetic wise sum of all lot weight is not equal to total assigned weight.' });
        return;
      }
      // End of Calculate assigned wight as per the genetics id :: By Devdan :: 22-Nov-2018

      // Check if AssignedWt and AssignedQty are equal :: By Devdan :: 17-Oct-2018
      console.log(assignedQty, assingedWt);
      if (assignedQty !== assingedWt) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: 'Sum of all lot weight is not equal to total assigned weight.' });
        return;
      }
      if (assignTaskDetailsForWebApi['ProductTypeDetails'].length === 0) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.productassignqtywarning });
        return;
      }

      if (lotDetails === null) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.lotsnotassigned });
        return;
      }

    } else if (this.selectedTaskTypeName === 'GRINDING') {
      assignTaskDetailsForWebApi.TaskDetails['AssignedWt'] = assignTaskFormValues[this.selectedTaskTypeName].assignwt;
      assignTaskDetailsForWebApi.TaskDetails['TaskKeyName'] = 'B-GRIND';

      if (Number(assignTaskFormValues[this.selectedTaskTypeName].assignwt) > Number(this.assignTask[this.selectedTaskTypeName].lotweight)) {
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.assignwtgreaterthanlotwt });
        return;
      }

    } else if (this.selectedTaskTypeName === 'JOINTSCREATION') {
      assignTaskDetailsForWebApi.TaskDetails['AssignedWt'] = assignTaskFormValues[this.selectedTaskTypeName].assignwt;
      assignTaskDetailsForWebApi.TaskDetails['TaskKeyName'] = 'B-JOINT';

      if (Number(assignTaskFormValues[this.selectedTaskTypeName].assignwt) > Number(this.assignTask[this.selectedTaskTypeName].lotweight)) {
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.assignwtgreaterthanlotwt });
        return;
      }

    } else if (this.selectedTaskTypeName === 'TAMPING') {
      assignTaskDetailsForWebApi.TaskDetails['AssignedWt'] = 0;
      assignTaskDetailsForWebApi.TaskDetails['TaskKeyName'] = 'B-TAMP';

    }  else if (this.selectedTaskTypeName === 'TUBING') {  // TUBING TASK
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
              assignTaskDetailsForWebApi['LotJointsDetails'].push({ LotId: element.LotNo, UnitValue: element.UnitValue, Qty: element.SelectedQty});

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
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.productassignqtywarning });
        return;
      }

      if (lotDetails === null) {
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.lotsnotassigned });
        return;
      }

      if (Number(allProductTypesTotalJoints) !== Number(allLotsTotalJoints)) {
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: 'Total lot selection joints is not matching with total joints of order.'});
        return;
      }

    } else if (this.selectedTaskTypeName === 'OILPACKAGING') { // BUDPACKAGING TASK
      // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
      // let PkgDetails = JSON.parse(localStorage.getItem('selectedPkgsArray'));
      const pkgDetails = JSON.parse(this.appCommonService.getLocalStorage('selectedPkgsArray'));

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
        pkgDetails.forEach((item, index) => {
          if (item !== null && item.length) {
            // tslint:disable-next-line:no-shadowed-variable
            item.forEach((element, lotIndex) => {
              tempOilPkgCodeDetails.push({ StrainId: element.StrainId, OilPkgId: element.OilPkgId, OilWt: element.SelectedWt});
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
          const oilPkgId =  Number(String(OilPkgObject).split(',')[0]);
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
            { ProductTypeId: item.productTypeId, Qty: item.assignPackageWt}
          );

          allProductTypesTotalWeight += Number(item.assignPackageWt) * Number(item.packageunit);
        }
      });

      // Calculate assigned wight as per the genetics id :: By Devdan :: 22-Nov-2018
      let lotWeightError = false;
      if (pkgDetails) {
        let geneticWiseAssignedWt = 0;
        let geneticWiseAssignedQty = 0;
        _.mapValues(_.groupBy(assignTaskFormValues[this.selectedTaskTypeName].oilOrderPackets, 'geneticsId'),
      (clist, geneticsId) => {
        geneticWiseAssignedQty = 0;
        clist.forEach(orderlist => {
          if (orderlist !== null && orderlist.assignPackageWt > 0) {
            geneticWiseAssignedQty = geneticWiseAssignedQty + (parseFloat(orderlist.assignPackageWt) * parseFloat(orderlist.packageunit));
          }
        });
        assignTaskFormValues[this.selectedTaskTypeName].oilOrderPackets
          .forEach(order => {
            if (order !== null && order.assignPackageWt > 0 && Number(order.geneticsId) === Number(geneticsId)) {
              geneticWiseAssignedWt = 0;
              pkgDetails.forEach((pkg, index) => {
                if (pkg !== null && pkg.length) {
                  pkg.forEach((element, lotIndex) => {
                    if (order.geneticsId === element.GeneticsId) {
                      geneticWiseAssignedWt += parseFloat(element.SelectedWt);
                    }
                  });
                }
              });
              if (geneticWiseAssignedWt !== geneticWiseAssignedQty) {
                lotWeightError = true;
              }
            }
          });
        });
      }
      if (lotWeightError) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: 'Genetic wise sum of all package weight is not equal to total assigned weight.' });
        return;
      }
      // End of Calculate assigned wight as per the genetics id :: By Devdan :: 22-Nov-2018

      if (assignTaskDetailsForWebApi['ProductTypeDetails'].length === 0) {
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.productassignqtywarning });
        return;
      }

      if (pkgDetails === null) {
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.pkgsnotassigned });
        return;
      }

      if (Number(allProductTypesTotalWeight) !== Number(allPkgsTotalWeight)) {
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: 'Total pkg selection weight is not matching with total order assigned weight.'});
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
              PackageCode: element5.packageCode ?  element5.packageCode : '',
              OrdProdItemId: Number(element5.ordProdItemId),
              MixPkgId: element5.mixPkgId ? element5.mixPkgId : 0
            }
          );
        });
      });

      if (assignTaskDetailsForWebApi['ProductTypeDetails'].length === 0) {
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.productassignqtywarning });
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
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.productassignqtywarning });
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
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.productassignqtywarning });
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

      // Calculate assigned wight as per the genetics id :: By Devdan :: 22-Nov-2018
      let lotWeightError = false;
      if (lotDetails) {
        let geneticWiseSelectedQty = 0;
        let geneticWiseAssignedQty = 0;
        _.mapValues(_.groupBy(assignTaskFormValues[this.selectedTaskTypeName].tubeOrderPackets, c => {
          return [c.geneticsId, c.packageunit, c.itemQty];
        }),
        // Number(String(LotObject).split(',')[0])
      (clist, lotObject) => {
        console.log(clist);
        geneticWiseAssignedQty = 0;
        clist.forEach(orderlist => {
          if (orderlist !== null && orderlist.assignQty > 0) {
            geneticWiseAssignedQty = geneticWiseAssignedQty + (parseFloat(orderlist.assignQty) * parseFloat(orderlist.packageunit));
          }
        });
        assignTaskFormValues[this.selectedTaskTypeName].tubeOrderPackets
          .forEach(order => {
            if (order !== null && order.assignQty > 0 && Number(order.geneticsId) === Number(String(lotObject).split(',')[0])
                  && order.packageunit === parseFloat(String(lotObject).split(',')[1])
                  && order.itemQty === Number(String(lotObject).split(',')[2])) {
              geneticWiseSelectedQty = 0;
              lotDetails.forEach((lot, index) => {
                lot.lotDetails.forEach((element) => {
                  if (element !== null) {
                    if (order.geneticsId === element.GeneticsId && order.packageunit === element.UnitValue
                          && order.itemQty === element.ItemQty) {
                        console.log(element);
                      geneticWiseSelectedQty += (parseFloat(element.SelectedQty) * parseFloat(element.UnitValue));
                    }
                  }
                });
              });
            }
          });
          if (geneticWiseSelectedQty !== geneticWiseAssignedQty) {
            lotWeightError = true;
          }
          console.log(geneticWiseSelectedQty);
          console.log(geneticWiseAssignedQty);
          geneticWiseSelectedQty = 0;
        });
      }
      if (lotWeightError) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: 'Genetic wise sum of all package weight is not equal to total assigned weight.' });
        return;
      }
      // End of Calculate assigned wight as per the genetics id :: By Devdan :: 22-Nov-2018

      if (assignTaskDetailsForWebApi['ProductTypeDetails'].length === 0) {
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.productassignqtywarning });
        return;
      }

      if (lotDetails1 === null && lotDetails2 === null) {
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.lotsnotassigned });
        return;
      }

      if (Number(allProductTypesTotalTubes) !== Number(allLotsTotalTubes)) {
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: 'Total lot selection tubes is not matching with total tubes of order.'});
        return;
      }

    }

    if (this.assignTaskForm.valid) {
      // console.log(assignTaskDetailsForWebApi);
      this.confirmationService.confirm({
      message: this.globalResource.saveconfirm,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
      console.log(assignTaskDetailsForWebApi);
      this.loaderService.display(true);
      this.taskCommonService.updateTask(assignTaskDetailsForWebApi)
        .subscribe(
          data => {
          if (String(data).toLocaleUpperCase() === 'NOBALANCE') {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.incorrectassignwt });
          }  if (String(data).toLocaleUpperCase() === 'NOTASSIGNED') {
            this.msgs = [];
            if (this.selectedTaskTypeName === 'TUBELABELING') {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.tasknotassigned });
            } else {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.tasknotassigned });
            }
          }  else if (String(data).toLocaleUpperCase() === 'FAILURE' || String(data).toLocaleUpperCase() === 'ERROR') {
            this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
          } else if (String(data).toLocaleUpperCase() === 'TRIMCOMPLETED') {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.trimcompleted });
          } else if (String(data).toLocaleUpperCase() === 'LOTDELETED') {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.lotdeleted });
          } else if (String(data).toLocaleUpperCase() === 'ALREADYSTARTED') {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskalreadystarted });
          } else if (String(data).toLocaleUpperCase() === 'TASKDELETED') {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskalreadydeleted });
          } else if (String(data).toLocaleUpperCase() === 'WEIGHTERROR') {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.assignwtgreaterthanlotwt });
          } else if (String(data).toLocaleUpperCase() === 'UNAVAILABLEWT') {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.unavailableLotWt });
          }  else if (String(data).toLocaleUpperCase() === 'PKGASSIND') {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.packageassigned });
          } else if (String(data).toLocaleUpperCase() === 'JOINTSHORTAGE') {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.jointshortage });

            this.assignTask.task = null;
            this.selectedTaskTypeName = '';
            this.isServiceCallComplete = false;

            this.assignTaskForm = this.fb.group({
              'taskname': new FormControl(null, Validators.required),
            });

            this.taskTypeChange();
          } else {
            this.msgs = [];
            this.msgs.push({severity: 'success',
            summary: this.globalResource.applicationmsg,
            detail: this.assignTaskResources.taskupdatedsuccessfully });

            this.assignTask.task = null;
            this.selectedTaskTypeName = '';
            this.isServiceCallComplete = false;
            this.assignTaskForm = this.fb.group({
              'taskname': new FormControl(null, Validators.required),
            });

            this.taskTypeChange();
            // Redirect User to manager dashboard after updating the task details
            setTimeout(() => {
              this.router.navigate(['home/dashboard/managerdashboard']);
            }, 1000);
          }
          this.loaderService.display(false);
        },
        error => {
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
            // http call ends
            this.loaderService.display(false);
        }
      );
    },
    reject: () => {
        // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
      }
    });
    } else {
      this.appCommonService.validateAllFields(this.assignTaskForm);
    }
  }

  // Redirecting back to task detail page
  backToTaskDetails() {
    this.router.navigate(['../home/taskaction', this.taskDetails.TaskTypeKey, this.taskId]);
  }
}
