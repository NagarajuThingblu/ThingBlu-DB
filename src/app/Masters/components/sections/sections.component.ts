
import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';
import { GlobalResources } from '../../../global resource/global.resource';
import { MastersResource } from '../../master.resource';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { AppCommonService } from './../../../shared/services/app-common.service';
import { Input, EventEmitter } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { ScrollTopService } from '../../../shared/services/ScrollTop.service';
import { AppConstants } from '../../../shared/models/app.constants';
import * as _ from 'lodash';
import { routing } from '../../../app.routing';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { NewSectionDetailsActionService } from '../../../task/services/add-section-details.service';

@Component({
  moduleId: module.id,
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.css']
})
export class SectionsComponent implements OnInit {


  clear: any;
  paginationValues: any;
  chkSelectAll: any;
  public newSectionEntryForm: FormGroup;
  Fields: any[];
  chkIsActive: boolean;
  strains: any[];
  section: any[];
  public saveButtonText: any;
  public newProductTypeResources: any;
  public newSectionResources: any;
  public globalResource: any;
  public _cookieService: any;
  public newSectionForm_copy: any;
  public msgs: any[];
  submitted: boolean;
  public SectionIdForUpdate: any = 0;
 
  collapsed: any;

 
 



  
    newSectionDetails = {
      Field: null,
      section: null,
      strain: null,
      plantcount: null,
      year: null,
      
    };

   
  public newEmployeeResources: any;

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private cookieService: CookieService,
    private newSectionDetailsActionService: NewSectionDetailsActionService, 
    private dropdownDataService: DropdownValuesService, 
    private dropdwonTransformService: DropdwonTransformService,
    private appCommonService: AppCommonService,
    private appComponentData: AppComponent,
    private scrolltopservice: ScrollTopService,
    private router: Router
  ) {
   
   
  }
  items = new FormArray([], this.customGroupValidation );
  arrayItems: FormArray;
  removeDuplicatesById(dataObject) {
   
    const newArr = [];
    dataObject.forEach((value, key) => {
      let exists = false;
      newArr.forEach((val2, key1) => {
        if (value.Field === val2.FieldId) { exists = true; }
      });

      if (exists === false && value.FieldId !== '') { newArr.push(value); }
    });
    return newArr;
   
  }
 

 

  
 resetForm() {
    this.newSectionEntryForm.reset({ chkSelectAll: true });
   

    const control = <FormArray>this.newSectionEntryForm.controls['items'];
    
    let length = control.length;
    while (length > 0) {
      length = Number(length) - 1;
      this.deleteItemAll(length);
    }
   
    this.addItem();
  }
  doOPenPanel() {
    this.collapsed = false;
    this.resetForm();
  }
 
    onSubmit(value: string) {
      this.submitted = true;
      let newSectionForApi;
      newSectionForApi = {
        Sections: {
          SectionId: this.SectionIdForUpdate,
            ClientId: Number(this._cookieService.ClientId),
            FieldId: Number(this.newSectionEntryForm.value.Field),
            VirtualRoleId: Number(this._cookieService.VirtualRoleId),
            IsActive: this.newSectionEntryForm.value.chkSelectAll ? 1 : 0,
        },
        SectionDetails: []
      };


    this.SectionDetailsArr.controls.forEach((element, index) => {

        newSectionForApi.SectionDetails.push({
            SectionName: element.value.section,
            StrainId:  this.newSectionEntryForm.value.strain,
            IsActive: element.value.chkSelectAll ? 1 : 0,
            PlantCount:element.value.PlantCount,
            Year:element.value.year
            
         });
    
     });
      this.newSectionForm_copy = JSON.parse(JSON.stringify(Object.assign({}, this.newSectionEntryForm.value)));

      if (this.newSectionEntryForm.valid) {
       
         this.loaderService.display(true);
        this.newSectionDetailsActionService.addNewSectionEntry(newSectionForApi)
        .subscribe(
            data => {
            
              this.msgs = [];
              if (String(data[0].ResultKey).toLocaleUpperCase() === 'SUCCESS') {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.newProductTypeResources.newproductsavedsuccess });
               
                this.resetForm();
              } else if (String(data).toLocaleUpperCase() === 'FAILURE') {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
              } else if (String(data[0].ResultKey).toUpperCase() === 'INUSE') {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                    detail: this.newProductTypeResources.producttypeisassigned });
              } else if (String(data[0].ResultKey).toUpperCase() === 'NOTPRESENT') {
                if (data[0].NoBrand === 1) {
                  this.newSectionEntryForm.controls['brand'].setErrors({ 'brandnotpresent': true });
                  this.loaderService.display(false);
                }
                if (data[0].NoSubBrand === 1) {
                  this.newSectionEntryForm.controls['subBrand'].setErrors({ 'subbrandnotpresent': true });
                  this.loaderService.display(false);
                }
                if (data[0].NoStrain === 1) {
                  this.newSectionEntryForm.controls['strain'].setErrors({ 'strainnotpresent': true });
                  this.loaderService.display(false);
                } if (data[0].NoPkgType === 1) {
                  this.newSectionEntryForm.controls['packageType'].setErrors({ 'pkgtypenotpresent': true });
                  this.loaderService.display(false);
                } if (data[0].NoSkew === 1) {
                  this.newSectionEntryForm.controls['skewType'].setErrors({ 'skewnotpresent': true });
                  this.loaderService.display(false);
                }
              } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'DUPLICATE') {
                data.forEach(dataItem => {
                let formGroup;
                formGroup = (<FormGroup>this.newSectionEntryForm.get('items.' + dataItem.IndexCode));

                (formGroup as FormGroup).setErrors({ 'prototypenotpresent': true });
                this.loaderService.display(false);
                });

                
              } else {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
              }
             
                this.loaderService.display(false);
            },
            error => {
              this.msgs = [];
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
             
              this.loaderService.display(false);
            });
      } else {
        this.appCommonService.validateAllFields(this.newSectionEntryForm);
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
      
         this.loaderService.display(true);
        this.newSectionDetailsActionService.addNewSectionEntry(newRoleDetailsForApi)
        .subscribe(
            data => {
           
              this.msgs = [];
              if (String(data[0].ResultKey).toLocaleUpperCase() === 'SUCCESS' && IsDeleted === 1) {
              
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.newProductTypeResources.prodcttypedeletesuccess });
                
                this.resetForm();
                
              } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'INUSE') {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
                detail: this.newProductTypeResources.producttypeisassigned });
                this.loaderService.display(false);
              } else if (String(data[0].ResultKey).toLocaleUpperCase() === 'SUCCESS' && ActiveAction === 1) {
                if (value.IsActiveFlag !== true) {
                  this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                  detail: this.newProductTypeResources.producttypedeactivatesuccess });
                  this.resetForm();
                 
                  this.loaderService.display(false);
                } else {
                  this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                  detail: this.newProductTypeResources.producttypeactivatesuccess });
                  this.resetForm();
                 
                  this.loaderService.display(false);
                }
              } else {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
              }
                
                this.loaderService.display(false);
            },
            error => {
              this.msgs = [];
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
              
              this.loaderService.display(false);
            });
    
    }

    customGroupValidation (formArray) {
      let isError = false;
      const result = _.groupBy( formArray.controls , c => {
        return [c.value.section, c.value.plantcount];
      });

      for (const prop in result) {
          if (result[prop].length > 1 && result[prop][0].controls['section'].value !== null && result[prop][0].controls['plantcount'].value !== null) {
            isError = true;
              _.forEach(result[prop], function (item: any, index) {
               
                item._status = 'INVALID';
              });
          } else {
              result[prop][0]._status = 'VALID';
              
          }
      }
      if (isError) { return {'duplicate': 'duplicate entries'}; }
  }

  ngOnInit() {
    this.saveButtonText = 'Save';
    this.clear = 'Clear';
    this.newEmployeeResources = MastersResource.getResources().en.addnewemployee;
    this.newProductTypeResources = MastersResource.getResources().en.newproductype;
    this.newSectionResources = MastersResource.getResources().en.addnewsection;
    this.globalResource = GlobalResources.getResources().en;
    this.appComponentData.setTitle('Product Type');
    this._cookieService = this.appCommonService.getUserProfile();
    setTimeout(() => {this.loaderService.display(true);
    }, 0);
    
  this.newSectionEntryForm = this.fb.group({
    'Field': new FormControl(null, Validators.required),
      items: new FormArray([], this.customGroupValidation),
  });
 
  this.addItem();
  
  if (this.appCommonService.ProductTypeBackLink && this.appCommonService.ProductTypeFormDetail) {
        this.newSectionEntryForm = this.appCommonService.ProductTypeFormDetail;
        this.appCommonService.ProductTypeFormDetail = null;
  } else if (this.appCommonService.TPProcessorBackLink && this.appCommonService.ProductTypeFormDetail) {
        this.newSectionEntryForm = this.appCommonService.ProductTypeFormDetail;
        this.appCommonService.ProductTypeFormDetail = null;
  } else if (this.appCommonService.lotPageBackLink && this.appCommonService.ProductTypeFormDetail) {
        this.newSectionEntryForm = this.appCommonService.ProductTypeFormDetail;
        this.appCommonService.ProductTypeFormDetail = null;
  }

  setTimeout(() => {
    this.loaderService.display(false);
  }, 500);

  }

  get SectionDetailsArr(): FormArray {
    return this.newSectionEntryForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      section: new FormControl(null, Validators.compose([Validators.required, Validators.max(99999), Validators.min(0.1)])),
      strain: new FormControl(null, Validators.compose([Validators.required, Validators.max(99999), Validators.min(0.1)])),
      plantcount: new FormControl(null, Validators.compose([Validators.required, Validators.max(99999), Validators.min(0.1)])),
      year: new FormControl(null, Validators.compose([Validators.required, Validators.max(99999), Validators.min(0.1)])),
      chkSelectAll: new FormControl(true)
    });
  }
  addItem(): void {
    // this.SectionDetailsArr.push(this.createItem());
    this.arrayItems = this.newSectionEntryForm.get('items') as FormArray;
    this.arrayItems.push(this.createItem());
  }
  deleteItem(index: number) {
    
    const control = <FormArray>this.newSectionEntryForm.controls['items'];
   
    if (control.length !== 1) {
      control.removeAt(index);
    }
    console.log(this.newSectionEntryForm.get('items'))
   
  }
  deleteItemAll(index: number) {
   
    const control = <FormArray>this.newSectionEntryForm.controls['items'];
    control.removeAt(index);
  }

  

 

  viewAllBrands() {
    this.appCommonService.ProductTypeBackLink = true;
    this.appCommonService.ProductTypeFormDetail = this.newSectionEntryForm;
    this.router.navigate(['../home/addnewbrand']);
  }

 

  viewAllStrains() {
  this.appCommonService.ProductTypeBackLink = true;
  this.appCommonService.ProductTypeFormDetail = this.newSectionEntryForm;
    this.router.navigate(['../home/strainmaster']);
  }

 
}

 