import { HttpMethodsService } from './../../../shared/services/http-methods.service';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { NewSubBrandActionService } from '../../../task/services/new-sub-brand-action.service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';

@Component({
    selector: 'app-add-new-skew-popup',
    templateUrl: './add-new-skew-popup.component.html'
})
export class AddNewSkewPopupComponent implements OnInit {
    // tslint:disable-next-line:no-input-rename
    @Input('Skew') Skew: any;
    @ViewChild('SubBrandForm') SubBrandForm;
    @Output() BrandSavedSubBrand: EventEmitter<any> = new EventEmitter<any>();
    @Output() SkewSaved: EventEmitter<any> = new EventEmitter<any>();

    public newSkewForm: FormGroup;
    public newSkewForm_copy: any;

    public newSkewResources: any;
    public globalResource: any;
    public msgs: any[];
    public _cookieService: any;
    public chkIsActive: boolean;
    public submitted: boolean;

    public onSkewSave = {
        skewType: null,
        skewName: null
    };
    constructor(
        private fb: FormBuilder,
        private loaderService: LoaderService,
        private dropdownDataService: DropdownValuesService,
        private dropdwonTransformService: DropdwonTransformService,
        private newSubBrandActionService: NewSubBrandActionService,
        private appCommonService: AppCommonService,
        private httpMethodsService: HttpMethodsService
    ) { }

    ngOnInit() {
        this.chkIsActive = true;
        this.newSkewResources = MastersResource.getResources().en.addNewSkew;
        this.globalResource = GlobalResources.getResources().en;
        this.loaderService.display(false);
        this._cookieService = this.appCommonService.getUserProfile();

        this.newSkewForm = this.fb.group({
            'skewType': new FormControl(null, Validators.required),
            'skewName': new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
            'description': new FormControl(null),
            'chkIsActive': new FormControl(null)
        });
    }

    saveSkewName(formModel) {
        if (String(this.newSkewForm.value.skewName).trim().length === 0) {
            this.newSkewForm.controls['skewName'].setErrors({ 'whitespace': true });
            return;
        }
        const skewDetailsForApi = {
            SkewDetails: {
                SkewTypeId: formModel.value.skewType,
                SkewName: this.appCommonService.trimString(formModel.value.skewName),
                Description: this.appCommonService.trimString(formModel.value.description),
                IsActive: this.newSkewForm.value.chkIsActive ? 1 : 0,
                ClientId: this._cookieService.ClientId,
                VirtualRoleId: this._cookieService.VirtualRoleId
            }
        };

        if (formModel.valid) {
            this.loaderService.display(true);
            this.httpMethodsService.post('api/Skew/SkewAddUpdate', skewDetailsForApi)
           .subscribe(
                    data => {
                        this.msgs = [];
                        if (data[0]['ResultKey'] === 'SUCCESS') {
                            this.msgs.push({
                                severity: 'success', summary: this.globalResource.applicationmsg,
                                detail: 'Skew added successfully.'
                            });
                            this.getSkewOnSave(data[0]);
                            this.resetForm();
                        } else if (data[0]['ResultKey'] === 'Failure') {
                            this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
                        } else if (data[0]['ResultKey'] === 'ALREADYEXISTS') {
                            this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Skew already exists.' });
                        } else if (data[0]['ResultKey'] === 'EMPTYSKEWNAME') {
                            this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: 'Please enter skew Name.' });
                        } else {
                            this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: data[0]['ResultMessage'] });
                        }
                        this.loaderService.display(false);
                    },
                    error => {
                        this.msgs = [];
                        this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
                        this.resetForm();
                        this.loaderService.display(false);
                    });
        } else {
            this.appCommonService.validateAllFields(this.newSkewForm);
        }
        this.Skew.showSkewModal = false;
    }

    hideSkewPopup() {
        this.resetForm();
        this.Skew.showSkewModal = false;
    }

    resetForm() {
        this.newSkewForm.reset({ chkIsActive: true });
    }
    getSkewOnSave(emitdata) {
        this.SkewSaved.emit(emitdata);
        this.Skew.showBrandModal = false;
      }
}

