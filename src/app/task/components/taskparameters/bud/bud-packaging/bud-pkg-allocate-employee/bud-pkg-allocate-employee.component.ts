import { LoaderService } from './../../../../../../shared/services/loader.service';
import { AppCommonService } from './../../../../../../shared/services/app-common.service';
import { TaskResources } from './../../../../../task.resources';
import { DropdwonTransformService } from './../../../../../../shared/services/dropdown-transform.service';
import { GlobalResources } from './../../../../../../global resource/global.resource';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SelectItem, Message } from 'primeng/api';

@Component({
  moduleId: module.id,
  selector: 'app-bud-pkg-allocate-employee',
  templateUrl: 'bud-pkg-allocate-employee.component.html',
  styles: [`
    .clsLotSelected {
      color: #25bb25 !important;
    }
  `]
})
export class BudPkgAllocateEmployeeComponent implements OnInit, OnDestroy {
  @Input() BudPkgForm: FormGroup;
  public questionForm: FormGroup;

  @Input() AllocateEmpData: any;
  @Output() CancelTask: EventEmitter<any> = new EventEmitter<any>();

  public globalResource: any;
  public employees: SelectItem[];
  public msgs: Message[] = [];

  items = new FormArray([]);

  public showLotSelectionModel = false;
  public brandStrainLots: any;

  public selectedLotsArray: any[] = [];
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
    // Added by Devdan :: 15-Oct-2018
    LotListId: null
  };

  public lotInfo: any = {
    lotId: 0,
    showLotNoteModal: false,
    showLotCommentModal: false
  };

  constructor(
    private fb: FormBuilder,
    private dropdwonTransformService: DropdwonTransformService,
    private appCommonService: AppCommonService,
    private loaderService: LoaderService,
  ) { }

  ngOnInit() {
    this.globalResource = GlobalResources.getResources().en;
    this.assignTaskResources = TaskResources.getResources().en.assigntask;

    this.BudPkgForm.addControl('allocateEmpArr', this.items);
    this.BudPkgForm.addControl('assignToAll', new FormControl(null));

    this.employees = this.dropdwonTransformService.transform(this.AllocateEmpData.employees, 'EmpName', 'EmpId', '-- Select --');

    this.AllocateEmpData.orderDetails.Table.map((object, index) => {
      this.allocateEmpArr.push(this.createItem(object, null));
    });

    this.questionForm = this.fb.group({
      questions: new FormArray([])
    });
    // }
  }

  ngOnDestroy() {
    this.allocateEmpArr.controls = [];
  }

  getLotSyncWt(lotId): number {
    return this.lotSyncWtArr.get(lotId);
  }

  setLotSyncWt(lotId, weight) {
    this.lotSyncWtArr.set(lotId, weight);
  }

  get allocateEmpArr(): FormArray {
    return this.BudPkgForm.get('allocateEmpArr') as FormArray;
  }

  get budOrderPackets(): FormArray {
    return this.BudPkgForm.get('budOrderPackets') as FormArray;
  }

  get questions(): FormArray {
    return this.questionForm.get('questions') as FormArray;
  }

  commentIconClicked(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotCommentModal = true;
    this.loaderService.display(false);
  }

  showLotNote(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotNoteModal = true;
  }

  createItem(object, parentUniqueId): FormGroup {
    const lotCount = this.AllocateEmpData.orderDetails['Table1'].filter(result => result.GeneticsId === object.GeneticsId).length;
    return this.fb.group({
      uniqueId: this.appCommonService.randomNumber(),
      productTypeId: object.ProductTypeId || null,
      strainId: object.StrainId || null,
      geneticsId: object.GeneticsId || null,
      geneticsName: object.GeneticsName || null,
      strainName: object.StrainName || null,
      pkgSize: object.UnitValue || null,
      requiedQty: object.RequiredQty || null,
      itemQty: object.ItemQty || null,
      assignQty: new FormControl(parentUniqueId ? object.splitQty : object.RequiredQty || null),
      employee: new FormControl(null),
      lotCount: lotCount || null,
      parentUniqueId: parentUniqueId,
      toolTip: object.ProductTypeId ?
        object.BrandName + '-'
        + object.SubBrandName + '-'
        + object.StrainName + '-'
        + object.PkgTypeName + '-'
        + String(object.UnitValue) + '-'
        + String(object.ItemQty) : null
    });
  }

  openLotSelection(rowData, rowIndex) {
    this.brandStrainLots = [];
    this.brandStrainLots = this.AllocateEmpData.orderDetails['Table1'].filter(result => {
      if (rowData.value.geneticsId) {
        return result.GeneticsId === rowData.value.geneticsId;
      } else {
        return result.StrainId === rowData.value.strainId;
    }
    });
    this.selLotBrandStrainRow.BrandId = 0;
    this.selLotBrandStrainRow.StrainId = rowData.value.strainId;
    this.selLotBrandStrainRow.selectedRowIndex = rowIndex;

    this.selLotBrandStrainRow.RequireWt = 0;
    this.selLotBrandStrainRow.combinationTotalAssignedWt = 0;

    this.AllocateEmpData.orderDetails['Table'].filter((value, key) => {
        // return value.StrainId === rowData.value.strainId;
        return value.ProductTypeId === rowData.value.productTypeId;
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
    this.allocateEmpArr.value.forEach((result, index) => {
      let totalPkgWt = 0;
        // if ((result.strainid === rowData.value.strainId) && Number(result.assignPackageWt) > 0) {
        if ((result.productTypeId === rowData.value.productTypeId) && Number(result.assignQty) > 0 && index === rowIndex) {
          totalPkgWt = Number(result.assignQty) * Number(result.pkgSize) * Number(result.itemQty);
            this.selLotBrandStrainRow.combinationTotalAssignedWt = Number(totalPkgWt);
        }
    });

    this.showLotSelectionModel = true;
  }

  changeValidator(selected, index) {
    const answerbox = this.questionForm.get('questions.' + index).get('answer');
    const availablewt = this.questionForm.get('questions.' + index).get('AvailWt');

    const validators = selected ? Validators.compose([Validators.required, Validators.min(0.1), Validators.max(availablewt.value)]) : null;
    answerbox.setValidators(validators);
    answerbox.updateValueAndValidity();
  }

  createQuestionControl(fb: FormBuilder) {
    return (question, index) => {
      let checkbox;
      let answerbox;
      const lotSelectedDetails = this.selectedLotsArray[this.selLotBrandStrainRow.selectedRowIndex];

      if (!this.lotSyncWtArr.has(question.LotId)) {
        this.setLotSyncWt(question.LotId, question.AvailableWt);
      }

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
            checkbox = lotRowDetails[0].Selected;
            answerbox = lotRowDetails[0].Selected
            ? [lotWt, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt)])]
            : null;
        } else {
          checkbox = question.selected;
          answerbox = question.selected ? [null, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt)])]
            : null;
        }
      } else {
        checkbox = question.selected;
        answerbox = question.selected ? [null, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt)])]
          : null;
      }
        return fb.group({
          question: checkbox, answer: answerbox, questionNumber: index, LotNo: question.LotId,
          AvailWt: question.AvailableWt,
          GrowerLotNo: question.GrowerLotNo, LotNoteCount: question.LotNoteCount
        });
    };
  }

  submit(form) {
    const lotDetails = [];
    let totalLotWt = 0;
    let loMaxWtFlag = false;

    if (this.questionForm.valid) {
      // In edit mode, skip this validation on submit and checking this validations on update tasks
      /// condition added by Devdan :: 23-Nov-2018
        form.value.questions.forEach(result => {
          totalLotWt += result.question ? Number(result.answer) : 0;
        });

        if (totalLotWt !== Number(this.selLotBrandStrainRow.combinationTotalAssignedWt)) {
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: 'Sum of all lot weight is not equal to total assigned weight.' });

          return;
        }

      form.value.questions.forEach((result, index) => {
        if (result.question === true) {
          let totalSelectedLotWt = 0;
          let totalSelectedLotWt1 = 0;
          this.selectedLotsArray.forEach(result1 => {
            result1.forEach(result3 => {
              if (result3.LotNo ===  result.LotNo ) {
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
          if (Number(totalSelectedLotWt) > result.AvailWt ) {
                const answerBox = (this.questionForm.get('questions.' + index) as FormGroup).controls['answer'];

                (answerBox as FormControl).setErrors({ 'lotmaxwtexceeded': true });
                loMaxWtFlag = true;
                this.msgs = [];
                this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: (Number(result.AvailWt) - Number(totalSelectedLotWt)) + ' (gms) weight available for lot ' + result.GrowerLotNo });
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
              GeneticsId:  this.selLotBrandStrainRow.GeneticsId,
              GeneticsName:  this.selLotBrandStrainRow.GeneticsName
            }
          );

          // Added by bharat for bud packaing new changes
          this.setLotSyncWt(result.LotNo,
            Number(result.AvailWt) - (totalSelectedLotWt1 + Number(result.answer))
            );
        }
      });
      this.selectedLotsArray[this.selLotBrandStrainRow.selectedRowIndex] = lotDetails;

      this.appCommonService.setLocalStorage('selectedLotsArray', JSON.stringify(this.selectedLotsArray));

      if (loMaxWtFlag) {
        this.showLotSelectionModel = true;
      } else {
        this.showLotSelectionModel = false;
      }
    } else {
      this.appCommonService.validateAllFields(this.questionForm);
    }
  }

  assignToAllChange() {
    const assignToAllEmp =  this.BudPkgForm.value.assignToAll;
    this.allocateEmpArr.controls.forEach((element: FormGroup) => {
      element.controls['employee'].patchValue(assignToAllEmp ? assignToAllEmp : null);
    });
  }

  assignQtyChange(rowIndex) {
    this.selectedLotsArray[rowIndex].forEach(rowItem => {
      this.setLotSyncWt(rowItem.LotNo,
          this.getLotSyncWt(rowItem.LotNo) + Number(rowItem.SelectedWt)
        // Number(result.AvailWt) - (totalSelectedLotWt1 + Number(result.answer))
        );
    });
    this.selectedLotsArray[rowIndex] = [];
    this.appCommonService.setLocalStorage('selectedLotsArray', JSON.stringify(this.selectedLotsArray));
  }

  splitTask(formRow: FormGroup, index: number): void {
    const parentUniqueId = formRow.value.uniqueId;
    const splitObject =  this.allocateEmpArr.value.filter(item => item.uniqueId === parentUniqueId)[0];

    const splitObj = this.AllocateEmpData.orderDetails.Table
    .filter(data => data.ProductTypeId === splitObject.productTypeId)[0];

    const results: number[] = [];

    results[0] = Math.floor(Number(formRow.value.assignQty) / 2);
    results[1] = Number(formRow.value.assignQty) % 2;

    formRow.controls['assignQty'].patchValue(results[0] + results[1] );
    splitObj['splitQty'] = results[0];

    const formGroup = this.createItem(splitObj, parentUniqueId);

    this.allocateEmpArr.insert((index + 1), formGroup);
  }

  undoTask(formRow: FormGroup, index: number) {
    const parentUniqueId = formRow.value.parentUniqueId;

    // Find Parent Row of current row to add current assign qty to parent assign qty
    const splitObject =  this.allocateEmpArr.controls.filter(item => item.value.uniqueId === parentUniqueId)[0];

    // If Parent row is undo then assign current row parentUniqueId to all children to current row.
    this.allocateEmpArr.controls.filter(formGroupControl => formGroupControl.value.parentUniqueId === formRow.value.uniqueId)
    .map((filteredControl: FormGroup) => {
      filteredControl.controls['parentUniqueId'].patchValue(formRow.value.parentUniqueId);
    });

    (<FormGroup>splitObject).controls['assignQty'].patchValue(Number(formRow.value.assignQty) + Number(splitObject.value.assignQty));
    this.allocateEmpArr.removeAt(index);
  }

}
