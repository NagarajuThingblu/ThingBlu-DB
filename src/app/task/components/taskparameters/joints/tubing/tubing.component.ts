import { LoaderService } from './../../../../../shared/services/loader.service';
import { forEach } from '@angular/router/src/utils/collection';
import { element } from 'protractor';
import { GlobalResources } from './../../../../../global resource/global.resource';
import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { DropdownValuesService } from '../../../../../shared/services/dropdown-values.service';
import { TaskCommonService } from '../../../../services/task-common.service';
import { Message, SelectItem, ConfirmationService } from 'primeng/api';
import { TaskResources } from '../../../../task.resources';
import { PositiveIntegerValidator } from '../../../../../shared/validators/positive-integer.validator';
import { OrderService } from '../../../../../order/service/order.service';
import { DropdwonTransformService } from '../../../../../shared/services/dropdown-transform.service';
import * as _ from 'lodash';
import { AppConstants } from '../../../../../shared/models/app.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from '../../../../../shared/models/user.model';
import { CookieService } from 'ngx-cookie-service';
import { validateConfig } from '@angular/router/src/config';
import { AppCommonService } from '../../../../../shared/services/app-common.service';
import { Title } from '@angular/platform-browser';
import { RefreshService } from '../../../../../dashboard/services/refresh.service';

@Component({
  moduleId: module.id,
  selector: 'app-tubing',
  templateUrl: './tubing.component.html',
  styles: [`
      p-header.accordionHeader p.panel-titleCompletion {
        width: calc(100% - 120px);
        display: inline-block;
        margin: 0px;
        padding: 0px;
    }
  `]
})
export class TubingComponent implements OnInit, OnDestroy {

  TUBING: FormGroup;
  completionForm: FormGroup;
  reviewForm: FormGroup;

  @Input() AssignRole: any;

  public orderDetails: any;
  public orderDetailsBS: any;
  public orderDetailsBS_filteredData: any = [];
  public allOrders: any;
  public allOrderNos: any;
  public showLotSelectionModel = false;
  public showLotCompletiionModal = false;
  public showMixLotSelectionModel = false;

  public assignRole: any;

  public taskId: any;
  public taskType: any;
  public _cookieService: UserModel;
  public taskReviewModel: any;
  public orderLotDetails: any;
  public showProductTypeLotDetailsModal = false;
  public productTypeLotDetails: any;
  public strainLots: any[] = [];
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
    combinationTotalAssignedQty: null,
    GeneticsId: 0,
    GeneticsName: null,
    pkgSizeRequiredQtyArr: []
  };

  public selMixLotPkgRow = {
    BrandId: null,
    StrainId: null,
    BrandName: null,
    StrainName: null,
    RequireQty: null,
    selectedRowIndex: null,
    ParentRowIndex: null,
    combinationTotalAssignedQty: null,
    GeneticsId: 0,
    GeneticsName: null
  };

  // public OrderObject: any; // Commented by Devdan :: 26-Oct-2018 :: Unused
  public defaultDate: Date;
  public showToManager = false;
  public lotMap = new Map<any, any>();

  public lotBalancedQtyMap = new Map<any, any>();
  public productTypeQtyMap = new Map<any, any>();

  // Joint Production Dashboard Redirection Details
  public prodDBRouteParams: any;

  public readonlyFlag: Boolean = false;
  public readonlyEmployeeFlag: Boolean = false;
  // End Joint Production Dashboard Redirection Details

  public productTypeMixPkgsDetails: any = [];
  public LotDetails: any;

  // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Variable to Enable/Disable Second Text Box
  isRActSecsDisabled: boolean;

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
    this.prodDBRouteParams = this.appCommonService.prodDBRouteParams;
  }

  public msgs: Message[] = [];

  // public Lots: SelectItem[]; // Commented by Devdan :: 26-Oct-2018 :: Unused
  public employees: SelectItem[];
  public priorities: SelectItem[];
  public strains: SelectItem[];

  public assignTaskResources: any;
  public globalResource: any;
  public taskStatus: any;

  private globalData = {
    employees: [],
    strains: [],
    orderDetails: []
  };

  public brandStrainLots: any;
  public questionForm: FormGroup;
  public lotListForm: FormGroup;
  public selectedLotsArray: any[] = [];
  public selectedMixLotsArray: any[] = [];
  public completedLotArray: any[] = [];

  // TaskCompletionModel = { // Co mmented by Devdan :: 26-Oct-2018 :: Unused
  //   wastematerialwt: '',
  //   oilmaterialwt: '',
  //   jointmaterialwt: '',
  //   usablebudwt: '',
  //   processedwt: '',
  //   assignedwt: ''
  // };

  // public TaskActionDetails: any;  // Commented by Devdan :: 26-Oct-2018 :: Unused

  public selectedLots = [];

  public completionParameters: any = [];
  public completionLots: any = [];
  public uniqueBrandStrain: any = [];
  public disableCompletedQtyArr: any = [];
  public userRoles: any;
  public data;


  // Added by Devdan :: 12-Oct-2018
  taskTypeId: any;

  ngOnDestroy() {
    this.appCommonService.prodDBRouteParams = null;
    this.prodDBRouteParams = null;

    this.lotBalancedQtyMap.clear();
    this.productTypeQtyMap.clear();
    this.lotMap.clear();

    // localStorage.removeItem('selectedMixLotsArray');
    // localStorage.removeItem('selectedLotsArray');

    this.appCommonService.removeItem('selectedMixLotsArray');
    this.appCommonService.removeItem('selectedLotsArray');
  }

  ngOnInit() {

    // for navigate joint dashboard if employee assign task :: 20-Mar-2019 :: swapnil
    this.assignRole = this.AssignRole ? this.AssignRole : null;
    this.assignTaskResources = TaskResources.getResources().en.assigntask;
    this.globalResource = GlobalResources.getResources().en;
    this.taskStatus = AppConstants.getStatusList;
    this.userRoles = AppConstants.getUserRoles;
    this.titleService.setTitle(this.assignTaskResources.tubingtitle);
    this.defaultDate = this.appCommonService.calcTime(this._cookieService.UTCTime);

    this.route.params.forEach((urlParams) => {
      this.taskId = urlParams['id'];
      this.taskType = urlParams['taskType'];
      // Get the task type id from data received from resolver
      if (this.TaskModel.TaskDetails) {
        this.taskTypeId = this.TaskModel.TaskDetails.TaskTypeId;
      }
    });

    // console.log(this.TaskModel);

    if (this.PageFlag.page !== 'TaskAction') {

      this.TaskModel.TUBING = {
        lotno: null,
        brand: null,
        strain: null,
        startdate:  this.TaskModel.startdate,
        enddate: null,
        endtime: null,
        esthrs: null,
        priority: 'Normal',
        notifymanager: this.TaskModel.IsManagerNotify ? this.TaskModel.IsManagerNotify : false,
        notifyemployee: this.TaskModel.IsEmployeeNotify ? this.TaskModel.IsEmployeeNotify : false,
        usercomment: null,
        orderno: null,
        employee: null,
      };

      this.questionForm = this.fb.group({
        questions: new FormArray([])
      });

      this.TUBING = new FormGroup({
        'lotno': new FormControl(''),
        'brand': new FormControl(''),
        'strain': new FormControl('', Validators.required),
        'employee': new FormControl('', Validators.required),
        'estimatedstartdate': new FormControl('',  Validators.compose([Validators.required])),
        'estimatedenddate': new FormControl(''),
        // 'estimatedenddate': new FormControl('',  Validators.compose([Validators.required])),
        'esthrs': new FormControl(''),
        'priority': new FormControl(''),
        'notifymanager': new FormControl(''),
        'notifyemployee': new FormControl(''),
        'comment': new FormControl('', Validators.maxLength(500)),
        // 'orderno': new FormControl('', Validators.required),
        jointsOrderPackets: this.fb.array([]),
      });

      this.getTubingStrainListByClient();
      this.employeeListByClient();

      this.priorities =  [
        {label: 'Normal', value: 'Normal'},
        {label: 'Important', value: 'Important'},
        {label: 'Critical', value: 'Critical'}
      ];

      this.ParentFormGroup.addControl('TUBING', this.TUBING);

      // Populate strain & lot by default. Joint production dashboard functionality
      if (this.prodDBRouteParams) {
        this.TaskModel.TUBING.strain = this.prodDBRouteParams.StrainId;
        this.TaskModel.TUBING.employee = this._cookieService.EmpId;

        if (String(this._cookieService.UserRole) === String(this.userRoles.Employee)) {
          this.readonlyEmployeeFlag = true;
        }
        this.readonlyFlag = true;
        (this.ParentFormGroup.get('TUBING') as FormGroup).get('strain').patchValue(this.TaskModel.TUBING.strain);
        this.onStrainChange();
      }
      // End of Populate strain & lot by default. Joint production dashboard functionality
    } else {

      this.lotListForm = this.fb.group({
        completedLots: new FormArray([])
      });

      // Lot Mixing
      this.questionForm = this.fb.group({
        questions: new FormArray([])
      });
      // End of Lot Mixing

      this.uniqueBrandStrain = this.removeDuplicatesByName(this.TaskModel.AssignQtyDetails);

      this.taskReviewModel = {
        // Commented by Devdan :: Sec to Min change :: 06-Nov-2018 :: Seconds to HR-MM-SS Logic
        // racthrs: this.TaskModel.RevHrs ? this.TaskModel.RevHrs : this.padLeft(String(Math.floor(this.TaskModel.ActHrs / 60)), '0', 2),
        racthrs: this.TaskModel.RevHrs ?  this.TaskModel.RevHrs : this.padLeft(String(Math.floor(this.TaskModel.ActHrs / 3600)), '0', 2),
        // ractmins: this.padLeft(String(this.TaskModel.ActHrs % 60), '0', 2),
        ractmins: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) / 60)), '0', 2),
        // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Getting Seconds.
        ractsecs: this.padLeft(String(Math.floor((this.TaskModel.ActHrs % 3600) % 60)), '0', 2),
        rmisccost: this.TaskModel.RevMiscCost ? this.TaskModel.RevMiscCost : this.TaskModel.MiscCost,
      };

       // Set the Review Actual Seconds Fields Disabled or Enabled :: By Devdan :: Sec to Min change :: 06-Nov-2018
       this.isRActSecsDisabled = (this.taskReviewModel.racthrs !== '00') || (this.taskReviewModel.ractmins !== '00');

      if (this._cookieService.UserRole === this.userRoles.Manager && this.TaskModel.IsReview && this.TaskModel.TaskStatus === this.taskStatus.Completed) {
        this.showToManager = true;
      }

      this.completionForm = this.fb.group({
        MiscCost: new FormControl(null),
        MiscComment: new FormControl(null),
        completeParamArr:  this.fb.array(this.TaskModel.AssignQtyDetails.map(this.generateCompletionParams(this.fb)))
        // companies: this.fb.array([])
      });

      if (this.TaskModel.TaskStatus === this.taskStatus.InProcess || this.TaskModel.TaskStatus === this.taskStatus.Paused ) {
        this.calculateMixLotQty([], 'ALL');
      }

      this.reviewForm = this.fb.group({
        ActHrs: new FormControl(null),
        ActMins: new FormControl(null, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
        // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Getting Seconds.
        ActSecs: new FormControl({value: null, disabled: this.isRActSecsDisabled}, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
        MiscCost: new FormControl(null),
        MiscComment: new FormControl(null),
        reviewParamArr:  this.fb.array(this.TaskModel.AssignQtyDetails.map(this.generateReviewParams(this.fb)))
      });

      if (this.TaskModel.TaskStatus === this.taskStatus.ReviewPending) {
        this.calculateMixLotQtyForReview([], 'ALL');
      }
      // this.setCompanies();
    }
  }

  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
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

  get reviewParamArr(): FormArray {
    return this.reviewForm.get('reviewParamArr') as FormArray;
  }

  get jointsOrderPackets(): FormArray {
    // return this.TUBING.get('jointsOrderPackets') as FormArray;
    return (this.ParentFormGroup.get('TUBING') as FormGroup).get('jointsOrderPackets') as FormArray;
  }

  lotInnerFormArray(comp): FormArray {
    return comp.get('LotDetails') as FormArray;
  }

  // Lot Mixing Function
  mixLotDetailsArr(comp): FormArray {
    return comp.get('MixLotDetails') as FormArray;
  }

  addItem(comp: FormGroup, mixLot: FormGroup): void {
    if (Number(this.productTypeQtyMap.get(comp.value.ProductTypeId)) >= comp.value.completedQty) {
      this.msgs = [];
      this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.maxpkglimitexceed });
      return;
    }
    this.productTypeQtyMap.set(comp.value.ProductTypeId, Number(this.productTypeQtyMap.get(comp.value.ProductTypeId) + 1));

    this.mixLotDetailsArr(comp).push(this.createMixItem(comp, 0));

    const packagesCompletedBox = (<FormGroup>comp)
    .get('completedQty');

    packagesCompletedBox.markAsTouched();
    packagesCompletedBox.updateValueAndValidity();
  }

  deleteItem(comp: FormGroup, parentIndex: number, childIndex: number) {

    const packagesCompletedBox = (<FormGroup>this.completionForm.get('completeParamArr.' + parentIndex))
    .get('completedQty');

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
    this.calculateMixLotQty([], 'ALL');
  }


  createMixItem(childObject, childIndex): FormGroup {
    return this.fb.group({
      srno: childIndex,
      mixPkgId: childObject.MixPkgId ? childObject.MixPkgId : 0
    });
  }
  // End of Lot Mixing Function

  generateCompletionParams(fb: FormBuilder) {
    return (object, index) => {
      let completedBox;
      let completionFormGroup: FormGroup;

      // this.disableCompletedQtyArr[index] = object.AssignedQty;
      this.disableCompletedQtyArr[index] = Number(object.AssignedQty);
      completedBox = [object.AssignedQty, Validators.max(object.AssignedQty)];

      completionFormGroup =  fb.group({
                    uniqueId: index,
                    completedQty: completedBox,
                    RawSupId: 0,
                    StrainId: object.StrainId,
                    PkgTypeId: object.PkgTypeId,
                    UnitValue: object.UnitValue,
                    ItemQty: object.ItemQty,
                    ProductTypeId: index,
                    AssignedQty: object.AssignedQty,
                    LotDetails: this.fb.array(

                      this.TaskModel.AssignQtyLotDetails
                      .filter(result => result.GeneticsId === this.TaskModel.AssignQtyDetails[index].GeneticsId
                        && result.UnitValue === this.TaskModel.AssignQtyDetails[index].UnitValue
                      )
                      .map((object1, index1) => {
                        return this.createLotControls(this.fb, object1, index1, 'Complete');
                      })

                      // this.TaskModel.AssignQtyLotDetails
                      // .filter(result => {
                      //     return result.GeneticsId === this.TaskModel.AssignQtyDetails[index].GeneticsId;
                      // })
                      // .map((object1, index1) => {
                      //   return this.createLotControls(this.fb, object1, index1, 'Complete');
                      // })

                    ),
                    MixLotDetails: this.fb.array([])
                  });

                // for (let pkgIndex = 1; pkgIndex <= object.AssignedQty; pkgIndex++) {
                //   (completionFormGroup.get('LotDetails') as FormArray).push({
                //     LotId: object.LotId,
                //     lotCompletedQty: checkbox,
                //     GrowerLotNo: object.GrowerLotNo,
                //     AssignedWt: object.AssignedWt,
                //     LotNoteCount: object.LotNoteCount
                //   });
                // }
                return completionFormGroup;
      };
  }

  generateReviewParams(fb: FormBuilder) {
    return (object, index) => {
      let reviewBox;
      // this.TaskModel.ReviewQtyLotDetails
      // .filter(result =>  result.StrainId === object.StrainId
      //   && result.PkgTypeId === object.PkgTypeId && result.UnitValue === object.UnitValue).forEach(obj => {
      //   this.disableCompletedQtyArr[index] += Number(obj.ProcessedQty);
      // });
      if (this.TaskModel.TaskStatus === this.taskStatus.ReviewPending) {
        this.disableCompletedQtyArr[index] = 0;
        this.disableCompletedQtyArr[index] = Number(object.CompletedQty);
      }

      reviewBox = [this.disableCompletedQtyArr[index]];

      this.strainLots[index] =   _.uniqWith(this.dropdwonTransformService.transform(
        this.TaskModel.ReviewQtyLotDetails
       .filter(result =>
        // result.ProductTypeId === object.ProductTypeId
        // result.StrainId === object.StrainId &&
        result.PkgTypeId === object.PkgTypeId &&
        result.UnitValue === object.UnitValue &&
        result.ItemQty === object.ItemQty
        ),
         'GrowerLotNo', 'LotId', '-- Select --')
     , _.isEqual);
      return fb.group({
                uniqueId: index,
                reviewedQty: reviewBox,
                RawSupId: 0,
                StrainId: object.StrainId,
                PkgTypeId: object.PkgTypeId,
                UnitValue: object.UnitValue,
                ItemQty: object.ItemQty,
                ProductTypeId: index,
                AssignedQty: object.AssignedQty,
                LotDetails: this.fb.array(

                  this.TaskModel.ReviewQtyLotDetails
                  .filter(result =>
                    // result.ProductTypeId === object.ProductTypeId
                    // result.StrainId === object.StrainId &&
                    result.PkgTypeId === object.PkgTypeId &&
                    result.UnitValue === object.UnitValue &&
                    result.ItemQty === object.ItemQty
                    )
                  .map((object1, index1) => {
                      return this.createLotControls(this.fb, object1, index1, 'Review');
                    })

                  // this.TaskModel.ReviewQtyLotDetails
                  // .filter(result =>  result.ProductTypeId === object.ProductTypeId
                  //  )
                  // .map(this.createReviewLotControls(this.fb, 'Review'))
                ),
                MixLotDetails: this.fb.array(
                  _.uniqBy(this.TaskModel.MixedLotPkgDetails, 'MixPkgId')
                  .filter(result =>
                    // result.ProductTypeId === object.ProductTypeId
                    //  result.StrainId === object.StrainId &&
                    result.PkgTypeId === object.PkgTypeId &&
                    result.UnitValue === object.UnitValue &&
                    result.ItemQty === object.ItemQty
                    )
                  .map((childObject, childIndex) => {
                    this.selectedMixLotsArray[index + '' + childIndex] = [];
                     this.TaskModel.MixedLotPkgDetails.map((data, index1) => {
                      if (data.MixPkgId === childObject.MixPkgId) {
                        this.selectedMixLotsArray[index + '' + childIndex].push({
                            LotNo: data.LotId,
                            GrowerLotNo: data.GrowerLotNo,
                            AvailWt: data.AvailWt,
                            SelectedJointsQty: Number(data.Qty),
                            AssignedJointsQty: data.AssignedJointsQty,
                            Selected: true,
                            Index: index1,
                            StrainId: 0,
                            BrandId: 0,
                            StrainName: data.StrainName,
                            GeneticsId:  data.GeneticsId,
                            GeneticsName:  data.GeneticsName
                        });
                      }
                  });
                    return this.createMixItem(childObject, childIndex);
                  })
                )
              });
      };
  }

  // Mix Lot Total Qty
  calculateMixLotQty(question, Flag) {
    if (String(Flag).toLocaleUpperCase() === 'SPECIFIC') {
    } else if (String(Flag).toLocaleUpperCase() === 'ALL') {

          this.lotMap.clear();
          this.lotBalancedQtyMap.clear();
          this.productTypeQtyMap.clear();
          // Iterate throught each product type
          this.completeParamArr.controls.forEach((productTypeItem, parentIndex) => {
            // Iterate throught every lot in above product type
            (productTypeItem as FormArray).controls['LotDetails'].controls.forEach(lotDetails => {
              if (this.lotMap.has(lotDetails.value.LotId + '' + productTypeItem.value.UnitValue)) {
                this.lotMap.set(lotDetails.value.LotId + '' + productTypeItem.value.UnitValue,
                  Number(this.lotMap.get(lotDetails.value.LotId + '' + productTypeItem.value.UnitValue)) +
                  (Number(lotDetails.value.lotCompletedQty) *
                  Number(productTypeItem.value.ItemQty))
                );

                this.lotBalancedQtyMap.set(lotDetails.value.LotId + '' + productTypeItem.value.UnitValue,
                  Number(lotDetails.value.AssignedJointsQty) -
                  Number(this.lotMap.get(lotDetails.value.LotId + '' + productTypeItem.value.UnitValue)));
              } else {
                this.lotMap.set(lotDetails.value.LotId + '' + productTypeItem.value.UnitValue ,
                  (Number(lotDetails.value.lotCompletedQty) *
                  Number(productTypeItem.value.ItemQty))
                 );

                  this.lotBalancedQtyMap.set(lotDetails.value.LotId + '' + productTypeItem.value.UnitValue,
                    Number(lotDetails.value.AssignedJointsQty) -
                    Number(this.lotMap.get(lotDetails.value.LotId + '' + productTypeItem.value.UnitValue)));
              }

              if (this.productTypeQtyMap.has(productTypeItem.value.ProductTypeId)) {
                this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
                  (Number(this.productTypeQtyMap.get(productTypeItem.value.ProductTypeId)) + Number(lotDetails.value.lotCompletedQty)));
              } else {
                this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
                  Number(lotDetails.value.lotCompletedQty));
              }
            });

            (productTypeItem as FormArray).controls['MixLotDetails'].controls.forEach((mixLotDetails, childIndex) => {
              if (this.selectedMixLotsArray[parentIndex + '' + childIndex]) {

                this.selectedMixLotsArray[parentIndex + '' + childIndex].forEach(element2 => {
                  if (this.lotMap.has(element2.LotNo + '' + productTypeItem.value.UnitValue)) {
                    this.lotMap.set(element2.LotNo + '' + productTypeItem.value.UnitValue ,
                      Number(this.lotMap.get(element2.LotNo + '' + productTypeItem.value.UnitValue)) +
                      Number(element2.SelectedJointsQty));
                  } else {
                    this.lotMap.set(element2.LotNo + '' + productTypeItem.value.UnitValue ,
                      Number(element2.SelectedJointsQty));
                  }
                  this.lotBalancedQtyMap.set(element2.LotNo + '' + productTypeItem.value.UnitValue,
                    Number(element2.AssignedJointsQty) - Number(this.lotMap.get(element2.LotNo + '' + productTypeItem.value.UnitValue)));
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
  // End of Mix Lot Total Qty

    // Mix Lot Total Qty For Review
    calculateMixLotQtyForReview(question, Flag) {
      if (String(Flag).toLocaleUpperCase() === 'SPECIFIC') {
      } else if (String(Flag).toLocaleUpperCase() === 'ALL') {
          this.lotMap.clear();
          this.lotBalancedQtyMap.clear();
          this.productTypeQtyMap.clear();
          // Iterate throught each product type
          this.reviewParamArr.controls.forEach((productTypeItem, parentIndex) => {
            // Iterate throught every lot in above product type
            (productTypeItem as FormArray).controls['LotDetails'].controls.forEach(lotDetails => {
              if (this.lotMap.has(lotDetails.value.LotId + '' + productTypeItem.value.UnitValue)) {
                this.lotMap.set(lotDetails.value.LotId + '' + productTypeItem.value.UnitValue ,
                  Number(this.lotMap.get(lotDetails.value.LotId + '' + productTypeItem.value.UnitValue)) +
                  (Number(lotDetails.value.lotReviewedQty) * Number(productTypeItem.value.ItemQty))
                );

                this.lotBalancedQtyMap.set(lotDetails.value.LotId + '' + productTypeItem.value.UnitValue,
                  Number(lotDetails.value.AssignedJointsQty) - Number(this.lotMap.get(lotDetails.value.LotId + '' + productTypeItem.value.UnitValue)));
              } else {
                this.lotMap.set(lotDetails.value.LotId + '' + productTypeItem.value.UnitValue ,
                  (Number(lotDetails.value.lotReviewedQty) * Number(productTypeItem.value.ItemQty))
                  );

                  this.lotBalancedQtyMap.set(lotDetails.value.LotId + '' + productTypeItem.value.UnitValue,
                    Number(lotDetails.value.AssignedJointsQty) - Number(this.lotMap.get(lotDetails.value.LotId + '' + productTypeItem.value.UnitValue)));
              }

              if (this.productTypeQtyMap.has(productTypeItem.value.ProductTypeId)) {
                this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
                  (Number(this.productTypeQtyMap.get(productTypeItem.value.ProductTypeId)) + Number(lotDetails.value.lotReviewedQty)));
              } else {
                this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
                  Number(lotDetails.value.lotReviewedQty));
              }
            });

            (productTypeItem as FormArray).controls['MixLotDetails'].controls.forEach((mixLotDetails, childIndex) => {
              if (this.selectedMixLotsArray[parentIndex + '' + childIndex]) {

                this.selectedMixLotsArray[parentIndex + '' + childIndex].forEach(element2 => {
                  if (this.lotMap.has(element2.LotNo + '' + productTypeItem.value.UnitValue)) {
                    this.lotMap.set(element2.LotNo + '' + productTypeItem.value.UnitValue ,
                      Number(this.lotMap.get(element2.LotNo + '' + productTypeItem.value.UnitValue)) +
                      Number(element2.SelectedJointsQty));
                  } else {
                    this.lotMap.set(element2.LotNo + '' + productTypeItem.value.UnitValue ,
                      Number(element2.SelectedJointsQty));
                  }
                  this.lotBalancedQtyMap.set(element2.LotNo + '' + productTypeItem.value.UnitValue,
                    Number(element2.AssignedJointsQty) - Number(this.lotMap.get(element2.LotNo + '' + productTypeItem.value.UnitValue)));
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
    // End of Mix Lot Total Qty For Review

  calculateTotalCompletedQty(index, comp, lot) {
     // this.disableCompletedWtArr[index] = 0;

    //  let lotTotalQty = 0;
    //  let prodTypeTotalPkgQty = 0;

    //  // Iterate throught each product type
    //  this.completeParamArr.controls.forEach((productTypeItem, parentRowIndex) => {

    //    prodTypeTotalPkgQty = 0;
    //    // Iterate throught every lot in above product type
    //    (productTypeItem as FormArray).controls['LotDetails'].controls.forEach(lotDetails => {
    //      if (lotDetails.value.LotId === lot.value.LotId) {
    //       lotTotalQty += (Number(lotDetails.value.lotCompletedQty) * Number(productTypeItem.value.ItemQty));

    //        lotDetails.controls['lotCompletedQty'].updateValueAndValidity();
    //      }
    //      prodTypeTotalPkgQty += Number(lotDetails.value.lotCompletedQty);
    //    });

    //    (productTypeItem as FormArray).controls['MixLotDetails'].controls.forEach((mixLotDetails, childIndex) => {
    //      prodTypeTotalPkgQty += 1;
    //      if (this.selectedMixLotsArray.length > 0) {
    //        this.selectedMixLotsArray[parentRowIndex + '' + childIndex].forEach(element1 => {
    //          if (element1.LotNo === lot.value.LotId) {
    //           lotTotalQty += Number(element1.SelectedJointsQty);
    //          }
    //        });
    //      }
    //    });

    //    this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId, prodTypeTotalPkgQty);
    //  });

    //  // lot total processed wt
    //  this.lotMap.set(lot.value.LotId, lotTotalQty);

    //  // lot total balanced wt
    //  this.lotBalancedQtyMap.set(lot.value.LotId, Number(lot.value.AssignedJointsQty) - lotTotalQty);

    this.calculateMixLotQty([], 'ALL');

     if (Number(this.lotMap.get(lot.value.LotId + '' + comp.value.UnitValue)) > Number(lot.value.AssignedJointsQty)) {
       this.msgs = [];
       this.msgs.push({
         severity: 'warn', summary: this.globalResource.applicationmsg,
         detail: this.assignTaskResources.compqtygreaterassignqty
       });

       lot.controls['lotCompletedQty'].setErrors({ 'GreaterLotQty': true });
     }

     const packagesCompletedBox = (<FormGroup>this.completionForm.get('completeParamArr.' + index))
     .get('completedQty');

     packagesCompletedBox.markAsTouched();
     packagesCompletedBox.updateValueAndValidity();
  }

  calculateTotalReviewedQty(index, comp, lot) {
    this.calculateMixLotQtyForReview([], 'ALL');

    if (Number(this.lotMap.get(lot.value.LotId + '' + comp.value.UnitValue)) > Number(lot.value.AssignedJointsQty)) {
      this.msgs = [];
      this.msgs.push({
        severity: 'warn', summary: this.globalResource.applicationmsg,
        detail: this.assignTaskResources.compqtygreaterassignqty
      });

      lot.controls['lotReviewedQty'].setErrors({ 'GreaterLotQty': true });
    }

    const packagesCompletedBox = (<FormGroup>this.completionForm.get('reviewParamArr.' + index))
    .get('reviewedQty');

    packagesCompletedBox.markAsTouched();
    packagesCompletedBox.updateValueAndValidity();
  }

  compQtyOnChange(index, formArrayObj) {
    // (formArrayObj.get('LotDetails') as FormArray).reset();

    if (formArrayObj.get('completedQty').valid) {
        // this.strainLots[index] =   _.uniqWith(this.dropdwonTransformService.transform(
        //      this.TaskModel.AssignQtyLotDetails
        //     .filter(result =>  result.StrainId === this.TaskModel.AssignQtyDetails[index].StrainId),
        //       'GrowerLotNo', 'LotId', '-- Select --')
        //   , _.isEqual);

        // if ( this.strainLots[index].length === 2) {
        //   defaultLotId = (this.strainLots[index])[1].value;
        // } else { defaultLotId = null; }

        // formArrayObj.setControl('LotDetails', this.fb.array([]));
        // for (let pkgIndex = 1; pkgIndex <= this.disableCompletedQtyArr[index]; pkgIndex++) {
        //   (formArrayObj.get('LotDetails') as FormArray).push(
        //   this.createLotControls(this.fb, pkgIndex, 'Complete', defaultLotId)
        //   );
        // }
        if (this.disableCompletedQtyArr[index] !== 0) {
          formArrayObj.setControl('LotDetails', this.fb.array([]));
          formArrayObj.setControl('MixLotDetails', this.fb.array([]));

          this.TaskModel.AssignQtyLotDetails
          .filter(result => result.GeneticsId === this.TaskModel.AssignQtyDetails[index].GeneticsId
            && result.UnitValue === this.TaskModel.AssignQtyDetails[index].UnitValue
          )
          .map((object, index1) => {
            (formArrayObj.get('LotDetails') as FormArray).push(this.createLotControls(this.fb, object, index1, 'Complete'));
          });

          this.calculateMixLotQty([], 'ALL');
        } else {
          this.mixLotDetailsArr(formArrayObj).controls.forEach((control, childIndex) => {
            this.selectedMixLotsArray[index + '' + childIndex] = [];
          });
          // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
          // localStorage.setItem('selectedMixLotsArray', JSON.stringify(this.selectedMixLotsArray));
          this.appCommonService.setLocalStorage('selectedMixLotsArray', JSON.stringify(this.selectedMixLotsArray));

          // formArrayObj.setControl('LotDetails', this.fb.array([]));
          // formArrayObj.setControl('MixLotDetails', this.fb.array([]));

          this.calculateMixLotQty([], 'ALL');
        }
    }
}

  createLotControls(fb: FormBuilder, object: any, index: number, flag: string) {
    let lotCompletedBox;

    if (flag === 'Complete') {
      lotCompletedBox = [null];
      return fb.group({
        LotId: object.LotId, lotCompletedQty: lotCompletedBox, GrowerLotNo: object.GrowerLotNo,
        AssignedJointsQty: object.AssignedJointsQty, LotNoteCount: object.LotNoteCount, StrainId: object.StrainId
      });
    } else {
      const assignedQty = this.TaskModel.AssignQtyLotDetails.filter(data =>
        data.LotId === object.LotId && data.UnitValue === object.UnitValue && data.StrainId === object.LotStrainId
      )[0].AssignedJointsQty;

      object.AssignedJointsQty = assignedQty;

      lotCompletedBox = [object.ProcessedQty ? object.ProcessedQty : 0];
      return fb.group({
        LotId: object.LotId, lotReviewedQty: lotCompletedBox, GrowerLotNo: object.GrowerLotNo, StrainId: object.StrainId,
        AssignedJointsQty: object.AssignedJointsQty, ProcessedJointsQty: object.ProcessedQty, LotNoteCount: object.LotNoteCount
      });
    }
  }

  createReviewLotControls(fb: FormBuilder, flag: string) {
    return (object, index) => {
      let lotBox;
      lotBox = [object.LotId ? object.LotId : 0, Validators.required];
      return fb.group({ pkgIndex: index + 1, lotno: lotBox, ProductTypeId: object.ProductTypeId });
    };
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
        // Added by Devdan :: 18-Oct-2018
        if (this.taskTypeId > 0 && question.LotId === data.LotNo ) {
          lotRowDetails.push(data);
        } else if (data.Index === index) {
          lotRowDetails.push(data);
        }
        ///// Check if the selected lot is persent in database data In Edit mode
        if (this.taskId && this.taskId > 0) {
          this.TaskModel.TubingLotDetails.forEach(Lot => {
            if (question.LotId === Lot.LotId) {
              isLotPresentInDBData = true;
            }
          });
        }
      });

        if (lotRowDetails.length) {
          const lotQty = lotRowDetails[0].SelectedQty;
          if (this.taskId && this.taskId > 0 && isLotPresentInDBData) {
            checkbox = lotRowDetails[0].Selected;
            answerbox = lotRowDetails[0].Selected
            ? [lotQty, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt + Number(lotQty))])]
            : null;
          } else {
            checkbox = lotRowDetails[0].Selected;
            answerbox = lotRowDetails[0].Selected
            ? [lotQty, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt)])]
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
        return fb.group({question: checkbox, answer: answerbox, questionNumber: index, LotNo: question.LotId, UnitValue: question.UnitValue,
        AvailJointsQty: question.Qty + (answerbox ? Number(answerbox[0]) : 0),
        GrowerLotNo: question.GrowerLotNo, LotNoteCount: question.LotNoteCount,
        GeneticsId: question.GeneticsId, GeneticsName: question.GeneticsName, StrainId: question.StrainId, StrainName: question.StrainName
        });
      } else {
        return fb.group({question: checkbox, answer: answerbox, questionNumber: index, LotNo: question.LotId, UnitValue: question.UnitValue,
        AvailJointsQty: question.Qty,
        GrowerLotNo: question.GrowerLotNo, LotNoteCount: question.LotNoteCount,
        GeneticsId: question.GeneticsId, GeneticsName: question.GeneticsName, StrainId: question.StrainId, StrainName: question.StrainName
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
          if (data.Index === index) {
            lotRowDetails.push(data);
          }
        });

        if (lotRowDetails.length) {
          checkbox = lotRowDetails[0].Selected;
          answerbox = lotRowDetails[0].Selected
            ? [lotRowDetails[0].SelectedJointsQty, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableJointsQty)])]
            : null;
        } else {
          checkbox = question.selected;
          answerbox = question.selected ? [null, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableJointsQty)])]
            : null;
        }
      } else {
        checkbox = question.selected;
        answerbox = question.selected ? [null, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableJointsQty)])]
          : null;
      }
      return fb.group({
        question: checkbox, answer: answerbox, questionNumber: index, LotNo: question.LotId, assignedJointsQty: question.AssignedJointsQty,
        UnitValue: question.UnitValue,
        AvailJointsQty: question.AvailJointsQty, GrowerLotNo: question.GrowerLotNo, LotNoteCount: question.LotNoteCount
      });
    };
  }

  createItem(object, index): FormGroup {
    const counts  = this.globalData.orderDetails['Table1'].filter(result => result.StrainId === object.StrainId).length;

    // In case of Edit , show assigned qty and available qty together with respective size of package
    let eRequiredQty;
    let eAssignedQty;
    if (this.taskTypeId > 0) {
      eRequiredQty = object.RequiredQty; // + this.TaskModel.TubingProductDetails.AssignedQty;
      object.RequiredQty = eRequiredQty;
      object.TotalWt = (eRequiredQty * this.TaskModel.TubingProductDetails.UnitValue);
      eAssignedQty = this.TaskModel.TubingProductDetails.AssignedQty;
    } else {
      eAssignedQty = object.RequiredQty;
    }
        return this.fb.group({
          assignQty: new FormControl({value : counts === 0 ? 0 : eAssignedQty, disabled: counts === 0 }, Validators.max(object.RequiredQty)),
          brandid: 0,
          strainid: object.StrainId,
          packagetypeid: object.PkgTypeId,
          packagetype: object.PkgTypeName,
          packageunit: object.UnitValue,
          pkgTypeId: object.PkgTypeId,
          itemQty: object.ItemQty,
          requiredQty: object.RequiredQty,
          productTypeId: 1
        });
  }
  // createItem(fb: FormBuilder) {
  //   return (object, index) => {
  //     return fb.group({
  //       assignQty: new FormControl(null, [Validators.max(object.Qty)]),
  //       brandid: object.RawSupId,
  //       strainid: object.StrainId,
  //       packagetypeid: object.PkgTypeId,
  //       packagetype: object.PkgTypeName,
  //       packageunit: object.UnitValue
  //     });
  //   };
  // }

  // To show completion or review details of selected product type on action details page
  getLotsInfo(details) {
    this.orderLotDetails = this.TaskModel.AssignQtyDetails.filter(result =>
      // result.ProductTypeId === details.ProductTypeId
      // result.StrainId === details.StrainId &&
      result.PkgTypeId === details.PkgTypeId &&
      result.UnitValue === details.UnitValue &&
      result.ItemQty === details.ItemQty
    )[0];

    this.LotDetails = this.TaskModel.AssignQtyDetails.filter(r =>
      // r.StrainId === details.StrainId &&
      r.PkgTypeId === details.PkgTypeId &&
      r.UnitValue === details.UnitValue &&
      r.ItemQty === details.ItemQty
      )[0];
    this.showProductTypeLotDetailsModal = true;

    this.productTypeLotDetails = this.TaskModel.ReviewQtyLotDetails
    .filter(result =>
      // result.ProductTypeId === details.ProductTypeId
      // result.StrainId === details.StrainId &&
      result.PkgTypeId === details.PkgTypeId &&
      result.UnitValue === details.UnitValue &&
      result.ItemQty === details.ItemQty
      );

    this.productTypeMixPkgsDetails['PkgDetails'] = _.uniqBy(this.TaskModel.MixedLotPkgDetails, 'MixPkgId');
  }

  getPkgMixLotDetails(MixPkgId) {
    return this.TaskModel.MixedLotPkgDetails.filter(data => data.MixPkgId === MixPkgId);
  }

  displayLotDetails(orderDetail) {
    // return this.TaskModel.AssignQtyLotDetails.filter(result => result.RawSupId === orderDetail.RawSupId && result.StrainId === orderDetail.StrainId);
    return this.TaskModel.AssignQtyLotDetails.filter(result => result.GeneticsId === orderDetail.GeneticsId);
  }

  assignQtyOnChange(jointsOrderPacket, maxValue) {
    // this.orderDetailsBS.filter();

    // if (!budOrderPacket.controls['assignQty'].valid) {
    //   // budOrderPacket.controls['assignQty'].value = '';
    //   return;
    // }

    const assignQtyBox = jointsOrderPacket.get('assignQty');

    const validators = assignQtyBox.value ? Validators.compose([null,  Validators.max(maxValue)]) : null;
    assignQtyBox.setValidators(validators);
    assignQtyBox.updateValueAndValidity();
  }

  changeValidator(selected, index) {
    const answerbox = this.questionForm.get('questions.' + index).get('answer');
    const availableqty = this.questionForm.get('questions.' + index).get('AvailJointsQty');

    const validators = selected ? Validators.compose([Validators.required, Validators.min(0.1), Validators.max(availableqty.value)]) : null;
    answerbox.setValidators(validators);
    answerbox.updateValueAndValidity();
  }

  showLotNote(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotNoteModal = true;
  }

  estStartDate_Select() {
    if (((new Date(this.returnFormattedDate(this.defaultDate)) >
      new Date(this.TUBING.value.estimatedstartdate)))) {
      this.showPastDateLabel = true;
    } else {
      this.showPastDateLabel = false;
    }
  }

  onNoteSave(lotComments) {
    this.uniqueBrandStrain = this.uniqueBrandStrain;
  }

  returnFormattedDate(dateObject) {
    return new Date(dateObject).toLocaleDateString().replace(/\u200E/g, '');
  }

  employeeListByClient() {
    this.dropdownDataService.getEmployeeListByClient().subscribe(
      data => {
        this.globalData.employees = [];
        this.globalData.employees = data;
        this.employees = this.dropdwonTransformService.transform(data, 'EmpName', 'EmpId', '-- Select --');
      } ,
      error => { console.log(error); },
      () => console.log('Get all employees by client complete'));
  }

  getTubingStrainListByClient() {
    // Added by Devdan :: 20-Oct-2018
    let editmode;
    if (this.taskTypeId > 0) {
      editmode = true;
    } else {
      editmode = false;
    }
    this.taskCommonService.getTubingStrainListByClient().subscribe(
      data => {
        this.globalData.strains = [];
        this.globalData.strains = data;
        this.strains = this.dropdwonTransformService.transform(data, 'StrainName', 'StrainId', '-- Select --');

        // Added by Devdan :: 19-Oct-2018 :: Load Stain Change Event
        if (this.taskTypeId > 0) {
          this.setFormInEditMode();
          this.onStrainChange();
          this.readonlyFlag = true;
        }

      } ,
      error => { console.log(error); },
    );
  }

  onStrainChange() {
    let strainId;
    if (this.taskTypeId > 0) {
      strainId = this.TaskModel.TUBING.strain;
    } else {
      strainId = (this.ParentFormGroup.get('TUBING') as FormGroup).get('strain').value;
    }
    const productTypeParam = {};

     // Populate strain & lot by default. Joint production dashboard functionality
     if (this.prodDBRouteParams) {
      productTypeParam['StrainId'] = strainId;
      productTypeParam['PkgTypeId'] = this.prodDBRouteParams.PkgTypeId;
      productTypeParam['UnitValue'] = this.prodDBRouteParams.UnitValue;
      productTypeParam['ItemQty'] = this.prodDBRouteParams.ItemQty;
      productTypeParam['ViewOrdersBy'] = this.prodDBRouteParams.viewOrdersBy;
      productTypeParam['BeginDate'] = new Date(this.prodDBRouteParams.beginDate).toLocaleDateString().replace(/\u200E/g, '');
      productTypeParam['EndDate'] = new Date(this.prodDBRouteParams.endDate).toLocaleDateString().replace(/\u200E/g, '');
    }

    // Added by Devdan :: 23-Oct-2018 :: In case of Edit mode, Get the values from TaskModel Object
    if (this.taskTypeId > 0) {
      productTypeParam['StrainId'] = strainId;
      productTypeParam['PkgTypeId'] = this.TaskModel.TubingProductDetails.PkgTypeId;
      productTypeParam['UnitValue'] = this.TaskModel.TubingProductDetails.UnitValue;
      productTypeParam['ItemQty'] = this.TaskModel.TubingProductDetails.ItemQty;
      if (this.prodDBRouteParams) {
        productTypeParam['ViewOrdersBy'] = this.prodDBRouteParams.viewOrdersBy;
        productTypeParam['BeginDate'] = new Date(this.prodDBRouteParams.beginDate).toLocaleDateString().replace(/\u200E/g, '');
        productTypeParam['EndDate'] = new Date(this.prodDBRouteParams.endDate).toLocaleDateString().replace(/\u200E/g, '');
        }
    }


    // End of Populate strain & lot by default. Joint production dashboard functionality
    this.orderService.getSelectedStrainOrderDetails(productTypeParam, 'JOINTS').subscribe(
      data => {
        if (data !== 'No data found!') {
          this.globalData.orderDetails = data;
          this.orderDetails = data.Table;

          const newArr = [];

          // To get unique record according brand and strain
           this.orderDetailsBS = this.removeDuplicatesByName(this.orderDetails);
          // End of getting unique record accroding brand and strain

          // To map assign wt textbox in table for each row
           // this.jointsOrderPackets.reset();
          // this.TUBING. jointsOrderPackets = this.fb.array([]);
          (this.ParentFormGroup.controls['TUBING'] as FormGroup).setControl('jointsOrderPackets', this.fb.array([]));

          // this.jointsOrderPackets.push(this.fb.array(this.orderDetails.map(this.createItem(this.fb))));
          this.orderDetails.map((object, index) => {
            this.jointsOrderPackets.push(this.createItem(object, index));
          });

          // End To map assign wt textbox in table for each row

          // Unique Brand Strain Combination
          this.orderDetailsBS_filteredData = [];
          this.selectedLotsArray = [];

          const filterItems = this.jointsOrderPackets.value.filter(result => {
            return result.assignQty !== null;
          });

          this.orderDetailsBS.forEach((value, key) => {
            let exists = false;
            this.jointsOrderPackets.value.forEach((val2, key1) => {
              if ( value.StrainId === val2.strainid) { exists = true; }
            });
            const counts  = this.globalData.orderDetails['Table1'].filter(result => result.StrainId === value.StrainId).length;
            value['LotCount'] = counts;
            if (exists && value.StrainId !== '') { this.orderDetailsBS_filteredData.push(value); }
          });
      // End Unique Brand Strain Combination

        // Added by Devdan :: 20-Oct-2018 :: Getting the selected lots and assigning it to ngmodel
        if (this.taskTypeId > 0) {
          this.openLotSelection(this.TaskModel.TubingProductDetails, 0);
          this.setSelectedLotDetails();
          this.showLotSelectionModel = false;
          this.readonlyFlag = true;
        }

        }

      } ,
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

      if (exists === false  && value.StrainName !== '') { newArr.push(value); }
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

  onLotSelectionChange() {
    this.selectedLots = [];
    this.TaskModel.TUBING.lotno.map(item => {
        return {
          'lotno': item , 'availableQty': '23'
        };
    }).forEach(item => this.selectedLots.push(item));
  }

  openLotSelection(orderDetail, rowIndex) {
    this.brandStrainLots = [];
    this.selLotBrandStrainRow.pkgSizeRequiredQtyArr = [];

    const selectedStrainUnitValues = this.orderDetails.filter(result =>  result.GeneticsId === orderDetail.GeneticsId);

    this.brandStrainLots = this.globalData.orderDetails['Table1'].filter(result =>
        result.GeneticsId === orderDetail.GeneticsId
        &&  Number(selectedStrainUnitValues.filter(data1 => data1.UnitValue === result.UnitValue).length) > 0
      );

    this.selLotBrandStrainRow.BrandId = 0;
    this.selLotBrandStrainRow.StrainId = orderDetail.StrainId;
    this.selLotBrandStrainRow.selectedRowIndex = rowIndex;

    this.selLotBrandStrainRow.RequireWt = 0;
    this.selLotBrandStrainRow.combinationTotalAssignedQty = 0;

    this.orderDetails.filter((value, key) =>
      //  value.StrainId === orderDetail.StrainId )
      value.GeneticsId === orderDetail.GeneticsId)
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

    this.jointsOrderPackets.value.forEach(result => {
      if (result.strainid === orderDetail.StrainId && Number(result.assignQty) > 0) {
        // totalPkgWt = Number(result.assignQty) * Number(result.itemQty);
        if (this.selLotBrandStrainRow.pkgSizeRequiredQtyArr.filter(item => item.UnitValue === result.packageunit).length) {
          const unitValueQty = this.selLotBrandStrainRow.pkgSizeRequiredQtyArr.filter(item => item.UnitValue === result.packageunit)[0].RequiredQty;

          this.selLotBrandStrainRow.pkgSizeRequiredQtyArr
          .filter(item => item.UnitValue === result.packageunit)[0].RequiredQty
          = unitValueQty + (Number(result.assignQty) * Number(result.itemQty));

        } else {
          this.selLotBrandStrainRow.pkgSizeRequiredQtyArr.push({
            UnitValue: result.packageunit, RequiredQty: Number(result.assignQty) * Number(result.itemQty)
          });
        }
      }
    });

    this.showLotSelectionModel = true;
  }

  openMixLotSelection(mixLotRow, rowIndex, ParentRowIndex) {
    const mixLotDetails = this.TaskModel.AssignQtyLotDetails.filter(result =>
     // result.StrainId === this.TaskModel.AssignQtyDetails[ParentRowIndex].StrainId
     // &&
      result.UnitValue === this.TaskModel.AssignQtyDetails[ParentRowIndex].UnitValue
    );

    this.selMixLotPkgRow.BrandId = 0;
    this.selMixLotPkgRow.StrainId = this.TaskModel.AssignQtyDetails[ParentRowIndex].StrainId;
    this.selMixLotPkgRow.StrainName = this.TaskModel.AssignQtyDetails[ParentRowIndex].StrainName;
    this.selMixLotPkgRow.selectedRowIndex = rowIndex;
    this.selMixLotPkgRow.ParentRowIndex = ParentRowIndex;

    this.selMixLotPkgRow.RequireQty = this.TaskModel.AssignQtyDetails[ParentRowIndex].ItemQty;
    this.selMixLotPkgRow.combinationTotalAssignedQty = this.TaskModel.AssignQtyDetails[ParentRowIndex].ItemQty;

    this.selLotBrandStrainRow.GeneticsId = this.TaskModel.AssignQtyDetails[ParentRowIndex].GeneticsId;
    this.selLotBrandStrainRow.GeneticsName = this.TaskModel.AssignQtyDetails[ParentRowIndex].GeneticsName;

    this.questionForm = this.fb.group({
      questions: this.fb.array(mixLotDetails
        .map(this.createQuestionControlForMixLot(this.fb))
      )
    });

    this.showMixLotSelectionModel = true;
  }

  submit(form) {
    const lotDetails = [];
    const pkgSizeReqQtyMap = new Map();

    if (this.questionForm.valid) {
      form.value.questions.forEach(result => {
        // totalLotWt += result.question ? Number(result.answer) : 0;
        if (result.question) {
          if (pkgSizeReqQtyMap.has(result.UnitValue)) {
            pkgSizeReqQtyMap.set(result.UnitValue,
              Number(pkgSizeReqQtyMap.get(result.UnitValue)) + Number(result.answer)
            );
          } else {
            pkgSizeReqQtyMap.set(result.UnitValue,
              Number(result.answer)
            );
          }
        }
      });

      for (let i = 0; i < this.selLotBrandStrainRow.pkgSizeRequiredQtyArr.length; i++) {
        const temp = this.selLotBrandStrainRow.pkgSizeRequiredQtyArr[i];
        if (pkgSizeReqQtyMap.get(temp.UnitValue) !== Number(temp.RequiredQty)) {
          this.msgs = [];

          this.msgs.push({
              severity: 'warn',
              summary: this.globalResource.applicationmsg,
              detail: 'Sum of all lot joints(' + String(temp.UnitValue) + 'g) qty is not equal to total assigned qty(' + String(temp.RequiredQty) + ').'
          });

          return;
        }
      }

      form.value.questions.forEach(result => {
        if (result.question === true) {
          lotDetails.push(
            {
              LotNo: result.LotNo,
              GrowerLotNo: result.GrowerLotNo,
              UnitValue: result.UnitValue,
              AvailJointsQty: result.AvailJointsQty,
              SelectedQty: result.answer,
              Selected: true,
              Index: result.questionNumber,
              StrainId: result.StrainId,
              StrainName: result.StrainName,
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
      this.showLotSelectionModel = false;
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
    let totalLotQty = 0;
    let lotUsedCount = 0;

    if (this.questionForm.valid) {
      form.value.questions.forEach(result => {
        if (result.question) {
          totalLotQty += result.question ? Number(result.answer) : 0;
          lotUsedCount += 1;
        }
      });

      if (totalLotQty !== Number(this.selMixLotPkgRow.combinationTotalAssignedQty)) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.assignTaskResources.pkgqtynotmatched });

        return;
      }

      if (lotUsedCount < 2) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.assignTaskResources.minPkgLotQtyMsg });

        return;
      }

      form.value.questions.forEach(result => {
        if (result.question === true) {
          mixLotDetails.push(
            {
              LotNo: result.LotNo,
              GrowerLotNo: result.GrowerLotNo,
              AvailWt: result.AvailWt,
              SelectedJointsQty: Number(result.answer),
              AssignedJointsQty: result.assignedJointsQty,
              Selected: true,
              Index: result.questionNumber,
              StrainId: this.selMixLotPkgRow.StrainId,
              BrandId: this.selMixLotPkgRow.BrandId,
              StrainName: this.selMixLotPkgRow.StrainName,
              GeneticsId:  this.selMixLotPkgRow.GeneticsId,
              GeneticsName:  this.selMixLotPkgRow.GeneticsName
            }
          );
        }
      });
      this.selectedMixLotsArray[this.selMixLotPkgRow.ParentRowIndex + '' + this.selMixLotPkgRow.selectedRowIndex] = mixLotDetails;
      this.calculateMixLotQty([], 'ALL');

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
    let completeLotDetailsForApi;
    const lotProductListArr = [];

    let duplicateEntry = false;
    let countMisMatch = false;
    if ( this.completionForm.valid === true) {
        completeLotDetailsForApi = {
          TaskDetails: {
            TaskId: Number(this.taskId),
            VirtualRoleId: 0,
            Comment: formModel.MiscComment ? formModel.MiscComment : '',
            MiscCost: 0,
            TaskKeyName: 'B-TUBE'
          },
          LotJointsDetails: [],
          TubingProductDetails: [],
          LotTubeProductList: [],
          TubeMixPkgDetails: []
        };

        // 3rd Object: Product wise Total Qty Details
        formModel.completeParamArr.forEach((object, index) => {
          completeLotDetailsForApi.TubingProductDetails.push({
            // RawSupId: object.RawSupId,
            StrainId: object.StrainId,
            PkgTypeId: object.PkgTypeId,
            UnitValue: object.UnitValue,
            ItemQty: object.ItemQty,
            // ProductTypeId: object.ProductTypeId,
            Qty: object.completedQty ? object.completedQty : 0,
            // IndexCode: String(index)
          });
        });

        // 4th Object: Product wise all lot list and their entered wt details
        // let validateDuplicateFlag = false;
        formModel.completeParamArr.forEach((object, PkgFormIndex) => {
          object.LotDetails.forEach((LotObject, index) => {
            if (LotObject.lotCompletedQty > 0) {
              // console.log(LotObject);
              completeLotDetailsForApi.LotTubeProductList.push({
                // ProductTypeId: object.ProductTypeId,
                StrainId: LotObject.StrainId,
                PkgTypeId: object.PkgTypeId,
                UnitValue: object.UnitValue,
                ItemQty: object.ItemQty,
                LotId: LotObject.LotId,
                Qty: LotObject.lotCompletedQty ? LotObject.lotCompletedQty : 0
                // PackageCode: '',
                // IndexCode: String(PkgFormIndex + '##' + index)
              });
            }

              lotProductListArr.push({
                StrainId: LotObject.StrainId,
                PkgTypeId: object.PkgTypeId,
                UnitValue: object.UnitValue,
                ItemQty: object.ItemQty,
                // ProductTypeId: object.ProductTypeId,
                LotId: LotObject.LotId,
                Qty: LotObject.lotCompletedQty ? LotObject.lotCompletedQty : 0,
              });
          });

          if (this.productTypeQtyMap.get(object.ProductTypeId) !== object.completedQty) {
            const packagesCompletedBox = (<FormGroup>this.completionForm.get('completeParamArr.' + PkgFormIndex))
            .get('completedQty');

            packagesCompletedBox.setErrors({ pkgqtynotmatched: true });
            countMisMatch = true;
            packagesCompletedBox.markAsDirty();
             return;
          }
        });


        if (countMisMatch) {
          return;
         }


        // 2nd Object: All Products unique lot id and sum of product item qty

        // const result = _.groupBy(completeLotDetailsForApi.LotProductList , c => {
        //   return [c.LotId];
        // });

        _.mapValues(_.groupBy(lotProductListArr, c => {
            return [c.LotId, c.UnitValue];
          }),
          (clist, LotObject) => {
            let lotJointsQty = 0;
            clist.map(LotDetails => {
              lotJointsQty += ( LotDetails.ItemQty);
            });

            // if (LotTotalWt) {
              completeLotDetailsForApi.LotJointsDetails.push({
                LotId: Number(String(LotObject).split(',')[0]),
                UnitValue: Number(String(LotObject).split(',')[1]),
                Qty: Number(this.lotMap.get(String(LotObject).split(',')[0]
                  + '' + String(LotObject).split(',')[1]) ) ?
                  Number(this.lotMap.get(String(LotObject).split(',')[0] + '' + String(LotObject).split(',')[1])) : 0
              });

          });

          // 5th Object: Mix Lot Details
            formModel.completeParamArr.forEach((object, index) => {
              if (object.MixLotDetails.length > 0) {
                object.MixLotDetails.forEach((MixLotObject, childIndex) => {
                  if (this.selectedMixLotsArray[index + '' + childIndex].length > 0) {
                    this.selectedMixLotsArray[index + '' + childIndex].forEach(item => {
                      completeLotDetailsForApi.TubeMixPkgDetails.push({
                        SkewKeyName: 'JOINTS',
                        MixPkgNo: index + '' + childIndex,
                        ProductTypeId: object.ProductTypeId,
                        StrainId: object.StrainId,
                        PkgTypeId: object.PkgTypeId,
                        UnitValue: object.UnitValue,
                        ItemQty: object.ItemQty,
                        LotId: Number(item.LotNo),
                        LotItemQty: item.SelectedJointsQty ? item.SelectedJointsQty : 0
                      });
                    });
                  }
                });
              }
            });
          // End of Mix Lot Details
          // duplicateEntry = true;
          if (duplicateEntry) { return; }
          duplicateEntry = false;

          // console.log(completeLotDetailsForApi);
      // return;

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
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskalreadycompleted });

                  if (this.TaskModel.IsReview === true) {
                    this.TaskModel.TaskStatus = this.taskStatus.ReviewPending;
                  } else {
                    this.TaskModel.TaskStatus =  this.taskStatus.Completed;
                  }
                  this.TaskCompleteOrReviewed.emit();
                } else if (String(data).toLocaleUpperCase() === 'DELETED') {
                  this.msgs = [];
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskActionCannotPerformC });

                  setTimeout( () => {
                    if (this._cookieService.UserRole === this.userRoles.Manager) {
                      this.router.navigate(['home/managerdashboard']);
                    } else {
                      this.router.navigate(['home/empdashboard']);
                    }
                  }, 2000);
                } else if (String(data).toLocaleUpperCase() === 'FAILURE') {
                  this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
                } else if (String(data).toLocaleUpperCase() === 'SUCCESS') {
                  if (this.TaskModel.IsReview === true) {
                    this.TaskModel.TaskStatus =  this.taskStatus.ReviewPending;
                  } else {
                    this.TaskModel.TaskStatus =  this.taskStatus.Completed;
                  }
                  this.msgs = [];
                  this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                    detail: this.assignTaskResources.taskcompleteddetailssavesuccess });
                  setTimeout( () => {
                   // if (this._cookieService.UserRole === this.userRoles.Manager) {
                   //   this.router.navigate(['home/managerdashboard']);
                   // } else {
                   //   this.router.navigate(['home/empdashboard']);
                   // }

                    // for navigate joint dashboard if employee assign task :: 20-Mar-2019 :: swapnil
                  if (this._cookieService.UserRole === this.userRoles.Manager) {
                          this.router.navigate(['home/jointsproductiondashboard']);
                        } else {
                          // if employee assign task to self then redirect to joint dashboard else employee dashboard
                          if (this.assignRole.length !== 0) {
                          if (this.assignRole[0].RoleName === 'Employee') {
                            this.router.navigate(['home/jointsproductiondashboard']);
                          }
                         } else {
                          this.router.navigate(['home/empdashboard']);  }
                        }
                  }, 2000);
                }
              },
              error => { console.log(error); },
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

    let duplicateEntry = false;
    // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Calculate Seconds
    const ActSeconds = this.reviewForm.getRawValue().ActSecs;
    if ( this.reviewForm.valid === true) {
        reviewLotDetailsForApi = {
          TaskDetails: {
            TaskId: Number(this.taskId),
            VirtualRoleId: 0,
            Comment: formModel.MiscComment ? formModel.MiscComment : '',
            MiscCost: 0,
            TaskKeyName: 'B-TUBE',
            // ADDED by Devdan :: Sec to Min change :: 06-Nov-2018
            RevTimeInSec: this.CaluculateTotalSecs(formModel.ActHrs, formModel.ActMins, ActSeconds),
          },
          LotJointsDetails: [],
          TubingProductDetails: [],
          LotTubeProductList: [],
          TubeMixPkgDetails: []
        };

        // 3rd Object: Product wise Total Qty Details
        formModel.reviewParamArr.forEach((object, index) => {
          reviewLotDetailsForApi.TubingProductDetails.push({
            // ProductTypeId: object.ProductTypeId,
            StrainId: object.StrainId,
            PkgTypeId: object.PkgTypeId,
            UnitValue: object.UnitValue,
            ItemQty: object.ItemQty,
            Qty: object.reviewedQty ? object.reviewedQty : 0,
          });
        });

        // 4th Object: Product wise all lot list and their entered wt details
        // let validateDuplicateFlag = false;
        formModel.reviewParamArr.forEach((object, PkgFormIndex) => {
          object.LotDetails.forEach((LotObject, index) => {
            reviewLotDetailsForApi.LotTubeProductList.push({
                // ProductTypeId: object.ProductTypeId,
                StrainId: LotObject.StrainId,
                PkgTypeId: object.PkgTypeId,
                UnitValue: object.UnitValue,
                ItemQty: object.ItemQty,
                LotId: LotObject.LotId,
                Qty: LotObject.lotReviewedQty ? LotObject.lotReviewedQty : 0
                // PackageCode: '',
                // IndexCode: String(PkgFormIndex + '##' + index)
              });

              lotProductListArr.push({
                StrainId: LotObject.StrainId,
                PkgTypeId: object.PkgTypeId,
                UnitValue: object.UnitValue,
                ItemQty: object.ItemQty,
                // ProductTypeId: object.ProductTypeId,
                LotId: LotObject.LotId,
                Qty: LotObject.lotReviewedQty ? LotObject.lotReviewedQty : 0,
              });
          });
        });

        // 2nd Object: All Products unique lot id and sum of product item qty

        // const result = _.groupBy(reviewLotDetailsForApi.LotProductList , c => {
        //   return [c.LotId];
        // });

        _.mapValues(_.groupBy(lotProductListArr, c => {
            return [c.LotId, c.UnitValue];
          }),
          (clist, LotObject) => {
            let lotJointsQty = 0;
            clist.map(LotDetails => {
              lotJointsQty += ( LotDetails.ItemQty);
            });

            // if (LotTotalWt) {
              reviewLotDetailsForApi.LotJointsDetails.push({
                LotId: Number(String(LotObject).split(',')[0]),
                UnitValue: Number(String(LotObject).split(',')[1]),
                Qty: Number(this.lotMap.get(String(LotObject).split(',')[0]
                  + '' + String(LotObject).split(',')[1]) ) ?
                  Number(this.lotMap.get(String(LotObject).split(',')[0] + '' + String(LotObject).split(',')[1])) : 0
              });

          });

          this.TaskModel.AssignQtyLotDetails.forEach((object, index) => {
            if ( reviewLotDetailsForApi.LotJointsDetails.filter(r => r.LotId === object.LotId).length <= 0) {
                reviewLotDetailsForApi.LotJointsDetails.push({
                  LotId: object.LotId,
                  UnitValue: object.UnitValue,
                  Qty: object.ProcessedJointsQty
                });
              }
            });

          // 5th Object: Mix Lot Details
            formModel.reviewParamArr.forEach((object, index) => {
              if (object.MixLotDetails.length > 0) {
                object.MixLotDetails.forEach((MixLotObject, childIndex) => {
                  // if (this.selectedMixLotsArray[index + '' + childIndex].length > 0) {
                  //   this.selectedMixLotsArray[index + '' + childIndex].forEach(item => {
                  //     reviewLotDetailsForApi.MixPkgDetails.push({
                  //       SkewKeyName: 'JOINTS',
                  //       MixPkgNo: index + '' + childIndex,
                  //       ProductTypeId: object.ProductTypeId,
                  //       UnitValue: object.UnitValue,
                  //       LotId: Number(item.LotNo),
                  //       ItemQty: item.SelectedJointsQty ? item.SelectedJointsQty : 0
                  //     });
                  //   });
                  // }

                  reviewLotDetailsForApi.TubeMixPkgDetails.push({
                    SkewKeyName: 'JOINTS',
                    MixPkgId: MixLotObject.mixPkgId,
                    MixPkgNo: index + '' + childIndex,
                    // ProductTypeId: object.ProductTypeId,
                    StrainId: object.StrainId,
                    PkgTypeId: object.PkgTypeId,
                    UnitValue: object.UnitValue,
                    ItemQty: object.ItemQty,
                    LotId: 0,
                    Weight: 0
                  });
                });
              }
            });
          // End of Mix Lot Details
          // duplicateEntry = true;
          if (duplicateEntry) { return; }
          duplicateEntry = false;
      // return;

      this.confirmationService.confirm({
        message: this.assignTaskResources.taskcompleteconfirm,
        header: 'Confirmation',
        icon: 'fa fa-exclamation-triangle',
        accept: () => {

            // http call starts
            this.loaderService.display(true);

            this.taskCommonService.submitTaskReview(reviewLotDetailsForApi)
              .subscribe(data => {
                if (String(data).toLocaleUpperCase() === 'NOCOMPLETE') {
                  this.msgs = [];
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskalreadycompleted });

                  if (this.TaskModel.IsReview === true) {
                    this.TaskModel.TaskStatus = this.taskStatus.ReviewPending;
                  } else {
                    this.TaskModel.TaskStatus =  this.taskStatus.Completed;
                  }
                  this.TaskCompleteOrReviewed.emit();
                } else if (String(data).toLocaleUpperCase() === 'DELETED') {
                  this.msgs = [];
                  this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.taskActionCannotPerformC });

                  setTimeout( () => {
                    if (this._cookieService.UserRole === this.userRoles.Manager) {
                      this.router.navigate(['home/managerdashboard']);
                    } else {
                      this.router.navigate(['home/empdashboard']);
                    }
                  }, 2000);
                } else if (String(data).toLocaleUpperCase() === 'FAILURE') {
                  this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
                } else if (String(data).toLocaleUpperCase() === 'SUCCESS') {
                  if (this.TaskModel.IsReview === true) {
                    this.TaskModel.TaskStatus =  this.taskStatus.ReviewPending;
                  } else {
                    this.TaskModel.TaskStatus =  this.taskStatus.Completed;
                  }
                  this.msgs = [];
                  this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                    detail: this.assignTaskResources.taskcompleteddetailssavesuccess });

                  setTimeout( () => {
                   if (this._cookieService.UserRole === this.userRoles.Manager) {
                      this.router.navigate(['home/managerdashboard']);
                    } else {
                      this.router.navigate(['home/empdashboard']);
                    }

                  }, 2000);
                }
              },
              error => { console.log(error); },
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
      this.appCommonService.validateAllFields(this.reviewForm);
    }
  }

  // Created by Devdan :: 23-Oct-2018 :: to set the ng model values
  setFormInEditMode() {

    this.TaskModel.TUBING = {
      lotno: null,
      brand: null,
      strain: this.TaskModel.TubingProductDetails.StrainId,
      startdate:  this.TaskModel.startdate,
      enddate: null,
      endtime: null,
      esthrs: null,
      priority: this.TaskModel.TaskDetails.TaskPriority,
      notifymanager: this.TaskModel.TaskDetails.IsManagerNotify,
      notifyemployee: this.TaskModel.TaskDetails.IsEmpNotify,
      usercomment: this.TaskModel.TubingTaskDetails.Comment,
      orderno: null,
      employee: this.TaskModel.TaskDetails.EmpId,
    };
  }

  setSelectedLotDetails() {
    const lotDetails = [];
    if (this.TaskModel.TubingLotDetails.length > 0) {
      this.TaskModel.TubingLotDetails.forEach((Lot, index) => {
          lotDetails.push(
            {
              LotNo: Lot.LotId,
              GrowerLotNo: Lot.GrowerLotNo,
              UnitValue: Lot.UnitValue,
              AvailJointsQty: Lot.AvailableQty,
              SelectedQty: Lot.AssignedJointsQty,
              Selected: true,
              Index: '',
              StrainId: Lot.StrainId,
              StrainName: Lot.StrainName,
              BrandId: this.selLotBrandStrainRow.BrandId,
              GeneticsId:  this.selLotBrandStrainRow.GeneticsId,
              GeneticsName:  this.selLotBrandStrainRow.GeneticsName
            }
          );
          this.selectedLotsArray[this.selLotBrandStrainRow.selectedRowIndex] = lotDetails;

          this.appCommonService.setLocalStorage('selectedLotsArray', JSON.stringify(this.selectedLotsArray));
          this.showLotSelectionModel = false;
        }
      );
    }
  }

  commentIconClicked(LotId) {
    this.lotInfo.lotId = LotId;
    this.lotInfo.showLotCommentModal = true;
    this.loaderService.display(false);
  }

}
