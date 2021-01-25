import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';
import { GlobalResources } from '../../../global resource/global.resource';
import { MastersResource } from '../../master.resource';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { NewProductTypeDetailsActionService } from '../../../task/services/new-product-type.service';
import { AppCommonService } from './../../../shared/services/app-common.service';
import { Input, EventEmitter } from '@angular/core';
import { NewProductTypeService } from '../../services/new-product-type.service';
import { AppComponent } from '../../../app.component';
import { ScrollTopService } from '../../../shared/services/ScrollTop.service';
import { AppConstants } from '../../../shared/models/app.constants';
import * as _ from 'lodash';
import { routing } from '../../../app.routing';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  moduleId: module.id,
  selector: 'app-new-product-type',
  templateUrl: 'new-product-type.component.html'
})
export class NewProductTypeComponent implements OnInit {

  @Input() NewProductTypeSave: EventEmitter<any> = new EventEmitter<any>();
  clear: any;
  paginationValues: any;
  chkSelectAll: any;
  public newProductTypeEntryForm: FormGroup;
  brands: any[];
  chkIsActive: boolean;
  subbrands: any[];
  strains: any[];
  skewtypes: any[];
  packagetypes: any[];
  packageunit: any[];
  public allProductTypeList: any;
  public oilReturnProcessingResource: any;
  showBrandModal = false;
  showPackageTypeModal = false;
  public saveButtonText: any;
  public newProductTypeResources: any;
  public globalResource: any;
  public _cookieService: any;
  public newProductTypeForm_copy: any;
  public msgs: any[];
  submitted: boolean;
  public productTypeIdForUpdate: any = 0;
  public employeeOnEdit: any;
  public skewTypeID: any = 0;
  public skewKeyName: any = '';
  public skewTypesDetails: any;
  public skewTypesDetail: any;
  collapsed: any;

  public BrandInfo: any = {
    BrandName: null,
    showBrandModal: false
  };

  public SubBrandInfo: any = {
    SubBrandName: null,

    showSubBrandModal: false,
    allBrands: []
  };

  public PackageTypeInfo: any = {
    PackageTypeName: null,
    Description: null,
    showPackageTypeModal: false
  };

  public StrainInfo: any = {
    StrainName: null,
    thc: null,
    cbd: null,
    total: null,
    showStrainModal: false
  };

  public newProductTypeInfo: any = {
    newProductTypeInfo: null
  };

    // all form fiels model object
    newProductTypeDetails = {
      brand: null,
      subBrand: null,
      starin: null,
      skewType: null,
      packageType: null,
      packageUnit: null,
      packageItemQty: null,
      packageLbl: null,
      unitPrice:null,
      
    };

    private globalData = {
      brands: [],
      strains: [],
      skewtypes: [],
      packagetypes: []
    };
  // NewSubBrandEntryForm: any; // Commented by Devdan :: 31-Oct-2018 :: Unused
  public newEmployeeResources: any;

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private cookieService: CookieService,
    private newProductTypeDetailsActionService: NewProductTypeDetailsActionService, // for saving form details service
    private dropdownDataService: DropdownValuesService, // For common used dropdown service
    private dropdwonTransformService: DropdwonTransformService,
    private appCommonService: AppCommonService,
    private newProductTypeService: NewProductTypeService,
    private appComponentData: AppComponent,
    private scrolltopservice: ScrollTopService,
    private router: Router
  ) {
    this.getAllBrands();
    this.getAllStrains();
    this.getAllSkew();
    this.getAllPackageType();
  // this.skewType_InChange();
  }
  items = new FormArray([], this.customGroupValidation );
  arrayItems: FormArray;
  removeDuplicatesById(dataObject) {
    // To get unique record according brand and strain
    const newArr = [];
    dataObject.forEach((value, key) => {
      let exists = false;
      newArr.forEach((val2, key1) => {
        if (value.Brand === val2.BrandId) { exists = true; }
      });

      if (exists === false && value.BrandId !== '') { newArr.push(value); }
    });
    return newArr;
    // End of getting unique record accroding brand and strain
  }
  getAllBrands() {
    this.dropdownDataService.getBrands().subscribe(
      data => {
        this.globalData.brands = data;
        this.brands = this.dropdwonTransformService.transform(data.filter(x => x.ParentId === 0), 'BrandName', 'BrandId', '-- Select --');
        this.SubBrandInfo.allBrands = this.brands;
        this.getSubBrands();
      } ,
      error => { console.log(error); },
      () => console.log('Get all brands complete'));
  }

  getSubBrands() {
    // console.log('Get all sub brands complete');
    this.subbrands = this.dropdwonTransformService.transform(this.globalData.brands.filter(
      data => data.ParentId === this.newProductTypeEntryForm.value.brand), 'SubBrandName', 'SubBrandId', '-- Select --');
  }

  brandChange() {
     this.newProductTypeDetails.subBrand = null;
     this.getSubBrands();
  }

  getAllStrains() {
    this.dropdownDataService.getStrains().subscribe(
      data => {
        // alert('');
        this.globalData.strains = data;
        this.strains = this.dropdwonTransformService.transform(data, 'StrainName', 'StrainId', '-- Select --');
      } ,
      error => { console.log(error); },
      () => console.log('Get all strains complete'));
  }

  getAllSkew() {
    //     this.skewtypes = [
    //   { label: '-- Select --', value: null },
    //   { label: 'Bud', value: 1 },
    //   { label: 'Joints', value: 2 },
    //   { label: 'Oil', value: 3 }
    // ];
    this.dropdownDataService.getSkewListByClient().subscribe(
      data => {
        if (String(data).toLocaleUpperCase() !== 'NO DATA FOUND!') {
        this.globalData.skewtypes = data;
        this.skewTypesDetails = data;
        this.skewtypes = this.dropdwonTransformService.transform(data, 'SkwTypeName', 'SkwTypeId', '-- Select --');
        if (this.skewTypesDetails) {
          this.skewType_InChange();
          }
      } else {
        this.globalData.skewtypes = [];
        this.skewtypes = [];
      }
     // this.loaderService.display(false);
    },
      error => { console.log(error); },
      () => console.log('Get all skew types complete'));
  }


  getAllPackageType() {
    this.dropdownDataService.getPackageTypeList().subscribe(
      data => {
        this.globalData.packagetypes = data;
        this.packagetypes = this.dropdwonTransformService.transform(data, 'PkgTypeName', 'PkgTypeId', '-- Select --');
      } ,
      error => { console.log(error); },
      () => console.log('Get all package types complete'));
  }

  showBrandPopup() {
    this.BrandInfo.brand = null;
    this.BrandInfo.showBrandModal = true;
    this.loaderService.display(false);
  }


  showSubBrandPopup() {
    this.SubBrandInfo.subbrand = null;
    this.SubBrandInfo.showSubBrandModal = true;
    this.getAllBrands();
    this.loaderService.display(false);
  }


  showPackageTypePopup() {
    this.PackageTypeInfo.PackageTypeName = null;
    this.PackageTypeInfo.Description = null;
    this.PackageTypeInfo.showPackageTypeModal = true;
    this.loaderService.display(false);
  }

  showStrainPopup() {
    this.StrainInfo.strain = null;
    this.StrainInfo.thc = null;
    this.StrainInfo.cbd = null;
    this.StrainInfo.total = null;
    this.StrainInfo.showStrainModal = true;
    this.loaderService.display(false);
  }

  newProductTypeInfoCall() {
    this.newProductTypeInfo.newProductTypeInfo = 'Success';
  }
  onBrandSave(BrandId) {
    this.getAllBrands();
    const brand = this.newProductTypeEntryForm.controls['brand'];
    brand.patchValue(BrandId);
  }

  onSubBrandSave(OnBrandSave) {
    this.getAllBrands();
    const brand = this.newProductTypeEntryForm.controls['brand'];
    brand.patchValue(OnBrandSave.brand);
    // console.log(OnBrandSave);
    const subBrand = this.newProductTypeEntryForm.controls['subBrand'];
    subBrand.patchValue(OnBrandSave.SubBrand);
  }

  onStrainSave(StrainId) {
    this.getAllStrains();
    const strain = this.newProductTypeEntryForm.controls['strain'];
    strain.patchValue(StrainId);
  }

  onPackageTypeSave(PkgTypeId) {
    this.getAllPackageType();
    const packageType = this.newProductTypeEntryForm.controls['packageType'];
    packageType.patchValue(PkgTypeId);
  }

  getAllProductTypeListByClient() {
    this.loaderService.display(true);
    this.newProductTypeService.getAllProductTypeListByClient().subscribe(
      data => {
       if (data !== 'No data found!') {
          this.allProductTypeList = data;
          this.paginationValues = AppConstants.getPaginationOptions;
          if (this.allProductTypeList.length > 20) {
            this.paginationValues[AppConstants.getPaginationOptions.length] = this.allProductTypeList.length;
          }
       } else {
        this.allProductTypeList = [];
       }
      //  this.loaderService.display(false);
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('Get All  New Product Type List By Client complete'));
  }

  resetForm() {
    this.newProductTypeEntryForm.reset({ chkSelectAll: true });
    // this.saveButtonText = 'Save';
    // this.clear = 'Clear';
    // this.newProductTypeResources.pageheading = 'Add New Product Type';
    // this.productTypeIdForUpdate = 0;
    // this.newProductTypeDetails = {
    //   brand: null,
    //   subBrand: null,
    //   starin: null,
    //   skewType: null,
    //   packageType: null,
    //   packageUnit: null,
    //   packageItemQty: null,
    //   packageLbl: null
    // };

    // this.newProductTypeEntryForm = this.fb.group({
    //   'brand': new FormControl(null, Validators.required),
    //   'subBrand': new FormControl(null),
    //   'strain': new FormControl(null, Validators.required),
    //   'skewType': new FormControl(null, Validators.required),
    //   'packageType': new FormControl(null, Validators.required),
    //   // 'packageUnit': new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(8), Validators.min(0.1)])),
    //   // 'packageItemQty': new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(8), Validators.min(1)])),
    //   // 'packageLable': new FormControl(null, Validators.maxLength(50)),
    //   // 'chkSelectAll': new FormControl(null),
    //     items: new FormArray([], this.customGroupValidation),
    // });
    // this.addItem();

    const control = <FormArray>this.newProductTypeEntryForm.controls['items'];
    // console.log(control);
    let length = control.length;
    while (length > 0) {
      length = Number(length) - 1;
      this.deleteItemAll(length);
    }
    this.getAllSkew();
    this.addItem();
  }
  doOPenPanel() {
    this.collapsed = false;
    this.resetForm();
  }
  // setScrollTop() {
  //   window.scrollTo(0, 0);
  //   // this.scrolltopservice.setScrollTop();
  // }
  getAllProductType() {
    this.loaderService.display(true);
    this.newProductTypeService.getAllProductTypeListByClient().subscribe(
      data => {
       if (data !== 'No data found!') {
          this.allProductTypeList = data;
       } else {
        this.allProductTypeList = [];
       }
     //  this.loaderService.display(false);
      } ,
      error => { console.log(error);  this.loaderService.display(false); },
      () => console.log('Get All  Employee List complete'));
  }

    // Save the form details
    onSubmit(value: string) {
      this.submitted = true;
      let newProductDetailsForApi;
      newProductDetailsForApi = {
        ClientProductType: {
            ProductTypeId: this.productTypeIdForUpdate,
            ClientId: Number(this._cookieService.ClientId),
            BrandId: Number(this.newProductTypeEntryForm.value.brand),
            subBrandId: Number(this.newProductTypeEntryForm.value.subBrand),
            StrainId: Number(this.newProductTypeEntryForm.value.strain),
            SkwTypeId: Number(this.newProductTypeEntryForm.value.skewType),
            SkewKeyName: (this.skewtypes.filter(x => x.value === this.newProductTypeEntryForm.value.skewType))[0].label,
            PkgTypeId: Number(this.newProductTypeEntryForm.value.packageType),
            // UnitValue: Number(this.newProductTypeEntryForm.value.packageUnit),
            // ItemQty: Number(this.newProductTypeEntryForm.value.packageItemQty),
            // PackageLabel: this.appCommonService.trimString(this.newProductTypeEntryForm.value.packageLable),
            VirtualRoleId: Number(this._cookieService.VirtualRoleId)
            // IsActive: this.newProductTypeEntryForm.value.chkSelectAll ? 1 : 0,
        },
        productTyepeNewDetails: []
      };


    this.productTypeDetailsArr.controls.forEach((element, index) => {
      // this.lotInnerFormArray(element).controls.forEach((item, subIndex) => {

        //  let oilProcessedWt = 0;
        //  if (String(element.value.packageCode) !== '' && Number(oilProcessedDetailsForApi.OilPackageDetails.filter(data =>
        //    String(data.OilPkgCode) !== ''
        //    && String(data.OilPkgCode).toLocaleUpperCase() === String(element.value.packageCode).toLocaleUpperCase()).length) > 0) {
        //    this.msgs = [];
        //    this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.oilReturnProcessingResource.duplicatePackageCode });
        //    duplicateEntry = true;
        //    (<FormGroup>element).controls['packageCode'].setErrors({ 'duplicatepkgcode': true });
        //    (<FormGroup>element).controls['packageCode'].updateValueAndValidity();
        //  }

        //  if (this.selectedLotsArray.length) {
        //    this.selectedLotsArray[index].forEach((DataObject) => {
        //      if (DataObject) {
        //        oilProcessedWt += Number(DataObject.ProcessedWt);
        //      }
        //    });
        //  }

        newProductDetailsForApi.productTyepeNewDetails.push({
            UnitValue: element.value.packageUnit,
            ItemQty:  this.newProductTypeEntryForm.getRawValue().items[index].packageItemQty,
            IsActive: element.value.chkSelectAll ? 1 : 0,
            IndexCode: index,
            UnitPrice:element.value.packageUnitPrice
            
         });
      // });
     });
      this.newProductTypeForm_copy = JSON.parse(JSON.stringify(Object.assign({}, this.newProductTypeEntryForm.value)));

      // console.log(newProductDetailsForApi);
      if (this.newProductTypeEntryForm.valid) {
        // alert('');
         // http call starts
         this.loaderService.display(true);
        this.newProductTypeDetailsActionService.addNewProductTypeEntry(newProductDetailsForApi)
        .subscribe(
            data => {
              // console.log(data);
              this.msgs = [];
              if (String(data[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.newProductTypeResources.newproductsavedsuccess });
                this.NewProductTypeSave = data;
                this.resetForm();
              } else if (String(data).toLocaleUpperCase() === 'FAILURE') {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
              } else if (String(data[0].ResultKey).toUpperCase() === 'INUSE') {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                    detail: this.newProductTypeResources.producttypeisassigned });
              } else if (String(data[0].ResultKey).toUpperCase() === 'NOTPRESENT') {
                if (data[0].NoBrand === 1) {
                  this.newProductTypeEntryForm.controls['brand'].setErrors({ 'brandnotpresent': true });
                  this.loaderService.display(false);
                }
                if (data[0].NoSubBrand === 1) {
                  this.newProductTypeEntryForm.controls['subBrand'].setErrors({ 'subbrandnotpresent': true });
                  this.loaderService.display(false);
                }
                if (data[0].NoStrain === 1) {
                  this.newProductTypeEntryForm.controls['strain'].setErrors({ 'strainnotpresent': true });
                  this.loaderService.display(false);
                } if (data[0].NoPkgType === 1) {
                  this.newProductTypeEntryForm.controls['packageType'].setErrors({ 'pkgtypenotpresent': true });
                  this.loaderService.display(false);
                } if (data[0].NoSkew === 1) {
                  this.newProductTypeEntryForm.controls['skewType'].setErrors({ 'skewnotpresent': true });
                  this.loaderService.display(false);
                }
              } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'DUPLICATE') {
                data.forEach(dataItem => {
                let formGroup;
                formGroup = (<FormGroup>this.newProductTypeEntryForm.get('items.' + dataItem.IndexCode));

                (formGroup as FormGroup).setErrors({ 'prototypenotpresent': true });
                this.loaderService.display(false);
                });

                  // data.forEach(dataItem => {
                  //   console.log(dataItem);
                  //   const arrIndexCode = String(dataItem.IndexCode);
                  //   alert(arrIndexCode);
                  //   const uniquecodeBox = (this.newProductTypeEntryForm.get('items.' + arrIndexCode))
                  //   .get('packageUnit');

                  //   (uniquecodeBox as FormControl).setErrors({ 'brandnotpresent': true });
                  //   this.loaderService.display(false);
                  //     return;
                  // });
                // this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                // detail: this.newProductTypeResources.prodcttypealreadyexist });
              } else {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
              }
              this.getAllProductTypeListByClient();
                // http call end
                this.loaderService.display(false);
            },
            error => {
              this.msgs = [];
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
              // http call end
              this.loaderService.display(false);
            });
      } else {
        this.appCommonService.validateAllFields(this.newProductTypeEntryForm);
      }
    }
    productTypeDeleteEvent(value: any, IsDeleted: number, ActiveAction: number) {
      let newRoleDetailsForApi;
      newRoleDetailsForApi = {
        ClientProductType: {
            ProductTypeId: value.ProductTypeId,
            VirtualRoleId: Number(this._cookieService.VirtualRoleId),
            IsDeleted: IsDeleted,
            IsActiveGrid: value.IsActiveFlag,
            ActiveInactive: ActiveAction
        },
        productTyepeNewDetails: []
      };
      // this.newProductTypeForm_copy = JSON.parse(JSON.stringify(Object.assign({}, this.NewEmployeeForm.value)));

      // console.log(newRoleDetailsForApi);
      // if (this.NewEmployeeForm.valid) {
         // http call starts
         this.loaderService.display(true);
        this.newProductTypeDetailsActionService.addNewProductTypeEntry(newRoleDetailsForApi)
        .subscribe(
            data => {
              // console.log(data);
              this.msgs = [];
              if (String(data[0].ResultKey).toLocaleUpperCase() === 'SUCCESS' && IsDeleted === 1) {
                // alert('IsDeleted');
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.newProductTypeResources.prodcttypedeletesuccess });
                this.NewProductTypeSave = data;
                this.resetForm();
                this.getAllProductType();
              } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'INUSE') {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newProductTypeResources.producttypeisassigned });
                this.loaderService.display(false);
              } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'SUCCESS' && ActiveAction === 1) {
                if (value.IsActiveFlag !== true) {
                  this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                  detail: this.newProductTypeResources.producttypedeactivatesuccess });
                  this.resetForm();
                  this.getAllProductType();
                  this.loaderService.display(false);
                } else {
                  this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                  detail: this.newProductTypeResources.producttypeactivatesuccess });
                  this.resetForm();
                  this.getAllProductType();
                  this.loaderService.display(false);
                }
              } else {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
              }
                // http call end
                this.loaderService.display(false);
            },
            error => {
              this.msgs = [];
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
              // http call end
              this.loaderService.display(false);
            });
      // } else {
      //   this.appCommonService.validateAllFields(this.NewEmployeeForm);
      // }
    }

    customGroupValidation (formArray) {
      let isError = false;
      const result = _.groupBy( formArray.controls , c => {
        return [c.value.packageUnit, c.value.packageItemQty];
      });

      for (const prop in result) {
          if (result[prop].length > 1 && result[prop][0].controls['packageUnit'].value !== null && result[prop][0].controls['packageItemQty'].value !== null) {
            isError = true;
              _.forEach(result[prop], function (item: any, index) {
                // alert(index);
                item._status = 'INVALID';
              });
          } else {
              result[prop][0]._status = 'VALID';
              // console.log(result[prop].length);
          }
      }
      if (isError) { return {'duplicate': 'duplicate entries'}; }
  }

    getEmployeeOnEdit(ProductTypeId) {
      // alert(ProductTypeId);
      // this.newEmployeeService.GetAllEmployeeList().subscribe(
        // this.newProductTypeService.getAllProductTypeListByClient().subscribe(
        const data = this.allProductTypeList;
         if (data !== 'No data found!') {
            // this.getAllBrands();
            // this.getAllStrains();
            // this.getAllSkew();
            // this.getAllPackageType();
            this.productTypeIdForUpdate = ProductTypeId;
            this.employeeOnEdit = data.filter(x => x.ProductTypeId === ProductTypeId);
            const brand = this.newProductTypeEntryForm.controls['brand'];
            const subBrand = this.newProductTypeEntryForm.controls['subBrand'];
            const strain = this.newProductTypeEntryForm.controls['strain'];
            const skewType = this.newProductTypeEntryForm.controls['skewType'];
            const packageType = this.newProductTypeEntryForm.controls['packageType'];
            const packageUnit = this.newProductTypeEntryForm.controls['packageUnit'];
            const packageItemQty = this.newProductTypeEntryForm.controls['packageItemQty'];
            const packagelable = this.newProductTypeEntryForm.controls['packageLable'];
            const chkSelectAll = this.newProductTypeEntryForm.controls['chkSelectAll'];

            brand.patchValue(this.employeeOnEdit[0].BrandId);
            subBrand.patchValue(this.employeeOnEdit[0].SubBrandId);
            strain.patchValue(this.employeeOnEdit[0].StrainId);
            skewType.patchValue(this.employeeOnEdit[0].SkwTypeId);
            packageType.patchValue(this.employeeOnEdit[0].PkgTypeId);
            packageUnit.patchValue(this.employeeOnEdit[0].UnitValue);
            packageItemQty.patchValue(this.employeeOnEdit[0].ItemQty);
            packagelable.patchValue(this.employeeOnEdit[0].PackageLabel);
            chkSelectAll.patchValue(this.employeeOnEdit[0].IsActive);

            this.saveButtonText = 'Update';
            this.clear = 'Cancel';
            this.newProductTypeResources.pageheading = 'Edit Product Type';
            this.scrolltopservice.setScrollTop();
         } else {
          this.allProductTypeList = [];
         }
       //  this.loaderService.display(false);
    }

  ngOnInit() {
    this.saveButtonText = 'Save';
    this.clear = 'Clear';
    this.newEmployeeResources = MastersResource.getResources().en.addnewemployee;
    this.newProductTypeResources = MastersResource.getResources().en.newproductype;
    this.globalResource = GlobalResources.getResources().en;
    this.appComponentData.setTitle('Product Type');
    this._cookieService = this.appCommonService.getUserProfile();
    setTimeout(() => {this.loaderService.display(true);
    }, 0);
    this.getAllProductTypeListByClient();
  // new product type form defination(reactive form)
  this.newProductTypeEntryForm = this.fb.group({
    'brand': new FormControl(null, Validators.required),
    'subBrand': new FormControl(null),
    'strain': new FormControl(null, Validators.required),
    'skewType': new FormControl(null, Validators.required),
    'packageType': new FormControl(null, Validators.required),
    // 'packageUnit': new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(8), Validators.min(0.1)])),
    // 'packageItemQty': new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(8), Validators.min(1)])),
    // 'packageLable': new FormControl(null, Validators.maxLength(50)),
    // 'chkSelectAll': new FormControl(null),
     // items: this.items
      items: new FormArray([], this.customGroupValidation),
  });
  // this.items.controls['chkSelectAll'] = 1;
  this.addItem();
  // redirection code :: swapnil :: 02-april-2019
  if (this.appCommonService.ProductTypeBackLink && this.appCommonService.ProductTypeFormDetail) {
        this.newProductTypeEntryForm = this.appCommonService.ProductTypeFormDetail;
        this.appCommonService.ProductTypeFormDetail = null;
  } else if (this.appCommonService.TPProcessorBackLink && this.appCommonService.ProductTypeFormDetail) {
        this.newProductTypeEntryForm = this.appCommonService.ProductTypeFormDetail;
        this.appCommonService.ProductTypeFormDetail = null;
  } else if (this.appCommonService.lotPageBackLink && this.appCommonService.ProductTypeFormDetail) {
        this.newProductTypeEntryForm = this.appCommonService.ProductTypeFormDetail;
        this.appCommonService.ProductTypeFormDetail = null;
  }

  setTimeout(() => {
    this.loaderService.display(false);
  }, 500);

  }

  get productTypeDetailsArr(): FormArray {
    return this.newProductTypeEntryForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    if (this.skewTypeID === null) {
      this.skewTypeID = 0;
    }
    return this.fb.group({
      packageUnit: new FormControl(null, Validators.compose([Validators.required, Validators.max(99999), Validators.min(0.1)])),
      // packageItemQty: new FormControl(null, Validators.compose([Validators.required, Validators.max(99999), Validators.min(1)])),
      // tslint:disable-next-line:max-line-length
      packageItemQty: new FormControl({value: this.skewKeyName !== 'JointMaterialWt' ? 1 : 0 , disabled : this.skewKeyName !== 'JointMaterialWt' ? true : false },
        this.skewKeyName === 'JointMaterialWt' ? Validators.compose([Validators.required, Validators.max(99999), Validators.min(0.1)]) : null),
        packageUnitPrice: new FormControl(null,Validators.compose([Validators.required])),
      chkSelectAll: new FormControl(true)
    });
  }
  addItem(): void {
    // this.productTypeDetailsArr.push(this.createItem());
    this.arrayItems = this.newProductTypeEntryForm.get('items') as FormArray;
    this.arrayItems.push(this.createItem());
    console.log(this.arrayItems)
  }
  deleteItem(index: number) {
    // control refers to your formarray
    const control = <FormArray>this.newProductTypeEntryForm.controls['items'];
    // alert(control.length);
    // IF 1 row exists then do not remove row
    if (control.length !== 1) {
      control.removeAt(index);
    }
    // remove the chosen row
    // control.removeAt(index);
  }
  deleteItemAll(index: number) {
    // control refers to your formarray
    const control = <FormArray>this.newProductTypeEntryForm.controls['items'];
    control.removeAt(index);
  }

  changeValidator(flag, index) {
    const returnedbox = this.newProductTypeEntryForm.get('items.' + index).get('packageItemQty');
    let validators;
    validators = flag ? Validators.compose([Validators.required, Validators.max(99999), Validators.min(1)]) : null;

    returnedbox.setValidators(validators);
    returnedbox.updateValueAndValidity();
  }

  skewType_InChange() {
    if (this.appCommonService.ProductTypeBackLink || this.appCommonService.TPProcessorBackLink || this.appCommonService.lotPageBackLink) {
      this.appCommonService.ProductTypeBackLink = false;
      this.appCommonService.lotPageBackLink = false;
      this.appCommonService.TPProcessorBackLink = false;
      if (this.newProductTypeEntryForm.value.skewType) {
        this.skewTypeID = this.newProductTypeEntryForm.value.skewType;
      } else {
        this.skewTypeID = 0;
      }
      this.skewTypesDetail =  this.skewTypesDetails.filter(r => r.SkwTypeId === this.skewTypeID);
        if ( this.skewTypesDetail.length > 0) {
            this.skewKeyName = this.skewTypesDetail[0].SkewKeyName;
            } else {
            this.skewKeyName = '';
        }
      if (this.skewKeyName !== 'JointMaterialWt') {
        this.productTypeDetailsArr.controls.forEach((element, index) => {
          // this.changeValidator(false, index);
          (element as FormGroup).controls['packageItemQty'].clearValidators();
          (element as FormGroup).controls['packageItemQty'].updateValueAndValidity();
          (element as FormControl).markAsPristine();
          (element as FormGroup).controls['packageItemQty'].patchValue(1);
          (element as FormGroup).controls['packageItemQty'].disable();
        });
      } else {
        this.productTypeDetailsArr.controls.forEach((element, index) => {
          (element as FormGroup).controls['packageItemQty'].enable();
          this.changeValidator(true, index);
         // (element as FormGroup).controls['packageItemQty'].patchValue(0);
        });
    }
    } else {
    if (this.newProductTypeEntryForm.value.skewType) {
      this.skewTypeID = this.newProductTypeEntryForm.value.skewType;
    } else {
      this.skewTypeID = 0;
    }
    this.skewTypesDetail =  this.skewTypesDetails.filter(r => r.SkwTypeId === this.skewTypeID);
      if ( this.skewTypesDetail.length > 0) {
          this.skewKeyName = this.skewTypesDetail[0].SkewKeyName;
          } else {
          this.skewKeyName = '';
      }
    if (this.skewKeyName !== 'JointMaterialWt') {
      this.productTypeDetailsArr.controls.forEach((element, index) => {
        // this.changeValidator(false, index);
        (element as FormGroup).controls['packageItemQty'].clearValidators();
        (element as FormGroup).controls['packageItemQty'].updateValueAndValidity();
        (element as FormControl).markAsPristine();
        (element as FormGroup).controls['packageItemQty'].patchValue(1);
        (element as FormGroup).controls['packageItemQty'].disable();
      });
    } else {
      this.productTypeDetailsArr.controls.forEach((element, index) => {
        (element as FormGroup).controls['packageItemQty'].enable();
        this.changeValidator(true, index);
        (element as FormGroup).controls['packageItemQty'].patchValue(0);
      });
    }
  }
  }


  // add methods to view links
  viewAllBrands() {
    this.appCommonService.ProductTypeBackLink = true;
    this.appCommonService.ProductTypeFormDetail = this.newProductTypeEntryForm;
    this.router.navigate(['../home/addnewbrand']);
  }

  viewAllSubBrands() {
    this.appCommonService.ProductTypeBackLink = true;
    this.appCommonService.ProductTypeFormDetail = this.newProductTypeEntryForm;
    this.router.navigate(['../home/addnewsubbrand']);
  }

  viewAllStrains() {
  this.appCommonService.ProductTypeBackLink = true;
  this.appCommonService.ProductTypeFormDetail = this.newProductTypeEntryForm;
    this.router.navigate(['../home/strainmaster']);
  }

  viewAllPackageType() {
  this.appCommonService.ProductTypeBackLink = true;
  this.appCommonService.ProductTypeFormDetail = this.newProductTypeEntryForm;
    this.router.navigate(['../home/addnewpackagetype']);
  }
}
