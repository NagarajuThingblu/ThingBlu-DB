import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { CookieService } from 'ngx-cookie-service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { NewStrainTypeActionService } from '../../../task/services/new-strain-type-action.service';

@Component({
  selector: 'app-add-new-straintype',
  templateUrl: './add-new-straintype.component.html',
  styleUrls: ['./add-new-straintype.component.css']
})
export class AddNewStraintypeComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('StrainType') StrainType: any;
  @ViewChild('StrainTypeForm') StrainTypeForm;
  @Output() StrainTypeSaved: EventEmitter<any> = new EventEmitter<any>();

  chkIsActive: boolean;
  newStrainTypeEntryForm: FormGroup;
  public newStrainTypeResources: any;
  public globalResource: any;
  submitted: boolean;
  public _cookieService: any;
  public msgs: any[];
    // all form fiels model object
    newStrainTypeDetails = {
      straintype: null,
      description: null,
      chkIsActive: 1
    };

    public strainTypeInfo: any = {
      strainTypeName: null,
      showStrainTypeModal: false
    };

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    // private cookieService: CookieService,
    // tslint:disable-next-line:no-shadowed-variable
    private newStrainTypeActionService: NewStrainTypeActionService, // for saving form details service
    private appCommonService: AppCommonService
  ) {
  }



    resetForm() {
      this.newStrainTypeEntryForm.reset({ chkIsActive: true });

      this.newStrainTypeDetails = {
        straintype: null,
        description: null,
        chkIsActive: 1
      };
    }

    saveStrainTypeNames(formModel) {
      if (String(this.newStrainTypeEntryForm.value.straintype).trim().length === 0) {
        this.newStrainTypeEntryForm.controls['straintype'].setErrors({'whitespace': true});
        return;
      }
      const straintypeDetailsForApi = {
        StrainType: {
          StrainTypeName: this.appCommonService.trimString(this.newStrainTypeEntryForm.value.straintype),
          Description: this.appCommonService.trimString(this.newStrainTypeEntryForm.value.description),
          IsActive: this.newStrainTypeEntryForm.value.chkIsActive ? 1 : 0,
          VirtualRoleId: this._cookieService.VirtualRoleId,
          ClientId: Number(this._cookieService.ClientId)
        }
      };
      // console.log(straintypeDetailsForApi);
      if (this.newStrainTypeEntryForm.valid) {
         // http call starts
         this.loaderService.display(true);
        this.newStrainTypeActionService.addNewStrainType(straintypeDetailsForApi)
        .subscribe(
            data => {
              // console.log(data);
              this.msgs = [];
              if (data[0]['Result'] === 'Success') {
                this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail: this.newStrainTypeResources.newstraintypesavedsuccess });
                // console.log(data[0]['StrainTypeId']);
                this.getStrainTypeOnSave(data[0]['StrainTypeId']);

                this.resetForm();
              } else if (data === 'Failure') {
                this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
              } else if (data === 'Duplicate') {
                this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.newStrainTypeResources.straintypealreadyexist });
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
        this.appCommonService.validateAllFields(this.newStrainTypeEntryForm);
      }
    }

    hideStrainTypePopup() {
      this.resetForm();
      this.StrainType.showStrainTypeModal = false;
    }


    getStrainTypeOnSave(StrainTypeId) {
      this.StrainTypeSaved.emit(StrainTypeId);
      this.StrainType.showStrainTypeModal = false;
    }

  ngOnInit() {
    this.chkIsActive = true;
    this.newStrainTypeResources = MastersResource.getResources().en.addnewstraintype;
    this.globalResource = GlobalResources.getResources().en;
    this.loaderService.display(false);
    this._cookieService = this.appCommonService.getUserProfile();


  // New StrainType form defination(reactive form)
  this.newStrainTypeEntryForm = this.fb.group({
    'straintype': new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
    'description': new FormControl(null, [Validators.maxLength(500)]),
    'chkIsActive': new FormControl(null)
  });
  }
}
