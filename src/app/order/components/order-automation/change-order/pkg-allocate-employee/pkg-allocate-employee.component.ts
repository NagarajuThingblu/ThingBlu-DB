import { forEach } from '@angular/router/src/utils/collection';
import { OrderService } from './../../../../service/order.service';
import { validateConfig } from '@angular/router/src/config';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SelectItem, Message } from 'primeng/api';

import * as _ from 'lodash';
import { DropdwonTransformService } from '../../../../../shared/services/dropdown-transform.service';
import { AppCommonService } from '../../../../../shared/services/app-common.service';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { GlobalResources } from '../../../../../global resource/global.resource';
import { TaskResources } from '../../../../../task/task.resources';

@Component({
  moduleId: module.id,
  selector: 'app-pkg-allocate-employee',
  templateUrl: 'pkg-allocate-employee.component.html',
  styles: [`
    .clsLotSelected {
      color: #25bb25 !important;
    }

    .disableGrayButton {
      background: grey !important;
      cursor: not-allowed;
    }

    ::ng-deep .clsBackgroundGrey > .ui-dropdown-label, ::ng-deep .clsBackgroundGrey > .ui-state-default {
      background-color: #E6E6E6 !important;
    }

    .pkgInfo.clsInvalidRow{
      border:1px solid red;
    }
  `]
})
export class PkgAllocateEmployeeComponent implements OnInit {
  @Input() ProductItem: FormGroup;
  @Input() OtherData: any;
  @Input() ChangeOrderDetails: any;
  @Output() CancelTask: EventEmitter<any> = new EventEmitter<any>();

  public questionForm: FormGroup;
  public questionPkgForm: FormGroup;
  public productTypeTaskList = [];
  public actionType: any;
  public productTypeId: number;
  public employees: any;

  public showLotSelectionModel = false;
  public brandStrainLots: any;
  public globalResource: any;
  public msgs: Message[] = [];
  public addtionAssignedQty  = 0;

  public lotInfo: any = {
    lotId: 0,
    showLotNoteModal: false,
    showLotCommentModal: false
  };

  private globalData = {
    employees: [],
    orderDetails: []
  };
  public selectedPkgsArray: any[] = [];
  public completedLotArray: any[] = [];

  public orderDetailsBS: any;
  public orderDetailsBS_filteredData: any = [];

  public selectedLotsArray = new Map<any, any>();
  public assignTaskResources: any;
  public lotSyncWtArr = new Map<any, any>();
  public lotSyncWtPkgArr = new Map<any, any>();

  public brandStrainPkgs: any ;
  public showPkgSelectionModel = false;
  public selLotBrandStrainRow = {
    BrandId: null,
    StrainId: null,
    BrandName: null,
    StrainName: null,
    RequireWt: null,
    selectedRowIndex: null,
    combinationTotalAssignedWt: null,
    GeneticsId: null,
    GeneticsName: null,
    LotListId: null,
    ProductTypeId: null,
    UniqueId: null
  };
  public selPkgBrandStrainRow = {
    BrandId: null,
    StrainId: null,
    BrandName: null,
    StrainName: null,
    RequireWt: null,
    selectedRowIndex: null,
    combinationTotalAssignedWt: null,
    GeneticsId: null,
    GeneticsName: null,
    ProductTypeId: null,
    UniqueId: null
  };
  public actionNameValue: SelectItem[];

  constructor(
    private fb: FormBuilder,
    private dropdwonTransformService: DropdwonTransformService,
    private appCommonService: AppCommonService,
    private loaderService: LoaderService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.actionNameValue = [
      { label: 'None', value: 'None' },
    ];
    this.globalResource = GlobalResources.getResources().en;
    this.assignTaskResources = TaskResources.getResources().en.assigntask;
    this.productTypeId = this.ProductItem.value.productType;
    this.employees = this.OtherData.employees;

    this.questionForm = this.fb.group({
      questions: new FormArray([])
    });

    this.questionPkgForm = this.fb.group({
      pkgQuestions: new FormArray([])
    });
    if (this.ProductItem.get('skewkeyName').value === 'BUD' ) {
      this.getSelectedOrderDetails(this.OtherData.orderId);
    } else {
      this.getSelectedOrderPkgDetails(this.OtherData.orderId);
    }

    this.getChangeOrderTaskByProductType(this.OtherData.orderId, this.productTypeId, this.ProductItem.get('skewkeyName').value, 'Addition');
  }

  onChange_Action(productItem) {
    (productItem as FormGroup).setControl('tasksArr', new FormArray([]));
    this.actionType = this.ProductItem.value.taskAction;
    if (this.actionType === 'CreateTask') {
      this.addTaskItem('CreateTask');
    } else if (this.actionType === 'AddToCurrentTask') {
      this.addTaskItemForCurrentTask();
    } else {
    }
  }

  get questions(): FormArray {
    return this.questionForm.get('questions') as FormArray;
  }

  get pkgQuestions(): FormArray {
    return this.questionPkgForm.get('pkgQuestions') as FormArray;
  }
  get tasksArr(): FormArray {
    return this.ProductItem.get('tasksArr') as FormArray;
  }

  addTaskItem(actionType): void {
    let arrayItem;
    arrayItem = this.ProductItem.get('tasksArr') as FormArray;
    arrayItem.push(this.createTaskItems(this.ProductItem, actionType));
  }

  createTaskItems(productItem, actionType): FormGroup {
    return this.fb.group({
      'taskId': new FormControl(null),
      'taskType': new FormControl(productItem.value.taskType),
      'taskTypeName': new FormControl(null),
      'taskStatus': new FormControl('ToBeAssigned'),
      'employee': new FormControl(null),
      'employeeName': new FormControl(null),
      'assignedQty': new FormControl(null, actionType !== 'AddToCurrentTask' ? Validators.required : null),
      'addedQty': new FormControl(null, actionType === 'AddToCurrentTask' ? Validators.required : null),
      'pkgType': new FormControl(productItem.value.pkgType),
      'pkgTypeName': new FormControl(null),
      'actiontype': new FormControl(actionType),
      uniqueId: this.appCommonService.randomNumber(),
    });
  }

  addTaskItemForCurrentTask(): void {
    let arrayItem;
    arrayItem = this.ProductItem.get('tasksArr') as FormArray;
    this.productTypeTaskList.forEach((item) => {
      arrayItem.push(this.createTaskItemsForCurrentTask(item));
    });
  }

  createTaskItemsForCurrentTask(productTypeTaskList): FormGroup {
    return this.fb.group({
      'taskId': new FormControl(productTypeTaskList.TaskId),
      'taskType': new FormControl(productTypeTaskList.TaskTypeId),
      'taskTypeName': new FormControl(productTypeTaskList.TaskTypeName),
      'taskStatus': new FormControl(productTypeTaskList.TaskStatus),
      'employee': new FormControl(productTypeTaskList.EmpId),
      'employeeName': new FormControl(productTypeTaskList.EmpName),
      'assignedQty': new FormControl(productTypeTaskList.AssignedQty),
      'addedQty': new FormControl(productTypeTaskList.TaskId ? 0 : null, Validators.required),
      'pkgType': new FormControl(productTypeTaskList.PkgtypeId),
      'pkgTypeName': new FormControl(productTypeTaskList.PkgTypeName),
      'actiontype': new FormControl('AddToCurrentTask'),
      uniqueId: this.appCommonService.randomNumber(),
    });
  }

  createNewTask(actionType) {
    this.addTaskItem(actionType);
  }

  showLotNote(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotNoteModal = true;
  }

  commentIconClicked(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotCommentModal = true;
    this.loaderService.display(false);
  }

  deleteItem(taskIndex) {
    const controla = <FormArray>this.ProductItem.get('tasksArr');
    if (controla.length !== 1) {
      const con =  (controla.controls[taskIndex] as FormGroup);
      if (this.appCommonService.getSessionStorage('selectedLotsArray')) {
        const selectedLots1 = JSON.parse(this.appCommonService.getSessionStorage('selectedLotsArray'));
          selectedLots1.forEach((item1, index1) => {
          //   item1.forEach((p, index2) => {
          //     if (p.UniqueId === con.value.uniqueId ) {
          //       item1.splice(index2, 1);
          //     }
          // });
          for ( let i = 0; i < item1.length; i++) {
            if ( item1[i].UniqueId === con.value.uniqueId) {
              item1.splice(i, 1);
              i -- ;
            }
         }
      });
      this.appCommonService.setSessionStorage('selectedLotsArray', JSON.stringify(selectedLots1));
      }
      controla.removeAt(taskIndex);
    }
  }

   getSelectedOrderDetails(OrderId) {
    this.orderService.getSelectedOrderDetails(OrderId, 'BUD', false, 0).subscribe(
      data => {
        if (data !== 'No data found!') {
          this.globalData.orderDetails = data;
      }
    },
      error => { console.log(error); },
      () => console.log('sucess'));
  }

  getChangeOrderTaskByProductType(orderId, productTypeId, skewKeyName, actionType) {
    let productTaskList = [];
    this.loaderService.display(true);
    this.orderService.getChangeOrderTasksByProductType(orderId, productTypeId, skewKeyName, actionType).subscribe(
      data => {
        if (data !== 'No data found!') {
          productTaskList = data.Table;
          this.loaderService.display(false);
          if (productTaskList.length > 0) {
            this.actionNameValue.push({ label: 'Add to Current Task(s)', value: 'AddToCurrentTask' });
            this.productTypeTaskList = productTaskList;
            this.ProductItem.controls['taskAction'].patchValue('AddToCurrentTask');
          } else {
            this.actionNameValue.push({ label: 'Create Task(s)', value: 'CreateTask' });
            this.ProductItem.controls['taskAction'].patchValue('None');
          }
        }
        this.onChange_Action(this.ProductItem);
      },
      error => { console.log(error); this.loaderService.display(false); },
      () => console.log('Get All Order Incoming complete'));
  }

  onChange_Employee(rowData) {

    this.tasksArr.controls.forEach((data) => {
      const answerBox = (data as FormGroup).controls['employee'];
      (answerBox as FormControl).setErrors(null);
    });
    this.tasksArr.controls.forEach((data) => {
      // tslint:disable-next-line:max-line-length
      if ((data as FormGroup).controls['employee'].value === rowData.value.employee && (data as FormGroup).controls['uniqueId'].value !== rowData.value.uniqueId) {
        const answerBox = (rowData as FormGroup).controls['employee'];
        (answerBox as FormControl).setErrors({ 'duplicateemployee': true });  // lotmaxwtexceeded
      }
    });
  }

  getLotSyncWt(lotId): number {
    return this.lotSyncWtArr.get(lotId);
  }

  getLotSyncPkgWt(lotId): number {
    return this.lotSyncWtPkgArr.get(lotId);
  }

  setLotSyncWt(lotId, weight) {
    this.lotSyncWtArr.set(lotId, weight);
  }

  openLotSelection(parentRowData, rowData, rowIndex) {
    const strainId = parentRowData.value.strain;
    this.brandStrainLots = [];
    this.brandStrainLots = this.globalData.orderDetails['Table1'].filter(result => {
      if (parentRowData.value.geneticsId) {
        return result.GeneticsId === parentRowData.value.geneticsId;
      } else {
        return result.StrainId === parentRowData.value.strainId;
      }
    });

    if (this.brandStrainLots.length <= 0) {
      this.msgs = [];
      this.msgs.push({
        severity: 'warn', summary: this.globalResource.applicationmsg,
        detail: 'Lot(s) not available.'
      });
      return;
    }
    this.selLotBrandStrainRow.BrandId = 0;
    this.selLotBrandStrainRow.StrainId = strainId;
    // this.selLotBrandStrainRow.selectedRowIndex = rowIndex;

    if (rowData.value.actiontype === 'AddToCurrentTask') {
      const employeeBox = (rowData as FormGroup).controls['addedQty'];
      const validators = !rowData.value.addedQty ? Validators.compose([Validators.required]) : null;
      employeeBox.setValidators(validators);
      employeeBox.updateValueAndValidity();
    } else if (rowData.value.actiontype === 'CreateTask') {
    const employeeBox = (rowData as FormGroup).controls['assignedQty'];
    const validators = !rowData.value.assignedQty ? Validators.compose([Validators.required]) : null;
    employeeBox.setValidators(validators);
    employeeBox.updateValueAndValidity();
  }
    this.selLotBrandStrainRow.RequireWt = 0;
    if (rowData.value.actiontype === 'AddToCurrentTask') {
    const totalPkgWt = Number(rowData.value.addedQty) * Number(parentRowData.value.pkgSize) * Number(parentRowData.value.itemQty);
    this.selLotBrandStrainRow.combinationTotalAssignedWt = Number(totalPkgWt);
    // this.selLotBrandStrainRow.combinationTotalAssignedWt = rowData.value.addedQty;
    } else if (rowData.value.actiontype === 'CreateTask') {
      const totalPkgWt = Number(rowData.value.assignedQty) * Number(parentRowData.value.pkgSize) * Number(parentRowData.value.itemQty);
      this.selLotBrandStrainRow.combinationTotalAssignedWt = Number(totalPkgWt);
      // this.selLotBrandStrainRow.combinationTotalAssignedWt = rowData.value.assignedQty;
    }
    this.selLotBrandStrainRow.ProductTypeId = parentRowData.value.productType;
    this.selLotBrandStrainRow.UniqueId = rowData.value.uniqueId;

    this.globalData.orderDetails['Table'].filter((value, key) => {
      return value.ProductTypeId === parentRowData.value.productType;
    })
      .map(value => {
        this.selLotBrandStrainRow.RequireWt += value.TotalWt;
        this.selLotBrandStrainRow.BrandName = '';
        this.selLotBrandStrainRow.StrainName = value.StrainName;
        this.selLotBrandStrainRow.GeneticsId = value.GeneticsId;
        this.selLotBrandStrainRow.GeneticsName = value.GeneticsName;
      });
    this.questionForm = this.fb.group({
      questions: this.fb.array(this.brandStrainLots.map(this.createQuestionControl(this.fb)))
    });

    // this.allocateEmpArr.value.forEach((result, index) => {
    //   let totalPkgWt = 0;
    //     // if ((result.strainid === rowData.value.strainId) && Number(result.assignPackageWt) > 0) {
    //     if ((result.productTypeId === rowData.value.productTypeId) && Number(result.assignQty) > 0 && index === rowIndex) {
    //       totalPkgWt = Number(result.assignQty) * Number(result.pkgSize) * Number(result.itemQty);
    //         this.selLotBrandStrainRow.combinationTotalAssignedWt = Number(totalPkgWt);
    //     }
    // });

    this.syncAllLotWeight();

    this.showLotSelectionModel = true;
  }

  syncAllLotWeight() {
    // const selectedLots = Array.from(this.selectedLotsArray.values());
    const selectedLots = JSON.parse(this.appCommonService.getSessionStorage('selectedLotsArray'));
    if (selectedLots !== null) {
      this.lotSyncWtArr.clear();
      selectedLots
        .forEach((item, index) => {
          if (item !== null && item.length) {
            item.forEach((element, lotIndex) => {
              if (this.lotSyncWtArr.has(element.LotNo)) {
                this.lotSyncWtArr.set(element.LotNo,
                  Number(this.lotSyncWtArr.get(element.LotNo)) -
                  Number(element.SelectedWt));
              } else {
                this.lotSyncWtArr.set(element.LotNo,
                  Number(element.AvailWt) - Number(element.SelectedWt));
              }
            });
          }
        });
    }
  }

  lotWeightOnChange(rowItem) {
    let updatedWt = 0;
    if (this.lotSyncWtArr.has(rowItem.value.LotNo)) {

      updatedWt = (Number(this.lotSyncWtArr.get(rowItem.value.LotNo)) + Number(rowItem.value.previousValue))
        - Number(rowItem.value.answer);

      if (updatedWt <= 0) { updatedWt = 0; }
      this.lotSyncWtArr.set(rowItem.value.LotNo, updatedWt);

      rowItem.controls['previousValue'].patchValue(rowItem.value.answer);
    } else {
      updatedWt = Number(rowItem.value.AvailWt) - Number(rowItem.value.answer);

      if (updatedWt <= 0) { updatedWt = 0; }
      this.lotSyncWtArr.set(rowItem.value.LotNo, updatedWt);

      rowItem.controls['previousValue'].patchValue(rowItem.value.answer);
    }
  }

  createQuestionControl(fb: FormBuilder) {
    return (question, index) => {
      let checkbox;
      let answerbox;
      const lotSelectedDetails = this.selectedLotsArray.get(this.selLotBrandStrainRow.UniqueId);
      // if (!this.lotSyncWtArr.has(question.LotId)) {
      //   this.setLotSyncWt(question.LotId, question.AvailableWt);
      // }
      let previousWt = 0;
      if (lotSelectedDetails) {
        const lotRowDetails = [];
        lotSelectedDetails.forEach(data => {
          // Added by Devdan :: 16-Oct-2018
          if (data.Index === index) {
            lotRowDetails.push(data);
          }
        });

        if (lotRowDetails.length) {
          const lotWt = lotRowDetails[0].SelectedWt;
          previousWt = lotWt;
          checkbox = lotRowDetails[0].Selected;
          // answerbox = lotRowDetails[0].Selected
          // ? [lotWt, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt)])]
          // : null;
          answerbox = [lotWt, Validators.compose([Validators.max(question.AvailableWt)])];
        } else {
          checkbox = question.selected;
          // answerbox = question.selected ? [null, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt)])]
          //   : null;
          answerbox = [null, Validators.compose([Validators.max(question.AvailableWt)])];
        }
      } else {
        checkbox = question.selected;
        // answerbox = question.selected ? [null, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt)])]
        //   : null;
        answerbox = [null, Validators.compose([Validators.max(question.AvailableWt)])];
      }
      return fb.group({
        question: checkbox, answer: answerbox, questionNumber: index, LotNo: question.LotId,
        AvailWt: question.AvailableWt, previousValue: previousWt || 0,
        GrowerLotNo: question.GrowerLotNo, LotNoteCount: question.LotNoteCount
      });
    };
  }

  submit(form) {
    const lotDetails = [];
    let totalLotWt = 0;
    let loMaxWtFlag = false;
    let lotSelectFlag = false;
    let noLotSelected = false;

    if (this.questionForm.valid) {
      // In edit mode, skip this validation on submit and checking this validations on update tasks
      /// condition added by Devdan :: 23-Nov-2018
      form.value.questions.forEach(result => {
        totalLotWt += Number(result.answer) ? Number(result.answer) : 0;

        // comment checkbox condition for remove checkbox :: 05-april-2019 :: swapnil
        // if (result.question) {  //change result.question to result.answer
        if (result.answer) {
          noLotSelected = true;
        }
        // if (Number(result.answer) > 0 && !result.question) {  //change result.question to result.answer
        if (Number(result.answer) > 0 && !result.answer) {
          lotSelectFlag = true;
          return;
        }
      });
      if (lotSelectFlag || !noLotSelected) {
        this.msgs = [];
        this.msgs.push({
          severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: 'Please select lot.'
        });
        return;
      } else if (totalLotWt !== Number(this.selLotBrandStrainRow.combinationTotalAssignedWt)) {
        this.msgs = [];
        this.msgs.push({
          severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: 'Selected Weight does not equal Required Weight'
        });
        return;
      }

      form.value.questions.forEach((result, index) => {
        if (result.answer > 0) {  // comment checkbox condition for remove checkbox :: 05-april-2019 :: swapnil

          let totalSelectedLotWt = 0;
          let totalSelectedLotWt1 = 0;
          this.selectedLotsArray.forEach(result1 => {
            result1.forEach(result3 => {
              if (result3.LotNo === result.LotNo) {
                totalSelectedLotWt += Number(result3.SelectedWt);
              }
            });
          });
          totalSelectedLotWt1 = totalSelectedLotWt;
          if (Number(totalSelectedLotWt) > 0) {
            totalSelectedLotWt = Number(totalSelectedLotWt) - Number(result.answer);
          } else {
            totalSelectedLotWt = Number(result.answer);
          }
          if (Number(totalSelectedLotWt) > result.AvailWt) {
            const answerBox = (this.questionForm.get('questions.' + index) as FormGroup).controls['answer'];
            (answerBox as FormControl).setErrors({ 'lotmaxwtexceeded': true });
            loMaxWtFlag = true;
            this.msgs = [];
            this.msgs.push({
              severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: (Number(result.AvailWt) - Number(totalSelectedLotWt)) + ' (gms) weight available for lot ' + result.GrowerLotNo
            });
            return;
          }
          if (loMaxWtFlag) {
            return;
          }
          const lotListId = 0;
          lotDetails.push(
            {
              LotListId: lotListId,
              LotNo: result.LotNo,
              GrowerLotNo: result.GrowerLotNo,
              AvailWt: result.AvailWt,
              SelectedWt: result.answer,
              Selected: true,
              Index: result.questionNumber,
              StrainId: result.StrainId,
              StrainName: this.selLotBrandStrainRow.StrainName,
              BrandId: this.selLotBrandStrainRow.BrandId,
              GeneticsId: this.selLotBrandStrainRow.GeneticsId,
              GeneticsName: this.selLotBrandStrainRow.GeneticsName,
              ProductTypeId: this.selLotBrandStrainRow.ProductTypeId,
              UniqueId: this.selLotBrandStrainRow.UniqueId
            }
          );
          // Added by bharat for bud packaing new changes
          // this.setLotSyncWt(result.LotNo,
          //   Number(result.AvailWt) - (totalSelectedLotWt1 + Number(result.answer))
          //   );
        }
      });
      // this.allocateEmpArr.controls[this.selLotBrandStrainRow.selectedRowIndex].updateValueAndValidity();
      this.selectedLotsArray.set(this.selLotBrandStrainRow.UniqueId, lotDetails);
      //  this.selectedLotsArray[this.selLotBrandStrainRow.UniqueId] = lotDetails;

      if (this.appCommonService.getSessionStorage('selectedLotsArray')) {
        const selectedLots1 = JSON.parse(this.appCommonService.getSessionStorage('selectedLotsArray'));
        lotDetails.forEach((item, index) => {
          selectedLots1.forEach((item1, index1) => {
            item1.forEach((p, index2) => {
              if (p.UniqueId === item.UniqueId && p.LotNo === item.LotNo) {
                item1.splice(index2, 1);
                // (index2);
                item1.push(item);
              } else {
                if (item1.filter(r => r.UniqueId === item.UniqueId && r.LotNo === item.LotNo ).length <= 0) {
                  item1.push(item);
                }
              }
            });
          });
        });
        this.appCommonService.setSessionStorage('selectedLotsArray', JSON.stringify(selectedLots1));
      } else {
        this.appCommonService.setSessionStorage('selectedLotsArray', JSON.stringify(Array.from(this.selectedLotsArray.values())));
      }

      if (loMaxWtFlag) {
        this.showLotSelectionModel = true;
      } else {
        this.showLotSelectionModel = false;
      }
    } else {
      this.appCommonService.validateAllFields(this.questionForm);
    }
  }
  assognedQty_onChange(rowData, unassignedTqty) {
    let assQty = 0;
    this.addtionAssignedQty = 0;
    this.tasksArr.controls.forEach((data) => {
      assQty = Number(assQty ) + Number((data as FormGroup).controls['assignedQty'].value);
    });
    const employeeBox = (rowData as FormGroup).controls['assignedQty'];
    if (assQty > unassignedTqty) {
      setTimeout(() => {
        employeeBox.setErrors({ 'assignedQtyExceeded': true });
      }, 0);

    } else {
      this.tasksArr.controls.forEach((data) => {
         (data as FormGroup).controls['assignedQty'].setErrors(null);
      });
      this.addtionAssignedQty = assQty;
    }
  }

  addedQty_onChange(rowData, unassignedTqty) {
    let assQty = 0;
    this.addtionAssignedQty = 0;
    this.tasksArr.controls.forEach((data) => {
      assQty = Number(assQty ) + Number((data as FormGroup).controls['addedQty'].value);
    });
    const employeeBox = (rowData as FormGroup).controls['addedQty'];
    if (assQty > unassignedTqty) {
      setTimeout(() => {
        employeeBox.setErrors({ 'assignedQtyExceeded': true });
      }, 0);

    } else {
      this.tasksArr.controls.forEach((data) => {
         (data as FormGroup).controls['addedQty'].setErrors(null);
      });
      this.addtionAssignedQty = assQty;
    }
  }

  // OIl
  getSelectedOrderPkgDetails(OrderId) {
    this.orderService.getSelectedOrderDetails(OrderId, 'OIL', false, 0).subscribe(
      data => {
        if (data !== 'No data found!') {
          this.globalData.orderDetails = data;
          const newArr = [];
            this.orderDetailsBS = this.removeDuplicatesByName(this.globalData.orderDetails['Table']);
          // Unique Brand Strain Combination
          this.orderDetailsBS_filteredData = [];
          this.selectedPkgsArray = [];

          this.orderDetailsBS.forEach((value, key) => {
            const counts  = this.globalData.orderDetails['Table1'].filter(result => result.StrainId === value.StrainId).length;
            value['LotCount'] = counts;
            if ( value.StrainId !== '') { this.orderDetailsBS_filteredData.push(value); }
          });
          // End Unique Brand Strain Combination

          //// localStorage.setItem('uniqueOrderStrains', this.orderDetailsBS_filteredData);
        }
      },
      error => { console.log(error); },
      () => console.log('sucess'));
  }

  removeDuplicatesByName(dataObject) {
    // To get unique record according brand and strain
    const newArr = [];
    dataObject.forEach((value, key) => {
      let exists = false;
      newArr.forEach((val2, key1) => {
        if (value.StrainName === val2.StrainName) { exists = true; }
      });

      if (exists === false && value.StrainName !== '') { newArr.push(value); }
    });
    return newArr;
    // End of getting unique record accroding brand and strain
  }

  removeDuplicatesById(dataObject) {
    // To get unique record according brand and strain
    const newArr = [];
    dataObject.forEach((value, key) => {
      let exists = false;
      newArr.forEach((val2, key1) => {
        if (value.strainid === val2.strainid) { exists = true; }
      });

      if (exists === false && value.strainid !== '') { newArr.push(value); }
    });
    return newArr;
    // End of getting unique record accroding brand and strain
  }

  openPkgSelection(parentRowData, rowData, rowIndex) {
    const StrainId = parentRowData.value.strain;
    const GeneticsId = parentRowData.value.geneticsId;
    this.brandStrainPkgs = [];
    this.brandStrainPkgs = this.globalData.orderDetails['Table1'].filter(result => result.GeneticsId === GeneticsId);
    this.selPkgBrandStrainRow.BrandId = 0;
    this.selPkgBrandStrainRow.StrainId = StrainId;
    this.selPkgBrandStrainRow.selectedRowIndex = rowIndex;
    this.selPkgBrandStrainRow.UniqueId = rowData.value.uniqueId;
    this.selPkgBrandStrainRow.ProductTypeId = parentRowData.value.productType;
    this.selPkgBrandStrainRow.RequireWt = 0;
    this.selPkgBrandStrainRow.combinationTotalAssignedWt = 0;

    this.globalData.orderDetails['Table1'].filter((value, key) =>
      value.GeneticsId === GeneticsId)
      .map(value => {
        this.selPkgBrandStrainRow.RequireWt += value.TotalWt;
        this.selPkgBrandStrainRow.BrandName = '';
        this.selPkgBrandStrainRow.StrainName = value.StrainName;
        this.selPkgBrandStrainRow.GeneticsId = value.GeneticsId;
        this.selPkgBrandStrainRow.GeneticsName = value.GeneticsName;

      });

    this.questionPkgForm = this.fb.group({
      pkgQuestions: this.fb.array(this.brandStrainPkgs.map(this.createQuestionPkgControl(this.fb)))
    });

    if (rowData.value.actiontype === 'AddToCurrentTask') {
      const employeeBox = (rowData as FormGroup).controls['addedQty'];
      const validators = !rowData.value.addedQty ? Validators.compose([Validators.required]) : null;
      employeeBox.setValidators(validators);
      employeeBox.updateValueAndValidity();
    } else if (rowData.value.actiontype === 'CreateTask') {
    const employeeBox = (rowData as FormGroup).controls['assignedQty'];
    const validators = !rowData.value.assignedQty ? Validators.compose([Validators.required]) : null;
    employeeBox.setValidators(validators);
    employeeBox.updateValueAndValidity();
  }
    this.selPkgBrandStrainRow.RequireWt = 0;
    if (rowData.value.actiontype === 'AddToCurrentTask') {
    const totalPkgWt = Number(rowData.value.addedQty) * Number(parentRowData.value.pkgSize) * Number(parentRowData.value.itemQty);
    this.selPkgBrandStrainRow.combinationTotalAssignedWt = Number(totalPkgWt);
    // this.selLotBrandStrainRow.combinationTotalAssignedWt = rowData.value.addedQty;
    } else if (rowData.value.actiontype === 'CreateTask') {
      const totalPkgWt = Number(rowData.value.assignedQty) * Number(parentRowData.value.pkgSize) * Number(parentRowData.value.itemQty);
      this.selPkgBrandStrainRow.combinationTotalAssignedWt = Number(totalPkgWt);
      // this.selLotBrandStrainRow.combinationTotalAssignedWt = rowData.value.assignedQty;
    }
    // this.selPkgBrandStrainRow.ProductTypeId = parentRowData.value.productType


    // this.oilOrderPackets.value.forEach(result => {
    //   let totalPkgWt = 0;
    //   if (this.taskId && this.taskId > 0) {
    //     if ((result.strainid === StrainId  || result.geneticsId === GeneticsId) && Number(result.assignPackageWt) > 0) {
    //       totalPkgWt = Number(result.assignPackageWt) * Number(result.packageunit);
    //         this.selPkgBrandStrainRow.combinationTotalAssignedWt += Number(totalPkgWt);
    //     }
    //   } else {
    //     if ((result.strainid === StrainId) && Number(result.assignPackageWt) > 0) {
    //       totalPkgWt = Number(result.assignPackageWt) * Number(result.packageunit);
    //         this.selPkgBrandStrainRow.combinationTotalAssignedWt += Number(totalPkgWt);
    //     }
    //   }
    // });

    this.syncAllPkgWeight();
    this.showPkgSelectionModel = true;
  }

  createQuestionPkgControl(fb: FormBuilder) {
    return (question, index) => {
      let checkbox;
      let answerbox;
      let previousWt = 0;
      const pkgSelectedDetails = this.selectedPkgsArray[this.selPkgBrandStrainRow.selectedRowIndex];

      if (pkgSelectedDetails) {
        const pkgRowDetails = [];
        pkgSelectedDetails.forEach(data => {
          if (data.Index === index) {
            pkgRowDetails.push(data);
          }
        });
        if (pkgRowDetails.length) {
          const pkgWt = pkgRowDetails[0].SelectedWt;
          previousWt = pkgWt;
            checkbox = pkgRowDetails[0].Selected;
            // answerbox = pkgRowDetails[0].Selected
            // ? [pkgWt, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt)])]
            // : null;
            answerbox = [pkgWt, Validators.compose([ Validators.max(question.AvailableWt)])];
        } else {
          checkbox = question.selected;
          // answerbox = question.selected ? [null, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt)])]
          //   : null;
          answerbox = [null, Validators.compose([Validators.max(question.AvailableWt)])];
        }
      } else {
        checkbox = question.selected;
        // answerbox = question.selected ? [null, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt)])]
        //   : null;
        answerbox = [null, Validators.compose([Validators.max(question.AvailableWt)])];
      }
        return fb.group({
          questionNumber: index, question: checkbox, OilPkgCode: question.OilPkgCode,
          TPPkgTypeName: question.TPPkgTypeName, answer: answerbox,
          AvailWt: question.AvailableWt,  previousValue: previousWt || 0,
          StrainId: question.StrainId, StrainName: question.StrainName, GeneticsId: question.GeneticsId, GeneticsName: question.GeneticsName,
          OilPkgId: question.OilPkgId
        });
    };
  }

  submitPkg(form) {
    debugger;
    const pkgDetails = [];
    let totalPkgWt = 0;
    let loMaxWtFlag = false;

    if (this.questionPkgForm.valid) {
      // In edit mode, skip this validation on submit and checking this validations on update tasks
      /// condition added by Devdan :: 23-Nov-2018
        form.value.pkgQuestions.forEach(result => {
          totalPkgWt +=  Number(result.answer) ? Number(result.answer) : 0;
        });
        if (totalPkgWt !== Number(this.selPkgBrandStrainRow.combinationTotalAssignedWt)) {
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: 'Sum of all pkg weight is not equal to total assigned weight.' });
          return;
        }

      form.value.pkgQuestions.forEach((result, index) => {
       // if (result.question === true) {  // change checkbox true condition add on weight
          if (result.answer > 0) {
          let totalSelectedOilPkgWt = 0;
          this.selectedPkgsArray.forEach(result1 => {
            result1.forEach(result3 => {
              if (result3.OilPkgId ===  result.OilPkgId ) {
                totalSelectedOilPkgWt += Number(result3.SelectedWt);
              }
            });
          });
          if (Number(totalSelectedOilPkgWt) > 0) {
            totalSelectedOilPkgWt = Number(totalSelectedOilPkgWt) - Number(result.answer);
          } else {
            totalSelectedOilPkgWt = Number(result.answer);
          }
          if (Number(totalSelectedOilPkgWt) > result.AvailWt ) {
                const answerBox = (this.questionForm.get('pkgQuestions.' + index) as FormGroup).controls['answer'];

                (answerBox as FormControl).setErrors({ 'oilpkgmaxwtexceeded': true });

                loMaxWtFlag = true;
                this.msgs = [];
                this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: (Number(result.AvailWt) - Number(totalSelectedOilPkgWt)) + ' (gms) weight available for oil pkg ' + result.OilPkgCode });
                  return;
          }
          pkgDetails.push(
            {
              OilPkgId: result.OilPkgId,
              OilPkgCode: result.OilPkgCode,
              TPPkgTypeName: result.TPPkgTypeName,
              AvailWt: result.AvailWt,
              SelectedWt: result.answer,
              Selected: true,
              Index: result.questionNumber,
              StrainId: result.StrainId,
              BrandId: this.selPkgBrandStrainRow.BrandId,
              ProductTypeId: this.selPkgBrandStrainRow.ProductTypeId,
              GeneticsId:  this.selPkgBrandStrainRow.GeneticsId,
              UniqueId: this.selPkgBrandStrainRow.UniqueId,
            }
          );
        }
      });

      if (loMaxWtFlag) {
        return;
      }
      this.selectedPkgsArray[this.selPkgBrandStrainRow.selectedRowIndex] = pkgDetails;
      // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
      // localStorage.setItem('selectedPkgsArray', JSON.stringify(this.selectedPkgsArray));

      if (this.appCommonService.getSessionStorage('selectedPkgsArray')) {
        const selectedLots1 = JSON.parse(this.appCommonService.getSessionStorage('selectedPkgsArray'));
        pkgDetails.forEach((item, index) => {
          selectedLots1.forEach((item1, index1) => {
            item1.forEach((p, index2) => {
              if (p.UniqueId === item.UniqueId && p.OilPkgId === item.OilPkgId) {
                item1.splice(index2, 1);
                // (index2);
                item1.push(item);
              } else {
                if (item1.filter(r => r.UniqueId === item.UniqueId && r.OilPkgId === item.OilPkgId ).length <= 0) {
                  item1.push(item);
                }
              }
            });
          });
        });
        this.appCommonService.setSessionStorage('selectedPkgsArray', JSON.stringify(selectedLots1));
      } else {
        this.appCommonService.setSessionStorage('selectedPkgsArray', JSON.stringify(this.selectedPkgsArray));
      }
      // this.appCommonService.setLocalStorage('selectedPkgsArray', JSON.stringify(this.selectedPkgsArray));
      this.showPkgSelectionModel = false;
    } else {
      this.appCommonService.validateAllFields(this.questionForm);
    }
  }

  deletePkgItem(taskIndex) {
    const controla = <FormArray>this.ProductItem.get('tasksArr');
    if (controla.length !== 1) {
      const con =  (controla.controls[taskIndex] as FormGroup);
      if (this.appCommonService.getSessionStorage('selectedPkgsArray')) {
        const selectedLots1 = JSON.parse(this.appCommonService.getSessionStorage('selectedPkgsArray'));
          selectedLots1.forEach((item1, index1) => {
          for ( let i = 0; i < item1.length; i++) {
            if ( item1[i].UniqueId === con.value.uniqueId) {
              item1.splice(i, 1);
              i -- ;
            }
         }
      });
      this.appCommonService.setSessionStorage('selectedPkgsArray', JSON.stringify(selectedLots1));
      }
      controla.removeAt(taskIndex);
    }
  }

  syncAllPkgWeight() {
    // const selectedLots = Array.from(this.selectedLotsArray.values());
    const selectedPkg = JSON.parse(this.appCommonService.getSessionStorage('selectedPkgsArray'));
    if (selectedPkg !== null) {
      this.lotSyncWtPkgArr.clear();
      selectedPkg
        .forEach((item, index) => {
          if (item !== null && item.length) {
            item.forEach((element, lotIndex) => {
              if (this.lotSyncWtPkgArr.has(element.OilPkgId)) {
                this.lotSyncWtPkgArr.set(element.OilPkgId,
                  Number(this.lotSyncWtPkgArr.get(element.OilPkgId)) -
                  Number(element.SelectedWt));
              } else {
                this.lotSyncWtPkgArr.set(element.OilPkgId,
                  Number(element.AvailWt) - Number(element.SelectedWt));
              }
            });
          }
        });
    }
  }

  pkgWeightOnChange(rowItem) {
    let updatedWt = 0;
    if (this.lotSyncWtPkgArr.has(rowItem.value.OilPkgId)) {

      updatedWt = (Number(this.lotSyncWtPkgArr.get(rowItem.value.OilPkgId)) + Number(rowItem.value.previousValue))
        - Number(rowItem.value.answer);

      if (updatedWt <= 0) { updatedWt = 0; }
      this.lotSyncWtPkgArr.set(rowItem.value.OilPkgId, updatedWt);

      rowItem.controls['previousValue'].patchValue(rowItem.value.answer);
    } else {
      updatedWt = Number(rowItem.value.AvailWt) - Number(rowItem.value.answer);

      if (updatedWt <= 0) { updatedWt = 0; }
      this.lotSyncWtPkgArr.set(rowItem.value.OilPkgId, updatedWt);

      rowItem.controls['previousValue'].patchValue(rowItem.value.answer);
    }
  }

  isPkgSelected (uniqueId) {
    this.selectedPkgsArray.forEach((item, index) => {
      item.forEach(result => {
        if (result.UniqueId === uniqueId ) {
          return true;
        } else {
          return false;
        }
    });
  });
  }
}
