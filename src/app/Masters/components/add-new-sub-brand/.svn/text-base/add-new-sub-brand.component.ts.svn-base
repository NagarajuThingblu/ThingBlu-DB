import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { CookieService } from 'ngx-cookie-service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { NewSubBrandActionService } from '../../../task/services/new-sub-brand-action.service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';

@Component({
  selector: 'app-add-new-sub-brand',
  templateUrl: './add-new-sub-brand.component.html',
  styleUrls: ['./add-new-sub-brand.component.css']
})
export class AddNewSubBrandComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('SubBrand') SubBrand: any;
  @ViewChild('SubBrandForm') SubBrandForm;
  @Output() BrandSavedSubBrand: EventEmitter<any> = new EventEmitter<any>();
  @Output() SubBrandSaved: EventEmitter<any> = new EventEmitter<any>();
  chkIsActive: boolean;
  newSubBrandEntryForm: FormGroup;
  public newSubBrandResources: any;
  public globalResource: any;
  submitted: boolean;
  public msgs: any[];
  brands: any[];
  public _cookieService: any;
  public NewSubBrandForm_copy: any;

    // all form fiels model object
    newSubBrandDetails = {
      brand: null,
      subbrand: null,
      chkIsActive: 1
    };

    private globalData = {
      brands: [],
    };



    public onBrandSave = {
      brand: null,
      SubBrand: null
    };
  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    // private cookieService: CookieService,
    private dropdownDataService: DropdownValuesService, // For common used dropdown service
    private dropdwonTransformService: DropdwonTransformService,
    // tslint:disable-next-line:no-shadowed-variable
    private newSubBrandActionService: NewSubBrandActionService, // for saving form details service
    private appCommonService: AppCommonService
  ) {
    this.getAllBrands();
  }

  getAllBrands() {
    this.dropdownDataService.getBrands().subscribe(
      data => {
        this.globalData.brands = data;
        this.brands = this.dropdwonTransformService.transform(data.filter(x => x.ParentId === 0), 'BrandName', 'BrandId', '-- Select --');
      } ,
      error => { console.log(error); },
      () => console.log('Get all brands complete'));
  }

  resetForm() {
    this.SubBrandForm.reset({ chkIsActive: true });

    this.newSubBrandDetails = {
      brand: null,
      subbrand: null,
      chkIsActive: 1
    };
  }

    saveSubBrandNames(formModel) {
      if (String(this.newSubBrandEntryForm.value.subbrand).trim().length === 0) {
        this.newSubBrandEntryForm.controls['subbrand'].setErrors({'whitespace': true});
        return;
      }
      const subbrandDetailsForApi = {
        Brand: {
          ParentId: formModel.value.brand,
          BrandName: this.appCommonService.trimString(formModel.value.subbrand),
          Description: this.appCommonService.trimString(formModel.value.description),
          IsActive: this.newSubBrandEntryForm.value.chkIsActive ? 1 : 0,
          ClientId: this._cookieService.ClientId,
          VirtualRoleId: this._cookieService.VirtualRoleId
        }
      };
      // console.log(subbrandDetailsForApi);
      if (formModel.valid) {
         // http call starts
         this.loaderService.display(true);
        this.newSubBrandActionService.addNewSubBrand(subbrandDetailsForApi)
        .subscribe(
            data => {
              // console.log(data);
              this.msgs = [];
              if (data[0]['Result'] === 'Success') {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg , detail: this.newSubBrandResources.newsubbrandsavedsuccess });

                this.getBrandOnSave(formModel.value.brand);

                this.onBrandSave.brand = formModel.value.brand;
                this.onBrandSave.SubBrand = data[0]['brandId'];
                // console.log(this.onBrandSave);
                this.getSubBrandOnSave(this.onBrandSave);

                this.resetForm();
              } else if (data === 'Failure') {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
              } else if (data === 'Duplicate') {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.newSubBrandResources.subbrandalreadyexist });
              } else if (data === 'NotInserted') {
                this.newSubBrandEntryForm.controls['brand'].setErrors({ 'brandnotpresent': true });
                this.loaderService.display(false);
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
              this.resetForm();
              this.loaderService.display(false);
            });
      } else {
        this.appCommonService.validateAllFields(this.newSubBrandEntryForm);
      }
     }

    hideSubBrandPopup() {
      this.resetForm();
      this.SubBrand.showSubBrandModal = false;
    }

    getBrandOnSave(BrandId) {
      this.BrandSavedSubBrand.emit(BrandId);
    }

    getSubBrandOnSave(onBrandSave) {
          this.SubBrandSaved.emit(onBrandSave);
          this.SubBrand.showSubBrandModal = false;
        }

  ngOnInit() {
    this.chkIsActive = true;
    this.newSubBrandResources = MastersResource.getResources().en.addnewsubbrand;
    this.globalResource = GlobalResources.getResources().en;
    this.loaderService.display(false);
    this._cookieService = this.appCommonService.getUserProfile();

  // New SubBrand form defination(reactive form)
  this.newSubBrandEntryForm = this.fb.group({
    'brand': new FormControl(null, Validators.required),
    'subbrand': new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
    'description': new FormControl(null),
    'chkIsActive': new FormControl(null)
  });
  }
}
