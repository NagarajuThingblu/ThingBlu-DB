import { forEach } from '@angular/router/src/utils/collection';
import { AppConstants } from './../../../../../shared/models/app.constants';
import { GlobalResources } from './../../../../../global resource/global.resource';
import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { DropdownValuesService } from '../../../../../shared/services/dropdown-values.service';
import { TaskCommonService } from '../../../../services/task-common.service';
import { Message, SelectItem, ConfirmationService } from 'primeng/api';
import { TaskResources } from '../../../../task.resources';
import { OrderService } from '../../../../../order/service/order.service';
import { DropdwonTransformService } from '../../../../../shared/services/dropdown-transform.service';
import * as _ from 'lodash';

import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from '../../../../../shared/models/user.model';
import { CookieService } from 'ngx-cookie-service';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { AppCommonService } from '../../../../../shared/services/app-common.service';
import { environment } from './../../../../../../environments/environment';
import { Title } from '@angular/platform-browser';
import { DISABLED } from '@angular/forms/src/model';
import { RefreshService } from '../../../../../dashboard/services/refresh.service';

// const tolerance = environment.tolerance;
@Component({
  moduleId: module.id,
  selector: 'app-bud-packaging',
  templateUrl: 'bud-packaging.component.html',
  styles: [`
    .divLotMixing hr, .divRevLotMixing hr {
      margin-top: 5px; margin-bottom: 0px;
    }

    .divLotMixing, .divRevLotMixing {
      margin-top: 10px;
    }
    .clsVisible {
      visibility: hidden;
    }
  `]
})
export class BudPackagingComponent implements OnInit, OnDestroy {
  BUDPACKAGING: FormGroup;
  completionForm: FormGroup;
  reviewForm: FormGroup;
  public orderDetails: any;
  public orderDetailsBS: any;
  public orderDetailsBS_filteredData: any = [];
  public allOrders: any;
  public allOrderNos: any;
  public showLotSelectionModel = false;
  public showLotCompletiionModal = false;
  public showMixLotSelectionModel = false;
  public enabledReturnwtbox = false;

  public taskId: any;
  public taskType: any;
  public _cookieService: UserModel;
  public taskReviewModel: any;
  public showProductTypeLotDetailsModal = false;
  public productTypeLotDetails: any;
  public LotDetails: any;
  public productTypeMixPkgsDetails: any = [];
  public showPastDateLabel = false;
  public lotInfo: any = {
    lotId: 0,
    showLotNoteModal: false,
    showLotCommentModal: false
  };

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

  public selMixLotPkgRow = {
    BrandId: null,
    StrainId: null,
    BrandName: null,
    StrainName: null,
    RequireWt: null,
    selectedRowIndex: null,
    ParentRowIndex: null,
    combinationTotalAssignedWt: null,
    GeneticsId: null,
    GeneticsName: null
  };

  public orderObject: any;
  public defaultDate: Date;
  public showToManager = false;
  public lotMap = new Map<any, any>();

  public lotBalancedWtMap = new Map<any, any>();
  public productTypeQtyMap = new Map<any, any>();

  @Input() TaskModel: any;
  @Input() PageFlag: any;
  @Input() ParentFormGroup: FormGroup;
  @Output() TaskCompleteOrReviewed: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private dropdownDataService: DropdownValuesService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private router: Router,
    private orderService: OrderService,
    private dropdwonTransformService: DropdwonTransformService,
    private taskCommonService: TaskCommonService,
    private cdr: ChangeDetectorRef,
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
    private confirmationService: ConfirmationService,
    private titleService: Title,
    private refreshService: RefreshService
  ) {
    this._cookieService = this.appCommonService.getUserProfile();
  }

  public msgs: Message[] = [];
  // Commented by Dev :: 25-Oct-2018 :: UnUsed Variable
  // public Lots: SelectItem[];
  public employees: SelectItem[];
  public priorities: SelectItem[];

  public assignTaskResources: any;
  public globalResource: any;
  public taskStatus: any;

  private globalData = {
    employees: [],
    orderDetails: []
  };

  public brandStrainLots: any;
  public questionForm: FormGroup;
  public lotListForm: FormGroup;
  public selectedLotsArray: any[] = [];
  public selectedMixLotsArray: any[] = [];
  public completedLotArray: any[] = [];
  public userRoles: any;

  // Commented by Devdan ::: 25-Oct-2018 :: UnUsed Code
  // TaskCompletionModel = {
  //   wastematerialwt: '',
  //   oilmaterialwt: '',
  //   jointmaterialwt: '',
  //   usablebudwt: '',
  //   processedwt: '',
  //   assignedwt: ''
  // };

  // Commented by Devdan ::: 25-Oct-2018 :: UnUsed Code
  // public TaskActionDetails: any;

  public selectedLots = [];

  public completionParameters: any = [];
  public completionLots: any = [];
  public UniqueBrandStrain: any = [];
  public disableCompletedWtArr: any = [];
  public uniqueLotsArr: any = [];
  public AppConstants: any = {
    maxLength: AppConstants.maxLength
  };

  // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Variable to Enable/Disable Second Text Box
  isRActSecsDisabled: boolean;

  public data;
  // Added by Devdan :: 12-Oct-2018
  taskTypeId: any;
  readOnlyFlag: boolean;
  ngOnInit() {
    this.assignTaskResources = TaskResources.getResources().en.assigntask;
    this.globalResource = GlobalResources.getResources().en;
    this.taskStatus = AppConstants.getStatusList;
    this.userRoles = AppConstants.getUserRoles;
    this.titleService.setTitle(this.assignTaskResources.budpackagingtitle);
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);

    this.route.params.forEach((urlParams) => {
      this.taskId = urlParams['id'];
      this.taskType = urlParams['taskType'];
      // Get the task type id from data received from resolver
      if (this.TaskModel.TaskDetails !== undefined) {
        this.taskTypeId = this.TaskModel.TaskDetails.TaskTypeId;
      }
    });

    if (this.PageFlag.page !== 'TaskAction') {

      this.TaskModel.BUDPACKAGING = {
        lotno: null,
        brand: null,
        strain: null,
        startdate: this.TaskModel.startdate,
        enddate: null,
        endtime: null,
        esthrs: null,
        priority: 'Normal',
        notifymanager: this.TaskModel.IsManagerNotify ? this.TaskModel.IsManagerNotify : false,
        notifyemployee: this.TaskModel.IsEmployeeNotify ? this.TaskModel.IsEmployeeNotify : false,
        usercomment: null,
        orderno: null
      };

      this.questionForm = this.fb.group({
        questions: new FormArray([])
      });

      this.getABudPackagingOrders();

      this.BUDPACKAGING = new FormGroup({
        'lotno': new FormControl(''),
        'brand': new FormControl(''),
        'strain': new FormControl(''),
        'employee': new FormControl('', Validators.required),
        'estimatedstartdate': new FormControl('', Validators.compose([Validators.required])),
        'estimatedenddate': new FormControl(''),
        // 'estimatedenddate': new FormControl('',  Validators.compose([Validators.required])),
        'esthrs': new FormControl(''),
        'priority': new FormControl(''),
        'notifymanager': new FormControl(''),
        'notifyemployee': new FormControl(''),
        'comment': new FormControl('', Validators.maxLength(500)),
        'orderno': new FormControl('', Validators.required),
        budOrderPackets: this.fb.array([]),
      });

      this.employeeListByClient();

      this.priorities = [
        { label: 'Normal', value: 'Normal' },
        { label: 'Important', value: 'Important' },
        { label: 'Critical', value: 'Critical' }
      ];

      this.ParentFormGroup.addControl('BUDPACKAGING', this.BUDPACKAGING);
    } else {

      this.lotListForm = this.fb.group({
        completedLots: new FormArray([])
      });

      // this.UniqueBrandStrain = this.removeDuplicatesByName(this.TaskModel.AssignQtyDetails);
      this.UniqueBrandStrain = this.removeDuplicatesByName(this.TaskModel.AssignQtyLotDetails);
      this.taskReviewModel = {
        // Commented by Devdan :: Sec to Min change :: 06-Nov-2018 :: Seconds to HR-MM-SS Logic
        // racthrs: this.TaskModel.RevHrs ? this.TaskModel.RevHrs : this.padLeft(String(Math.floor(this.TaskModel.ActHrs / 60)), '0', 2),
        racthrs: this.TaskModel.RevHrs ?  this.TaskModel.RevHrs : this.padLeft(String(Math.floor(this.TaskModel.ActHrs / 3600)), '0', 2),
        // ractmins: this.padLeft(String(this.TaskModel.ActHrs % 60), '0', 2),
        ractmins: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) / 60)), '0', 2),
        // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Getting Seconds.
        ractsecs: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) % 60)), '0', 2)
      };

      // Set the Review Actual Seconds Fields Disabled or Enabled :: By Devdan :: Sec to Min change :: 06-Nov-2018
       this.isRActSecsDisabled = (this.taskReviewModel.racthrs !== '00') || (this.taskReviewModel.ractmins !== '00');

      if (this._cookieService.UserRole === this.userRoles.Manager && this.TaskModel.IsReview && this.TaskModel.TaskStatus === this.taskStatus.Completed) {
        this.showToManager = true;
      }

      this.questionForm = this.fb.group({
        questions: new FormArray([])
      });

      this.uniqueLotsArr = this.getUniqueLotList(this.TaskModel.AssignQtyLotDetails);
      this.completionForm = this.fb.group({
        MiscCost: new FormControl(null),
        MiscComment: new FormControl(null),
        completeParamArr: this.fb.array(this.TaskModel.AssignQtyDetails.map(this.generateCompletionParams(this.fb))),
        lotReturnWtArr: this.fb.array(
          this.uniqueLotsArr.map(this.generateCompLotReturnWtArr(this.fb))
        )
        // companies: this.fb.array([])
      });

      if (this.TaskModel.TaskStatus === this.taskStatus.InProcess || this.TaskModel.TaskStatus === this.taskStatus.Paused ) {
        this.calculateMixLotWt([], 'ALL');
      }

      this.reviewForm = this.fb.group({
        ActHrs: new FormControl(null),
        ActMins: new FormControl(null, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
        // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Getting Seconds.
        ActSecs: new FormControl({value: null, disabled: this.isRActSecsDisabled}, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
        MiscCost: new FormControl(null),
        MiscComment: new FormControl(null),
        reviewParamArr: this.fb.array(this.TaskModel.AssignQtyDetails.map(this.generateReviewParams(this.fb))),
        lotReturnWtArr: this.fb.array(
          this.uniqueLotsArr.map(this.generateReviewLotReturnWtArr(this.fb))
        )
      });
      if (this._cookieService.UserRole === this.userRoles.Manager && this.TaskModel.TaskStatus === this.taskStatus.ReviewPending) {
        this.calculateDefaultProcessedWtForReview();
      }

      if (this.TaskModel.TaskStatus === this.taskStatus.ReviewPending) {
        this.calculateMixLotWtForReview([], 'ALL');
      }
      // this.setCompanies();
    }
  }

  ngOnDestroy() {
    this.lotBalancedWtMap.clear();
    this.productTypeQtyMap.clear();
    this.lotMap.clear();

    // localStorage.removeItem('selectedMixLotsArray');
    // localStorage.removeItem('selectedLotsArray');

    this.appCommonService.removeItem('selectedMixLotsArray');
    this.appCommonService.removeItem('selectedLotsArray');
  }

  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr((size * -1), size);
  }
  // setCompanies() {
  //   const control = <FormArray>this.completionForm.controls.companies;
  //   this.data.companies.forEach(x => {
  //     control.push(this.fb.group({
  //       company: x.company,
  //       projects: this.setProjects(x) }));
  //   });
  // }

  // setProjects(x) {
  //   const arr = new FormArray([]);
  //   x.projects.forEach(y => {
  //     arr.push(this.fb.group({
  //       projectName: y.projectName
  //     }));
  //   });
  //   return arr;
  // }

  get questions(): FormArray {
    return this.questionForm.get('questions') as FormArray;
  }

  get completeParamArr(): FormArray {
    return this.completionForm.get('completeParamArr') as FormArray;
  }

  get lotReturnWtArr(): FormArray {
    return this.completionForm.get('lotReturnWtArr') as FormArray;
  }

  get reviewParamArr(): FormArray {
    return this.reviewForm.get('reviewParamArr') as FormArray;
  }

  get lotReturnWtRevArr(): FormArray {
    return this.reviewForm.get('lotReturnWtArr') as FormArray;
  }

  get budOrderPackets(): FormArray {
    // return this.BUDPACKAGING.get('budOrderPackets') as FormArray;
    return (this.ParentFormGroup.get('BUDPACKAGING') as FormGroup).get('budOrderPackets') as FormArray;
  }

  lotInnerFormArray(comp): FormArray {
    return comp.get('LotDetails') as FormArray;
  }

  mixLotDetailsArr(comp): FormArray {
    return comp.get('MixLotDetails') as FormArray;
  }

  addItem(comp: FormGroup, mixLot: FormGroup): void {
    if (Number(this.productTypeQtyMap.get(comp.value.ProductTypeId)) >= comp.value.completedWt) {
      this.msgs = [];
      this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.maxpkglimitexceed });
      return;
    }
    this.productTypeQtyMap.set(comp.value.ProductTypeId, Number(this.productTypeQtyMap.get(comp.value.ProductTypeId) + 1));

    this.mixLotDetailsArr(comp).push(this.createMixItem(comp, 0));

    const packagesCompletedBox = (<FormGroup>comp)
    .get('completedWt');

    packagesCompletedBox.markAsTouched();
    packagesCompletedBox.updateValueAndValidity();
  }

  deleteItem(comp: FormGroup, parentIndex: number, childIndex: number) {

    const packagesCompletedBox = (<FormGroup>this.completionForm.get('completeParamArr.' + parentIndex))
    .get('completedWt');

    packagesCompletedBox.markAsTouched();
    packagesCompletedBox.updateValueAndValidity();
    // control refers to your formarray
    const control = <FormArray>this.mixLotDetailsArr(comp);

    if (Number(control.controls.length) > 1) {
      for (let i =  childIndex; i <= Number(control.controls.length); i++) {
        this.selectedMixLotsArray[parentIndex + '' + i] = this.selectedMixLotsArray[parentIndex + '' + (i + 1)];
      }
    } else {
      this.selectedMixLotsArray[parentIndex + '' + childIndex] = [];
    }
    // remove the chosen row
    control.removeAt(childIndex);
    this.productTypeQtyMap.set(comp.value.ProductTypeId, Number(this.productTypeQtyMap.get(comp.value.ProductTypeId) - 1));
    // this.selectedMixLotsArray[parentIndex + '' + childIndex] = [];

    this.calculateMixLotWt([], 'ALL');
  }

  createMixItem(childObject, childIndex): FormGroup {
    return this.fb.group({
      srno: childIndex,
      mixPkgId: childObject.MixPkgId ? childObject.MixPkgId : 0
    });
  }
  generateCompletionParams(fb: FormBuilder) {
    return (object, index) => {
      let completedBox, packageCodeBox;

      completedBox = [null, Validators.max(object.AssignedQty)];
      packageCodeBox = [null];
      this.disableCompletedWtArr[index] = object.AssignedQty;

      return fb.group({
        uniqueId: index,
        completedWt: completedBox,
        RawSupId: object.RawSupId,
        StrainId: object.StrainId,
        PkgTypeId: object.PkgTypeId,
        UnitValue: object.UnitValue,
        ItemQty: object.ItemQty,
        packageCode: packageCodeBox,
        ProductTypeId: object.ProductTypeId,
        AssignedQty: object.AssignedQty,
        LotDetails: this.fb.array(
          this.TaskModel.AssignQtyLotDetails
          .filter(result => {
            if (this.TaskModel.AssignQtyDetails[index].GeneticsId) {
              return result.GeneticsId === this.TaskModel.AssignQtyDetails[index].GeneticsId;
            } else {
              return result.StrainId === this.TaskModel.AssignQtyDetails[index].StrainId;
            }
          })
          .map((object1, index1) => {
            return this.createLotControls(this.fb, object1, index1, 'Complete');
          })
          // this.TaskModel.AssignQtyLotDetails
          //   .filter(result => result.StrainId === object.StrainId)
          //   .map(this.createLotControls(this.fb, 'Complete'))) }
        ),
        MixLotDetails: this.fb.array([])
      });
    };
  }

  generateCompLotReturnWtArr(fb: FormBuilder) {
    return (object, index) => {
      let processedLotWt, lotReturnedWt;

      processedLotWt = [null];
      // LotReturnedWt = [null, Validators.compose([Validators.required])];
      lotReturnedWt = [null];

      return fb.group({
        uniqueId: index,
        LotId: object.LotId,
        AssignedWt: object.AssignedWt,
        GrowerLotNo: object.GrowerLotNo,
        processedLotWt: processedLotWt,
        lotReturnedWt: lotReturnedWt
      });
    };
  }

  generateReviewLotReturnWtArr(fb: FormBuilder) {
    return (object, index) => {
      let processedLotWt, lotReturnedWt;

      processedLotWt = [null];
      // LotReturnedWt = [null, Validators.compose([Validators.required])];
      lotReturnedWt = [null];

      return fb.group({
        uniqueId: index,
        LotId: object.LotId,
        GrowerLotNo: object.GrowerLotNo,
        AssignedWt: object.AssignedWt,
        processedLotWt: processedLotWt,
        lotReturnedWt: lotReturnedWt
      });
    };
  }

  generateReviewParams(fb: FormBuilder) {
    return (object, index) => {
      let reviewBox;

      // this.disableCompletedWtArr[index] = 0;

      if (this.TaskModel.TaskStatus === this.taskStatus.ReviewPending) {
        this.disableCompletedWtArr[index] = 0;
        this.disableCompletedWtArr[index] = Number(object.CompletedQty);
        }

      // this.TaskModel.ReviewQtyLotDetails
      //   .filter(result => result.StrainId === object.StrainId
      //     && result.PkgTypeId === object.PkgTypeId && result.UnitValue === object.UnitValue).forEach(obj => {
      //       this.disableCompletedWtArr[index] += Number(obj.ProcessedQty);
      //     });

      // this.disableCompletedWtArr[index] = object.CompletedQty;

      reviewBox = [this.disableCompletedWtArr[index]];
      return fb.group({
        uniqueId: index,
        reviewedWt: reviewBox,
        RawSupId: object.RawSupId,
        StrainId: object.StrainId,
        PkgTypeId: object.PkgTypeId,
        UnitValue: object.UnitValue,
        ItemQty: object.ItemQty,
        PackageCode: object.PackageCode,
        ProductTypeId: object.ProductTypeId,
        LotDetails: this.fb.array(
          this.TaskModel.ReviewQtyLotDetails
            .filter(result => result.StrainId === object.StrainId
              && result.PkgTypeId === object.PkgTypeId && result.UnitValue === object.UnitValue)
            .map((object1, index1) => {
                return this.createLotControls(this.fb, object1, index1, 'Review');
              })
          ),
          MixLotDetails: this.fb.array(
            _.uniqBy(this.TaskModel.MixedLotPkgDetails, 'MixPkgId')
            .filter(result => result.ProductTypeId === object.ProductTypeId)
            .map((childObject, childIndex) => {
              this.selectedMixLotsArray[index + '' + childIndex] = [];
               this.TaskModel.MixedLotPkgDetails.map((data, index1) => {
                if (data.MixPkgId === childObject.MixPkgId) {
                  this.selectedMixLotsArray[index + '' + childIndex].push({
                      LotNo: data.LotId,
                      GrowerLotNo: data.GrowerLotNo,
                      AvailWt: data.AvailWt ? data.AvailWt : 0,
                      SelectedWt: Number(data.LotUsedWt),
                      AssignedWt: data.AssignedWt ? data.AssignedWt : 0,
                      Selected: true,
                      Index: index1,
                      StrainId: 0,
                      StrainName: data.StrainName,
                      BrandId: 0,
                      LotNoteCount: data.LotNoteCount // Added LotNoteCount
                  });
                }
            });
              return this.createMixItem(childObject, childIndex);
            })
          )
      });
    };
  }

  calculateDefaultProcessedWtForReview() {
    this.lotMap.clear();
    let lotTotalWeight = 0;
    // Iterate throught each product type
    this.reviewParamArr.controls.forEach(productTypeItem => {
      lotTotalWeight = 0;
      // Iterate throught every lot in above product type
      (productTypeItem as FormArray).controls['LotDetails'].controls.forEach(lotDetails => {
          if (!this.lotMap.has(String(lotDetails.value.LotId))) {
            lotTotalWeight += Number(lotDetails.value.lotReviewedWt)
                              * (Number(productTypeItem.value.UnitValue)
                              * Number(productTypeItem.value.ItemQty));
        } else {
          lotTotalWeight += Number(this.lotMap.get(String(lotDetails.value.LotId)))
                            +  Number(lotDetails.value.lotReviewedWt)
                            * (Number(productTypeItem.value.UnitValue)
                            * Number(productTypeItem.value.ItemQty));
        }

        this.lotMap.set(lotDetails.value.LotId, lotTotalWeight);
      });
    });
  }

  calculateMixLotWt(question, Flag) {
    let lotTotalWeight = 0;

    if (String(Flag).toLocaleUpperCase() === 'SPECIFIC') {
        // Iterate throught each product type
        this.completeParamArr.controls.forEach((productTypeItem, parentIndex) => {
          // Iterate throught every lot in above product type
          (productTypeItem as FormArray).controls['LotDetails'].controls.forEach(lotDetails => {
            if (lotDetails.value.LotId === question.value.LotNo) {
              lotTotalWeight += Number(lotDetails.value.lotCompletedWt) * Number(productTypeItem.value.UnitValue) * Number(productTypeItem.value.ItemQty);
            }
          });

            (productTypeItem as FormArray).controls['MixLotDetails'].controls.forEach((mixLotDetails, childIndex) => {
              if (this.selectedMixLotsArray.length > 0) {
                this.selectedMixLotsArray[this.selMixLotPkgRow.ParentRowIndex + '' + this.selMixLotPkgRow.selectedRowIndex].forEach(element => {
                  if (element.LotNo === question.value.LotNo) {
                    lotTotalWeight += Number(element.SelectedWt);
                  }
                });
              } else {
                lotTotalWeight += Number(question.value.answer);
              }
            });
        });

        // lot total processed wt
        this.lotMap.set(question.value.LotNo, lotTotalWeight);

        // lot total balanced wt
        this.lotBalancedWtMap.set(question.value.LotNo, Number(question.value.assignedWt) - lotTotalWeight);
    } else if (String(Flag).toLocaleUpperCase() === 'ALL') {

          this.lotMap.clear();
          this.lotBalancedWtMap.clear();
          this.productTypeQtyMap.clear();
          // Iterate throught each product type
          this.completeParamArr.controls.forEach((productTypeItem, parentIndex) => {
            // Iterate throught every lot in above product type
            (productTypeItem as FormArray).controls['LotDetails'].controls.forEach(lotDetails => {
              if (this.lotMap.has(lotDetails.value.LotId)) {
                this.lotMap.set(lotDetails.value.LotId ,
                  Number(this.lotMap.get(lotDetails.value.LotId)) +
                  Number(lotDetails.value.lotCompletedWt) *
                  Number(productTypeItem.value.UnitValue) *
                  Number(productTypeItem.value.ItemQty));

                  this.lotBalancedWtMap.set(lotDetails.value.LotId, Number(lotDetails.value.AssignedWt) - Number(this.lotMap.get(lotDetails.value.LotId)));
              } else {
                this.lotMap.set(lotDetails.value.LotId ,
                  Number(lotDetails.value.lotCompletedWt) *
                  Number(productTypeItem.value.UnitValue) *
                  Number(productTypeItem.value.ItemQty));

                  this.lotBalancedWtMap.set(lotDetails.value.LotId, Number(lotDetails.value.AssignedWt) - Number(this.lotMap.get(lotDetails.value.LotId)));
              }

              if (this.productTypeQtyMap.has(productTypeItem.value.ProductTypeId)) {
                this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
                  (Number(this.productTypeQtyMap.get(productTypeItem.value.ProductTypeId)) + Number(lotDetails.value.lotCompletedWt)));
              } else {
                this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
                  Number(lotDetails.value.lotCompletedWt));
              }
            });

            (productTypeItem as FormArray).controls['MixLotDetails'].controls.forEach((mixLotDetails, childIndex) => {
              if (this.selectedMixLotsArray[parentIndex + '' + childIndex]) {

                this.selectedMixLotsArray[parentIndex + '' + childIndex].forEach(element => {
                  if (this.lotMap.has(element.LotNo)) {
                    this.lotMap.set(element.LotNo ,
                      Number(this.lotMap.get(element.LotNo)) +
                      Number(element.SelectedWt));
                  } else {
                    this.lotMap.set(element.LotNo ,
                      Number(element.SelectedWt));
                  }

                  this.lotBalancedWtMap.set(element.LotNo, Number(element.AssignedWt) - Number(this.lotMap.get(element.LotNo)));
              });
              }

              if (this.productTypeQtyMap.has(productTypeItem.value.ProductTypeId)) {
                this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
                  (Number(this.productTypeQtyMap.get(productTypeItem.value.ProductTypeId)) + 1));
              } else {
                this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId, 1);
              }
            });
          });
    }
  }

  calculateMixLotWtForReview(question, Flag) {
    if (String(Flag).toLocaleUpperCase() === 'SPECIFIC') {

    } else if (String(Flag).toLocaleUpperCase() === 'ALL') {
          this.lotMap.clear();
          this.lotBalancedWtMap.clear();
          this.productTypeQtyMap.clear();
          // Iterate throught each product type
          this.reviewParamArr.controls.forEach((productTypeItem, parentIndex) => {
            // Iterate throught every lot in above product type
            (productTypeItem as FormArray).controls['LotDetails'].controls.forEach(lotDetails => {
              if (this.lotMap.has(lotDetails.value.LotId)) {
                this.lotMap.set(lotDetails.value.LotId ,
                  Number(this.lotMap.get(lotDetails.value.LotId)) +
                  Number(lotDetails.value.lotReviewedWt) *
                  Number(productTypeItem.value.UnitValue) *
                  Number(productTypeItem.value.ItemQty));

                  this.lotBalancedWtMap.set(lotDetails.value.LotId, Number(lotDetails.value.AssignedWt) - Number(this.lotMap.get(lotDetails.value.LotId)));
              } else {
                this.lotMap.set(lotDetails.value.LotId ,
                  Number(lotDetails.value.lotReviewedWt) *
                  Number(productTypeItem.value.UnitValue) *
                  Number(productTypeItem.value.ItemQty));

                  this.lotBalancedWtMap.set(lotDetails.value.LotId, Number(lotDetails.value.AssignedWt) - Number(this.lotMap.get(lotDetails.value.LotId)));
              }

              if (this.productTypeQtyMap.has(productTypeItem.value.ProductTypeId)) {
                this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
                  (Number(this.productTypeQtyMap.get(productTypeItem.value.ProductTypeId)) + Number(lotDetails.value.lotReviewedWt)));
              } else {
                this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
                  Number(lotDetails.value.lotReviewedWt));
              }
            });

            (productTypeItem as FormArray).controls['MixLotDetails'].controls.forEach((mixLotDetails, childIndex) => {
              if (this.selectedMixLotsArray[parentIndex + '' + childIndex]) {

                this.selectedMixLotsArray[parentIndex + '' + childIndex].forEach(element => {
                  if (this.lotMap.has(element.LotNo)) {
                    this.lotMap.set(element.LotNo ,
                      Number(this.lotMap.get(element.LotNo)) +
                      Number(element.SelectedWt));
                  } else {
                    this.lotMap.set(element.LotNo ,
                      Number(element.SelectedWt));
                  }

                  this.lotBalancedWtMap.set(element.LotNo, Number(element.AssignedWt) - Number(this.lotMap.get(element.LotNo)));
              });
              }

              if (this.productTypeQtyMap.has(productTypeItem.value.ProductTypeId)) {
                this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
                  (Number(this.productTypeQtyMap.get(productTypeItem.value.ProductTypeId)) + 1));
              } else {
                this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId, 1);
              }
            });
          });
    }
  }

  calculateTotalCompletedWt(index, comp, lot) {
    // this.disableCompletedWtArr[index] = 0;

    // let lotTotalWeight = 0;
    // let prodTypeTotalPkgQty = 0;
    // // Iterate throught each product type
    // this.completeParamArr.controls.forEach((productTypeItem, parentRowIndex) => {


    //   prodTypeTotalPkgQty = 0;
    //   // Iterate throught every lot in above product type
    //   (productTypeItem as FormArray).controls['LotDetails'].controls.forEach(lotDetails => {
    //     if (lotDetails.value.LotId === lot.value.LotId) {
    //       lotTotalWeight += Number(lotDetails.value.lotCompletedWt) * Number(productTypeItem.value.UnitValue) * Number(productTypeItem.value.ItemQty);

    //       lotDetails.controls['lotCompletedWt'].updateValueAndValidity();
    //     }
    //     prodTypeTotalPkgQty += Number(lotDetails.value.lotCompletedWt);
    //   });

    //   (productTypeItem as FormArray).controls['MixLotDetails'].controls.forEach((mixLotDetails, childIndex) => {
    //     prodTypeTotalPkgQty += 1;
    //     if (this.selectedMixLotsArray.length > 0) {
    //       this.selectedMixLotsArray[parentRowIndex + '' + childIndex].forEach(element => {
    //         if (element.LotNo === lot.value.LotId) {
    //           lotTotalWeight += Number(element.SelectedWt);
    //         }
    //       });
    //     }
    //   });

    //   // if (prodTypeTotalPkgQty >= comp.value.completedWt) {
    //   //   this.msgs = [];
    //   //   this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.maxpkglimitexceed });
    //   //   return;
    //   // }
    //   this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId, prodTypeTotalPkgQty);
    // });

    // // lot total processed wt
    // this.lotMap.set(lot.value.LotId, lotTotalWeight);

    // // lot total balanced wt
    // this.lotBalancedWtMap.set(lot.value.LotId, Number(lot.value.AssignedWt) - lotTotalWeight);

    // comp.controls.LotDetails.value.forEach(object => {
    //   this.disableCompletedWtArr[index] += object.lotCompletedWt;
    // });

    this.calculateMixLotWt([], 'ALL');

    // if (Number(this.lotMap.get(lot.value.LotId)) > Number(lot.value.AssignedWt)) {
    //   this.msgs = [];
    //   this.msgs.push({
    //     severity: 'warn', summary: this.globalResource.applicationmsg,
    //     detail: this.assignTaskResources.compwtgreaterassignwt
    //   });

    //   lot.controls['lotCompletedWt'].setErrors({ 'GreaterLotWt': true });
    // }

    const packagesCompletedBox = (<FormGroup>this.completionForm.get('completeParamArr.' + index))
    .get('completedWt');

    packagesCompletedBox.markAsTouched();
    packagesCompletedBox.updateValueAndValidity();
    // if ( Number(this.disableCompletedWtArr[index]) * Number(comp.value.ItemQty) * Number(comp.value.UnitValue) > Number(lot.value.AssignedWt) ) {
    //   this.msgs = [];
    // this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Sum of all lot weight is greater than total assigned weight.' });

    //   lot.controls['lotCompletedWt'].setErrors({'GreaterLotWt': true});
    // }
  }

  calculateTotalReviewedWt(index, comp, lot) {
    this.disableCompletedWtArr[index] = 0;
    let lotTotalWeight = 0;
    // Iterate throught each product type
    this.reviewParamArr.controls.forEach(productTypeItem => {
      // Iterate throught every lot in above product type
      (productTypeItem as FormArray).controls['LotDetails'].controls.forEach(lotDetails => {
        if (lotDetails.value.LotId === lot.value.LotId) {
          lotTotalWeight += Number(lotDetails.value.lotReviewedWt) * Number(productTypeItem.value.UnitValue) * Number(productTypeItem.value.ItemQty);

          lotDetails.controls['lotReviewedWt'].updateValueAndValidity();
        }
      });
    });

    // lot total processed wt
    this.lotMap.set(lot.value.LotId, lotTotalWeight);

    comp.controls.LotDetails.value.forEach(object => {
      this.disableCompletedWtArr[index] += object.lotReviewedWt;
    });
  }

  compQtyOnChange(index, formArrayObj) {
    // (formArrayObj.get('LotDetails') as FormArray).reset();

    if (formArrayObj.get('completedWt').valid) {
        // this.strainLots[index] =   _.uniqWith(this.dropdwonTransformService.transform(
        //      this.TaskModel.AssignQtyLotDetails
        //     .filter(result =>  result.StrainId === this.TaskModel.AssignQtyDetails[index].StrainId),
        //       'GrowerLotNo', 'LotId', '-- Select --')
        //   , _.isEqual);

        // if ( this.strainLots[index].length === 2) {
        //   defaultLotId = (this.strainLots[index])[1].value;
        // } else { defaultLotId = null; }

        if (this.disableCompletedWtArr[index] !== 0) {
          formArrayObj.setControl('LotDetails', this.fb.array([]));
          formArrayObj.setControl('MixLotDetails', this.fb.array([]));

          this.TaskModel.AssignQtyLotDetails
          .filter(result => {
            if (this.TaskModel.AssignQtyDetails[index].GeneticsId) {
              return result.GeneticsId === this.TaskModel.AssignQtyDetails[index].GeneticsId;
            } else {
              return result.StrainId === this.TaskModel.AssignQtyDetails[index].StrainId;
            }
          })
          .map((object, index1) => {
            (formArrayObj.get('LotDetails') as FormArray).push(this.createLotControls(this.fb, object, index1, 'Complete'));
          });

          this.calculateMixLotWt([], 'ALL');
        } else {
          this.mixLotDetailsArr(formArrayObj).controls.forEach((control, childIndex) => {
              this.selectedMixLotsArray[index + '' + childIndex] = [];
          });
          // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
          // localStorage.setItem('selectedMixLotsArray', JSON.stringify(this.selectedMixLotsArray));
          this.appCommonService.setLocalStorage('selectedMixLotsArray', JSON.stringify(this.selectedMixLotsArray));

         // formArrayObj.setControl('LotDetails', this.fb.array([]));
        //  formArrayObj.setControl('MixLotDetails', this.fb.array([]));

          this.calculateMixLotWt([], 'ALL');
        }
        // (formArrayObj.get('LotDetails') as FormArray).push(
        //  this.TaskModel.AssignQtyLotDetails
        //     .filter(result => result.StrainId === formArrayObj.value.StrainId)
        //     .map(this.createLotControls(this.fb, 'Complete'))
        //   );

        // for (let pkgIndex = 1; pkgIndex <= this.disableCompletedWtArr[index]; pkgIndex++) {
        //   (formArrayObj.get('LotDetails') as FormArray).push(
        //   this.createLotControls(this.fb, pkgIndex, 'Complete', defaultLotId)
        //   );
        // }
    }
  }

  createLotControls(fb: FormBuilder, object: any, index: number, flag: string) {
    // return (object, index) => {
      let checkbox;

      if (flag === 'Complete') {
        checkbox = [null];
        return fb.group({
          LotId: object.LotId, lotCompletedWt: checkbox, GrowerLotNo: object.GrowerLotNo,
          AssignedWt: object.AssignedWt, LotNoteCount: object.LotNoteCount
        });
      } else {
        checkbox = [object.ProcessedQty ? object.ProcessedQty : 0];
        return fb.group({
          LotId: object.LotId, lotReviewedWt: checkbox, GrowerLotNo: object.GrowerLotNo,
          AssignedWt: object.AssignedWt, ProcessedQty: object.ProcessedQty, LotNoteCount: object.LotNoteCount
        });
      }
    // };
  }
  createQuestionControl(fb: FormBuilder) {
    return (question, index) => {
      let checkbox;
      let answerbox;
      const lotSelectedDetails = this.selectedLotsArray[this.selLotBrandStrainRow.selectedRowIndex];

      let isLotPresentInDBData = false;
      if (lotSelectedDetails) {
        const lotRowDetails = [];
        lotSelectedDetails.forEach(data => {
          // Added by Devdan :: 16-Oct-2018
          if (this.taskTypeId > 0 && question.LotId === data.LotNo) {
            lotRowDetails.push(data);
          } else if (data.Index === index) {
            lotRowDetails.push(data);
          }
          ///// Check if the selected lot is persent in database data In Edit mode
          if (this.taskId && this.taskId > 0) {
            this.TaskModel.BudPckgLotDetails.forEach(Lot => {
              if (question.LotId === Lot.LotId) {
                isLotPresentInDBData = true;
              }
            });
          }
        });
        if (lotRowDetails.length) {
          const lotWt = lotRowDetails[0].SelectedWt;
          if (this.taskId && this.taskId > 0 && isLotPresentInDBData) {
            checkbox = lotRowDetails[0].Selected;
            answerbox = lotRowDetails[0].Selected
            ? [lotWt, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt + Number(lotWt))])]
            : null;
          } else {
            checkbox = lotRowDetails[0].Selected;
            answerbox = lotRowDetails[0].Selected
            ? [lotWt, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt)])]
            : null;
          }
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
      if (this.taskId && this.taskId > 0 && isLotPresentInDBData) {
        return fb.group({
          question: checkbox, answer: answerbox, questionNumber: index, LotNo: question.LotId,
          AvailWt: question.AvailableWt + (answerbox ? Number(answerbox[0]) : 0),
          GrowerLotNo: question.GrowerLotNo, LotNoteCount: question.LotNoteCount
        });
      } else {
        return fb.group({
          question: checkbox, answer: answerbox, questionNumber: index, LotNo: question.LotId,
          AvailWt: question.AvailableWt,
          GrowerLotNo: question.GrowerLotNo, LotNoteCount: question.LotNoteCount
        });
      }
    };
  }

  createQuestionControlForMixLot(fb: FormBuilder) {
    return (question, index) => {
      let checkbox;
      let answerbox;

      const lotSelectedDetails = this.selectedMixLotsArray[this.selMixLotPkgRow.ParentRowIndex  + '' + this.selMixLotPkgRow.selectedRowIndex];

      if (lotSelectedDetails) {

        const lotRowDetails = [];
        lotSelectedDetails.forEach(data => {
          // Added by Devdan :: 16-Oct-2018
          if (this.taskTypeId > 0 && question.LotId === data.LotNo) {
            lotRowDetails.push(data);
          } else if (data.Index === index) {
            lotRowDetails.push(data);
          }
        });

        if (lotRowDetails.length) {
          checkbox = lotRowDetails[0].Selected;
          answerbox = lotRowDetails[0].Selected
            ? [lotRowDetails[0].SelectedWt, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt)])]
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
        question: checkbox, answer: answerbox, questionNumber: index, LotNo: question.LotId, assignedWt: question.AssignedWt,
        strainName: question.StrainName, strainId: question.StrainId,
        AvailWt: question.AvailableWt, GrowerLotNo: question.GrowerLotNo, LotNoteCount: question.LotNoteCount
      });
    };
  }

  createItem(object, index, AutoPopulate): FormGroup {
    const counts  = this.globalData.orderDetails['Table1'].filter(result => result.StrainId === object.StrainId).length;
    let tBPDetailsId;
    // Added by Devdan :: 15-Oct-2018 :: For bud packaging edit
    if (this.taskTypeId > 0 && object.OrderId === this.TaskModel.BudPckgOrderDetails[index].OrderId) {
      tBPDetailsId = this.TaskModel.BudPckgOrderDetails[index].Id;
    } else {
      tBPDetailsId = 0;
    }
    // In case of Edit , show assigned qty and available qty together with respective size of package
    let eRequiredQty;
    let eAssignedQty;
    if (this.taskTypeId > 0 && AutoPopulate) {
      eRequiredQty = object.RequiredQty + this.TaskModel.BudPckgOrderDetails[index].AssignedQty;
      object.RequiredQty = eRequiredQty;
      object.TotalWt = (eRequiredQty * this.TaskModel.BudPckgOrderDetails[index].UnitValue);
      eAssignedQty = this.TaskModel.BudPckgOrderDetails[index].AssignedQty;
    } else {
      eAssignedQty = object.RequiredQty;
    }
    return this.fb.group({
      // Modified by Devdan :: 17-Oct-2018 :: Getting AssignedQty in case of Edit else Required Qty
      assignPackageWt: new FormControl({value : counts === 0 ? 0 : eAssignedQty, disabled: counts === 0 }, [Validators.max(object.RequiredQty)]),
      brandid: object.RawSupId,
      strainid: object.StrainId,
      packagetypeid: object.PkgTypeId,
      packagetype: object.PkgTypeName,
      packageunit: object.UnitValue,
      itemQty: object.ItemQty,
      productTypeId: object.ProductTypeId,
      // Added by Devdan :: 15-Oct-2018 :: Added existing producttypeid into list for edit functionality
      TBPDId: tBPDetailsId,
      // Added by Devdan :: 22-Nov-2018 :: Added genetic Id for Edit Task functionality validations
      geneticsId: object.GeneticsId
    });
  }
  // createItem(fb: FormBuilder) {
  //   return (object, index) => {
  //     return fb.group({
  //       assignPackageWt: new FormControl(null, [Validators.max(object.Qty)]),
  //       brandid: object.RawSupId,
  //       strainid: object.StrainId,
  //       packagetypeid: object.PkgTypeId,
  //       packagetype: object.PkgTypeName,
  //       packageunit: object.UnitValue
  //     });
  //   };
  // }

  // To show completion or review details of selected product type on action details page
  getLotsInfo(ProductTypeId) {
    this.LotDetails = this.TaskModel.AssignQtyDetails.filter(r => r.ProductTypeId === ProductTypeId)[0];
    this.showProductTypeLotDetailsModal = true;
    this.productTypeLotDetails = this.TaskModel.ReviewQtyLotDetails
      .filter(result => result.ProductTypeId === ProductTypeId);
      // .filter(result => result.ProductTypeId === ProductTypeId);
      this.productTypeMixPkgsDetails['PkgDetails'] = _.uniqBy(this.TaskModel.MixedLotPkgDetails, 'MixPkgId');
  }

  getPkgMixLotDetails(MixPkgId) {
    return this.TaskModel.MixedLotPkgDetails.filter(data => data.MixPkgId === MixPkgId);
  }

  displayLotDetails(orderDetail) {
   // return this.TaskModel.AssignQtyLotDetails.filter(result => result.RawSupId === orderDetail.RawSupId && result.StrainId === orderDetail.StrainId);
   return this.TaskModel.AssignQtyLotDetails.filter(result =>  result.StrainId === orderDetail.StrainId);
  }

  assignWtOnChange(budOrderPacket) {
    // this.orderDetailsBS.filter();

    // if (!budOrderPacket.controls['assignPackageWt'].valid) {
    //   // budOrderPacket.controls['assignPackageWt'].value = '';
    //   return;
    // }

    // this.orderDetailsBS_filteredData = [];
    // this.selectedLotsArray = [];

    // const filterItems = this.budOrderPackets.value.filter(result => {
    //   return result.assignPackageWt > 0;
    // });

    // this.orderDetailsBS.forEach((value, key) => {
    //   let exists = false;
    //   filterItems.forEach((val2, key1) => {
    //     if (value.RawSupId === val2.brandid && value.StrainId === val2.strainid) { exists = true; }
    //   });

    //   if (exists && value.RawSupId !== '' && value.StrainId !== '') { this.orderDetailsBS_filteredData.push(value); }
    // });
  }

  changeValidator(selected, index) {
    const answerbox = this.questionForm.get('questions.' + index).get('answer');
    const availablewt = this.questionForm.get('questions.' + index).get('AvailWt');

    const validators = selected ? Validators.compose([Validators.required, Validators.min(0.1), Validators.max(availablewt.value)]) : null;
    answerbox.setValidators(validators);
    answerbox.updateValueAndValidity();
  }

  showLotNote(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotNoteModal = true;
  }

  estStartDate_Select() {
    if (((new Date(this.returnFormattedDate(this.defaultDate)) >
      new Date(this.BUDPACKAGING.value.estimatedstartdate)))) {
      this.showPastDateLabel = true;
    } else {
      this.showPastDateLabel = false;
    }
  }

  returnFormattedDate(dateObject) {
    return new Date(dateObject).toLocaleDateString().replace(/\u200E/g, '');
  }

  onNoteSave(lotComments) {
    this.UniqueBrandStrain = this.UniqueBrandStrain;
  }

  employeeListByClient() {
    this.dropdownDataService.getEmployeeListByClient().subscribe(
      data => {
        this.globalData.employees = [];
        this.globalData.employees = data;
        this.employees = this.dropdwonTransformService.transform(data, 'EmpName', 'EmpId', '-- Select --');
      },
      error => { console.log(error); },
      () => console.log('Get all Employees by client complete'));
  }

  getSelectedOrderDetails(OrderId, AutoPopulate) {
    let editmode;
    if (this.taskTypeId > 0) {
      editmode = true;
    } else {
      editmode = false;
    }
    this.orderService.getSelectedOrderDetails(OrderId, 'BUD', editmode, this.taskId).subscribe(
      data => {
        if (data !== 'No data found!') {
          this.globalData.orderDetails = data;
          this.orderDetails = data.Table;
          const newArr = [];
          // To get unique record according brand and strain :: By Devdan 22-Nov-2018
          if (this.taskTypeId > 0) {
            this.orderDetailsBS = this.removeDuplicatesByName(this.TaskModel.BudPckgLotDetails);
          } else {
            this.orderDetailsBS = this.removeDuplicatesByName(this.orderDetails);
          }
          // End of getting unique record accroding brand and strain

          // To map assign wt textbox in table for each row
          // this.budOrderPackets.reset();
          // this.BUDPACKAGING. budOrderPackets = this.fb.array([]);
          (this.ParentFormGroup.controls['BUDPACKAGING'] as FormGroup).setControl('budOrderPackets', this.fb.array([]));

          // this.budOrderPackets.push(this.fb.array(this.orderDetails.map(this.createItem(this.fb))));
          this.orderDetails.map((object, index) => {
            this.budOrderPackets.push(this.createItem(object, index, AutoPopulate));
          });

          // End To map assign wt textbox in table for each row

          // Unique Brand Strain Combination
          this.orderDetailsBS_filteredData = [];
          this.selectedLotsArray = [];

          const filterItems = this.budOrderPackets.value.filter(result => {
            return result.assignPackageWt !== null;
          });

          this.orderDetailsBS.forEach((value, key) => {
            let exists = false;
            this.budOrderPackets.value.forEach((val2, key1) => {
              if (value.StrainId === val2.strainid || this.taskTypeId > 0) { exists = true; }
            });
            const counts  = this.globalData.orderDetails['Table1'].filter(result => result.StrainId === value.StrainId).length;
            value['LotCount'] = counts;
            if (exists && value.StrainId !== '') { this.orderDetailsBS_filteredData.push(value); }
          });

          // End Unique Brand Strain Combination
          //// localStorage.setItem('uniqueOrderStrains', this.orderDetailsBS_filteredData);
        }
        // Added by Devdan :: 15-Oct-2018 :: Getting the selected lots and assigning it to ngmodel
        if (this.taskTypeId > 0 && AutoPopulate) {
          this.TaskModel.BudPckgOrderDetails.forEach(order => {
            this.openLotSelection(order.StrainId, order.GeneticsId, 0);
          });
          this.setSelectedLotDetails(this.orderDetails);
          this.showLotSelectionModel = false;
          this.readOnlyFlag = true;
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

  getUniqueLotList(LotObject) {
    // To get unique record according brand and strain
    const newArr = [];
    LotObject.forEach((value, key) => {
      let exists = false;
      newArr.forEach((val2, key1) => {
        if (value.LotId === val2.LotId) { exists = true; }
      });

      if (exists === false && value.LotId !== '') { newArr.push(value); }
    });
    return newArr;
    // End of getting unique record accroding brand and strain
  }

  getABudPackagingOrders() {
    let editmode;
    if (this.taskTypeId > 0) {
      editmode = true;
    } else {
      editmode = false;
    }
    this.orderService.getABudPackagingOrders(editmode).subscribe(
      data => {
        if (data !== 'No data found!') {
          this.allOrders = data;
          this.allOrderNos = this.dropdwonTransformService.transform(data, 'OrderRefId', 'OrderId', '-- Select --');
        }

        // Added by Devdan :: 08-Oct-2018 :: Load Stain Change Event
        if (this.taskTypeId > 0) {
          this.setFormInEditMode(0);
          this.onOrderChange('onLoad');
        }
      },
      error => { console.log(error); },
      () => console.log('Get All Orders complete'));
  }

  onOrderChange(value) {
    this.orderObject = this.allOrders.filter(result => result.OrderId === this.TaskModel.BUDPACKAGING.orderno)[0];

    this.selectedLotsArray = [];

    // localStorage.removeItem('selectedLotsArray');
    this.appCommonService.removeItem('selectedLotsArray');
    // localStorage.removeItem('uniqueOrderStrains');
    if (value === 'fmrHTML') {
      this.getSelectedOrderDetails(this.TaskModel.BUDPACKAGING.orderno, false);
    } else {
      this.getSelectedOrderDetails(this.TaskModel.BUDPACKAGING.orderno, true);
    }
  }

  onLotSelectionChange() {
    this.selectedLots = [];
    this.TaskModel.BUDPACKAGING.lotno.map(item => {
      return {
        'lotno': item, 'availableQty': '23'
      };
    }).forEach(item => this.selectedLots.push(item));
  }

  openLotSelection(StrainId, GeneticsId, rowIndex) {
    this.brandStrainLots = [];
    this.brandStrainLots = this.globalData.orderDetails['Table1'].filter(result => {
      if (GeneticsId) {
        return result.GeneticsId === GeneticsId;
      } else {
        return result.StrainId === StrainId;
    }
    });
    this.selLotBrandStrainRow.BrandId = 0;
    this.selLotBrandStrainRow.StrainId = StrainId;
    this.selLotBrandStrainRow.selectedRowIndex = rowIndex;

    this.selLotBrandStrainRow.RequireWt = 0;
    this.selLotBrandStrainRow.combinationTotalAssignedWt = 0;

    this.orderDetails.filter((value, key) => {
      if (GeneticsId) {
        return value.GeneticsId === GeneticsId;
      } else {
        return value.StrainId === StrainId;
      }
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
    this.budOrderPackets.value.forEach(result => {
      let totalPkgWt = 0;
      if (this.taskId && this.taskId > 0) {
        if ((result.strainid === StrainId || result.geneticsId === GeneticsId) && Number(result.assignPackageWt) > 0) {
          totalPkgWt = Number(result.assignPackageWt) * Number(result.packageunit) * Number(result.itemQty);
            this.selLotBrandStrainRow.combinationTotalAssignedWt += Number(totalPkgWt);
        }
      } else {
        if ((result.strainid === StrainId) && Number(result.assignPackageWt) > 0) {
          totalPkgWt = Number(result.assignPackageWt) * Number(result.packageunit) * Number(result.itemQty);
            this.selLotBrandStrainRow.combinationTotalAssignedWt += Number(totalPkgWt);
        }
      }
    });

    this.showLotSelectionModel = true;
  }

  openMixLotSelection(mixLotRow, rowIndex, ParentRowIndex) {
    const mixLotDetails = this.TaskModel.AssignQtyLotDetails.filter(result =>  {
    if (this.TaskModel.AssignQtyDetails[ParentRowIndex].GeneticsId) {
      return result.GeneticsId === this.TaskModel.AssignQtyDetails[ParentRowIndex].GeneticsId;
      } else {
        return  result.StrainId === this.TaskModel.AssignQtyDetails[ParentRowIndex].StrainId;
      }
    });

    this.selMixLotPkgRow.BrandId = 0;
    this.selMixLotPkgRow.StrainId = this.TaskModel.AssignQtyDetails[ParentRowIndex].StrainId;
    this.selMixLotPkgRow.StrainName = this.TaskModel.AssignQtyDetails[ParentRowIndex].StrainName;
    this.selMixLotPkgRow.selectedRowIndex = rowIndex;
    this.selMixLotPkgRow.ParentRowIndex = ParentRowIndex;

    this.selMixLotPkgRow.RequireWt = this.TaskModel.AssignQtyDetails[ParentRowIndex].UnitValue;
    this.selMixLotPkgRow.combinationTotalAssignedWt = this.TaskModel.AssignQtyDetails[ParentRowIndex].UnitValue;

    this.selMixLotPkgRow.GeneticsId = this.TaskModel.AssignQtyDetails[ParentRowIndex].GeneticsId;
    this.selMixLotPkgRow.GeneticsName = this.TaskModel.AssignQtyDetails[ParentRowIndex].GeneticsName;
    this.questionForm = this.fb.group({
      questions: this.fb.array(mixLotDetails
        .map(this.createQuestionControlForMixLot(this.fb))
      )
    });

    this.showMixLotSelectionModel = true;
  }

  submit(form) {
    // event.preventDefault();
    // event.stopPropagation();
    const lotDetails = [];
    let totalLotWt = 0;
    let loMaxWtFlag = false;

    if (this.questionForm.valid) {
      // In edit mode, skip this validation on submit and checking this validations on update tasks
      /// condition added by Devdan :: 23-Nov-2018
      if (!this.taskTypeId) {
        form.value.questions.forEach(result => {
          totalLotWt += result.question ? Number(result.answer) : 0;
        });

        if (totalLotWt !== Number(this.selLotBrandStrainRow.combinationTotalAssignedWt)) {
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: 'Sum of all lot weight is not equal to total assigned weight.' });

          return;
        }
      }

      form.value.questions.forEach((result, index) => {
        if (result.question === true) {
          let totalSelectedLotWt = 0;
          this.selectedLotsArray.forEach(result1 => {
            result1.forEach(result3 => {
              if (result3.LotNo ===  result.LotNo ) {
                totalSelectedLotWt += Number(result3.SelectedWt);
              }
            });
          });
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
          let lotListId;
          if (this.taskTypeId > 0 ) {
            this.TaskModel.BudPckgLotDetails.forEach(lot => {
              if (result.LotNo === lot.LotId) {
                lotListId = lot.Id;
              }
            });
          } else {
            lotListId = 0;
          }
          if (!lotListId) {
            lotListId = 0;
          }
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
        }
      });
      this.selectedLotsArray[this.selLotBrandStrainRow.selectedRowIndex] = lotDetails;
      // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
      // localStorage.setItem('selectedLotsArray', JSON.stringify(this.selectedLotsArray));
      this.appCommonService.setLocalStorage('selectedLotsArray', JSON.stringify(this.selectedLotsArray));

      if (loMaxWtFlag) {
        this.showLotSelectionModel = true;
      } else {
        this.showLotSelectionModel = false;
      }
    } else {
      this.appCommonService.validateAllFields(this.questionForm);
    }
    // this.submission = form.value;
  }

  // Mix Lot Details
  submitMixLotDetails(form) {
    // event.preventDefault();
    // event.stopPropagation();
    const mixLotDetails = [];
    let totalLotWt = 0;

    if (this.questionForm.valid) {
      form.value.questions.forEach(result => {
        totalLotWt += result.question ? Number(result.answer) : 0;
      });

      if (totalLotWt !== Number(this.selMixLotPkgRow.combinationTotalAssignedWt)) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.assignTaskResources.pkgwtnotmatched });

        return;
      }

      form.value.questions.forEach(result => {
        if (result.question === true) {
          mixLotDetails.push(
            {
              LotNo: result.LotNo,
              GrowerLotNo: result.GrowerLotNo,
              AvailWt: result.AvailWt,
              SelectedWt: Number(result.answer),
              AssignedWt: result.assignedWt,
              Selected: true,
              Index: result.questionNumber,
              StrainId: this.selMixLotPkgRow.StrainId,
              BrandId: this.selMixLotPkgRow.BrandId,
              StrainName: this.selMixLotPkgRow.StrainName,
              LotNoteCount: result.LotNoteCount // Added LotNoteCount
            }
          );
        }
      });

      this.selectedMixLotsArray[this.selMixLotPkgRow.ParentRowIndex + '' + this.selMixLotPkgRow.selectedRowIndex] = mixLotDetails;
      this.calculateMixLotWt([], 'ALL');
      // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
      // localStorage.setItem('selectedMixLotsArray', JSON.stringify(this.selectedMixLotsArray));
      this.appCommonService.setLocalStorage('selectedMixLotsArray', JSON.stringify(this.selectedMixLotsArray));
      this.showMixLotSelectionModel = false;
    } else {
      this.appCommonService.validateAllFields(this.questionForm);
    }
  }
  // End of Mix Lot Details

  // Submit Completion Parameters
  submitCompleteParameter(formModel) {
    let countMisMatch = false;
    let completeLotDetailsForApi;
    const lotProductListArr = [];
   // let thresholdExceed = false;
    let duplicateEntry = false;
    let isthresholdexceeded = false;

    if (this.completionForm.valid === true) {
      completeLotDetailsForApi = {
        TaskDetails: {
          TaskId: Number(this.taskId),
          VirtualRoleId: 0,
          Comment: formModel.MiscComment ? formModel.MiscComment : '',
          MiscCost: 0,
          TaskKeyName: 'A-PACKAGE'
        },
        LotDetails: [],
        ProductTypeDetails: [],
        LotProductList: [],
        MixPkgDetails: []
      };

      // 3rd Object: Product wise Total Qty Details
      formModel.completeParamArr.forEach((object, index) => {
        completeLotDetailsForApi.ProductTypeDetails.push({
          ProductTypeId: object.ProductTypeId,
          PackageCode: object.packageCode ? object.packageCode : '',
          Qty: object.completedWt ? object.completedWt : 0,
          IndexCode: String(index)
        });

        let validateDuplicateFlag = false;
        if (object.packageCode && Number(completeLotDetailsForApi.ProductTypeDetails.filter(data =>
          data.PackageCode &&
          String(data.PackageCode).toLocaleUpperCase() === String(object.packageCode).toLocaleUpperCase()).length) > 1
          ) {
          // this.msgs = [];
          // this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.duplicatePackageCode });

          const uniquecodeBox = (<FormGroup>this.completionForm.get('completeParamArr.' + index))
          // .get('LotDetails.' + index)
          .get('packageCode');

          if (!validateDuplicateFlag) {
            validateDuplicateFlag = true;
            uniquecodeBox.setErrors({ duplicatepkgcode: true });
          }

          duplicateEntry = true;
          return;
        }

        if (this.productTypeQtyMap.get(object.ProductTypeId) !== object.completedWt) {
          const packagesCompletedBox = (<FormGroup>this.completionForm.get('completeParamArr.' + index))
          .get('completedWt');

          packagesCompletedBox.setErrors({ pkgqtynotmatched: true });
          countMisMatch = true;
          packagesCompletedBox.markAsDirty();
           return;
        }
      });

      if (countMisMatch) {
        return;
       }
      // 4th Object: Product wise all lot list and their entered wt details
      formModel.completeParamArr.forEach((object, index) => {
        object.LotDetails.forEach(LotObject => {

          if (LotObject.lotCompletedWt > 0) {
            completeLotDetailsForApi.LotProductList.push({

              ProductTypeId: object.ProductTypeId,
              LotId: LotObject.LotId,
              Qty: LotObject.lotCompletedWt ? LotObject.lotCompletedWt : 0
            });
          }

          lotProductListArr.push({
            RawSupId: object.RawSupId,
            StrainId: object.StrainId,
            PkgTypeId: object.PkgTypeId,
            UnitValue: object.UnitValue,
            ItemQty: object.ItemQty,
            ProductTypeId: object.ProductTypeId,
            LotId: LotObject.LotId,
            Qty: LotObject.lotCompletedWt ? LotObject.lotCompletedWt : 0
          });
        });
      });

      // 2nd Object: All Products unique lot id and sum of lot wt

      _.mapValues(_.groupBy(lotProductListArr, 'LotId'),
        (clist, LotId) => {
          let lotTotalWt = 0;
          let lotReturnedWt = 0;
          let lotAssignedWt = 0;
         // let toleranceValue = 0;
          let lotFormIndex = 0;
          const tolerance = Number(this.TaskModel.Threshold);

          clist.map(LotDetails => {
            lotTotalWt += (LotDetails.Qty * LotDetails.UnitValue * LotDetails.ItemQty);
          });

          formModel.lotReturnWtArr.forEach((object, index) => {
            if (Number(object.LotId) === Number(LotId)) {
              lotReturnedWt = Number(object.lotReturnedWt);
              lotAssignedWt = Number(object.AssignedWt);
              lotFormIndex = index;
            }
          });

          if (this.enabledReturnwtbox === true)  {
            lotReturnedWt = lotReturnedWt;
          } else {
          // PkgReturnedWt =  Total Pkg Assigned Wt - Total Pkg Processed Wt
          const autoProcessweight = Number(this.lotMap.get(Number(LotId)));
          if (Number(lotAssignedWt < Number(autoProcessweight))) {
            lotReturnedWt = 0;
          } else {
            lotReturnedWt = Number(parseFloat(String(Number(lotAssignedWt) - Number(this.lotMap.get(Number(LotId))))).toFixed(2));
          }
        }

          let processedwt = 0;
          let assignWt = 0;
          let thresholdReturnwt = 0;
          const isReturnWTEnabled = 0;
          assignWt = Number(lotAssignedWt);
          thresholdReturnwt = lotReturnedWt;
          processedwt = this.lotMap.get(Number(LotId));
          const thresholdPlus = Number(this.TaskModel.Threshold);
          const thresholdMinus = Number(this.TaskModel.ThresholdMinus);
          let plustoleranceValue  ;
          let minustoleranceValue  ;
          plustoleranceValue = (assignWt) * Number(thresholdPlus) / 100;
          minustoleranceValue = (assignWt) * Number(thresholdMinus) / 100;
          if (Number(assignWt)  < Number(processedwt) + Number(thresholdReturnwt)) {
            if (Number(thresholdPlus) > 0 ) {
              if ( Math.abs((Number(assignWt) - Number(processedwt) + Number(thresholdReturnwt))) > plustoleranceValue  ) {
                 this.msgs = [];
                 this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                 detail: this.assignTaskResources.MismatchTotalandassignedwt });
                isthresholdexceeded = true;
            }
           } else if (Number(thresholdPlus) === 0 )  {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: this.assignTaskResources.MismatchTotalandassignedwt  });
            isthresholdexceeded = true;
           }
         }

         if (Number(assignWt) >  Number(processedwt) + Number(thresholdReturnwt)) {
          if (Number(thresholdMinus) > 0 ) {
            if ( Math.abs(Number(assignWt) - Number(processedwt) + Number(thresholdReturnwt) ) > minustoleranceValue ) {
                 this.msgs = [];
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                 detail: this.assignTaskResources.MismatchTotalandassignedwt });
              isthresholdexceeded = true;
              }
           } else if (Number(thresholdMinus) === 0 )  {
                    this.msgs = [];
                    this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                    detail: this.assignTaskResources.MismatchTotalandassignedwt  });
                  isthresholdexceeded = true;
           }
        }

          completeLotDetailsForApi.LotDetails.push({
            LotId: Number(LotId),
            // Weight: LotTotalWt ? LotTotalWt : 0,
            Weight: Number(this.lotMap.get(Number(LotId))) ? Number(this.lotMap.get(Number(LotId))) : 0,
            ReturnWt: thresholdReturnwt
          });
        });

      // 5th Object: Mix Lot Details
      formModel.completeParamArr.forEach((object, index) => {
        if (object.MixLotDetails.length > 0) {
          object.MixLotDetails.forEach((MixLotObject, childIndex) => {
            if (this.selectedMixLotsArray[index + '' + childIndex]) {
              this.selectedMixLotsArray[index + '' + childIndex].forEach(item => {
                completeLotDetailsForApi.MixPkgDetails.push({
                  SkewKeyName: 'BUD',
                  MixPkgNo: index + '' + childIndex,
                  PackageCode: object.packageCode ? object.packageCode : '',
                  ProductTypeId: object.ProductTypeId,
                  LotId: Number(item.LotNo),
                  Weight: item.SelectedWt ? item.SelectedWt : 0
                });
              });
            }
          });
        }
      });
        // End of Mix Lot Details
        if (duplicateEntry) { return; }
        duplicateEntry = false;
       // if (thresholdExceed) { return; }

       if ( isthresholdexceeded) {
        isthresholdexceeded = false;
        return; }

        this.confirmationService.confirm({
        message: this.assignTaskResources.taskcompleteconfirm,
        header: 'Confirmation',
        icon: 'fa fa-exclamation-triangle',
        accept: () => {

            // http call starts
            this.loaderService.display(true);

            this.taskCommonService.completeTask(completeLotDetailsForApi)
              .subscribe(data => {
                if (String(data).toLocaleUpperCase() === 'NOCOMPLETE') {
                  this.msgs = [];
                  this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskalreadycompleted });

                  if (this.TaskModel.IsReview === true) {
                    this.TaskModel.TaskStatus = this.taskStatus.ReviewPending;
                  } else {
                    this.TaskModel.TaskStatus = this.taskStatus.Completed;
                  }
                  this.TaskCompleteOrReviewed.emit();
                  // setTimeout( () => {
                  //   this.router.navigate(['home/taskaction', this.taskType, this.taskid]);
                  // }, 2000);

                } else if (String(data).toLocaleUpperCase() === 'DELETED') {
                  this.msgs = [];
                  this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskActionCannotPerformC });

                  setTimeout(() => {
                    if (this._cookieService.UserRole === this.userRoles.Manager) {
                      this.router.navigate(['home/managerdashboard']);
                    } else {
                      this.router.navigate(['home/empdashboard']);
                    }
                  }, 1000);
                } else if (String(data).toLocaleUpperCase() === 'FAILURE') {
                  this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
                } else if (String(data).toLocaleUpperCase() === 'SUCCESS') {
                  if (this.TaskModel.IsReview === true) {
                    this.TaskModel.TaskStatus = this.taskStatus.ReviewPending;
                  } else {
                    this.TaskModel.TaskStatus = this.taskStatus.Completed;
                  }
                  this.msgs = [];
                  this.msgs.push({
                    severity: 'success', summary: this.globalResource.applicationmsg,
                    detail: this.assignTaskResources.taskcompleteddetailssavesuccess
                  });

                  setTimeout(() => {
                    if (this._cookieService.UserRole === this.userRoles.Manager) {
                      this.router.navigate(['home/managerdashboard']);
                    } else {
                      this.router.navigate(['home/empdashboard']);
                    }
                  }, 1000);
                } else {
                  if (String(data[0].ResultKey).toLocaleUpperCase() === 'DUPLICATE') {
                    let validateDuplicateFlag = false;
                    data.forEach(dataItem => {
                      if (dataItem.PackageCode && String(dataItem.PackageCode) !== '') {
                        const arrIndexCode = String(dataItem.IndexCode).split('##');
                        const uniquecodeBox = (<FormGroup>this.completionForm.get('completeParamArr.' + String(dataItem.IndexCode)))
                        .get('packageCode');

                        // this.msgs = [];
                        // this.msgs.push({severity:'warn',summary:this.globalResource.applicationmsg,detail:this.assignTaskResources.duplicatePackageCode});
                        duplicateEntry = true;

                        if (!validateDuplicateFlag) {
                          validateDuplicateFlag = true;
                          (uniquecodeBox as FormControl).setErrors({ 'duplicatepkgcode': true });
                        }
                        return;
                      }
                    });
                  }
                }
              },
              () => {
                if (!(duplicateEntry === false)) {
                  return;
                } else {
                  this.PageFlag.showmodal = false;
                }
              }
            );
            // this.PageFlag.showmodal = false;
            // http call ends
            // Commented by DEVDAN :: 26-Sep2018 :: Optimizing API Calls
            // this.refreshService.PushChange().subscribe(
            //   msg => {
            //   });
            this.loaderService.display(false);
          },
          reject: () => {
              // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
          }
      });
    } else {
      this.appCommonService.validateAllFields(this.completionForm);
    }
  }

  // Commented by Devdan :: Sec to Min change :: 06-Nov-2018
  // CaluculateTotalMins(Hours, Mins) {
  //   return (Number(Hours) * 60) + Number(Mins);
  // }
  // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Calculate Seconds
  CaluculateTotalSecs(Hours, Mins, Secs) {
    return (Number(Hours) * 3600) + (Number(Mins) * 60) + Number(Secs);
  }

  submitReviewParameter(formModel) {
    let reviewLotDetailsForApi;
    const lotProductListArr = [];
   // let thresholdExceed = false;
    let isthresholdexceeded = false;
    let duplicateEntry = false;
    // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Calculate Seconds
    const ActSeconds = this.reviewForm.getRawValue().ActSecs;
    if (this.reviewForm.valid === true) {
    reviewLotDetailsForApi = {
      TaskDetails: {
        TaskId: Number(this.taskId),
        VirtualRoleId: 0,
        Comment: formModel.MiscComment,
        MiscCost: formModel.MiscCost ? Number(formModel.MiscCost) : 0,
        // Modified by Devdan :: Sec to Min change :: 06-Nov-2018
        RevTimeInSec: this.CaluculateTotalSecs(formModel.ActHrs, formModel.ActMins, ActSeconds),
        TaskKeyName: 'A-PACKAGE'
      },
      LotDetails: [],
      ProductTypeDetails: [],
      LotProductList: [],
      MixPkgDetails: []
    };

    // 3rd Object: Product wise Total Qty Details
    formModel.reviewParamArr.forEach((object, index) => {
      reviewLotDetailsForApi.ProductTypeDetails.push({
        // RawSupId: object.RawSupId,
        // StrainId: object.StrainId,
        // PkgTypeId: object.PkgTypeId,
        // UnitValue: object.UnitValue,
        ProductTypeId: object.ProductTypeId,
        PackageCode: object.PackageCode ? object.PackageCode : '',
        IndexCode: String(index),
        Qty: object.reviewedWt ? object.reviewedWt : 0
      });
    });

    // 4th Object: Product wise all lot list and their entered wt details
    formModel.reviewParamArr.forEach((object, index) => {
      object.LotDetails.forEach(LotObject => {

        if (LotObject.lotReviewedWt > 0) {
          reviewLotDetailsForApi.LotProductList.push({
            // RawSupId: object.RawSupId,
            // StrainId: object.StrainId,
            // PkgTypeId: object.PkgTypeId,
            // UnitValue: object.UnitValue,
            ProductTypeId: object.ProductTypeId,
            LotId: LotObject.LotId,
            Qty: LotObject.lotReviewedWt ? LotObject.lotReviewedWt : 0
          });
        }

        lotProductListArr.push({
          RawSupId: object.RawSupId,
          StrainId: object.StrainId,
          PkgTypeId: object.PkgTypeId,
          UnitValue: object.UnitValue,
          ItemQty: object.ItemQty,
          ProductTypeId: object.ProductTypeId,
          LotId: LotObject.LotId,
          Qty: LotObject.lotReviewedWt ? LotObject.lotReviewedWt : 0
        });

      });
    });
    // 2nd Object: All Products unique lot id and sum of lot wt

    // const result = _.groupBy(completeLotDetailsForApi.LotProductList , c => {
    //   return [c.LotId];
    // });

    _.mapValues(_.groupBy(lotProductListArr, 'LotId'),
      (clist, LotId) => {
        let lotTotalWt = 0;
        let lotReturnedWt = 0;
        let lotAssignedWt = 0;
       // let toleranceValue = 0;
        let lotFormIndex = 0;
        const tolerance = Number(this.TaskModel.Threshold);

        clist.map(LotDetails => {
          lotTotalWt += (LotDetails.Qty * LotDetails.UnitValue * LotDetails.ItemQty);
        });

        formModel.lotReturnWtArr.forEach((object, index) => {
          if (Number(object.LotId) === Number(LotId)) {
            lotReturnedWt = Number(object.lotReturnedWt);
            lotAssignedWt = Number(object.AssignedWt);
            lotFormIndex = index;
          }
        });

        if (this.enabledReturnwtbox === true)  {
          lotReturnedWt = lotReturnedWt;
        } else {
        // PkgReturnedWt =  Total Pkg Assigned Wt - Total Pkg Processed Wt
        const autoProcessweight = Number(this.lotMap.get(Number(LotId)));
        if (Number(lotAssignedWt < Number(autoProcessweight))) {
          lotReturnedWt = 0;
        } else {
          lotReturnedWt = Number(parseFloat(String(Number(lotAssignedWt) - Number(this.lotMap.get(Number(LotId))))).toFixed(2));
        }
      }

       // LotReturnedWt = Number(LotAssignedWt) - Number(this.lotMap.get(Number(LotId)));

        let processedwt = 0;
        let assignWt = 0;
        let thresholdReturnwt = 0;
        const isReturnWTEnabled = 0;
        assignWt = Number(lotAssignedWt);
        processedwt = this.lotMap.get(Number(LotId));
        thresholdReturnwt = lotReturnedWt;
        const thresholdPlus = Number(this.TaskModel.Threshold);
        const thresholdMinus = Number(this.TaskModel.ThresholdMinus);
        let plustoleranceValue  ;
        let minustoleranceValue  ;
        plustoleranceValue = (assignWt) * Number(thresholdPlus) / 100;
        minustoleranceValue = (assignWt) * Number(thresholdMinus) / 100;

         if (Number(assignWt)  < Number(processedwt) + Number(thresholdReturnwt)) {
          if (Number(thresholdPlus) > 0 ) {
            if ( Math.abs((Number(assignWt) - Number(processedwt) + Number(thresholdReturnwt))) > plustoleranceValue  ) {
               this.msgs = [];
               this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
               detail: this.assignTaskResources.MismatchTotalandassignedwt });
              // return;
              isthresholdexceeded = true;
          }
         } else if (Number(thresholdPlus) === 0 )  {
          this.msgs = [];
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.assignTaskResources.MismatchTotalandassignedwt  });
          // return;
          isthresholdexceeded = true;
         }
        // completeLotDetailsForApi.TaskDetails['ReturnWt'] = 0;
       }
       if (Number(assignWt) >  Number(processedwt) + Number(thresholdReturnwt)) {
        if (Number(thresholdMinus) > 0 ) {
          if ( Math.abs(Number(assignWt) - Number(processedwt) + Number(thresholdReturnwt) ) > minustoleranceValue ) {
               this.msgs = [];
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
               detail: this.assignTaskResources.MismatchTotalandassignedwt });
            // return;
            isthresholdexceeded = true;
            }
         } else if (Number(thresholdMinus) === 0 )  {
                  this.msgs = [];
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                  detail: this.assignTaskResources.MismatchTotalandassignedwt  });
                // return;
                isthresholdexceeded = true;
         }
      }

        // commmented by sanjay 04012019
        reviewLotDetailsForApi.LotDetails.push({
          LotId: Number(LotId),
          Weight: Number(this.lotMap.get(Number(LotId))) ? Number(this.lotMap.get(Number(LotId))) : 0,
          ReturnWt: thresholdReturnwt
        });
      });

      this.TaskModel.AssignQtyLotDetails.forEach((object, index) => {
      if ( reviewLotDetailsForApi.LotDetails.filter(r => r.LotId === object.LotId).length <= 0) {
          reviewLotDetailsForApi.LotDetails.push({
            LotId: object.LotId,
            Weight: 0,
            ReturnWt: object.ReturnWt
          });
        }
      });

    // 5th Object: Mix Lot Details
    formModel.reviewParamArr.forEach((object, index) => {
      if (object.MixLotDetails.length > 0) {
        object.MixLotDetails.forEach((MixLotObject, childIndex) => {
          // if (this.selectedMixLotsArray[index + '' + childIndex]) {
          //   this.selectedMixLotsArray[index + '' + childIndex].forEach(item => {
          //     reviewLotDetailsForApi.MixPkgDetails.push({
          //       SkewKeyName: 'BUD',
          //       MixPkgId: MixLotObject.mixPkgId,
          //       MixPkgNo: index + '' + childIndex,
          //       ProductTypeId: object.ProductTypeId,
          //       LotId: Number(item.LotNo),
          //       Weight: item.SelectedWt ? item.SelectedWt : 0
          //     });
          //   });
          // }
          reviewLotDetailsForApi.MixPkgDetails.push({
            SkewKeyName: 'BUD',
            MixPkgId: MixLotObject.mixPkgId,
            MixPkgNo: index + '' + childIndex,
            ProductTypeId: object.ProductTypeId,
            LotId: 0,
            Weight: 0
          });
        });
      }
    });
      // End of Mix Lot Details

    if ( isthresholdexceeded) {
      isthresholdexceeded = false;
      return; }
    // if (thresholdExceed) { return; }

    this.confirmationService.confirm({
      message: this.assignTaskResources.taskcompleteconfirm,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
            // http call starts
            this.loaderService.display(true);

            this.taskCommonService.submitTaskReview(reviewLotDetailsForApi)
              .subscribe(data => {
                if (String(data).toLocaleUpperCase() === 'NOREVIEW') {
                  this.msgs = [];
                  this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskalreadyreviewed });
                  this.TaskModel.TaskStatus = this.taskStatus.Completed;

                  if (this._cookieService.UserRole === this.userRoles.Manager &&
                    this.TaskModel.IsReview &&
                    this.TaskModel.TaskStatus === this.taskStatus.Completed) {
                    this.showToManager = true;
                  }

                  setTimeout(() => {
                    this.router.navigate(['home/taskaction', this.taskType, this.taskId]);
                  }, 1000);

                } else if (String(data).toLocaleUpperCase() === 'DELETED') {
                  this.msgs = [];
                  this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskActionCannotPerformR });

                  setTimeout(() => {
                    if (this._cookieService.UserRole === this.userRoles.Manager) {
                      this.router.navigate(['home/managerdashboard']);
                    } else {
                      this.router.navigate(['home/empdashboard']);
                    }
                  }, 1000);
                } else if (String(data).toLocaleUpperCase() === 'FAILURE') {
                  this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
                } else if (String(data).toLocaleUpperCase() === 'SUCCESS') {
                  this.TaskModel.TaskStatus = this.taskStatus.Completed;

                  if (this._cookieService.UserRole === this.userRoles.Manager &&
                    this.TaskModel.IsReview &&
                    this.TaskModel.TaskStatus === this.taskStatus.Completed) {
                    this.showToManager = true;
                  }

                  this.msgs = [];
                  this.msgs.push({ severity: 'success', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.reviewsubmittedsuccess });

                  setTimeout(() => {
                    if (this._cookieService.UserRole === this.userRoles.Manager) {
                      this.router.navigate(['home/managerdashboard']);
                    } else {
                      this.router.navigate(['home/empdashboard']);
                    }
                  }, 1000);
                } else {
                  if (String(data[0].ResultKey).toLocaleUpperCase() === 'DUPLICATE') {
                    data.forEach(dataItem => {
                      const arrIndexCode = String(dataItem.IndexCode).split('##');
                      const uniquecodeBox = (<FormGroup>this.completionForm.get('reviewParamArr.' + arrIndexCode[0]))
                      .get('packageCode');
                      this.msgs = [];
                      this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.duplicatePackageCode });
                      duplicateEntry = true;

                      (uniquecodeBox as FormControl).setErrors({ 'duplicate': true });
                      return;
                    });
                  }
                }
              },
              () => {
                if (!(duplicateEntry === false)) {
                  return;
                } else {
                  this.PageFlag.showReviewmodal = false;
                }
              }
            );
            // this.PageFlag.showReviewmodal = false;
            // http call ends
            // Commented by DEVDAN :: 26-Sep2018 :: Optimizing API Calls
            // this.refreshService.PushChange().subscribe(
            //   msg => {
            //   });
            this.loaderService.display(false);
          },
          reject: () => {
              // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
          }
      });
    } else {
      this.appCommonService.validateAllFields(this.reviewForm);
    }
  }

  // Created by Devdan :: 12-Oct-2018 :: to set the ng model values
  setFormInEditMode(lotweight) {
    this.TaskModel.BUDPACKAGING = {
      lotno: this.TaskModel.TaskDetails.LotId,
      brand: null,
      strain: this.TaskModel.TaskDetails.StrainId,
      startdate: this.TaskModel.startdate,
      enddate: '',
      endtime: '',
      employee: this.TaskModel.TaskDetails.EmpId,
      esthrs: '',
      priority: this.TaskModel.TaskDetails.TaskPriority,
      notifymanager: this.TaskModel.TaskDetails.IsManagerNotify,
      notifyemployee: this.TaskModel.TaskDetails.IsEmpNotify,
      usercomment: this.TaskModel.BudPckgTaskDetails.Comment,
      lotweight: lotweight,
      orderno: this.TaskModel.TaskDetails.OrderId
    };
  }

  // Added by Devdan :: 15-Oct-2018 :: Setting existing lot list
  setSelectedLotDetails(objOrder) {
    this.orderDetailsBS_filteredData.forEach((order, index) => {
      const lotDetails = [];
      this.TaskModel.BudPckgLotDetails.
      forEach((lot, index1) => {
      const availableLots = this.globalData.orderDetails['Table1'].filter(result => result.LotId === lot.LotId);
      if (lot.StrainId === order.StrainId && availableLots.length > 0) {
        lotDetails.push(
          {
            LotListId: 0,
            LotNo: lot.LotId,
            GrowerLotNo: lot.GrowerLotNo,
            AvailWt: availableLots[0].AvailableWt,
            SelectedWt: lot.AssignedWt,
            Selected: true,
            Index: '',
            StrainId: lot.StrainId,
            StrainName: lot.StrainName,
            BrandId: '', // this.TaskModel.BudPckgOrderDetails[index].BrandId
            GeneticsId:  lot.GeneticsId,
            GeneticsName:  lot.GeneticsName
          }
        );
      }
      this.selectedLotsArray[index] = lotDetails;
    });
  });
  this.appCommonService.setLocalStorage('selectedLotsArray', JSON.stringify(this.selectedLotsArray));
  }

  commentIconClicked(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotCommentModal = true;
    this.loaderService.display(false);
  }

}
