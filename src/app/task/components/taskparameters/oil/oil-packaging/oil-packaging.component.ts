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
import { AppConstants } from '../../../../../shared/models/app.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from '../../../../../shared/models/user.model';
import { CookieService } from 'ngx-cookie-service';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { AppCommonService } from '../../../../../shared/services/app-common.service';
import { environment } from './../../../../../../environments/environment';
import { Title } from '@angular/platform-browser';
import { RefreshService } from '../../../../../dashboard/services/refresh.service';

// const tolerance = environment.tolerance;
@Component({
  moduleId: module.id,
  selector: 'app-oil-packaging',
  templateUrl: './oil-packaging.component.html',
  styleUrls: ['./oil-packaging.component.css']
})
export class OilPackagingComponent implements OnInit, OnDestroy {


  OILPACKAGING: FormGroup;
  completionForm: FormGroup;
  reviewForm: FormGroup;
  public orderDetails: any;
  public orderDetailsBS: any;
  public orderDetailsBS_filteredData: any = [];
  public allOrders: any;
  public allOrderNos: any;
  public showPkgSelectionModel = false;
  public showLotCompletiionModal = false;
  public showMixPkgSelectionModel = false;
  public EnabledReturnwtbox = false;

  public taskId: any;
  public taskType: any;
  public _cookieService: UserModel;
  public taskReviewModel: any;
  public showProductTypePkgDetailsModal = false;
  public productTypePkgDetails: any;
  public packageDetails: any;
  public strainPkgs: any[] = [];
  public showPastDateLabel = false;
  // public LotInfo: any = { // Commented by Devdan :: 26-Oct-2018 :: Unused
  //   LotId: 0,
  //   showLotNoteModal: false
  // };

  public selPkgBrandStrainRow = {
    BrandId: null,
    StrainId: null,
    BrandName: null,
    StrainName: null,
    RequireWt: null,
    selectedRowIndex: null,
    combinationTotalAssignedWt: null,
    GeneticsId: null,
    GeneticsName: null
  };

  public selMixPkgPkgRow = {
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
  public pkgMap = new Map<any, any>();

  public pkgBalancedWtMap = new Map<any, any>();
  public productTypeQtyMap = new Map<any, any>();

  public selectedMixPkgsArray: any[] = [];

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

  // public Lots: SelectItem[];  // Commented by Devdan :: 26-Oct-2018 :: Unused
  public employees: SelectItem[];
  public priorities: SelectItem[];

  public assignTaskResources: any;
  public globalResource: any;
  public taskStatus: any;

  private globalData = {
    employees: [],
    orderDetails: []
  };

  public brandStrainPkgs: any;
  public questionForm: FormGroup;
  public lotListForm: FormGroup;
  public selectedPkgsArray: any[] = [];
  public completedLotArray: any[] = [];

  // TaskCompletionModel = {  // Commented by Devdan :: 26-Oct-2018 :: Unused
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
  public uniqueOilPkgsArr: any = [];

  // Added by Devdan :: 12-Oct-2018
  taskTypeId: any;
  readiOnlyFlag: boolean;

  // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Variable to Enable/Disable Second Text Box
  isRActSecsDisabled: boolean;

  ngOnInit() {
    this.assignTaskResources = TaskResources.getResources().en.assigntask;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle(this.assignTaskResources.oilpackagingtitle);
    this.taskStatus = AppConstants.getStatusList;
    this.userRoles = AppConstants.getUserRoles;
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

      this.TaskModel.OILPACKAGING = {
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

      this.getCOilPackagingOrders();

      this.OILPACKAGING = new FormGroup({
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
        oilOrderPackets: this.fb.array([]),
      });

      this.employeeListByClient();

      this.priorities = [
        { label: 'Normal', value: 'Normal' },
        { label: 'Important', value: 'Important' },
        { label: 'Critical', value: 'Critical' }
      ];

      this.ParentFormGroup.addControl('OILPACKAGING', this.OILPACKAGING);
    } else {

      this.lotListForm = this.fb.group({
        completedLots: new FormArray([])
      });

      this.questionForm = this.fb.group({
        questions: new FormArray([])
      });
      // Changed by sanjay 20-08-2018 for Display all genetics wise all strains
      // this.uniqueBrandStrain = this.removeDuplicatesByName(this.TaskModel.AssignQtyDetails);
      this.uniqueBrandStrain = this.removeDuplicatesByName(this.TaskModel.AssignQtyPkgDetails);
      // END
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

      // this.uniqueOilPkgsArr = this.GetUniqueLotList(this.TaskModel.AssignQtyPkgDetails);
      this.completionForm = this.fb.group({
        MiscCost: new FormControl(null),
        MiscComment: new FormControl(null),
        completeParamArr: this.fb.array(this.TaskModel.AssignQtyDetails.map(this.generateCompletionParams(this.fb))),
        pkgReturnWtArr: this.fb.array(
          this.TaskModel.AssignQtyPkgDetails.map(this.generateCompPkgReturnWtArr(this.fb))
        )
        // companies: this.fb.array([])
      });

      if (this.TaskModel.TaskStatus === this.taskStatus.InProcess || this.TaskModel.TaskStatus === this.taskStatus.Paused ) {
        this.calculateMixPkgWt([], 'ALL');
      }

      this.reviewForm = this.fb.group({
        ActHrs: new FormControl(null),
        ActMins: new FormControl(null, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
        // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Getting Seconds.
        ActSecs: new FormControl({value: null, disabled: this.isRActSecsDisabled}, Validators.compose([Validators.maxLength(2), Validators.max(59)])),
        MiscCost: new FormControl(null),
        MiscComment: new FormControl(null),
        reviewParamArr: this.fb.array(
           this.TaskModel.AssignQtyDetails.map(this.generateReviewParams(this.fb))
        ),
        pkgReturnWtArr: this.fb.array(
          this.TaskModel.AssignQtyPkgDetails.map(this.generateReviewPkgReturnWtArr(this.fb))
        )
      });

      if (this._cookieService.UserRole === this.userRoles.Manager && this.TaskModel.TaskStatus === this.taskStatus.ReviewPending) {
        this.calculateDefaultProcessedWtForReview();
      }

      if (this.TaskModel.TaskStatus === this.taskStatus.ReviewPending) {
        this.calculateMixPkgWtForReview([], 'ALL');
      }
    }
  }

  ngOnDestroy() {
    this.pkgBalancedWtMap.clear();
    this.productTypeQtyMap.clear();
    this.pkgMap.clear();

    // localStorage.removeItem('selectedMixPkgsArray');
    // localStorage.removeItem('selectedPkgsArray');

    this.appCommonService.removeItem('selectedMixPkgsArray');
    this.appCommonService.removeItem('selectedPkgsArray');
  }

  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr((size * -1), size);
  }

  get questions(): FormArray {
    return this.questionForm.get('questions') as FormArray;
  }

  get completeParamArr(): FormArray {
    return this.completionForm.get('completeParamArr') as FormArray;
  }

  get reviewParamArr(): FormArray {
    return this.reviewForm.get('reviewParamArr') as FormArray;
  }

  get pkgReturnWtArr(): FormArray {
    return this.completionForm.get('pkgReturnWtArr') as FormArray;
  }

  get pkgReturnWtRevArr(): FormArray {
    return this.reviewForm.get('pkgReturnWtArr') as FormArray;
  }

  get oilOrderPackets(): FormArray {
    // return this.OILPACKAGING.get('oilOrderPackets') as FormArray;
    return (this.ParentFormGroup.get('OILPACKAGING') as FormGroup).get('oilOrderPackets') as FormArray;
  }

  pkgInnerFormArray(comp): FormArray {
    return comp.get('PkgDetails') as FormArray;
  }

  // Pkg Mixing Function
  mixPkgDetailsArr(comp): FormArray {
    return comp.get('MixPkgDetails') as FormArray;
  }

  addItem(comp: FormGroup, mixPkg: FormGroup): void {
    if (Number(this.productTypeQtyMap.get(comp.value.ProductTypeId)) >= comp.value.completedQty) {
      this.msgs = [];
      this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.maxpkglimitexceed });
      return;
    }
    this.productTypeQtyMap.set(comp.value.ProductTypeId, Number(this.productTypeQtyMap.get(comp.value.ProductTypeId) + 1));

    this.mixPkgDetailsArr(comp).push(this.createMixItem(comp, 0));
  }

  deleteItem(comp: FormGroup, parentIndex: number, childIndex: number) {

    const packagesCompletedBox = (<FormGroup>this.completionForm.get('completeParamArr.' + parentIndex))
    .get('completedQty');

    packagesCompletedBox.markAsTouched();
    packagesCompletedBox.updateValueAndValidity();
    // control refers to your formarray
    const control = <FormArray>this.mixPkgDetailsArr(comp);

    if (Number(control.controls.length) > 1) {
      for (let i =  childIndex; i <= Number(control.controls.length); i++) {
        this.selectedMixPkgsArray[parentIndex + '' + i] = this.selectedMixPkgsArray[parentIndex + '' + (i + 1)];
      }
    } else {
      this.selectedMixPkgsArray[parentIndex + '' + childIndex] = [];
    }

    // remove the chosen row
    control.removeAt(childIndex);
    this.productTypeQtyMap.set(comp.value.ProductTypeId, Number(this.productTypeQtyMap.get(comp.value.ProductTypeId) - 1));

    // this.selectedMixPkgsArray[parentIndex + '' + childIndex] = [];
    this.calculateMixPkgWt([], 'ALL');
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
      let completedBox, packageCodeBox;

      completedBox = [null, Validators.max(object.AssignedQty)];
      packageCodeBox = [null];
      this.disableCompletedQtyArr[index] = object.AssignedQty;

      return fb.group({
        uniqueId: index,
        completedQty: completedBox,
        RawSupId: object.RawSupId,
        StrainId: object.StrainId,
        PkgTypeId: object.PkgTypeId,
        UnitValue: object.UnitValue,
        ItemQty: object.ItemQty,
        packageCode: packageCodeBox,
        ProductTypeId: object.ProductTypeId,
        PkgDetails: this.fb.array(

          this.TaskModel.AssignQtyPkgDetails
          .filter(result => {
            if (this.TaskModel.AssignQtyDetails[index].GeneticsId) {
              return result.GeneticsId === this.TaskModel.AssignQtyDetails[index].GeneticsId;
            } else {
              return result.StrainId === this.TaskModel.AssignQtyDetails[index].StrainId;
            }
          })
          .map((object1, index1) => {
             return this.createPkgControls(this.fb, object1, index1, 'Complete');
          })
          // this.TaskModel.AssignQtyPkgDetails
            // .filter(result => result.StrainId === object.StrainId)
            // .map(this.createPkgControls(this.fb, 'Complete'))
          ),
        MixPkgDetails: this.fb.array([])
      });
    };
  }

  generateCompPkgReturnWtArr(fb: FormBuilder) {
    return (object, index) => {
      let processedOilWt, pkgReturnedWt;

      processedOilWt = [null];
      // PkgReturnedWt = [null, Validators.compose([Validators.required])];
      pkgReturnedWt = [null];

      return fb.group({
        uniqueId: index,
        OilPkgId: object.OilPkgId,
        OilPkgCode: object.OilPkgCode,
        AssignedOilWt: object.AssignedOilWt,
        StrainName: object.StrainName,
        TPPkgTypeName: object.TPPkgTypeName,
        ProcessedOilWt: processedOilWt,
        pkgReturnedWt: pkgReturnedWt
      });
    };
  }

  generateReviewParams(fb: FormBuilder) {
    return (object, index) => {
      let reviewBox;

     // this.disableCompletedQtyArr[index] = 0;

     // this.disableCompletedQtyArr[index] = Number(object.CompletedQty);

     if (this.TaskModel.TaskStatus === this.taskStatus.ReviewPending) {
      this.disableCompletedQtyArr[index] = 0;
      this.disableCompletedQtyArr[index] = Number(object.CompletedQty);
      }

    //   reviewBox = [this.disableCompletedQtyArr[index]];
      reviewBox = [this.disableCompletedQtyArr[index]];

    //   this.strainPkgs[index] =   _.uniqWith(this.dropdwonTransformService.transform(
    //     this.TaskModel.ReviewQtyPkgDetails
    //    .filter(result =>  result.ProductTypeId === object.ProductTypeId),
    //      'OilPkgCode', 'OilPkgCode', '-- Select --')
    //  , _.isEqual);
      return fb.group({
                uniqueId: index,
                reviewedQty: reviewBox,
                RawSupId: object.RawSupId,
                StrainId: object.StrainId,
                PkgTypeId: object.PkgTypeId,
                UnitValue: object.UnitValue,
                ItemQty: object.ItemQty,
                PackageCode: object.PackageCode,
                ProductTypeId: object.ProductTypeId,
                PkgDetails: this.fb.array(
                  this.TaskModel.ReviewQtyPkgDetails
                    .filter(result => result.ProductTypeId === object.ProductTypeId)
                    .map((object1, index1) => {
                        return this.createPkgControls(this.fb, object1, index1, 'Review');
                      })
                  ),
                // MixPkgDetails: this.fb.array(
                //   _.uniqBy(this.TaskModel.MixedOilPkgDetails, 'MixPkgId')
                //   .filter(result => result.ProductTypeId === object.ProductTypeId)
                //   .map((childObject, childIndex) => {
                //     this.selectedMixPkgsArray[index + '' + childIndex] = [];
                //      this.TaskModel.MixedOilPkgDetails.map((data, index1) => {
                //       if (data.MixPkgId === childObject.MixPkgId) {
                //         this.selectedMixPkgsArray[index + '' + childIndex].push({
                //             OilPkgId: data.OilPkgId,
                //             OilPkgCode: data.OilPkgCode,
                //             AvailWt: data.AvailWt ? data.AvailWt : 0,
                //             SelectedWt: Number(data.LotUsedWt),
                //             AssignedWt: data.AssignedWt ? data.AssignedWt : 0,
                //             Selected: true,
                //             Index: index1,
                //             StrainId: 0,
                //             StrainName: data.StrainName,
                //             BrandId: 0
                //         });
                //       }
                //   });
                //     return this.createMixItem(childObject, childIndex);
                //   })
                // )
              });
      };
  }

  generateReviewPkgReturnWtArr(fb: FormBuilder) {
    return (object, index) => {
      let processedOilWt, pkgReturnedWt;

      processedOilWt = [null];
      // PkgReturnedWt = [null, Validators.compose([Validators.required])];
      pkgReturnedWt = [null];

      return fb.group({
        uniqueId: index,
        OilPkgId: object.OilPkgId,
        OilPkgCode: object.OilPkgCode,
        AssignedOilWt: object.AssignedOilWt,
        StrainName: object.StrainName,
        TPPkgTypeName: object.TPPkgTypeName,
        ProcessedOilWt: processedOilWt,
        pkgReturnedWt: pkgReturnedWt
      });
    };
  }

  calculateTotalCompletedWt(index, comp, pkg) {
    // this.disableCompletedWtArr[index] = 0;

    // // let pkgTotalWeight = 0;
    // // let prodTypeTotalPkgQty = 0;
    // // // Iterate throught each product type
    // // this.completeParamArr.controls.forEach((productTypeItem, parentRowIndex) => {

    // //   prodTypeTotalPkgQty = 0;
    // //   // Iterate throught every lot in above product type
    // //   (productTypeItem as FormArray).controls['PkgDetails'].controls.forEach(pkgDetails => {
    // //     if (pkgDetails.value.oilPkgCode === pkg.value.LotId) {
    // //       pkgTotalWeight += Number(pkgDetails.value.pkgCompletedQty) * Number(productTypeItem.value.UnitValue) * Number(productTypeItem.value.ItemQty);

    // //       pkgDetails.controls['pkgCompletedQty'].updateValueAndValidity();
    // //     }
    // //     prodTypeTotalPkgQty += Number(pkgDetails.value.pkgCompletedQty);
    // //   });

    // //   (productTypeItem as FormArray).controls['MixPkgDetails'].controls.forEach((mixPkgDetails, childIndex) => {
    // //     prodTypeTotalPkgQty += 1;
    // //     if (this.selectedMixPkgsArray.length > 0) {
    // //       this.selectedMixPkgsArray[parentRowIndex + '' + childIndex].forEach(element => {
    // //         if (element.LotNo === pkg.value.LotId) {
    // //           pkgTotalWeight += Number(element.SelectedWt);
    // //         }
    // //       });
    // //     }
    // //   });

    // //   // if (prodTypeTotalPkgQty >= comp.value.completedWt) {
    // //   //   this.msgs = [];
    // //   //   this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.maxpkglimitexceed });
    // //   //   return;
    // //   // }
    // //   this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId, prodTypeTotalPkgQty);
    // // });

    // // // lot total processed wt
    // // this.pkgMap.set(pkg.value.LotId, pkgTotalWeight);

    // // // lot total balanced wt
    // // this.pkgBalancedWtMap.set(pkg.value.LotId, Number(pkg.value.AssignedWt) - pkgTotalWeight);

    // comp.controls.PkgDetails.value.forEach(object => {
    //   this.disableCompletedWtArr[index] += object.pkgCompletedQty;
    // });

    this.calculateMixPkgWt([], 'ALL');
    // if (Number(this.pkgMap.get(pkg.value.oilPkgId)) > Number(pkg.value.assignedOilWt)) {
    //   this.msgs = [];
    //   this.msgs.push({
    //     severity: 'warn', summary: this.globalResource.applicationmsg,
    //     detail: this.assignTaskResources.compwtgreaterassignwt
    //   });

    //   pkg.controls['pkgCompletedQty'].setErrors({ 'GreaterPkgWt': true });
    // }

    const packagesCompletedBox = (<FormGroup>this.completionForm.get('completeParamArr.' + index))
    .get('completedQty');

    packagesCompletedBox.markAsTouched();
    packagesCompletedBox.updateValueAndValidity();
    // if ( Number(this.disableCompletedWtArr[index]) * Number(comp.value.ItemQty) * Number(comp.value.UnitValue) > Number(lot.value.AssignedWt) ) {
    //   this.msgs = [];
    // this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Sum of all lot weight is greater than total assigned weight.' });

    //   lot.controls['pkgCompletedQty'].setErrors({'GreaterLotWt': true});
    // }
  }

  calculateMixPkgWt(question, Flag) {
    let pkgTotalWeight = 0;

    if (String(Flag).toLocaleUpperCase() === 'SPECIFIC') {
        // Iterate throught each product type
        this.completeParamArr.controls.forEach((productTypeItem, parentIndex) => {
          // Iterate throught every lot in above product type
          (productTypeItem as FormArray).controls['PkgDetails'].controls.forEach(PkgDetails => {
            if (PkgDetails.value.oilPkgId === question.value.oilPkgId) {
              pkgTotalWeight += Number(PkgDetails.value.pkgCompletedQty) * Number(productTypeItem.value.UnitValue) * Number(productTypeItem.value.ItemQty);
            }
          });

            // (productTypeItem as FormArray).controls['MixPkgDetails'].controls.forEach((mixPkgDetails, childIndex) => {
            //   if (this.selectedMixPkgsArray.length > 0) {
            //     this.selectedMixPkgsArray[this.selMixPkgPkgRow.ParentRowIndex + '' + this.selMixPkgPkgRow.selectedRowIndex].forEach(element => {
            //       if (element.oilPkgCode === question.value.oilPkgCode) {
            //         pkgTotalWeight += Number(element.selectedOilWt);
            //       }
            //     });
            //   } else {
            //     pkgTotalWeight += Number(question.value.answer);
            //   }
            // });
        });

        // lot total processed wt
        this.pkgMap.set(question.value.oilPkgId, pkgTotalWeight);

        // lot total balanced wt
        this.pkgBalancedWtMap.set(question.value.oilPkgId, Number(question.value.assignedOilWt) - pkgTotalWeight);
    } else if (String(Flag).toLocaleUpperCase() === 'ALL') {

          this.pkgMap.clear();
          this.pkgBalancedWtMap.clear();
          this.productTypeQtyMap.clear();
          // Iterate throught each product type
          this.completeParamArr.controls.forEach((productTypeItem, parentIndex) => {
            // Iterate throught every lot in above product type
            (productTypeItem as FormArray).controls['PkgDetails'].controls.forEach(PkgDetails => {
              if (this.pkgMap.has(PkgDetails.value.oilPkgId)) {
                this.pkgMap.set(PkgDetails.value.oilPkgId ,
                  Number(this.pkgMap.get(PkgDetails.value.oilPkgId)) +
                  Number(PkgDetails.value.pkgCompletedQty) *
                  Number(productTypeItem.value.UnitValue) *
                  Number(productTypeItem.value.ItemQty));

                  this.pkgBalancedWtMap.set(PkgDetails.value.oilPkgId,
                    parseFloat(String(Number(PkgDetails.value.assignedOilWt) - Number(this.pkgMap.get(PkgDetails.value.oilPkgId)))).toFixed(2));
              } else {
                this.pkgMap.set(PkgDetails.value.oilPkgId ,
                  Number(PkgDetails.value.pkgCompletedQty) *
                  Number(productTypeItem.value.UnitValue) *
                  Number(productTypeItem.value.ItemQty));

                  this.pkgBalancedWtMap.set(PkgDetails.value.oilPkgId,
                    parseFloat(String(Number(PkgDetails.value.assignedOilWt) - Number(this.pkgMap.get(PkgDetails.value.oilPkgId)))).toFixed(2));
              }

              if (this.productTypeQtyMap.has(productTypeItem.value.ProductTypeId)) {
                this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
                  (Number(this.productTypeQtyMap.get(productTypeItem.value.ProductTypeId)) + Number(PkgDetails.value.pkgCompletedQty)));
              } else {
                this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
                  Number(PkgDetails.value.pkgCompletedQty));
              }
            });

            // (productTypeItem as FormArray).controls['MixPkgDetails'].controls.forEach((mixPkgDetails, childIndex) => {

            //   if (this.selectedMixPkgsArray[parentIndex + '' + childIndex]) {

            //     this.selectedMixPkgsArray[parentIndex + '' + childIndex].forEach(element => {
            //       if (this.pkgMap.has(element.oilPkgId)) {
            //         this.pkgMap.set(element.oilPkgId ,
            //           Number(this.pkgMap.get(element.oilPkgId)) +
            //           Number(element.selectedOilWt));
            //       } else {
            //         this.pkgMap.set(element.oilPkgId ,
            //           Number(element.selectedOilWt));
            //       }

            //       this.pkgBalancedWtMap.set(element.oilPkgId,
            //         parseFloat(String(Number(element.assignedOilWt) - Number(this.pkgMap.get(element.oilPkgId)))).toFixed(2));
            //   });

            //   }

            //   if (this.productTypeQtyMap.has(productTypeItem.value.ProductTypeId)) {
            //     this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
            //       (Number(this.productTypeQtyMap.get(productTypeItem.value.ProductTypeId)) + 1));
            //   } else {
            //     this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId, 1);
            //   }
            // });
          });
    }
  }

  calculateMixPkgWtForReview(question, Flag) {
    if (String(Flag).toLocaleUpperCase() === 'SPECIFIC') {

    } else if (String(Flag).toLocaleUpperCase() === 'ALL') {
          this.pkgMap.clear();
          this.pkgBalancedWtMap.clear();
          this.productTypeQtyMap.clear();
          // Iterate throught each product type
          this.reviewParamArr.controls.forEach((productTypeItem, parentIndex) => {
            // Iterate throught every lot in above product type
            (productTypeItem as FormArray).controls['PkgDetails'].controls.forEach(PkgDetails => {
              if (this.pkgMap.has(PkgDetails.value.oilPkgId)) {
                this.pkgMap.set(PkgDetails.value.oilPkgId ,
                  Number(this.pkgMap.get(PkgDetails.value.oilPkgId)) +
                  Number(PkgDetails.value.pkgReviewedQty) *
                  Number(productTypeItem.value.UnitValue) *
                  Number(productTypeItem.value.ItemQty));

                  this.pkgBalancedWtMap.set(PkgDetails.value.oilPkgId,
                    parseFloat(String(Number(PkgDetails.value.assignedOilWt) - Number(this.pkgMap.get(PkgDetails.value.oilPkgId)))).toFixed(2));
              } else {
                this.pkgMap.set(PkgDetails.value.oilPkgId ,
                  Number(PkgDetails.value.pkgReviewedQty) *
                  Number(productTypeItem.value.UnitValue) *
                  Number(productTypeItem.value.ItemQty));

                  this.pkgBalancedWtMap.set(PkgDetails.value.oilPkgId,
                    parseFloat(String(Number(PkgDetails.value.assignedOilWt) - Number(this.pkgMap.get(PkgDetails.value.oilPkgId)))).toFixed(2));
              }

              if (this.productTypeQtyMap.has(productTypeItem.value.ProductTypeId)) {
                this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
                  (Number(this.productTypeQtyMap.get(productTypeItem.value.ProductTypeId)) + Number(PkgDetails.value.pkgReviewedQty)));
              } else {
                this.productTypeQtyMap.set(productTypeItem.value.ProductTypeId,
                  Number(PkgDetails.value.pkgReviewedQty));
              }
            });
          });
    }
  }

  calculateTotalReviewedWt(index, comp, pkg) {
    this.disableCompletedQtyArr[index] = 0;

    comp.controls.PkgDetails.value.forEach(object => {
      this.disableCompletedQtyArr[index] += object.pkgReviewedQty;
    });

    this.calculateMixPkgWtForReview([], 'ALL');
    // if (Number(this.pkgMap.get(pkg.value.oilPkgId)) > Number(pkg.value.assignedOilWt)) {
    //   this.msgs = [];
    //   this.msgs.push({
    //     severity: 'warn', summary: this.globalResource.applicationmsg,
    //     detail: this.assignTaskResources.compwtgreaterassignwt
    //   });

    //   pkg.controls['pkgReviewedQty'].setErrors({ 'GreaterPkgWt': true });
    // }

    const packagesReviewedBox = (<FormGroup>this.completionForm.get('reviewParamArr.' + index))
    .get('reviewedQty');

    packagesReviewedBox.markAsTouched();
    packagesReviewedBox.updateValueAndValidity();
  }

  compQtyOnChange(index, formArrayObj) {
    // (formArrayObj.get('PkgDetails') as FormArray).reset();
    // let defaultPkgCode;
    // let oilProcessedWt = 0;
    if (formArrayObj.get('completedQty').valid) {
         this.strainPkgs[index] =   _.uniqWith(this.dropdwonTransformService.transform(
             this.TaskModel.AssignQtyPkgDetails
            .filter(result =>  {
              if (this.TaskModel.AssignQtyDetails[index].GeneticsId) {
                return result.GeneticsId === this.TaskModel.AssignQtyDetails[index].GeneticsId;
              } else {
                return result.StrainId === this.TaskModel.AssignQtyDetails[index].StrainId;
              }
            }),
              'OilPkgCode', 'OilPkgId', '-- Select --')
          , _.isEqual);

        //   // Clear product pkg processed wt if completed pkg qty changes
        //   (formArrayObj.get('PkgDetails') as FormArray).value.forEach(element => {
        //     this.pkgMap.set(element.oilPkgId, 0);
        //   });

        //   if ( this.strainPkgs[index].length === 2) {
        //     defaultPkgCode = (this.strainPkgs[index])[1].value;

        //     oilProcessedWt = Number(this.disableCompletedQtyArr[index])
        //     * Number(this.TaskModel.AssignQtyDetails[index].UnitValue)
        //     * Number(this.TaskModel.AssignQtyDetails[index].ItemQty);

        //     // Package total processed wt
        //     this.pkgMap.set(String(defaultPkgCode), oilProcessedWt);
        //   } else { defaultPkgCode = null; }

        // formArrayObj.setControl('PkgDetails', this.fb.array([]));
        // for (let pkgIndex = 1; pkgIndex <= this.disableCompletedQtyArr[index]; pkgIndex++) {
        //   // Clear all processed wt entries
        //   (formArrayObj.get('PkgDetails') as FormArray).push(
        //   this.createPkgControls(this.fb, pkgIndex, 'Complete', defaultPkgCode)
        //   );
        // }

        if (this.disableCompletedQtyArr[index] !== 0) {
          formArrayObj.setControl('PkgDetails', this.fb.array([]));
          // formArrayObj.setControl('MixPkgDetails', this.fb.array([]));

          this.TaskModel.AssignQtyPkgDetails

          .filter(result => {
            if (this.TaskModel.AssignQtyDetails[index].GeneticsId) {
              return result.GeneticsId === this.TaskModel.AssignQtyDetails[index].GeneticsId;
            } else {
              return result.StrainId === this.TaskModel.AssignQtyDetails[index].StrainId;
            }
          })
          .map((object, index1) => {
             (formArrayObj.get('PkgDetails') as FormArray).push(this.createPkgControls(this.fb, object, index1, 'Complete'));
          });
          this.calculateMixPkgWt([], 'ALL');
        } else {
          this.mixPkgDetailsArr(formArrayObj).controls.forEach((control, childIndex) => {
              this.selectedMixPkgsArray[index + '' + childIndex] = [];
          });
          // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
          // localStorage.setItem('selectedMixPkgsArray', JSON.stringify(this.selectedMixPkgsArray));
          this.appCommonService.setLocalStorage('selectedMixPkgsArray', JSON.stringify(this.selectedMixPkgsArray));

          // formArrayObj.setControl('PkgDetails', this.fb.array([]));
          // formArrayObj.setControl('MixPkgDetails', this.fb.array([]));

          this.calculateMixPkgWt([], 'ALL');
        }
    }
  }

  oilPkgCodeOnChange(ParentFormArrayObj, ParentIndex, index, formArrayObj) {
    let oilProcessedWt = 0;

    if (formArrayObj.get('oilPkgId').valid) {

      this.pkgMap.clear();
      // Iterate throught each product type
      this.completeParamArr.controls.forEach(productTypeItem => {
        // Iterate throught every lot in above product type
        (productTypeItem as FormArray).controls['PkgDetails'].controls.forEach(pkgDetails => {
          // if (pkgDetails.value.oilPkgCode === formArrayObj.value.oilPkgCode) {
          //   oilProcessedWt +=  Number(productTypeItem.value.UnitValue) * Number(productTypeItem.value.ItemQty);

          //   pkgDetails.controls['oilPkgCode'].updateValueAndValidity();
          // }
          // Package total processed wt
          oilProcessedWt = 0;
          if (!this.pkgMap.has(String(pkgDetails.value.oilPkgId))) {
              oilProcessedWt += (Number(productTypeItem.value.UnitValue)
                              * Number(productTypeItem.value.ItemQty));
          } else {
              oilProcessedWt += Number(this.pkgMap.get(String(pkgDetails.value.oilPkgId)))
                            + (Number(productTypeItem.value.UnitValue)
                            * Number(productTypeItem.value.ItemQty));
          }

          this.pkgMap.set(String(pkgDetails.value.oilPkgId), oilProcessedWt);
        });
      });
    }
  }

  calculateDefaultProcessedWtForReview() {
    let oilProcessedWt = 0;
    this.pkgMap.clear();
      // Iterate throught each product type
      this.reviewParamArr.controls.forEach(productTypeItem => {
        // Iterate throught every lot in above product type

        // (productTypeItem as FormArray).controls['PkgDetails'].controls.forEach(pkgDetails => {
        //   // Package total processed wt
        //   oilProcessedWt = 0;
        //   if (!this.pkgMap.has(String(pkgDetails.value.oilPkgId))) {
        //       oilProcessedWt += (Number(productTypeItem.value.UnitValue)
        //                       * Number(productTypeItem.value.ItemQty));
        //   } else {
        //       oilProcessedWt += Number(this.pkgMap.get(String(pkgDetails.value.oilPkgId)))
        //                     + (Number(productTypeItem.value.UnitValue)
        //                     * Number(productTypeItem.value.ItemQty));
        //   }

        //   this.pkgMap.set(String(pkgDetails.value.oilPkgId), oilProcessedWt);
        // });

        (productTypeItem as FormArray).controls['PkgDetails'].controls.forEach(pkgDetails => {
          if (!this.pkgMap.has(String(pkgDetails.value.oilPkgId))) {
            oilProcessedWt += Number(pkgDetails.value.pkgReviewedQty)
                              * (Number(productTypeItem.value.UnitValue)
                              * Number(productTypeItem.value.ItemQty));
        } else {
          oilProcessedWt += Number(this.pkgMap.get(String(pkgDetails.value.oilPkgId)))
                            +  Number(pkgDetails.value.pkgReviewedQty)
                            * (Number(productTypeItem.value.UnitValue)
                            * Number(productTypeItem.value.ItemQty));
        }

        this.pkgMap.set(pkgDetails.value.oilPkgId, oilProcessedWt);
      });
      });
  }

  createReviewPkgControls(fb: FormBuilder, flag: string) {
    return (object, index) => {
      let pkgBox;
      pkgBox = [object.OilPkgId ? object.OilPkgId : 0, Validators.required];
      return fb.group({ pkgIndex: index + 1, packageCode: object.PackageCode, oilPkgId: pkgBox, ProductTypeId: object.ProductTypeId });
    };
  }

  createPkgControls(fb: FormBuilder, object: any, index: number, flag: string) {
    let pkgCompletedQtyBox;

    if (flag === 'Complete') {
      pkgCompletedQtyBox = [null];

      return fb.group({
        pkgIndex: index,
        oilPkgCode: object.OilPkgCode,
        oilPkgId: object.OilPkgId,
        assignedOilWt: object.AssignedOilWt,
        pkgCompletedQty: pkgCompletedQtyBox,
        tpPkgTypeName: object.TPPkgTypeName
      });
    } else {
      pkgCompletedQtyBox = [object.ProcessedOilQty ? object.ProcessedOilQty : 0];
     const assignedOilWt = this.TaskModel.AssignQtyPkgDetails.filter(data => data.OilPkgId === object.OilPkgId)[0].AssignedOilWt;

      return fb.group({
        pkgIndex: index,
        oilPkgCode: object.OilPkgCode,
        oilPkgId: object.OilPkgId,
        assignedOilWt: assignedOilWt ? assignedOilWt : 0,
        pkgReviewedQty: pkgCompletedQtyBox,
        tpPkgTypeName: object.TPPkgTypeName
      });
    }
  }

  createQuestionControl(fb: FormBuilder) {
    return (question, index) => {
      let checkbox;
      let answerbox;
      const pkgSelectedDetails = this.selectedPkgsArray[this.selPkgBrandStrainRow.selectedRowIndex];

      let isLotPresentInDBData = false;
      if (pkgSelectedDetails) {

        const pkgRowDetails = [];

        pkgSelectedDetails.forEach(data => {
          // Added by Devdan :: 17-Oct-2018
          if (this.taskTypeId > 0 && question.OilPkgId === data.OilPkgId) {
            pkgRowDetails.push(data);
          } else if (data.Index === index) {
            pkgRowDetails.push(data);
          }
          ///// Check if the selected lot is persent in database data In Edit mode
          if (this.taskId && this.taskId > 0) {
            this.TaskModel.OilPckgDetails.forEach(pkg => {
              if (question.OilPkgId === pkg.OilPkgId) {
                isLotPresentInDBData = true;
              }
            });
          }
        });

        if (pkgRowDetails.length) {
          const pkgWt = pkgRowDetails[0].SelectedWt;
          if (this.taskId && this.taskId > 0) {
            checkbox = pkgRowDetails[0].Selected;
            // comment if checkbox true
            // answerbox = pkgRowDetails[0].Selected
            // ? [pkgWt, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt + Number(pkgWt))])]
            // : null;
            answerbox = [pkgWt, Validators.compose([Validators.max(question.AvailableWt + Number(pkgWt))])];
          } else {
            checkbox = pkgRowDetails[0].Selected;
            // answerbox = pkgRowDetails[0].Selected
            // ? [pkgWt, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt)])]
            // : null;
            answerbox = [pkgWt, Validators.compose([ Validators.max(question.AvailableWt)])];
          }
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

      if (this.taskId && this.taskId > 0) {
        return fb.group({
          questionNumber: index, question: checkbox, OilPkgCode: question.OilPkgCode,
          TPPkgTypeName: question.TPPkgTypeName, answer: answerbox,
          AvailWt: question.AvailableWt + (answerbox ? Number(answerbox[0]) : 0),
          StrainId: question.StrainId, StrainName: question.StrainName, GeneticsId: question.GeneticsId, GeneticsName: question.GeneticsName,
          OilPkgId: question.OilPkgId
        });
      } else {
        return fb.group({
          questionNumber: index, question: checkbox, OilPkgCode: question.OilPkgCode,
          TPPkgTypeName: question.TPPkgTypeName, answer: answerbox,
          AvailWt: question.AvailableWt,
          StrainId: question.StrainId, StrainName: question.StrainName, GeneticsId: question.GeneticsId, GeneticsName: question.GeneticsName,
          OilPkgId: question.OilPkgId
        });
      }
    };
  }

  createQuestionControlForMixPkg(fb: FormBuilder) {
    return (question, index) => {
      let checkbox;
      let answerbox;

      const pkgSelectedDetails = this.selectedMixPkgsArray[this.selMixPkgPkgRow.ParentRowIndex  + '' + this.selMixPkgPkgRow.selectedRowIndex];

      if (pkgSelectedDetails) {

        const pkgRowDetails = [];

        pkgSelectedDetails.forEach(data => {
          // Added by Devdan :: 17-Oct-2018
          if (this.taskTypeId > 0 && question.OilPkgId === data.OilPkgId) {
            pkgRowDetails.push(data);
          } else if (data.Index === index) {
            pkgRowDetails.push(data);
          }
        });

        if (pkgRowDetails.length) {
          checkbox = pkgRowDetails[0].Selected;

          // comment if checkbox checked condition to validation :: swapnil :: 05-april-2019
          // answerbox = pkgRowDetails[0].Selected
          //   ? [pkgRowDetails[0].selectedOilWt, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt)])]
          //   : null;
          answerbox = [pkgRowDetails[0].selectedOilWt, Validators.compose([Validators.max(question.AvailableWt)])];

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
        answerbox = [null, Validators.compose([Validators.required, Validators.min(0.1), Validators.max(question.AvailableWt)])];
      }
      return fb.group({
        question: checkbox, answer: answerbox, questionNumber: index, oilPkgCode: question.OilPkgCode, assignedOilWt: question.AssignedOilWt,
        StrainName: question.StrainName, StrainId: question.StrainId,
        AvailWt: question.AvailableWt, tpPkgTypeName: question.TPPkgTypeName, oilPkgId: question.OilPkgId
      });
    };
  }

  createItem(object, index): FormGroup {
    const counts  = this.globalData.orderDetails['Table1'].filter(result => result.StrainId === object.StrainId).length;
    // In case of Edit , show assigned qty and available qty together with respective size of package
    let eRequiredQty;
    let eAssignedQty;
    if (this.taskTypeId > 0) {
      eRequiredQty = object.RequiredQty + this.TaskModel.OilPckgOrderDetails[index].AssignedQty;
      object.RequiredQty = eRequiredQty;
      object.TotalWt = (eRequiredQty * this.TaskModel.OilPckgOrderDetails[index].UnitValue);
      eAssignedQty = this.TaskModel.OilPckgOrderDetails[index].AssignedQty;
    } else {
      eAssignedQty = object.RequiredQty;
    }
    return this.fb.group({
      assignPackageWt: new FormControl({value : counts === 0 ? 0 : eAssignedQty, disabled: counts === 0 }, [Validators.max(object.RequiredQty)]),
      brandid: object.RawSupId,
      strainid: object.StrainId,
      packagetypeid: object.PkgTypeId,
      packagetype: object.PkgTypeName,
      packageunit: object.UnitValue,
      itemQty: object.ItemQty,
      productTypeId: object.ProductTypeId,
      // Added by Devdan :: 23-Nov-2018 :: Added genetic Id for Edit Task functionality validations
      geneticsId: object.GeneticsId
    });
  }

  // To show completion or review details of selected product type on action details page
  getPkgInfo(ProductTypeId) {

    this.packageDetails = this.TaskModel.AssignQtyDetails.filter(result => result.ProductTypeId === ProductTypeId)[0];
    this.showProductTypePkgDetailsModal = true;

    this.productTypePkgDetails = this.TaskModel.ReviewQtyPkgDetails
      .filter(result => result.ProductTypeId === ProductTypeId);

  }

  displayPkgDetails(orderDetail) {
    // return this.TaskModel.AssignQtyPkgDetails.filter(result => result.RawSupId === orderDetail.RawSupId && result.StrainId === orderDetail.StrainId);
    return this.TaskModel.AssignQtyPkgDetails.filter(result =>  result.StrainId === orderDetail.StrainId  );
  }

  // AssignWtOnChange(budOrderPacket) { // Commented by Devdan :: 26-Oct-2018 :: Unused
    // this.orderDetailsBS.filter();

    // if (!budOrderPacket.controls['assignPackageWt'].valid) {
    //   // budOrderPacket.controls['assignPackageWt'].value = '';
    //   return;
    // }

    // this.orderDetailsBS_filteredData = [];
    // this.selectedLotsArray = [];

    // const filterItems = this.oilOrderPackets.value.filter(result => {
    //   return result.assignPackageWt > 0;
    // });

    // this.orderDetailsBS.forEach((value, key) => {
    //   let exists = false;
    //   filterItems.forEach((val2, key1) => {
    //     if (value.RawSupId === val2.brandid && value.StrainId === val2.strainid) { exists = true; }
    //   });

    //   if (exists && value.RawSupId !== '' && value.StrainId !== '') { this.orderDetailsBS_filteredData.push(value); }
    // });
  // }

  changeValidator(selected, index) {
    const answerbox = this.questionForm.get('questions.' + index).get('answer');
    const availablewt = this.questionForm.get('questions.' + index).get('AvailWt');

    const validators = selected ? Validators.compose([Validators.required, Validators.min(0.1), Validators.max(availablewt.value)]) : null;
    answerbox.setValidators(validators);
    answerbox.updateValueAndValidity();
  }

  estStartDate_Select() {
    if (((new Date(this.returnFormattedDate(this.defaultDate)) >
      new Date(this.OILPACKAGING.value.estimatedstartdate)))) {
      this.showPastDateLabel = true;
    } else {
      this.showPastDateLabel = false;
    }
  }

  returnFormattedDate(dateObject) {
    return new Date(dateObject).toLocaleDateString().replace(/\u200E/g, '');
  }

  onNoteSave(lotComments) {
    this.uniqueBrandStrain = this.uniqueBrandStrain;
  }

  employeeListByClient() {
    this.dropdownDataService.getEmployeeListByClient().subscribe(
      data => {
        this.globalData.employees = [];
        this.globalData.employees = data;
        this.employees = this.dropdwonTransformService.transform(data, 'EmpName', 'EmpId', '-- Select --');
      },
      error => { console.log(error); },
      () => console.log('Get all employees by client complete'));
  }

  getSelectedOrderDetails(OrderId) {
    let editmode;
    if (this.taskTypeId > 0) {
      editmode = true;
    } else {
      editmode = false;
    }
    this.orderService.getSelectedOrderDetails(OrderId, 'OIL', editmode, this.taskId).subscribe(
      data => {
        if (data !== 'No data found!') {
          this.globalData.orderDetails = data;
          this.orderDetails = data.Table;
          const newArr = [];
          this.orderDetailsBS = this.removeDuplicatesByName(this.orderDetails);
          // To get unique record according brand and strain :: By Devdan 23-Nov-2018
          if (this.taskTypeId > 0) {
            this.orderDetailsBS = this.removeDuplicatesByName(this.TaskModel.OilPckgDetails);
          } else {
            this.orderDetailsBS = this.removeDuplicatesByName(this.orderDetails);
          }
          // End of getting unique record accroding brand and strain
          // End of getting unique record accroding brand and strain

          // To map assign wt textbox in table for each row
          (this.ParentFormGroup.controls['OILPACKAGING'] as FormGroup).setControl('oilOrderPackets', this.fb.array([]));

          // this.oilOrderPackets.push(this.fb.array(this.orderDetails.map(this.createItem(this.fb))));
          this.orderDetails.map((object, index) => {
            this.oilOrderPackets.push(this.createItem(object, index));
          });

          // End To map assign wt textbox in table for each row

          // Unique Brand Strain Combination
          this.orderDetailsBS_filteredData = [];
          this.selectedPkgsArray = [];

          const filterItems = this.oilOrderPackets.value.filter(result => {
            return result.assignPackageWt !== null;
          });

          this.orderDetailsBS.forEach((value, key) => {
            let exists = false;
            this.oilOrderPackets.value.forEach((val2, key1) => {
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
        if (this.taskTypeId > 0) {
          this.TaskModel.OilPckgOrderDetails.forEach(order => {
            this.openPkgSelection(order.StrainId, order.GeneticsId, 0);
          });
          this.setSelectedLotDetails(this.orderDetails);
          this.showPkgSelectionModel = false;
          this.readiOnlyFlag = true;
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

  getCOilPackagingOrders() {
    let editmode;
    if (this.taskTypeId > 0) {
      editmode = true;
    } else {
      editmode = false;
    }
    this.orderService.getCOilPackagingOrders(editmode).subscribe(
      data => {
        if (data !== 'No data found!') {
          this.allOrders = data;
          this.allOrderNos = this.dropdwonTransformService.transform(data, 'OrderRefId', 'OrderId', '-- Select --');
        }

        // Added by Devdan :: 08-Oct-2018 :: Load Stain Change Event
        if (this.taskTypeId > 0) {
          this.setFormInEditMode(0);
          this.onOrderChange();
        }
      },
      error => { console.log(error); },
      () => console.log('Get All Orders complete'));
  }

  onOrderChange() {
    this.orderObject = this.allOrders.filter(result => result.OrderId === this.TaskModel.OILPACKAGING.orderno)[0];

    this.selectedPkgsArray = [];

    // localStorage.removeItem('selectedPkgsArray');
    this.appCommonService.removeItem('selectedPkgsArray');
    // localStorage.removeItem('uniqueOrderStrains');
    this.getSelectedOrderDetails(this.TaskModel.OILPACKAGING.orderno);
  }

  onLotSelectionChange() {
    this.selectedLots = [];
    this.TaskModel.OILPACKAGING.lotno.map(item => {
      return {
        'lotno': item, 'availableQty': '23'
      };
    }).forEach(item => this.selectedLots.push(item));
  }

  openPkgSelection(StrainId, GeneticsId, rowIndex) {
    this.brandStrainPkgs = [];
    this.brandStrainPkgs = this.globalData.orderDetails['Table1'].filter(result => result.GeneticsId === GeneticsId);

    this.selPkgBrandStrainRow.BrandId = 0;
    this.selPkgBrandStrainRow.StrainId = StrainId;
    this.selPkgBrandStrainRow.selectedRowIndex = rowIndex;

    this.selPkgBrandStrainRow.RequireWt = 0;
    this.selPkgBrandStrainRow.combinationTotalAssignedWt = 0;

    this.orderDetails.filter((value, key) =>
      value.GeneticsId === GeneticsId)
      .map(value => {
        this.selPkgBrandStrainRow.RequireWt += value.TotalWt;
        this.selPkgBrandStrainRow.BrandName = '';
        this.selPkgBrandStrainRow.StrainName = value.StrainName;
        this.selPkgBrandStrainRow.GeneticsId = value.GeneticsId;
        this.selPkgBrandStrainRow.GeneticsName = value.GeneticsName;

      });

    // console.log('brandStrainPkgs', this.brandStrainPkgs);
    // console.log('this.globalData.orderDetails', this.globalData.orderDetails);
    // console.log(this.selectedLotsArray[this.selPkgBrandStrainRow.selectedRowIndex]);
    this.questionForm = this.fb.group({
      questions: this.fb.array(this.brandStrainPkgs.map(this.createQuestionControl(this.fb)))
    });

    this.oilOrderPackets.value.forEach(result => {
      let totalPkgWt = 0;
      if (this.taskId && this.taskId > 0) {
        if ((result.strainid === StrainId  || result.geneticsId === GeneticsId) && Number(result.assignPackageWt) > 0) {
          totalPkgWt = Number(result.assignPackageWt) * Number(result.packageunit);
            this.selPkgBrandStrainRow.combinationTotalAssignedWt += Number(totalPkgWt);
        }
      } else {
        if ((result.strainid === StrainId) && Number(result.assignPackageWt) > 0) {
          totalPkgWt = Number(result.assignPackageWt) * Number(result.packageunit);
            this.selPkgBrandStrainRow.combinationTotalAssignedWt += Number(totalPkgWt);
        }
      }
    });

    this.showPkgSelectionModel = true;
  }

  openMixPkgSelection(mixPkgRow, rowIndex, ParentRowIndex) {
    const mixPkgDetails = this.TaskModel.AssignQtyPkgDetails.filter(result => result.GeneticsId === this.TaskModel.AssignQtyDetails[ParentRowIndex].GeneticsId);

    this.selMixPkgPkgRow.BrandId = 0;
    this.selMixPkgPkgRow.StrainId = this.TaskModel.AssignQtyDetails[ParentRowIndex].StrainId;
    this.selMixPkgPkgRow.StrainName = this.TaskModel.AssignQtyDetails[ParentRowIndex].StrainName;
    this.selMixPkgPkgRow.selectedRowIndex = rowIndex;
    this.selMixPkgPkgRow.ParentRowIndex = ParentRowIndex;
    this.selMixPkgPkgRow.GeneticsId = this.TaskModel.AssignQtyDetails[ParentRowIndex].GeneticsId;
    this.selMixPkgPkgRow.GeneticsName = this.TaskModel.AssignQtyDetails[ParentRowIndex].GeneticsName;

    this.selMixPkgPkgRow.RequireWt = this.TaskModel.AssignQtyDetails[ParentRowIndex].UnitValue;
    this.selMixPkgPkgRow.combinationTotalAssignedWt = this.TaskModel.AssignQtyDetails[ParentRowIndex].UnitValue;

    this.questionForm = this.fb.group({
      questions: this.fb.array(mixPkgDetails
        .map(this.createQuestionControlForMixPkg(this.fb))
      )
    });

    this.showMixPkgSelectionModel = true;
  }

  submit(form) {
    const pkgDetails = [];
    let totalPkgWt = 0;
    let loMaxWtFlag = false;

    if (this.questionForm.valid) {
      // In edit mode, skip this validation on submit and checking this validations on update tasks
      /// condition added by Devdan :: 23-Nov-2018
      if (!this.taskTypeId) {
        form.value.questions.forEach(result => {
          totalPkgWt +=  Number(result.answer) ? Number(result.answer) : 0;
        });

        if (totalPkgWt !== Number(this.selPkgBrandStrainRow.combinationTotalAssignedWt)) {
          this.msgs = [];
          this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: 'Sum of all pkg weight is not equal to total assigned weight.' });

          return;
        }
      }

      form.value.questions.forEach((result, index) => {
       // if (result.question === true) {  // change checkbox true condition add on weight
          if (result.answer >= 1) {
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
                const answerBox = (this.questionForm.get('questions.' + index) as FormGroup).controls['answer'];

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
              // StrainId: this.selPkgBrandStrainRow.StrainId, // Main Pkg strainid
              StrainId: result.StrainId,     // selected pkg strainid not product type strainid
              BrandId: this.selPkgBrandStrainRow.BrandId,
              // added by Devdan :: 23-Nov-2018 :: to check genetic wise assigned weight in edit mode
              GeneticsId:  this.selPkgBrandStrainRow.GeneticsId,
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
      this.appCommonService.setLocalStorage('selectedPkgsArray', JSON.stringify(this.selectedPkgsArray));
      this.showPkgSelectionModel = false;
    } else {
      this.appCommonService.validateAllFields(this.questionForm);
    }
    // this.submission = form.value;
  }

  // Mix Lot Details
  submitMixPkgDetails(form) {
    // event.preventDefault();
    // event.stopPropagation();
    const mixPkgDetails = [];
    let totalPkgWt = 0;

    if (this.questionForm.valid) {
      form.value.questions.forEach(result => {
        totalPkgWt +=  Number(result.answer) ? Number(result.answer) : 0;
      });

      if (totalPkgWt !== Number(this.selMixPkgPkgRow.combinationTotalAssignedWt)) {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.assignTaskResources.pkgwtnotmatched });

        return;
      }

      form.value.questions.forEach(result => {
       // if (result.question === true) { //change condition to checkbox to lot weight :: swapnil :: 05-april-2019
        if (result.question === true) {
          mixPkgDetails.push(
            {
              oilPkgCode: result.oilPkgCode,
              oilPkgId: result.oilPkgId,
              AvailWt: result.AvailWt,
              selectedOilWt: Number(result.answer),
              assignedOilWt: result.assignedOilWt,
              tpPkgTypeName: result.tpPkgTypeName,
              Selected: true,
              Index: result.questionNumber,
              StrainId: this.selMixPkgPkgRow.StrainId,
              BrandId: this.selMixPkgPkgRow.BrandId,
            }
          );
        }
      });

      this.selectedMixPkgsArray[this.selMixPkgPkgRow.ParentRowIndex + '' + this.selMixPkgPkgRow.selectedRowIndex] = mixPkgDetails;
      this.calculateMixPkgWt([], 'ALL');

      // Changed added by Devdan :: Calling common methods to get n set local storage :: 27-Sep-2018
      // localStorage.setItem('selectedMixPkgsArray', JSON.stringify(this.selectedMixPkgsArray));
      this.appCommonService.setLocalStorage('selectedMixPkgsArray', JSON.stringify(this.selectedMixPkgsArray));
      this.showMixPkgSelectionModel = false;
    } else {
      this.appCommonService.validateAllFields(this.questionForm);
    }
  }
  // End of Mix Lot Details

  // Submit Completion Parameters
  submitCompleteParameter(formModel) {
    let completeOilDetailsForApi;
    const oilPkgCodeProductListArr = [];
    const thresholdExceed = false;
    let duplicateEntry = false;
    let pkgQtyNotMatched = false;
    let isthresholdexceeded = false;

    if ( this.completionForm.valid === true) {
        completeOilDetailsForApi = {
          TaskDetails: {
            TaskId: Number(this.taskId),
            VirtualRoleId: 0,
            Comment: formModel.MiscComment ? formModel.MiscComment : '',
            MiscCost: 0,
            TaskKeyName: 'C-PACK'
          },
          OilPkgDetails: [],
          ProductTypeDetails: [],
          OilPkgCodeProductList: [],
          // MixPkgDetails: []
        };

        // 3rd Object: Product wise Total Qty Details
        formModel.completeParamArr.forEach((object, index) => {
          completeOilDetailsForApi.ProductTypeDetails.push({
            // RawSupId: object.RawSupId,
            // StrainId: object.StrainId,
            // PkgTypeId: object.PkgTypeId,
            // UnitValue: object.UnitValue,
            ProductTypeId: object.ProductTypeId,
            PackageCode: object.packageCode,
            Qty: object.completedQty ? object.completedQty : 0,
            IndexCode: String(index)
          });

          // 4th Object: Product wise all lot list and their entered wt details
          let validateDuplicateFlag = false;
          if ((String(object.packageCode) !== '' && object.packageCode) && Number(completeOilDetailsForApi.ProductTypeDetails.filter(data =>
            (String(data.PackageCode) !== '' && data.PackageCode)
              && String(data.PackageCode).toLocaleUpperCase() === String(object.packageCode).toLocaleUpperCase()).length) > 1) {
              // this.msgs = [];
              // this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.duplicatePackageCode });

              const uniquecodeBox = (<FormGroup>this.completionForm.get('completeParamArr.' + index))
              .get('packageCode');

              if (!validateDuplicateFlag) {
                validateDuplicateFlag = true;
                (uniquecodeBox as FormControl).setErrors({ 'duplicatepkgcode': true });
              }

              duplicateEntry = true;
              return;
            }

            if (this.productTypeQtyMap.get(object.ProductTypeId) !== object.completedQty) {
              const packagesCompletedBox = (<FormGroup>this.completionForm.get('completeParamArr.' + index))
              .get('completedQty');
              packagesCompletedBox.setErrors({ pkgqtynotmatched: true });
              packagesCompletedBox.markAsDirty();
              pkgQtyNotMatched = true;
              return;
            }
          });

          if (pkgQtyNotMatched) {
            return;
          }

          // 4th Object: Product wise all lot list and their entered wt details
          formModel.completeParamArr.forEach((object, index) => {
            object.PkgDetails.forEach(PkgObject => {
              if (PkgObject.pkgCompletedQty > 0) {
              completeOilDetailsForApi.OilPkgCodeProductList.push({
                ProductTypeId: object.ProductTypeId,
                OilPkgId: PkgObject.oilPkgId,
                PackageCode: object.packageCode ? object.packageCode : '',
                Qty: PkgObject.pkgCompletedQty ? PkgObject.pkgCompletedQty : 0
              });
            }

              oilPkgCodeProductListArr.push({
                StrainId: object.StrainId,
                PkgTypeId: object.PkgTypeId,
                UnitValue: object.UnitValue,
                ItemQty: object.ItemQty,
                ProductTypeId: object.ProductTypeId,
                OilPkgId: PkgObject.oilPkgId,
                Qty: PkgObject.pkgCompletedQty ? PkgObject.pkgCompletedQty : 0
              });
            });
          });

        // 2nd Object: All Products unique lot id and sum of product item qty

        // const result = _.groupBy(completePkgDetailsForApi.OilPkgCodeProductList , c => {
        //   return [c.LotId];
        // });

        _.mapValues(_.groupBy(oilPkgCodeProductListArr, 'OilPkgId'),
          (clist, OilPkgId) => {
            let oilPkgsWt = 0;
            let pkgReturnedWt = 0;
            let assignedOilWt = 0;
            let pkgFormIndex = 0;
            const toleranceValue = 0;
            const tolerance = Number(this.TaskModel.Threshold);

            // clist.map(PkgDetails => {
            //   OilPkgsWt += ( Number(PkgDetails.UnitValue) * Number(PkgDetails.ItemQty));
            // });
            oilPkgCodeProductListArr.forEach(PkgDetails => {
              if (Number(OilPkgId) === Number(PkgDetails.OilPkgId)) {
                oilPkgsWt += ( Number(PkgDetails.UnitValue) * Number(PkgDetails.ItemQty));
              }
            });

            formModel.pkgReturnWtArr.forEach((object, index) => {
              if (Number(object.OilPkgId) === Number(OilPkgId)) {
                pkgReturnedWt = Number(object.pkgReturnedWt);
                assignedOilWt = Number(object.AssignedOilWt);
                pkgFormIndex = index;
              }
            });
            if (this.EnabledReturnwtbox === true)  {
              pkgReturnedWt = pkgReturnedWt;
            } else {
            // PkgReturnedWt =  Total Pkg Assigned Wt - Total Pkg Processed Wt
            const autoProcessweight = Number(this.pkgMap.get(Number(OilPkgId)));
            if (Number(assignedOilWt < Number(autoProcessweight))) {
              pkgReturnedWt = 0;
            } else {
            pkgReturnedWt = Number(parseFloat(String(Number(assignedOilWt) - Number(this.pkgMap.get(Number(OilPkgId))))).toFixed(2));
            }
          }

            let processedwt = 0;
            let assignWt = 0;
            let thresholdReturnwt = 0;
            const isReturnWTEnabled = 0;
            assignWt = Number(assignedOilWt);
            thresholdReturnwt = pkgReturnedWt;
            processedwt = Number(this.pkgMap.get(Number(OilPkgId)));
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

          // if (Number(assignWt) >  Number(processedwt)) {
          //   if (Number(IsReturnWTEnabled) === 0  ) {
          //     thresholdReturnwt = Number(assignWt) - Number(processedwt);
          //   } else {
          //     thresholdReturnwt = PkgReturnedWt ? PkgReturnedWt : 0 ;
          //   }
          // } else {
          //   thresholdReturnwt = 0;
          // }


            // toleranceValue =  (Number(AssignedOilWt) * Number(tolerance)) / 100;
            // // To check total completion plus return wt is match with tolerance value tolerance is configured in enviroment
            // if (Number(tolerance) === 0) {
            //   PkgReturnedWt = Number(AssignedOilWt) -  Number(OilPkgsWt);
            // } else {
            //   if (
            //       (toleranceValue
            //         -
            //         Math.abs((AssignedOilWt - (Number(PkgReturnedWt) + Number(OilPkgsWt)) ))) < 0
            //     ) {
            //     this.msgs = [];
            //     this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            //       detail: this.assignTaskResources.returnwtnotmatchedwithtolerance });

            //       const returnbox = this.completionForm.get('pkgReturnWtArr.' + PkgFormIndex).get('pkgReturnedWt');
            //       // returnbox.setErrors({ thresholdExceed: true });
            //       // returnbox.updateValueAndValidity();
            //       thresholdExceed = true;
            //     return;
            //   }
            // }

            // if (LotTotalWt) {
              completeOilDetailsForApi.OilPkgDetails.push({
                OilPkgId: OilPkgId,
                // UnitValue: Number(String(PkgObject).split(',')[1]),
                OilWt: Number(this.pkgMap.get(Number(OilPkgId))) ? Number(this.pkgMap.get(Number(OilPkgId))) : 0,
                ReturnWt: thresholdReturnwt
              });
          });

          // 5th Object: Mix Lot Details
          // formModel.completeParamArr.forEach((object, index) => {
          //   if (object.MixPkgDetails.length > 0) {
          //     object.MixPkgDetails.forEach((MixLotObject, childIndex) => {
          //       if (this.selectedMixPkgsArray[index + '' + childIndex].length > 0) {
          //         this.selectedMixPkgsArray[index + '' + childIndex].forEach(item => {
          //           completeOilDetailsForApi.MixPkgDetails.push({
          //             SkewKeyName: 'OIL',
          //             MixPkgNo: index + '' + childIndex,
          //             ProductTypeId: object.ProductTypeId,
          //             OilPkgCode: item.oilPkgCode,
          //             Weight: item.selectedOilWt ? item.selectedOilWt : 0
          //           });
          //         });
          //       }
          //     });
          //   }
          // });
          // 5th Object: End of Mix Lot Details
          if (duplicateEntry) { return; }
          duplicateEntry = false;

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

          this.taskCommonService.completeTask(completeOilDetailsForApi)
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
              } else {
                if (String(data[0].ResultKey  ).toLocaleUpperCase() === 'DUPLICATE') {
                  let validateDuplicateFlag = false;
                  data.forEach(dataItem => {
                    if (dataItem.PackageCode && String(dataItem.PackageCode) !== '') {
                      const arrIndexCode = String(dataItem.IndexCode);
                      const uniquecodeBox = (<FormGroup>this.completionForm.get('completeParamArr.' + arrIndexCode[0]))
                     // .get('PkgDetails.' + arrIndexCode[1])
                      .get('packageCode');

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
            });
            // Commented by DEVDAN :: 26-Sep2018 :: Optimizing API Calls
            // this.refreshService.PushChange().subscribe(
            //   msg => {
            //   });
              // http call ends
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
    let reviewPkgDetailsForApi;
    const oilPkgCodeProductListArr = [];
    const thresholdExceed = false;
    let duplicateEntry = false;
    let Isthresholdexceeded = false;
    // Added by Devdan :: Sec to Min change :: 06-Nov-2018 :: Calculate Seconds
    const ActSeconds = this.reviewForm.getRawValue().ActSecs;
    if ( this.reviewForm.valid === true) {
        reviewPkgDetailsForApi = {
          TaskDetails: {
            TaskId: Number(this.taskId),
            VirtualRoleId: 0,
            Comment: formModel.MiscComment ? formModel.MiscComment : '',
            MiscCost: formModel.MiscCost ? formModel.MiscCost : 0,
            // Modified by Devdan :: Sec to Min change :: 06-Nov-2018
            RevTimeInSec: this.CaluculateTotalSecs(formModel.ActHrs, formModel.ActMins, ActSeconds),
            TaskKeyName: 'C-PACK'
          },
          OilPkgDetails: [],
          ProductTypeDetails: [],
          OilPkgCodeProductList: []
        };

        // 3rd Object: Product wise Total Qty Details
        formModel.reviewParamArr.forEach((object, index) => {
          reviewPkgDetailsForApi.ProductTypeDetails.push({
            ProductTypeId: object.ProductTypeId,
            PackageCode: object.PackageCode ? object.PackageCode : '',
            IndexCode: String(index),
            Qty: object.reviewedQty ? object.reviewedQty : 0
          });
        });

        // 4th Object: Product wise all lot list and their entered wt details
        formModel.reviewParamArr.forEach((object, index) => {
          object.PkgDetails.forEach((PkgObject, childIndex) => {

              if (object.packageCode && Number(reviewPkgDetailsForApi.OilPkgCodeProductList.filter(data =>
                data.PackageCode
                  && String(data.PackageCode).toLocaleUpperCase() === String(PkgObject.packageCode).toLocaleUpperCase()).length) > 0) {
                this.msgs = [];
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.duplicatePackageCode });
                duplicateEntry = true;
              }
              if (PkgObject.pkgCompletedQty > 0) {
              reviewPkgDetailsForApi.OilPkgCodeProductList.push({
                ProductTypeId: object.ProductTypeId,
                OilPkgId: PkgObject.oilPkgId,
                Qty: PkgObject.pkgReviewedQty ? PkgObject.pkgReviewedQty : 0
              });
            }
              oilPkgCodeProductListArr.push({
                StrainId: object.StrainId,
                PkgTypeId: object.PkgTypeId,
                UnitValue: object.UnitValue,
                ItemQty: object.ItemQty,
                ProductTypeId: object.ProductTypeId,
                OilPkgId: PkgObject.oilPkgId,
                Qty: PkgObject.pkgReviewedQty ? PkgObject.pkgReviewedQty : 0
              });
          });
        });

        // 2nd Object: All Products unique lot id and sum of product item qty

        // const result = _.groupBy(completePkgDetailsForApi.OilPkgCodeProductList , c => {
        //   return [c.LotId];
        // });

        _.mapValues(_.groupBy(oilPkgCodeProductListArr, c => {
            return [c.OilPkgId];
          }),
          (clist, OilPkgId) => {
            let oilPkgsWt = 0;
            let pkgReturnedWt = 0;
            let assignedOilWt = 0;
            let pkgFormIndex = 0;
            const toleranceValue = 0;
            const tolerance = Number(this.TaskModel.Threshold);
            clist.map(PkgDetails => {
              oilPkgsWt += ( PkgDetails.Qty * Number(PkgDetails.UnitValue) * Number(PkgDetails.ItemQty));
            });

            formModel.pkgReturnWtArr.forEach((object, index) => {
              if (Number(object.OilPkgId) === Number(OilPkgId)) {
                pkgReturnedWt = Number(object.pkgReturnedWt);
                assignedOilWt = Number(object.AssignedOilWt);
                pkgFormIndex = index;
              }
            });

            if (this.EnabledReturnwtbox)  {
              pkgReturnedWt = pkgReturnedWt;
            } else {
              // PkgReturnedWt =  Total Pkg Assigned Wt - Total Pkg Processed Wt
              const autoProcessweight = Number(this.pkgMap.get(Number(OilPkgId)));
              if (Number(assignedOilWt < Number(autoProcessweight))) {
                pkgReturnedWt = 0;
              } else {
              pkgReturnedWt = Number(parseFloat(String(Number(assignedOilWt) - Number(this.pkgMap.get(Number(OilPkgId))))).toFixed(2));
              }
            }

            let processedwt = 0;
            let assignWt = 0;
            let thresholdReturnwt = 0;
            const isReturnWTEnabled = 0;
            assignWt = Number(assignedOilWt);
            thresholdReturnwt = pkgReturnedWt;
            processedwt = Number(this.pkgMap.get(Number(OilPkgId)));
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
                  Isthresholdexceeded = true;
              }
             } else if (Number(thresholdPlus) === 0 )  {
              this.msgs = [];
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.assignTaskResources.MismatchTotalandassignedwt  });
              Isthresholdexceeded = true;
             }
           }

           if (Number(assignWt) >  Number(processedwt) + Number(thresholdReturnwt)) {
            if (Number(thresholdMinus) > 0 ) {
              if ( Math.abs(Number(assignWt) - Number(processedwt) + Number(thresholdReturnwt) ) > minustoleranceValue ) {
                   this.msgs = [];
                    this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                   detail: this.assignTaskResources.MismatchTotalandassignedwt });
                Isthresholdexceeded = true;
                }
             } else if (Number(thresholdMinus) === 0 )  {
                      this.msgs = [];
                      this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                      detail: this.assignTaskResources.MismatchTotalandassignedwt  });
                    Isthresholdexceeded = true;
             }
          }

          // if (Number(assignWt) >  Number(processedwt)) {
          //   if (Number(IsReturnWTEnabled) === 0  ) {
          //     thresholdReturnwt = Number(assignWt) - Number(processedwt);
          //   } else {
          //     thresholdReturnwt = PkgReturnedWt ? PkgReturnedWt : 0 ;
          //   }
          // } else {
          //   thresholdReturnwt = 0;
          // }
            // toleranceValue =  (Number(AssignedOilWt) * Number(tolerance)) / 100;
            // // To check total completion plus return wt is match with tolerance value tolerance is configured in enviroment
            // if (Number(tolerance) === 0) {
            //   PkgReturnedWt = Number(AssignedOilWt) -  Number(OilPkgsWt);
            // } else {
            //   if (
            //       (toleranceValue
            //         -
            //         Math.abs((AssignedOilWt - (Number(PkgReturnedWt) + Number(OilPkgsWt)) ))) < 0
            //     ) {
            //     this.msgs = [];
            //     this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            //       detail: this.assignTaskResources.returnwtnotmatchedwithtolerance });

            //       const returnbox = this.reviewForm.get('pkgReturnWtArr.' + PkgFormIndex).get('pkgReturnedWt');
            //       // returnbox.setErrors({ thresholdExceed: true });
            //       // returnbox.updateValueAndValidity();
            //       thresholdExceed = true;
            //     return;
            //   }
            // }
            // if (LotTotalWt) {

              reviewPkgDetailsForApi.OilPkgDetails.push({
                OilPkgId: Number(OilPkgId),
                // UnitValue: Number(String(PkgObject).split(',')[1]),
                OilWt: Number(this.pkgMap.get(Number(OilPkgId))) ? Number(this.pkgMap.get(Number(OilPkgId))) : 0,
                ReturnWt: thresholdReturnwt
              });
          });

          this.TaskModel.AssignQtyPkgDetails.forEach((object, index) => {
            if ( reviewPkgDetailsForApi.OilPkgDetails.filter(r => r.OilPkgId === object.OilPkgId).length <= 0) {
              reviewPkgDetailsForApi.OilPkgDetails.push({
                OilPkgId: object.OilPkgId,
                OilWt: 0,
                ReturnWt: object.ReturnWt
                });
              }
            });

          if (duplicateEntry) { return; }

      // thresholdExceed;
      if ( Isthresholdexceeded) {
        Isthresholdexceeded = false;
        return; }

      this.confirmationService.confirm({
      message: this.assignTaskResources.taskcompleteconfirm,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
          // http call starts
          this.loaderService.display(true);

          this.taskCommonService.submitTaskReview(reviewPkgDetailsForApi)
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
              } else {
                if (String(data[0].ResultKey  ).toLocaleUpperCase() === 'DUPLICATE') {
                  data.forEach(dataItem => {
                    if (dataItem.PackageCode && String(dataItem.PackageCode) !== '') {
                      const arrIndexCode = String(dataItem.IndexCode).split('##');
                      const uniquecodeBox = (<FormGroup>this.completionForm.get('reviewParamArr.' + arrIndexCode[0]))
                      .get('PkgDetails.' + arrIndexCode[1])
                      .get('packageCode');
                      this.msgs = [];
                      this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.assignTaskResources.duplicatePackageCode });

                      (uniquecodeBox as FormControl).setErrors({ 'duplicate': true });
                        return;
                    }
                  });
                }
              }
        });
        this.PageFlag.showmodal = false;
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
    this.TaskModel.OILPACKAGING = {
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
      usercomment: this.TaskModel.OilPckgTaskDetails.Comment,
      orderno: this.TaskModel.TaskDetails.OrderId
    };
  }

  // Added by Devdan :: 15-Oct-2018 :: Setting existing lot list
  setSelectedLotDetails(objOrder) {
    this.orderDetailsBS_filteredData.forEach((element, index) => {
      const pkgDetails = [];
      this.TaskModel.OilPckgDetails
      .forEach((OilPkg, index1) => {
        const availablePkg = this.globalData.orderDetails['Table1'].
          filter(result => result.OilPkgId === OilPkg.OilPkgId);
        if (OilPkg.StrainId === element.StrainId) {
            pkgDetails.push(
              {
                OilPkgId: OilPkg.OilPkgId,
                OilPkgCode: OilPkg.OilPkgCode,
                TPPkgTypeName: OilPkg.TPPkgTypeName,
                // AvailWt: OilPkg.AssignedOilWt,
                AvailWt: (availablePkg ? availablePkg[0].AvailableWt : 0),
                SelectedWt: OilPkg.AssignedOilWt,
                Selected: true,
                Index: '',
                StrainId: OilPkg.StrainId,
                // BrandId: this.TaskModel.OilPckgOrderDetails[index].BrandId,
                BrandId: '',
                // added by Devdan :: 23-Nov-2018 :: to check genetic wise assigned weight in edit mode
                GeneticsId:  OilPkg.GeneticsId,
              }
            );
          }
      });
      this.selectedPkgsArray[index] = pkgDetails;
   });
   this.appCommonService.setLocalStorage('selectedPkgsArray', JSON.stringify(this.selectedPkgsArray));
  }
}
