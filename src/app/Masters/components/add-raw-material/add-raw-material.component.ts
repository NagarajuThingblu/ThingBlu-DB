import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray, FormArrayName } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { CookieService } from 'ngx-cookie-service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { AppComponent } from '../../../app.component';
import { ScrollTopService } from '../../../shared/services/ScrollTop.service';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { AppConstants } from '../../../shared/models/app.constants';
import { NewARMDetailsActionService } from '../../../task/services/add-raw-material.service';
import { GrowerDetailsActionService } from '../../../task/services/grower-details-action.service';
import {NewLabelDetailsActionService} from '../../../task/services/add-label-details.service'

@Component({
  moduleId: module.id,
  selector: 'app-add-raw-material',
  templateUrl: './add-raw-material.component.html',
  styles:  [`
  .clsTableSelection tr.ui-state-highlight {
    background: transparent !important;
    color: #222222 !important;
    cursor: pointer;
  }

  .clsTableSelection tr:nth-child(even).ui-state-highlight {
    background: transparent !important;
    color: #222222 !important;
    cursor: pointer;
  }

  .clsTableSelection .ui-state-highlight a {
      color: #222222 !important;
  }
`]
})
export class AddRawMaterialComponent implements OnInit {
  ARMForm: FormGroup;
  public saveButtonText: any;
  public pageheading:any;
  paginationValues: any;
  public clear:any;
  public Growers:any[];
  public bins:any[];
  public allRawMateriallist:any;
  submitted: boolean;
  public _cookieService: any;
  enableDropDown = true;
  TrimmingMethods =['HT','MT'];
  public strainName: '';
  public TaskType: '';
  public SkewType: '';
  public TM: '';
  public LightDept: '';
  public ARMForm_copy: any;
  public msgs: any[];
  public globalResource: any;
  public addNewRawMaterial: any;
  public plusOnEdit: boolean = true;
  public event: any;
  public LabelIdForUpdate: any = 0;
  public LabelOnEdit: any;
  public GrowBinMapId = 0;
  public Editor = 0;
  public allLabelslist:any;
  private globalData = {
    binsData: [],
  };
  constructor(  private loaderService: LoaderService,
    private fb: FormBuilder,
    private growerDetailsActionService: GrowerDetailsActionService,
    private appCommonService: AppCommonService,
    private route: ActivatedRoute,
    private newARMDetailsActionService: NewARMDetailsActionService, 
    private cookieService: CookieService,
    private router: Router,
    private newLabelDetailsActionService: NewLabelDetailsActionService,
    private dropdwonTransformService: DropdwonTransformService,
    private dropdownDataService: DropdownValuesService, // For common used dropdown service
    private AppComponentData: AppComponent,
    private confirmationService: ConfirmationService,
    private scrolltopservice: ScrollTopService) {
      this.getGrowerData();
      this.getAllRawMaterialList();
      this.getBinsData();
     }
     items = new FormArray([], this.customGroupValidation );
     arrayItems: FormArray;

  ngOnInit() {
    this.saveButtonText = 'Save';
    this.pageheading="Add Raw Material";
    this.clear = 'Clear';
    this.globalResource = GlobalResources.getResources().en;
    this.AppComponentData.setTitle('Add Raw Materials');
    this._cookieService = this.appCommonService.getUserProfile();
    this.addNewRawMaterial = MastersResource.getResources().en.addNewRawMaterial;
    this.ARMForm = this.fb.group({
      'grower': new FormControl(null, Validators.required),
      'receivedwt': new FormControl(null,Validators.required),
      items: new FormArray([], this.customGroupValidation),
    })
    this.addItem();
    this.loaderService.display(false);
  }
  get RawmaterialDetailsArr(): FormArray {
    return this.ARMForm.get('items') as FormArray;
  }
  addItem(): void {
    this.arrayItems = this.ARMForm.get('items') as FormArray;
    this.arrayItems.push(this.createItem());
  }

  createItem(): FormGroup {
    return this.fb.group({
      binNo: new FormControl(null, Validators.compose([Validators.required])),
      tasktype:new FormControl(null, Validators.compose([Validators.required])),
      strain:new FormControl(null, Validators.compose([Validators.required, Validators.max(99999), Validators.min(0.1)])),
      skewType: new FormControl(null),
      lightDept: new FormControl(false),
      TrimmingMethod: new FormControl(null),
      weight: new FormControl(null,Validators.compose([Validators.required]))
    });
    
  }

  customGroupValidation (formArray) {
    let isError = false;
    const result = _.groupBy( formArray.controls , c => {
      return [c.value.binNo];
    });

    for (const prop in result) {
        if (result[prop].length > 1 && result[prop][0].controls['binNo'].value !== null) {
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

  getGrowerData(){
    this.growerDetailsActionService.getRowSuplierDetailList().subscribe(
      data =>{
        console.log(data)
        this.Growers = this.dropdwonTransformService.transform(data, 'RawSupplierName', 'RawSupId', '-- Select --');
      }
    )
  }
  getBinsData(){
    this.growerDetailsActionService.getEmptyBins().subscribe(
      data => {
        console.log(data)
        this.globalData.binsData = data
        this.bins =  this.dropdwonTransformService.transform(data, 'BinName', 'BinId', '-- Select --');
      }
    )
  }
  showData(index,event?: any){
    // var itemlist = this.ARMForm.get('items')['controls'];
for(let bin of this.globalData.binsData){
  if(event.value === bin.BinId){
this.strainName = bin.StrainName
this.TaskType = bin.TaskTypeName
this.SkewType = bin.SkewType
this.TM = bin.TrimmingMethod
this.LightDept = bin.IsLightDeprevation
// if(this.SkewType != null && this.TM != null){
//   this.enableDropDown = false;
// }

this.ARMForm.get('items')['controls'][index].controls['tasktype'].setValue(this.TaskType)  
this.ARMForm.get('items')['controls'][index].controls['strain'].setValue(this.strainName)  
this.ARMForm.get('items')['controls'][index].controls['skewType'].setValue(this.SkewType)  
this.ARMForm.get('items')['controls'][index].controls['TrimmingMethod'].setValue(this.TM)  
this.ARMForm.get('items')['controls'][index].controls['lightDept'].setValue(this.LightDept)  
 

  }
}
  }
    
 resetForm() {
  this.ARMForm.reset({ chkSelectAll: true });
this.saveButtonText ="Save"
this.pageheading = "Add Raw Material"
this.plusOnEdit = true;
this.getBinsData();
this.Editor = 0;
 this.GrowBinMapId = 0;
const control = <FormArray>this.ARMForm.controls['items'];
let length = control.length;
while (length > 0) {
  length = Number(length) - 1;
  this.deleteItemAll(length);
}
this.addItem();
}
deleteItemAll(index: number) {
  const control = <FormArray>this.ARMForm.controls['items'];
  control.removeAt(index);
}

deleteItem(index: number) {
    
  const control = <FormArray>this.ARMForm.controls['items'];
 
  if (control.length !== 1) {
    control.removeAt(index);
  }
  console.log(this.ARMForm.get('items'))
 
}
GoToBinsPage(){
  this.router.navigate(['../home/labels']);
}

  onSubmit(value: string){
    this.submitted = true;
   let newAddRawMaterialsForApi;
   newAddRawMaterialsForApi = {
    RawMaterial: {
      ClientId: Number(this._cookieService.ClientId),
      GrowerId: Number(this.ARMForm.value.grower),
      ReceivedWt: Number(this.ARMForm.value.receivedwt),
      GrowerBinMapId : this.GrowBinMapId,
      Editor:this.Editor,
    },
    OutputBinData: []
   };
   this.RawmaterialDetailsArr.controls.forEach((element, index) => {
   newAddRawMaterialsForApi.OutputBinData.push({
    BinId:element.value.binNo,
    DryWt:Number(element.value.weight),
    IsOpBinFilledCompletely:0
   });
   });
   this.ARMForm_copy = JSON.parse(JSON.stringify(Object.assign({}, this.ARMForm.value)));
   if (this.ARMForm.valid) {
    this.loaderService.display(true);
    this.newARMDetailsActionService.addRawMaterial(newAddRawMaterialsForApi)
    .subscribe(
      data => {
        this.msgs = [];
        if (String(data[0].RESULTKEY).toLocaleUpperCase() === 'SUCCESS') {
          this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
          detail: this.addNewRawMaterial.newRawMaterialavedsuccess });
         
          this.resetForm();
          this.getAllRawMaterialList();
          this.getBinsData();
          this.GrowBinMapId = 0;
          this.Editor = 0;
          this.plusOnEdit = true;
        }
        else if (String(data[0].RESULTKEY) === 'Total Recevied Weight is not equal to Total Bins Weight') {
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.addNewRawMaterial.BinWtMoreWtThanReceivedWt });
        }
        else if (String(data[0].RESULTKEY) === 'Bins Not Avilable') {
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.addNewRawMaterial.binsNotAvail });
        }
        else if (String(data[0].RESULTKEY) === 'Grower Deleted') {
          this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
          detail: this.addNewRawMaterial.growerdeleted });
        }
        this.loaderService.display(false);
      },
      error => {
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
       
        this.loaderService.display(false);
      });
   }
   else {
    this.appCommonService.validateAllFields(this.ARMForm);
  }
   
  }
  getAllRawMaterialList(){
    this.newARMDetailsActionService.GetRawMaterialList().subscribe(
      data=>{
        if (data !== 'No data found!') {
          this.allRawMateriallist=data;
          this.paginationValues = AppConstants.getPaginationOptions;
          if (this.allRawMateriallist.length > 20) {
            this.paginationValues[AppConstants.getPaginationOptions.length] = this.allRawMateriallist.length;
          }  
        }
        else {
          this.allRawMateriallist = [];
         }
         this.loaderService.display(false);
    },
    error => { console.log(error);  this.loaderService.display(false); },
    () => console.log('getAllStrainsbyClient complete'))
  }

  onPageChange(e) {
    this.event = e;
  }

  getAllLabelslist(){
    this.newLabelDetailsActionService.GetLabelslist().subscribe(
      data=>{
        this.globalData.binsData = data
        this.bins =  this.dropdwonTransformService.transform(data, 'BinName', 'LabelId', '-- Select --');
    })
  }

  getLabelsOnEdit(LabelId){
    this.plusOnEdit = false;
    this.enableDropDown = true;
   
    console.log(this.allRawMateriallist)
    const data = this.allRawMateriallist.filter(x => x.LabelId === LabelId);
    console.log(data);
    var itemlist = this.ARMForm.get('items')['controls'];
    if (data !== 'No data found!') {
      this.LabelIdForUpdate = LabelId;
      this.GrowBinMapId = data[0].GrowBinMapId;
      this.Editor = 1;
      this.LabelOnEdit = data;
      const grower = this.ARMForm.controls['grower'];
      const receivedwt =  this.ARMForm.controls['receivedwt'];
      const binNo =  itemlist[0].controls["binNo"];
      const tasktype =  itemlist[0].controls["tasktype"];
      const strain =  itemlist[0].controls["strain"];
      const skewType =  itemlist[0].controls["skewType"];
      const lightDept =  itemlist[0].controls["lightDept"];
      const TrimminMethod =  itemlist[0].controls["TrimmingMethod"];
      const weight =   itemlist[0].controls["weight"];

       grower.patchValue(this.LabelOnEdit[0].GrowerId);
       receivedwt.patchValue(this.LabelOnEdit[0].TotalWeight);
       this.getAllLabelslist();
       binNo.patchValue(this.LabelOnEdit[0].LabelId);
      tasktype.patchValue(this.LabelOnEdit[0].TaskTypeName);
      strain.patchValue(this.LabelOnEdit[0].StrainName);
      skewType.patchValue(this.LabelOnEdit[0].SkewType);
      lightDept.patchValue(this.LabelOnEdit[0].LightDeprevation);
      TrimminMethod.patchValue(this.LabelOnEdit[0].TrimmingMethod);
      weight.patchValue(this.LabelOnEdit[0].Weight);
  
        this.clear = 'Cancel';
       this.saveButtonText = 'Update';
       this.pageheading = 'Edit Add Raw Material';
     
      
    }else {
      this.allRawMateriallist = [];
      }
      
      this.loaderService.display(false);
  }

  showConformationMessaegForDelete(LabelId,rawmaterial, IsDeleted: number, ActiveInactiveFlag){
    let strMessage: any;
    strMessage = this.addNewRawMaterial.deleteARMMsg;
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.activateDeleteARM(LabelId, rawmaterial, IsDeleted, ActiveInactiveFlag);
      },
      reject: () => {
      }
    });
  }
  activateDeleteARM(LabelId, rawmaterial, IsDeleted, ActiveInactiveFlag) {
    let newARMDetailsForApi;
    newARMDetailsForApi= {
      RawMaterial: {
        GrowerId:rawmaterial.GrowerId,
        GrowerBinMapId:rawmaterial.GrowBinMapId,
        ReceivedWt:rawmaterial.TotalWeight,
        IsDeleted:IsDeleted,
        Editor:0,
        ClientId: Number(this._cookieService.ClientId),
        VirtualRoleId: Number(this._cookieService.VirtualRoleId),
      },
      OutputBinData:[]
    };
    this.RawmaterialDetailsArr.controls.forEach((element, index) => 
    {
      
      newARMDetailsForApi.OutputBinData.push({
        BinId:LabelId,
        DryWt: Number(rawmaterial.Weight),
        IsOpBinFilledCompletely: 0, 
        });
    });
    this.loaderService.display(true);
    this.newARMDetailsActionService.addRawMaterial(newARMDetailsForApi)
     .subscribe(
       data => {
       this.msgs = [];
      if (String(data[0].RESULTKEY) === 'SUCCESS' && IsDeleted === 1) {
      
        this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
        detail: this.addNewRawMaterial.newARWdeletedsuccess  });
        
        this.resetForm();
        this.getAllRawMaterialList();
        
      } else if (String(data[0].RESULTKEY) === 'Bin Is In Processed State') {
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
        detail: this.addNewRawMaterial.binisinuse });
        this.loaderService.display(false);
      }else if(String(data[0].RESULTKEY) === 'This bin used so you can not delete this bin'){
        this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
        detail: this.addNewRawMaterial.binisbeingused });
        this.loaderService.display(false);
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

}
