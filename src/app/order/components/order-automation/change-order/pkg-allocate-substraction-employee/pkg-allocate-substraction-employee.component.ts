import { forEach } from '@angular/router/src/utils/collection';
import { OrderService } from '../../../../service/order.service';
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
import { debug } from 'util';
import { iterateListLike } from '@angular/core/src/change_detection/change_detection_util';

@Component({
  moduleId: module.id,
  selector: 'app-pkg-allocate-substraction-employee',
  templateUrl: 'pkg-allocate-substraction-employee.component.html',
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
export class PkgAllocateSubstractionEmployeeComponent implements OnInit {
  @Input() ProductItem: FormGroup;
  @Input() OtherData: any;
  @Input() ChangeOrderDetails: any;
  @Output() CancelTask: EventEmitter<any> = new EventEmitter<any>();

  public questionForm: FormGroup;
  public questionJointForm: FormGroup;
  public productTypeTaskList = [];
  public selectedLotDetails = [];
  public selectedLotMixPkgDetails = [];

  public selectedPkgDetails = [];

  public selectedJointPkgDetails = [];
  public selectedJointMixPkgDetails = [];
  public actionType: any;
  public productTypeId: number;
  public employees: any;

  public isCompletedOrReviewTask = false;

  public showLotSelectionModel = false;
  public showJointSelectionModel = false;
  public brandStrainLots: any;
  public globalResource: any;
  public msgs: Message[] = [];
  public addtionAssignedQty = 0;

  public lotInfo: any = {
    lotId: 0,
    showLotNoteModal: false,
    showLotCommentModal: false
  };

  public selectedLotsArray = new Map<any, any>();
  public selectedMixLotsArray = new Map<any, any>();
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

  // Start OIL
  public questionPkgForm: FormGroup;
  public brandStrainPkgs: any ;
  public showPkgSelectionModel = false;
  public selectedPkgsArray = new Map<any, any>();
  public lotSyncWtPkgArr = new Map<any, any>();
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
  // END OIl

  // JoinTs
  public selectedJointPkgArray  = new Map<any, any>();
  public completedLotArray: any[] = [];

  public selLotJointBrandStrainRow = {
    BrandId: null,
    StrainId: null,
    BrandName: null,
    StrainName: null,
    RequireWt: null,
    selectedRowIndex: null,
    combinationTotalAssignedQty: null,
    GeneticsId: null,
    GeneticsName: null,
    ProductTypeId: null,
    UniqueId: null,
    pkgSizeRequiredQtyArr: []
  };

  public completionParameters: any = [];
  constructor(
    private fb: FormBuilder,
    private dropdwonTransformService: DropdwonTransformService,
    private appCommonService: AppCommonService,
    private loaderService: LoaderService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.actionNameValue = [
    //  { label: 'None', value: 'None' },
    ];
    this.globalResource = GlobalResources.getResources().en;
    this.assignTaskResources = TaskResources.getResources().en.assigntask;
    this.productTypeId = this.ProductItem.value.productType;
    this.employees = this.OtherData.employees;

    this.questionForm = this.fb.group({
      questions: new FormArray([]),
      mixLotDetailsArr: this.fb.array([])
    });

    this.questionPkgForm = this.fb.group({
      pkgQuestions: new FormArray([])
    });

    this.questionJointForm = this.fb.group({
      jointQuestions: this.fb.array([]),
      mixPkgDetailsArr: this.fb.array([])
    });
    this.getChangeOrderTaskByProductType(this.OtherData.orderId, this.productTypeId, this.ProductItem.get('skewkeyName').value, 'Substraction');
  }

  onChange_Action(productItem) {
    (productItem as FormGroup).setControl('tasksArr', new FormArray([]));
    this.actionType = this.ProductItem.value.taskAction;
    if (this.actionType === 'ReleaseMaterial') {
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

  get mixLotDetailsArr(): FormArray {
    return this.questionForm.get('mixLotDetailsArr') as FormArray;
  }

  get jointQuestions(): FormArray {
    return this.questionJointForm.get('jointQuestions') as FormArray;
  }

  get mixPkgDetailsArr(): FormArray {
    return this.questionJointForm.get('mixPkgDetailsArr') as FormArray;
  }

  get completeParamArr(): FormArray {
    return this.questionJointForm.get('completeParamArr') as FormArray;
  }

  addTaskItemForCurrentTask(): void {
    let arrayItem;
    arrayItem = this.ProductItem.get('tasksArr') as FormArray;
    this.productTypeTaskList.forEach((item) => {
      arrayItem.push(this.createTaskItemsForCurrentTask(this.ProductItem.value.skewkeyName, item));
    });
  }

  createTaskItemsForCurrentTask(skewkeyname, productTypeTaskList): FormGroup {
   const uniqId = this.appCommonService.randomNumber();
    // tslint:disable-next-line:max-line-length
    this.addtionAssignedQty = this.ProductItem.value.taskCount === 1 ? Math.abs(this.ProductItem.value.orderedQty - this.ProductItem.value.totalAssignedQty) : 0;
    return this.fb.group({
      'taskId': new FormControl(productTypeTaskList.TaskId),
      'taskType': new FormControl(productTypeTaskList.TaskTypeId),
      'taskTypeName': new FormControl(productTypeTaskList.TaskTypeName),
      'taskStatus': new FormControl(productTypeTaskList.TaskStatus),
      'employee': new FormControl(productTypeTaskList.EmpId),
      'employeeName': new FormControl(productTypeTaskList.EmpName),
      'assignedQty': new FormControl(productTypeTaskList.AssignedQty),
      'addedQty': new FormControl(productTypeTaskList.TaskId ? 0 : null, [Validators.required]),
      // tslint:disable-next-line:max-line-length
      'releaseQty': new FormControl(this.ProductItem.value.taskCount === 1 ? Math.abs(this.ProductItem.value.orderedQty - this.ProductItem.value.totalAssignedQty) : 0, Validators.required),
      'pkgType': new FormControl(productTypeTaskList.PkgtypeId),
      'pkgTypeName': new FormControl(productTypeTaskList.PkgTypeName),
      'actiontype': new FormControl('ReleaseMaterial'),
      uniqueId: uniqId,
      // tslint:disable-next-line:max-line-length
      isSameLot: skewkeyname === 'OIL' ? this.PkgPerTask(this.ProductItem, productTypeTaskList, uniqId, 0) :
                 skewkeyname === 'BUD1' ? this.lotsPerTask(this.ProductItem, productTypeTaskList, uniqId, 0) : null,
    });
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
      const con = (controla.controls[taskIndex] as FormGroup);
      if (this.appCommonService.getSessionStorage('selectedReleaseLotsArray')) {
        const selectedLots1 = JSON.parse(this.appCommonService.getSessionStorage('selectedReleaseLotsArray'));
        selectedLots1.forEach((item1, index1) => {
          item1.forEach((p, index2) => {
            if (p.UniqueId === con.value.uniqueId) {
              item1.splice(index2, 1);
            }
          });
        });
        this.appCommonService.setSessionStorage('selectedReleaseLotsArray', JSON.stringify(selectedLots1));
      }
      controla.removeAt(taskIndex);
    }
  }

  getChangeOrderTaskByProductType(orderId, productTypeId, skewKeyName, actionType) {
    this.selectedLotDetails = [];
    this.selectedLotMixPkgDetails = [];

    let productTaskList = [];
    this.selectedJointPkgDetails = [];
    this.selectedJointMixPkgDetails = [];
    this.loaderService.display(true);
    this.orderService.getChangeOrderTasksByProductType(orderId, productTypeId, skewKeyName, actionType).subscribe(
      data => {
        if (data !== 'No data found!') {
          productTaskList = data.Table;
          this.loaderService.display(false);
          if (productTaskList.length > 0) {
            this.productTypeTaskList = productTaskList;
            if (this.ProductItem.get('skewkeyName').value === 'BUD') {
              this.selectedLotDetails = data.Table1;
              this.selectedLotMixPkgDetails = data.Table2;
            } else  if (this.ProductItem.get('skewkeyName').value === 'JOINTS' ) {
              this.selectedJointPkgDetails = data.Table1;
              this.selectedJointMixPkgDetails = data.Table2;
            } else  {
              this.selectedPkgDetails = data.Table1;
            }
            this.actionNameValue.push({ label: 'Release Material', value: 'ReleaseMaterial' });
            this.ProductItem.controls['taskAction'].patchValue('ReleaseMaterial');
          } else {
           // this.ProductItem.controls['taskAction'].patchValue('None');
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
    debugger;
    let assQty = 0;
    this.addtionAssignedQty = 0;

    if (rowData.value.taskStatus === 'COMPLETED' || rowData.value.taskStatus === 'REVIEW PENDING') {
      this.isCompletedOrReviewTask = true;
    } else {
      this.isCompletedOrReviewTask = false;
    }
    this.tasksArr.controls.forEach((data) => {
      assQty = Number(assQty) + Number((data as FormGroup).controls['releaseQty'].value);
    });
    this.addtionAssignedQty = assQty;
    const strainId = parentRowData.value.strain;
    this.brandStrainLots = [];
    this.brandStrainLots = this.selectedLotDetails.filter(r => r.TaskId === rowData.value.taskId);

    if (rowData.value.actiontype === 'ReleaseMaterial') {
      const employeeBox = (rowData as FormGroup).controls['releaseQty'];
      const validators = !rowData.value.releaseQty ? Validators.compose([Validators.required]) : null;
      employeeBox.setValidators(validators);
      employeeBox.updateValueAndValidity();
    }

    this.selLotBrandStrainRow.BrandId = 0;
    this.selLotBrandStrainRow.StrainId = strainId;
    this.selLotBrandStrainRow.ProductTypeId = parentRowData.value.productType;
    this.selLotBrandStrainRow.UniqueId = rowData.value.uniqueId;
    this.selLotBrandStrainRow.RequireWt = 0;
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

    if (rowData.value.actiontype === 'ReleaseMaterial') {
      if ( this.isCompletedOrReviewTask) {
        this.selLotBrandStrainRow.combinationTotalAssignedWt = Number(rowData.value.releaseQty);
      } else {
        const totalPkgWt = Number(rowData.value.releaseQty) * Number(parentRowData.value.pkgSize) * Number(parentRowData.value.itemQty);
        this.selLotBrandStrainRow.combinationTotalAssignedWt = Number(totalPkgWt);
      }
    }
debugger;
    this.questionForm = this.fb.group({
      questions: this.fb.array(this.brandStrainLots.map(this.createQuestionControl(this.fb))),
      mixLotDetailsArr:  this.fb.array(
        _.uniqBy(this.selectedLotMixPkgDetails, 'MixPkgId').map((childObject, childIndex) => {
          return this.createLotMixItem(childObject, childIndex);
        })
      )
    });
   // this.syncAllLotWeight();
    this.showLotSelectionModel = true;
  }

  createLotMixItem(childObject, childIndex): FormGroup {
    let answerbox;
    const lotMixSelectedDetails = this.selectedMixLotsArray.get(this.selLotBrandStrainRow.UniqueId);

        if (lotMixSelectedDetails) {
          const lotRowDetails = [];
          lotMixSelectedDetails.forEach(data => {
            if (childObject.MixPkgId === data.MixPkgId ) {
            lotRowDetails.push(data);
            }
          });

          if (lotRowDetails.length) {
            const Qty = 1 ;
            answerbox = [Qty, Validators.compose([Validators.max(1)])];
          } else {
            answerbox = [null, Validators.compose([Validators.max(1)])];
          }
        } else {
          answerbox = [null, Validators.compose([Validators.max(1)])];
        }

    return this.fb.group({
      srno: childIndex,
      mixPkgId: childObject.MixPkgId ? childObject.MixPkgId : 0,
      SelectedQty: 1,
      mixPkgCount: answerbox
    });
  }

  createQuestionControl(fb: FormBuilder) {
    return (question, index) => {
      let checkbox;
      let answerbox;
      let previousWt = 0;
      const lotSelectedDetails = this.selectedLotsArray.get(this.selLotBrandStrainRow.UniqueId);

      if (!this.isCompletedOrReviewTask) {
        if (lotSelectedDetails) {
          const lotRowDetails = [];
          lotSelectedDetails.forEach(data => {
            if (data.Index === index) {
            lotRowDetails.push(data);
            }
          });

          if (lotRowDetails.length) {
            const lotWt = lotRowDetails[0].SelectedQty;
            previousWt = lotWt;
            checkbox = lotRowDetails[0].Selected;
            answerbox = [lotWt, Validators.compose([Validators.max(question.AvailableWt)])];
          } else {
            checkbox = question.selected;
            answerbox = [null, Validators.compose([Validators.max(question.AvailableWt)])];
          }
        } else {
          checkbox = question.selected;
          answerbox = [null, Validators.compose([Validators.max(question.AvailableWt)])];
        }
      } else {
        if (lotSelectedDetails) {
          const lotRowDetails = [];
          lotSelectedDetails.forEach(data => {
            if (data.Index === index) {
            lotRowDetails.push(data);
            }
          });

          if (lotRowDetails.length) {
            const lotWt = lotRowDetails[0].SelectedQty;
            previousWt = lotWt;
            checkbox = lotRowDetails[0].Selected;
            answerbox = [lotWt, Validators.compose([Validators.max(question.ProcessedQty)])];
          } else {
            checkbox = question.selected;
            answerbox = [null, Validators.compose([Validators.max(question.ProcessedQty)])];
          }
        } else {
          checkbox = question.selected;
          answerbox = [null, Validators.compose([Validators.max(question.ProcessedQty)])];
        }
      }

      return fb.group({
        question: checkbox, answer: answerbox, questionNumber: index, LotNo: question.LotId,
        AvailWt: question.AvailableWt, previousValue: previousWt || 0, SelectedWt: question.AssignedWt,
        GrowerLotNo: question.GrowerLotNo, LotNoteCount: question.LotNoteCount, SelectedQty: question.ProcessedQty,
      });
    };
  }

  syncAllLotWeight() {
    const selectedLots = JSON.parse(this.appCommonService.getSessionStorage('selectedReleaseLotsArray'));

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

  submit(form) {
    const lotDetails = [];
    let totalLotWt = 0;
    let loMaxWtFlag = false;
    let lotSelectFlag = false;
    let noLotSelected = false;

    if (this.questionForm.valid) {
      form.value.questions.forEach(result => {
        totalLotWt += Number(result.answer) ? Number(result.answer) : 0;
        if (result.answer) {
          noLotSelected = true;
        }
        if (Number(result.answer) > 0 && !result.answer) {
          lotSelectFlag = true;
          return;
        }
      });

      form.value.mixLotDetailsArr.forEach(result => {
        totalLotWt += Number(result.mixPkgCount) ? Number(result.mixPkgCount) : 0;
        if (result.mixPkgCount) {
          noLotSelected = true;
        }
        if (Number(result.mixPkgCount) > 0 && !result.mixPkgCount) {
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
          this.selectedLotsArray.forEach(result1 => {
            result1.forEach(result3 => {
              if (result3.LotNo === result.LotNo) {
                totalSelectedLotWt += Number(result3.SelectedWt);
              }
            });
          });

          if (Number(totalSelectedLotWt) > 0) {
            totalSelectedLotWt = Number(totalSelectedLotWt) - Number(result.answer);
          } else {
            totalSelectedLotWt = Number(result.answer);
          }
          if (this.isCompletedOrReviewTask) {
            if (Number(totalSelectedLotWt) > result.SelectedQty) {
              const answerBox = (this.questionForm.get('questions.' + index) as FormGroup).controls['answer'];
              (answerBox as FormControl).setErrors({ 'lotmaxwtexceeded': true });
              loMaxWtFlag = true;
              this.msgs = [];
              this.msgs.push({
                severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: (Number(result.SelectedQty) - Number(totalSelectedLotWt)) + ' Qty available for lot ' + result.GrowerLotNo
              });
              return;
            }
          } else {
          if (Number(totalSelectedLotWt) > result.SelectedWt) {
            const answerBox = (this.questionForm.get('questions.' + index) as FormGroup).controls['answer'];
            (answerBox as FormControl).setErrors({ 'lotmaxwtexceeded': true });
            loMaxWtFlag = true;
            this.msgs = [];
            this.msgs.push({
              severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: (Number(result.SelectedWt) - Number(totalSelectedLotWt)) + ' (gms) weight available for lot ' + result.GrowerLotNo
            });
            return;
          }
        }

          const lotListId = 0;
          if (Number(result.answer) > 0) {
          lotDetails.push(
            {
              LotListId: lotListId,
              LotNo: result.LotNo,
              GrowerLotNo: result.GrowerLotNo,
              AvailWt: result.AvailWt,
              SelectedWt: this.isCompletedOrReviewTask ?
                          Number(result.answer) * Number(this.ProductItem.value.pkgSize) * Number(this.ProductItem.value.itemQty) :
                          Number(result.answer),
              Selected: true,
              Index: result.questionNumber,
              StrainId: result.StrainId,
              StrainName: this.selLotBrandStrainRow.StrainName,
              BrandId: this.selLotBrandStrainRow.BrandId,
              GeneticsId: this.selLotBrandStrainRow.GeneticsId,
              GeneticsName: this.selLotBrandStrainRow.GeneticsName,
              ProductTypeId: this.selLotBrandStrainRow.ProductTypeId,
              UniqueId: this.selLotBrandStrainRow.UniqueId,
              SelectedQty: Number(result.answer)
            }
          );
          }
        }
      });
      const mixLotDetails = [];
      form.value.mixLotDetailsArr.forEach((result, index) => {
        if (result.mixPkgCount > 0) {
          mixLotDetails.push({
            MixPkgId: result.MixPkgId,
            ProductTypeId: this.selLotBrandStrainRow.ProductTypeId,
            UniqueId: this.selLotBrandStrainRow.UniqueId,
            Qty: 1,
            IndexCode: index
          });
        }
      });
     // this.selectedMixLotsArray.set(this.selLotBrandStrainRow.UniqueId, mixLotDetails);
      this.selectedLotsArray.set(this.selLotBrandStrainRow.UniqueId, {
        lotDetails, mixLotDetails});
      if (this.appCommonService.getSessionStorage('selectedReleaseLotsArray')) {
        const selectedLots1 = JSON.parse(this.appCommonService.getSessionStorage('selectedReleaseLotsArray'));
        lotDetails.forEach((item, index) => {
          selectedLots1.forEach((item1, index1) => {
            if (item1.length > 0) {
            item1.lotDetails.forEach((p, index2) => {
              if (lotDetails.filter(r => (p.UniqueId === r.UniqueId && p.LotNo === r.LotNo)).length <= 0) {
               if ( lotDetails.filter(r => p.UniqueId === r.UniqueId ).length > 0) {
                item1.lotDetails.splice(index2, 1);
                }
              }
              if (p.UniqueId === item.UniqueId && p.LotNo === item.LotNo) {
                item1.lotDetails.splice(index2, 1);
                // (index2);
                item1.lotDetails.push(item);
              } else {
                if (item1.lotDetails.filter(r => r.UniqueId === item.UniqueId && r.LotNo === item.LotNo).length <= 0) {
                  item1.lotDetails.push(item);
                }
              }
            });
          }
          });
        });

        mixLotDetails.forEach((item, index) => {
          selectedLots1.forEach((item1, index1) => {
            if (item1) {
            item1.mixLotDetails.forEach((p, index2) => {
              if (p.UniqueId === item.UniqueId && p.MixPkgId === item.MixPkgId) {
                item1.mixLotDetails.splice(index2, 1);
                // (index2);
                item1.mixLotDetails.push(item);
              } else {
                if (item1.mixLotDetails.filter(r => r.UniqueId === item.UniqueId && r.MixPkgId === item.MixPkgId).length <= 0) {
                  item1.mixLotDetails.push(item);
                }
              }
            });
          }
          });
        });

        this.appCommonService.setSessionStorage('selectedReleaseLotsArray', JSON.stringify(selectedLots1));
      } else {
        this.appCommonService.setSessionStorage('selectedReleaseLotsArray', JSON.stringify(Array.from(this.selectedLotsArray.values())));
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

  addedQty_onChange(rowData, changedOrderqty, orderQty) {
    let assQty = 0;
    let assigedQty = 0;
    this.tasksArr.controls.forEach((data) => {
      assQty = Number(assQty) + Number((data as FormGroup).controls['releaseQty'].value);
      assigedQty = Number(assigedQty) + Number((data as FormGroup).controls['assignedQty'].value);
    });
    this.addtionAssignedQty = assQty;
    const employeeBox = (rowData as FormGroup).controls['releaseQty'];
    if (assQty > (assigedQty - Number(orderQty))) {
      setTimeout(() => {
        employeeBox.setErrors({ 'assignedQtyExceeded': true });
      }, 0);
      return;
    } else {
      this.tasksArr.controls.forEach((data) => {
        (data as FormGroup).controls['releaseQty'].setErrors(null);
      });
      if (this.ProductItem.value.skewkeyName === 'BUD') {
          let selectedLots1 = [];
          if (this.appCommonService.getSessionStorage('selectedReleaseLotsArray')) {
            selectedLots1 = JSON.parse(this.appCommonService.getSessionStorage('selectedReleaseLotsArray'));
            if (selectedLots1) {
            selectedLots1.forEach((item, index) => {
              if (item) {
              for (let i = 0; i < item.lotDetails.length; i++) {
                if (item.lotDetails[i].UniqueId === rowData.value.uniqueId) {
                  item.lotDetails.splice(i, 1);
                  i--;
                }
              }
              for (let i = 0; i < item.mixlotDetails.length; i++) {
                if (item.mixlotDetails[i].UniqueId === rowData.value.uniqueId) {
                  item.mixlotDetails.splice(i, 1);
                  i--;
                }
              }
            }
            });
          }
            this.selectedLotsArray.delete(rowData.value.uniqueId);
            this.appCommonService.setSessionStorage('selectedReleaseLotsArray', JSON.stringify(selectedLots1));
          }
          setTimeout(() => {
            // this.syncAllLotWeight();
          }, 0);
      //  this.lotsPerTask1(this.ProductItem, rowData, 0); remprory remove working file
      } else  if (this.ProductItem.value.skewkeyName === 'JOINTS') {
          let selectedJointPkgs: any;
          if (this.appCommonService.getSessionStorage('selectedJointsPkgReleaseArray')) {
            selectedJointPkgs = JSON.parse(this.appCommonService.getSessionStorage('selectedJointsPkgReleaseArray'));
            if (selectedJointPkgs) {
            selectedJointPkgs.forEach((item, index) => {
              if (item) {
                if (item.lotDetails) {
                  for (let i = 0; i <  item.lotDetails.length; i++) {
                    if (item.lotDetails[i].UniqueId === rowData.value.uniqueId) {
                      item.lotDetails.splice(i, 1);
                      i--;
                    }
                  }
            }
          }
            });
            selectedJointPkgs.forEach((item, index) => {
              if (item) {
                if (item.mixPkgDetails) {
              for (let i = 0; i < item.mixPkgDetails.length; i++) {
                if (item.mixPkgDetails[i].UniqueId === rowData.value.uniqueId) {
                  item.mixPkgDetails.splice(i, 1);
                  i--;
              }
          }
        }
      }
        });
        }
          this.selectedJointPkgArray.delete(rowData.value.uniqueId);
            this.appCommonService.setSessionStorage('selectedJointsPkgReleaseArray', JSON.stringify(selectedJointPkgs));
            return;
          }
        // this.lotsPerTask1(this.ProductItem, rowData, 0);
      } else {
        let selectedLots1 = [];
        if (this.appCommonService.getSessionStorage('selectedReleasePkgsArray')) {
          selectedLots1 = JSON.parse(this.appCommonService.getSessionStorage('selectedReleasePkgsArray'));
          selectedLots1.forEach((item, index) => {

            for (let i = 0; i < item.length; i++) {
              if (item[i].UniqueId === rowData.value.uniqueId) {
                item.splice(i, 1);
                i--;
              }
            }
          });
          this.selectedPkgsArray.delete(rowData.value.uniqueId);
          this.appCommonService.setSessionStorage('selectedReleasePkgsArray', JSON.stringify(selectedLots1));
        }
        setTimeout(() => {
          this.syncAllPkgWeight();
        }, 0);
      this.pkgPerTask1(this.ProductItem, rowData, 0);
    }
  }
  }

  absValue(value) {
    return Math.abs(Number(value));
  }

  lotsPerTask(productItem, rowData, uniqId , i) {
    let brandStrainLots = [];
    let unselectedwt = 0;
    brandStrainLots = this.selectedLotDetails.filter(r => r.TaskId === rowData.TaskId);
    const releaseQty = productItem.value.taskCount === 1 ? Math.abs(this.ProductItem.value.orderedQty - this.ProductItem.value.totalAssignedQty) : 0;

    if (brandStrainLots) {
      if (brandStrainLots.length === 1) {
        const lotDetails = [];
        const lotListId = 0;
        unselectedwt = Number(releaseQty) * Number(productItem.value.pkgSize) * Number(productItem.value.itemQty);
      lotDetails.push(
          {
            LotListId: lotListId,
            LotNo: brandStrainLots[0].LotId,
            GrowerLotNo: brandStrainLots[0].GrowerLotNo,
            AvailWt: null,
            SelectedWt: Number(releaseQty) * Number(productItem.value.pkgSize) * Number(productItem.value.itemQty),
            Selected: true,
            Index: 0,
            StrainId: brandStrainLots[0].StrainId,
            StrainName: brandStrainLots[0].StrainName,
            BrandId: productItem.value.brand,
            GeneticsId: brandStrainLots[0].GeneticsId,
            GeneticsName: brandStrainLots[0].GeneticsName,
            ProductTypeId: productItem.value.productType,
            UniqueId: uniqId,
            SelectedQty: Number(releaseQty)
          }
        );

        this.selectedLotsArray.set(uniqId, lotDetails);
        let selectedLots1 = [];
        if (this.appCommonService.getSessionStorage('selectedReleaseLotsArray')) {
          selectedLots1 = JSON.parse(this.appCommonService.getSessionStorage('selectedReleaseLotsArray'));
          lotDetails.forEach((item, index) => {
            selectedLots1.forEach((item1, index1) => {
              if (item1.length > 0) {
              item1.forEach((p, index2) => {
                if (lotDetails.filter(r => p.UniqueId === r.UniqueId && p.LotNo === r.LotNo).length <= 0) {
                  if ( lotDetails.filter(r => p.UniqueId === r.UniqueId ).length > 0) {
                    item1.splice(index2, 1);
                    }
                }
                if (p.UniqueId === item.UniqueId && p.LotNo === item.LotNo) {
                  item1.splice(index2, 1);
                  // (index2);
                  if (unselectedwt > 0) {
                  item1.push(item);
                  }
                } else {
                  if (item1.filter(r => r.UniqueId === item.UniqueId && r.LotNo === item.LotNo).length <= 0) {
                    if (unselectedwt > 0) {
                    item1.push(item);
                    }
                  }
                }
              });
            } else {
              if (unselectedwt > 0) {
                item1.push(item);
                }
            }
            });
          });
          this.appCommonService.setSessionStorage('selectedReleaseLotsArray', JSON.stringify(selectedLots1));
        } else {
          this.appCommonService.setSessionStorage('selectedReleaseLotsArray', JSON.stringify(Array.from(this.selectedLotsArray.values())));
        }
        return true;
      } else {
        return false;
      }
    }
  }

  PkgPerTask(productItem, rowData, uniqId , i) {
    let brandStrainPkgs = [];
    let unselectedwt = 0;
    brandStrainPkgs = this.selectedPkgDetails.filter(r => r.TaskId === rowData.TaskId);
    const releaseQty = productItem.value.taskCount === 1 ? Math.abs(this.ProductItem.value.orderedQty - this.ProductItem.value.totalAssignedQty) : 0;

    if (brandStrainPkgs) {
      if (brandStrainPkgs.length === 1) {
        const pkgDetails = [];
        const lotListId = 0;
        unselectedwt = Number(releaseQty) * Number(productItem.value.pkgSize) * Number(productItem.value.itemQty);
        pkgDetails.push(
          {
            LotListId: lotListId,
            OilPkgId: brandStrainPkgs[0].OilPkgId,
            GrowerLotNo: brandStrainPkgs[0].GrowerLotNo,
            AvailWt: null,
            SelectedWt: Number(releaseQty) * Number(productItem.value.pkgSize) * Number(productItem.value.itemQty),
            Selected: true,
            Index: 0,
            StrainId: brandStrainPkgs[0].StrainId,
            StrainName: brandStrainPkgs[0].StrainName,
            BrandId: productItem.value.brand,
            GeneticsId: brandStrainPkgs[0].GeneticsId,
            GeneticsName: brandStrainPkgs[0].GeneticsName,
            ProductTypeId: productItem.value.productType,
            UniqueId: uniqId,
          }
        );

        this.selectedPkgsArray.set(uniqId, pkgDetails);
        let selectedLots1 = [];
        if (this.appCommonService.getSessionStorage('selectedReleasePkgsArray')) {
          selectedLots1 = JSON.parse(this.appCommonService.getSessionStorage('selectedReleasePkgsArray'));
          pkgDetails.forEach((item, index) => {
            selectedLots1.forEach((item1, index1) => {
              if (item1.length > 0) {
              item1.forEach((p, index2) => {
                if (pkgDetails.filter(r => p.UniqueId === r.UniqueId && p.OilPkgId === r.OilPkgId).length <= 0) {
                  if ( pkgDetails.filter(r => p.UniqueId === r.UniqueId ).length > 0) {
                    item1.splice(index2, 1);
                    }
                }
                if (p.UniqueId === item.UniqueId && p.OilPkgId === item.OilPkgId) {
                  item1.splice(index2, 1);
                  // (index2);
                  if (unselectedwt > 0) {
                  item1.push(item);
                  }
                } else {
                  if (item1.filter(r => r.UniqueId === item.UniqueId && r.OilPkgId === item.OilPkgId).length <= 0) {
                    if (unselectedwt > 0) {
                    item1.push(item);
                    }
                  }
                }
              });
            } else {
              if (unselectedwt > 0) {
                item1.push(item);
                }
              }
            });
          });
          this.appCommonService.setSessionStorage('selectedReleasePkgsArray', JSON.stringify(selectedLots1));
        } else {
          this.appCommonService.setSessionStorage('selectedReleasePkgsArray', JSON.stringify(Array.from(this.selectedPkgsArray.values())));
        }
        return true;
      } else {
        return false;
      }
    }
  }

  lotsPerTask1(productItem, rowData, i) {
    let brandStrainLots = [];
    let unselectedwt = 0;
    brandStrainLots = this.selectedLotDetails.filter(r => r.TaskId === rowData.value.taskId);

    if (brandStrainLots) {
      if (brandStrainLots.length === 1) {
        const lotDetails = [];
        const lotListId = 0;
        unselectedwt = Number(rowData.value.releaseQty) * Number(productItem.value.pkgSize) * Number(productItem.value.itemQty);
        lotDetails.push(
          {
            LotListId: lotListId,
            LotNo: brandStrainLots[0].LotId,
            GrowerLotNo: brandStrainLots[0].GrowerLotNo,
            AvailWt: null,
            SelectedWt: Number(rowData.value.releaseQty) * Number(productItem.value.pkgSize) * Number(productItem.value.itemQty),
            Selected: true,
            Index: 0,
            StrainId: brandStrainLots[0].StrainId,
            StrainName: brandStrainLots[0].StrainName,
            BrandId: productItem.value.brand,
            GeneticsId: brandStrainLots[0].GeneticsId,
            GeneticsName: brandStrainLots[0].GeneticsName,
            ProductTypeId: productItem.value.productType,
            UniqueId: rowData.value.uniqueId,
            SelectedQty: Number(rowData.value.releaseQty)
          }
        );

        this.selectedLotsArray.set(this.selLotBrandStrainRow.UniqueId, lotDetails);
        let selectedLots1 = [];
        if (this.appCommonService.getSessionStorage('selectedReleaseLotsArray')) {
          selectedLots1 = JSON.parse(this.appCommonService.getSessionStorage('selectedReleaseLotsArray'));
          lotDetails.forEach((item, index) => {
            selectedLots1.forEach((item1, index1) => {
              if (item1.length > 0) {
              item1.forEach((p, index2) => {
                if (lotDetails.filter(r => p.UniqueId === r.UniqueId && p.LotNo === r.LotNo).length <= 0) {
                  if ( lotDetails.filter(r => p.UniqueId === r.UniqueId ).length > 0) {
                    item1.splice(index2, 1);
                    }
                }
                if (p.UniqueId === item.UniqueId && p.LotNo === item.LotNo) {
                  item1.splice(index2, 1);
                  if (unselectedwt > 0) {
                    item1.push(item);
                  }
                } else {
                  if (item1.filter(r => r.UniqueId === item.UniqueId && r.LotNo === item.LotNo).length <= 0) {
                    item1.push(item);
                  }
                }
              });
            } else {
              item1.push(item);
            }
            });
          });
          this.appCommonService.setSessionStorage('selectedReleaseLotsArray', JSON.stringify(selectedLots1));
        } else {
          this.appCommonService.setSessionStorage('selectedReleaseLotsArray', JSON.stringify(Array.from(this.selectedLotsArray.values())));
        }
        return true;
      } else {
        return false;
      }
    }
  }

  // OIl

  openPkgSelection(parentRowData, rowData, rowIndex) {

    let assQty = 0;
    this.tasksArr.controls.forEach((data) => {
      assQty = Number(assQty) + Number((data as FormGroup).controls['releaseQty'].value);
    });
    if (assQty > Math.abs(Number(parentRowData.value.changeOrderQty))) {
      return;
    }

    const strainId = parentRowData.value.strain;
    this.brandStrainLots = [];
    this.brandStrainPkgs =  this.selectedPkgDetails.filter(r => r.TaskId === rowData.value.taskId);
    this.selPkgBrandStrainRow.BrandId = 0;
    this.selPkgBrandStrainRow.StrainId = strainId;
    this.selPkgBrandStrainRow.selectedRowIndex = rowIndex;
    this.selPkgBrandStrainRow.ProductTypeId = parentRowData.value.productType;
    this.selPkgBrandStrainRow.UniqueId = rowData.value.uniqueId;

    if (rowData.value.actiontype === 'ReleaseMaterial') {
      const employeeBox = (rowData as FormGroup).controls['releaseQty'];
      const validators = !rowData.value.releaseQty ? Validators.compose([Validators.required]) : null;
      employeeBox.setValidators(validators);
      employeeBox.updateValueAndValidity();
    }

    this.selPkgBrandStrainRow.RequireWt = 0;
    if (rowData.value.actiontype === 'ReleaseMaterial') {
      const totalPkgWt = Number(rowData.value.releaseQty) * Number(parentRowData.value.pkgSize) * Number(parentRowData.value.itemQty);
      this.selPkgBrandStrainRow.combinationTotalAssignedWt = Number(totalPkgWt);
      // this.selLotBrandStrainRow.combinationTotalAssignedWt = rowData.value.releaseQty;
    }
    this.selectedPkgDetails.filter((value, key) => {
      return value.TaskId === rowData.value.taskId;
    })
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

    this.syncAllPkgWeight();
    this.showPkgSelectionModel = true;
  }

  createQuestionPkgControl(fb: FormBuilder) {
    return (question, index) => {
      let checkbox;
      let answerbox;
      let previousWt = 0;
      const pkgSelectedDetails = this.selectedPkgsArray.get(this.selPkgBrandStrainRow.UniqueId); // [this.selPkgBrandStrainRow.selectedRowIndex];
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
          AvailWt: question.AssignedOilWt,  previousValue: previousWt || 0, SelectedWt : question.AssignedOilWt,
          StrainId: question.StrainId, StrainName: question.StrainName, GeneticsId: question.GeneticsId, GeneticsName: question.GeneticsName,
          OilPkgId: question.OilPkgId
        });
    };
  }

  submitPkg(form) {
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
                const answerBox = (this.questionPkgForm.get('pkgQuestions.' + index) as FormGroup).controls['answer'];

                (answerBox as FormControl).setErrors({ 'oilpkgmaxwtexceeded': true });

                loMaxWtFlag = true;
                this.msgs = [];
                this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: (Number(result.AvailWt) - Number(totalSelectedOilPkgWt)) + ' (gms) weight available for oil pkg ' + result.OilPkgCode });
                  return;
          }
          if (result.answer > 0) {
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
              GeneticsId:  this.selPkgBrandStrainRow.GeneticsId,
              ProductTypeId: this.selPkgBrandStrainRow.ProductTypeId,
              UniqueId: this.selPkgBrandStrainRow.UniqueId,
            }
          );
          }
        }
      });
      if (loMaxWtFlag) {
        return;
      }
      this.selectedPkgsArray.set(this.selPkgBrandStrainRow.UniqueId , pkgDetails);

      if (this.appCommonService.getSessionStorage('selectedReleasePkgsArray')) {
        const selectedLots1 = JSON.parse(this.appCommonService.getSessionStorage('selectedReleasePkgsArray'));
        pkgDetails.forEach((item, index) => {
          selectedLots1.forEach((item1, index1) => {
            item1.forEach((p, index2) => {
              if (pkgDetails.filter(r => p.UniqueId === r.UniqueId && p.OilPkgId === r.OilPkgId).length <= 0) {
                if ( pkgDetails.filter(r => p.UniqueId === r.UniqueId ).length > 0) {
                  item1.splice(index2, 1);
                  }
              }
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
        this.appCommonService.setSessionStorage('selectedReleasePkgsArray', JSON.stringify(selectedLots1));
      } else {
        this.appCommonService.setSessionStorage('selectedReleasePkgsArray', JSON.stringify(Array.from(this.selectedPkgsArray.values())));
      }
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
      this.appCommonService.setSessionStorage('selectedPkgsArray', JSON.stringify(Array.from(this.selectedPkgsArray.values())));
      }
      controla.removeAt(taskIndex);
    }
  }

  syncAllPkgWeight() {
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

  pkgPerTask1(productItem, rowData, i) {
    let brandStrainPkgs = [];
    let unselectedwt = 0;
    brandStrainPkgs = this.selectedPkgDetails.filter(r => r.TaskId === rowData.value.taskId);

    if (brandStrainPkgs) {
      if (brandStrainPkgs.length === 1) {
        const PkgDetails = [];
        const lotListId = 0;
        unselectedwt = Number(rowData.value.releaseQty) * Number(productItem.value.pkgSize) * Number(productItem.value.itemQty);
        PkgDetails.push(
          {
            LotListId: lotListId,
            OilPkgId: brandStrainPkgs[0].OilPkgId,
            GrowerLotNo: brandStrainPkgs[0].GrowerLotNo,
            AvailWt: null,
            SelectedWt: Number(rowData.value.releaseQty) * Number(productItem.value.pkgSize) * Number(productItem.value.itemQty),
            Selected: true,
            Index: 0,
            StrainId: brandStrainPkgs[0].StrainId,
            StrainName: brandStrainPkgs[0].StrainName,
            BrandId: productItem.value.brand,
            GeneticsId: brandStrainPkgs[0].GeneticsId,
            GeneticsName: brandStrainPkgs[0].GeneticsName,
            ProductTypeId: productItem.value.productType,
            UniqueId: rowData.value.uniqueId,
          }
        );

        this.selectedPkgsArray.set(rowData.value.uniqueId, PkgDetails);
        let selectedLots1 = [];
        if (this.appCommonService.getSessionStorage('selectedReleasePkgsArray')) {
          selectedLots1 = JSON.parse(this.appCommonService.getSessionStorage('selectedReleasePkgsArray'));
          PkgDetails.forEach((item, index) => {
            selectedLots1.forEach((item1, index1) => {
              if (item1.length > 0) {
              item1.forEach((p, index2) => {
                if (PkgDetails.filter(r => p.UniqueId === r.UniqueId && p.OilPkgId === r.OilPkgId).length <= 0) {
                  if ( PkgDetails.filter(r => p.UniqueId === r.UniqueId ).length > 0) {
                    item1.splice(index2, 1);
                    }
                }
                if (p.UniqueId === item.UniqueId && p.OilPkgId === item.OilPkgId) {
                  item1.splice(index2, 1);
                  if (unselectedwt > 0) {
                    item1.push(item);
                  }
                } else {
                  if (item1.filter(r => r.UniqueId === item.UniqueId && r.LotNo === item.OilPkgId).length <= 0) {
                    item1.push(item);
                  }
                }
              });
            } else {
              item1.push(item);
            }
            });
          });
          this.appCommonService.setSessionStorage('selectedReleasePkgsArray', JSON.stringify(selectedLots1));
        } else {
          this.appCommonService.setSessionStorage('selectedReleasePkgsArray', JSON.stringify(Array.from(this.selectedPkgsArray.values() )));
        }
        return true;
      } else {
        return false;
      }
    }
  }
  // JOint Package
  openjointLotSelection(parentRowData, rowData, rowIndex) {
      let assQty = 0;
      this.tasksArr.controls.forEach((data) => {
        assQty = Number(assQty) + Number((data as FormGroup).controls['releaseQty'].value);
      });
      if (assQty > Math.abs(Number(parentRowData.value.orderedQty))) {
        return;
      }

      const strainId = parentRowData.value.strain;
      this.brandStrainLots = [];
      this.selLotJointBrandStrainRow.pkgSizeRequiredQtyArr = [];
      this.brandStrainLots = this.selectedJointPkgDetails.filter(r => r.TaskId === rowData.value.taskId);

      this.selLotJointBrandStrainRow.BrandId = 0;
      this.selLotJointBrandStrainRow.StrainId = strainId;
      this.selLotJointBrandStrainRow.selectedRowIndex = rowIndex;
      this.selLotJointBrandStrainRow.RequireWt = 0;
      this.selLotJointBrandStrainRow.combinationTotalAssignedQty = 0;
      this.selLotJointBrandStrainRow.ProductTypeId = parentRowData.value.productType;
      this.selLotJointBrandStrainRow.UniqueId = rowData.value.uniqueId;

      if (rowData.value.actiontype === 'ReleaseMaterial') {
        const employeeBox = (rowData as FormGroup).controls['releaseQty'];
        const validators = !rowData.value.releaseQty ? Validators.compose([Validators.required]) : null;
        employeeBox.setValidators(validators);
        employeeBox.updateValueAndValidity();
      }

      if (rowData.value.actiontype === 'ReleaseMaterial') {
         // const totalPkgWt = Number(rowData.value.releaseQty) * Number(parentRowData.value.pkgSize) * Number(parentRowData.value.itemQty);
        this.selLotJointBrandStrainRow.combinationTotalAssignedQty = Number(rowData.value.releaseQty) ;
      }

      this.selectedJointPkgDetails.filter((value, key) =>
      //  value.StrainId === rowData.StrainId)
      value.TaskId  === rowData.value.taskId)
      .map(value => {
        this.selLotJointBrandStrainRow.RequireWt += value.TotalWt;
        this.selLotJointBrandStrainRow.BrandName = '';
        this.selLotJointBrandStrainRow.StrainName = value.StrainName;
        this.selLotJointBrandStrainRow.GeneticsId = value.GeneticsId;
        this.selLotJointBrandStrainRow.GeneticsName = value.GeneticsName;
      });

    this.questionJointForm = this.fb.group({
      jointQuestions: this.fb.array(this.brandStrainLots.map(this.createJointQuestionControl(this.fb))),
      mixPkgDetailsArr: this.fb.array(
        _.uniqBy(this.selectedJointMixPkgDetails, 'MixPkgId')
          .filter(result => result.TaskId === rowData.value.taskId)
          .map((childObject, childIndex) => {
            return this.createMixItem(childObject, childIndex);
          })
      )
    });
    this.showJointSelectionModel = true;
  }

  createJointQuestionControl(fb: FormBuilder) {
    return (question, index) => {
      let checkbox;
      let answerbox;
      let lotSelectedDetails = [];

      if (this.selectedJointPkgArray.get(this.selLotJointBrandStrainRow.UniqueId)) {
        lotSelectedDetails = this.selectedJointPkgArray.get(this.selLotJointBrandStrainRow.UniqueId).lotDetails;
      } else {
        lotSelectedDetails = [];
      }

      if (lotSelectedDetails) {
        const lotRowDetails = [];
        lotSelectedDetails.forEach(data => {
          if (data.Index === index) {
          lotRowDetails.push(data);
          }
        });

        if (lotRowDetails.length) {
          const lotQty = lotRowDetails[0].SelectedQty;
          checkbox = lotRowDetails[0].Selected;
          answerbox = [lotQty, Validators.compose([Validators.max(question.AvailableWt)])];
        } else {
          checkbox = question.selected;
          answerbox = [null, Validators.compose([Validators.max(question.AvailableWt)])];
        }
      } else {
        checkbox = question.selected;
        answerbox = [null, Validators.compose([Validators.max(question.AvailableWt)])];
      }
      return fb.group({
        question: checkbox, answer: answerbox, questionNumber: index, LotNo: question.LotId, UnitValue: question.UnitValue,
        AvailTubesQty: question.AssignedQty, GrowerLotNo: question.GrowerLotNo, LotNoteCount: question.LotNoteCount,
        GeneticsId: question.GeneticsId, GeneticsName: question.GeneticsName, StrainId: question.StrainId, StrainName: question.StrainName,
        ItemQty: question.ItemQty, PkgTypeId: question.PkgTypeId, PkgTypeName: question.PkgTypeName
      });
    };
  }

  createMixItem(childObject, childIndex): FormGroup {
    let checkbox;
    let mixPkgDetails = [];

    if (this.selectedJointPkgArray.get(this.selLotJointBrandStrainRow.UniqueId)) {
      mixPkgDetails = this.selectedJointPkgArray.get(this.selLotJointBrandStrainRow.UniqueId).mixPkgDetails;
    } else {
      mixPkgDetails = [];
    }
    if (mixPkgDetails && mixPkgDetails.length > 0) {
      const lotRowDetails = [];
      mixPkgDetails.forEach(data => {
          lotRowDetails.push(data);
      });

      if (lotRowDetails.length) {
        checkbox = lotRowDetails[0].selected;
      } else {
        checkbox = childObject.selected;
      }
    } else {
      checkbox = childObject.selected;
    }

    return this.fb.group({
      srno: childIndex,
      UnitValue: childObject.TubeUnitValue,
      ItemQty: childObject.TubeItemQty,
      PkgTypeId: childObject.TubePkgTypeId,
      PkgTypeName: childObject.TubePkgTypeName,
      StrainId: childObject.StrainId,
      StrainName: childObject.StrainName,
      GeneticsId: childObject.GeneticsId,
      Qty: childObject.Qty,
      mixPkgCheck: checkbox,
      mixPkgId: childObject.MixPkgId ? childObject.MixPkgId : 0,
      MixPkgNo: childObject.MixPkgNo
    });
  }

  changeValidator(selected, index) {
    const answerbox = this.questionJointForm.get('jointQuestions.' + index).get('answer');
    const availableqty = this.questionJointForm.get('jointQuestions.' + index).get('AvailTubesQty');

   // const validators = selected ? Validators.compose([Validators.required, Validators.min(0.1), Validators.max(availableqty.value)]) : null;
    const validators = Validators.compose([Validators.max(availableqty.value)]);
   answerbox.setValidators(validators);
    answerbox.updateValueAndValidity();
  }

  submitJoint(form) {
    const lotDetails = [];
    const mixPkgDetails = [];
    const totalSumObject = {
      lotTotalQty: 0,
      ItemQty: 0,
      UnitValue: 0,
      PkgTypeName: '',
      productTotalRequiredQty: 0
    };
    if (this.questionJointForm.valid) {
      form.value.jointQuestions.forEach(result => {
         if (result.answer > 0) {
          lotDetails.push(
            {
              ProductTypeId: this.selLotJointBrandStrainRow.ProductTypeId,
              LotNo: result.LotNo,
              GrowerLotNo: result.GrowerLotNo,
              PkgTypeId: result.PkgTypeId,
              UnitValue: result.UnitValue,
              SelectedQty: result.answer,
              Selected: true,
              Index: result.questionNumber,
              StrainId: result.StrainId,
              AvailTubesQty: result.AvailTubesQty,
              StrainName: result.StrainName,
              BrandId: this.selLotBrandStrainRow.BrandId,
              GeneticsId: this.selLotBrandStrainRow.GeneticsId,
              GeneticsName: this.selLotBrandStrainRow.GeneticsName,
              PkgTypeName: result.PkgTypeName,
              ItemQty: result.ItemQty,
              LotNoteCount: result.LotNoteCount,
              UniqueId: this.selLotJointBrandStrainRow.UniqueId
            }
          );
         }
      });

      form.value.mixPkgDetailsArr.forEach(result => {

        if (result.mixPkgCheck === true) {
          mixPkgDetails.push(
            {
              ProductTypeId: this.selLotJointBrandStrainRow.ProductTypeId,
              MixPkgId: result.mixPkgId,
              MixPkgNo: result.MixPkgNo,
              SelectedQty: 1,
              Index: result.srno,
              UnitValue: result.UnitValue,
              ItemQty: result.ItemQty,
              PkgTypeId: result.PkgTypeId,
              PkgTypeName: result.PkgTypeName,
              StrainId: result.StrainId,
              StrainName: result.StrainName,
              GeneticsId: result.GeneticsId,
              selected: true,
              UniqueId: this.selLotJointBrandStrainRow.UniqueId
            }
          );
        }
      });

      this.selectedJointPkgArray.set(this.selLotJointBrandStrainRow.UniqueId, {
        lotDetails: lotDetails,
        mixPkgDetails: mixPkgDetails
      });
      // this.selectedJointPkgArray[this.selLotJointBrandStrainRow.selectedRowIndex] = {
      //   lotDetails: lotDetails,
      //   mixPkgDetails: mixPkgDetails
      // };
      if (this.appCommonService.getSessionStorage('selectedJointsPkgReleaseArray')) {
        const selectedLots1 = JSON.parse(this.appCommonService.getSessionStorage('selectedJointsPkgReleaseArray'));
        lotDetails.forEach((item, index) => {
          selectedLots1.forEach((item1, index1) => {
            if (item1) {
            item1.lotDetails.forEach((p, index2) => {
              if (lotDetails.filter(r => p.UniqueId === r.UniqueId && p.LotNo === r.LotNo).length <= 0) {
                if ( lotDetails.filter(r => p.UniqueId === r.UniqueId ).length > 0) {
                  item1.splice(index2, 1);
                  }
              }
              if (p.UniqueId === item.UniqueId && p.LotNo === item.LotNo) {
                item1.lotDetails.splice(index2, 1);
                // (index2);
                item1.lotDetails.push(item);
              } else {
                if (item1.lotDetails.filter(r => r.UniqueId === item.UniqueId && r.LotNo === item.LotNo).length <= 0) {
                  item1.lotDetails.push(item);
                }
              }
            });
          }
          });
        });

        mixPkgDetails.forEach((item, index) => {
          selectedLots1.forEach((item1, index1) => {
            if (item1) {
            item1.mixPkgDetails.forEach((p, index2) => {
              if (p.UniqueId === item.UniqueId && p.LotNo === item.LotNo) {
                item1.mixPkgDetails.splice(index2, 1);
                // (index2);
                item1.mixPkgDetails.push(item);
              } else {
                if (item1.mixPkgDetails.filter(r => r.UniqueId === item.UniqueId && r.LotNo === item.LotNo).length <= 0) {
                  item1.mixPkgDetails.push(item);
                }
              }
            });
          }
          });
        });

        this.appCommonService.setSessionStorage('selectedJointsPkgReleaseArray', JSON.stringify(selectedLots1));
      } else {
        this.appCommonService.setSessionStorage('selectedJointsPkgReleaseArray', JSON.stringify(Array.from( this.selectedJointPkgArray.values())));
      }
      this.showJointSelectionModel = false;
    } else {
      this.appCommonService.validateAllFields(this.questionJointForm);
    }
  }
}
