import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { CookieService } from 'ngx-cookie-service';
import { NewStrainTypeActionService } from '../../../task/services/new-strain-type-action.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { ConfirmationService } from 'primeng/api';
import { AppComponent } from '../../../app.component';
import { StrainTypeService } from '../../services/strain-type.service';
import { AddGeneticsActionService } from '../../../task/services/add-genetics-action.service';
import { GeneticsService } from '../../services/genetics.service';
import { AppConstants } from '../../../shared/models/app.constants';
import { ActivatedRoute,Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NewSectionDetailsActionService } from '../../../task/services/add-section-details.service';
import { PTRService } from '../../../Masters/services/ptr.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
@Component({
  selector: 'app-update-terminationreason',
  templateUrl: './update-terminationreason.component.html',
  styleUrls: ['./update-terminationreason.component.css']
})
export class UpdateTerminationreasonComponent implements OnInit {
  public taskid;
  public taskType;
  globalResource: any;
  public sectionId:any;
  public _cookieService: any;
  public allUpdatedTerminationlist:any;
  public sectionDetails:any;
  pageheading: any;
  public Phases:any;
  public msgs: any[];
  public enabledisablefields: boolean = true
  public enabledisableTerminationFields:boolean =false
  public TerminatioReasons: any[];
  paginationValues: any;
  public sectionid:any
  updateTerminationReason:FormGroup;
  constructor( 
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private cookieService: CookieService,
    private appComponentData: AppComponent,
    private geneticsService: GeneticsService,
    private dropdwonTransformService: DropdwonTransformService,
    // tslint:disable-next-line:no-shadowed-variable
    private addGeneticsActionService: AddGeneticsActionService,
    private confirmationService: ConfirmationService,
    private appCommonService: AppCommonService,
    private router: Router,
    private titleService: Title,
    private newSectionDetailsActionService: NewSectionDetailsActionService,
    private ptrActionService: PTRService,

    ) {
      this.route.params.forEach((urlParams) => {
       this.sectionId = urlParams['SectionId'];
        this.sectionDetails = urlParams
        console.log(urlParams)
      });
   }

  ngOnInit() {
    this.pageheading="Section Details";
    this.getAllTerminationReasons();
    this.getAllUpdateTerminationlist();
    this.globalResource = GlobalResources.getResources().en;
    this._cookieService = this.appCommonService.getUserProfile();
    this.titleService.setTitle("Update Termination");
    this.updateTerminationReason = this.fb.group({
      'phase': new FormControl(null, Validators.required),
      'completed':new FormControl(null),
      'cpc':new FormControl(0),
      'Terminationreason':new FormControl(0),
      'tpc':new FormControl(0),
      'deliverydate':new FormControl(null),
    })
    setTimeout(() => {
      this.loaderService.display(false);
    }, 500);
    this.Phases =  [
      {label: '--Select--', value: 'null'},
      {label: 'Planting', value: 'Planting'},
      {label: 'Harvesting', value: 'Harvesting'}
    ];
    this.sectionid=Number(this.sectionDetails.SectionId)
  }
  getAllTerminationReasons(){
    this.ptrActionService.GetAllPTRListByClient().subscribe(
      data => {
        if(data != 'No Data Found!'){
          this.TerminatioReasons = this.dropdwonTransformService.transform(data, 'TerminationReason', 'TerminationId', '-- Select --',false);
        }
        else{
          this.TerminatioReasons = [];
        }
       
       } ,
       error => { console.log(error);  this.loaderService.display(false); },
       () => console.log('getTerminationReasons complete'));
  }
  enableAndDisableFields(event:any){
    if(event){
this.enabledisablefields = false;
this.enabledisableTerminationFields = true
    }
    else{
      this.enabledisablefields = true;
      this.enabledisableTerminationFields = false
    }
console.log(event);
  }

  onSubmit(value: string){
    let newUpdateTerminationForApi;
    newUpdateTerminationForApi = {
      TaskStatus: {
        SectionId:Number(this.sectionDetails.SectionId),
        StrainId:Number(this.sectionDetails.StrainId),
        ClientId: Number(this._cookieService.ClientId),
        TaskName:this.updateTerminationReason.value.phase,
        IsTaskCompleted:this.updateTerminationReason.value.completed === null? 0:1,
        CompletedPlantCount:this.updateTerminationReason.value.cpc,
        TerminatedPlantCount:Number(this.updateTerminationReason.value.tpc),
        TerminationReasonId:this.updateTerminationReason.value.Terminationreason,
      }
    }
    if (this.updateTerminationReason.valid) {
      this.loaderService.display(true);
      this.newSectionDetailsActionService.updateTermination(newUpdateTerminationForApi)
        .subscribe(
          data => {
            this.msgs = [];
            if (String(data[0].RESULTKEY) === 'SUCCESS') {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
                detail:'Termination Reason Added Successfully' });
                this.getAllUpdateTerminationlist();
                this.loaderService.display(false);
            }
            else {
              this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
              this.loaderService.display(false);
            } 
          }, 
          error => {
            this.msgs = [];
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
           
            this.loaderService.display(false);
          });
    }
    else {
      this.appCommonService.validateAllFields(this.updateTerminationReason);
    }
  }
  getAllUpdateTerminationlist()
  {
this.newSectionDetailsActionService.GetUpdatedTerminationList(this.sectionDetails.SectionId).subscribe(
  data=>{
    if (data !== 'No Data Found') {
      this.allUpdatedTerminationlist=data;
      this.paginationValues = AppConstants.getPaginationOptions;
    if (this.allUpdatedTerminationlist.length > 20) {
      this.paginationValues[AppConstants.getPaginationOptions.length] = this.allUpdatedTerminationlist.length;
    }
  } else {
    this.allUpdatedTerminationlist = [];
   }
   this.loaderService.display(false);
  },
   error => { console.log(error);  this.loaderService.display(false); },
   () => console.log('getAllStrainsbyClient complete'));
  }

  backToSectionsPge(){
    this.router.navigate(['../home/sections']);
  }
}
