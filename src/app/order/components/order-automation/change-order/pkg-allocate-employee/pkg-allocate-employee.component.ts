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

  public selectedLotsArray = new Map<any, any>();
  public assignTaskResources: any;
  public lotSyncWtArr = new Map<any, any>();
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
    this.getChangeOrderTaskByProductType(this.OtherData.orderId, this.productTypeId, this.ProductItem.get('skewkeyName').value);
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
  get tasksArr(): FormArray {
    return this.ProductItem.get('tasksArr') as FormArray;
  }

  addTaskItem(actionType): void {
    let arrayItem;
    arrayItem = this.ProductItem.get('tasksArr') as FormArray;
    arrayItem.push(this.createTaskItems(actionType));
  }

  createTaskItems(actionType): FormGroup {
    return this.fb.group({
      'taskId': new FormControl(null),
      'taskType': new FormControl(null),
      'taskStatus': new FormControl(null),
      'employee': new FormControl(null),
      'employeeName': new FormControl(null),
      'assignedQty': new FormControl(null),
      'addedQty': new FormControl(null, Validators.required || null),
      'pkgType': new FormControl(null),
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
            item1.forEach((p, index2) => {
              if (p.UniqueId === con.value.uniqueId ) {
                item1.splice(index2, 1);
              }
          });
      });
      this.appCommonService.setSessionStorage('selectedLotsArray', JSON.stringify(selectedLots1));
      }
      controla.removeAt(taskIndex);
    }
  }

  getChangeOrderTaskByProductType(orderId, productTypeId, skewKeyName) {
    let productTaskList = [];
    this.loaderService.display(true);
    this.orderService.getChangeOrderTasksByProductType(orderId, productTypeId, skewKeyName).subscribe(
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

  setLotSyncWt(lotId, weight) {
    this.lotSyncWtArr.set(lotId, weight);
  }

  openLotSelection(parentRowData, rowData, rowIndex) {
    const strainId = parentRowData.value.strain;
    this.brandStrainLots = [];
    this.brandStrainLots = this.ChangeOrderDetails.orderDetails['Table1'].filter(result => {
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

    this.ChangeOrderDetails.orderDetails['Table'].filter((value, key) => {
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
              StrainId: this.selLotBrandStrainRow.StrainId,
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
                if (item1.filter(r => r.UniqueId === item.UniqueId).length <= 0) {
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
}
