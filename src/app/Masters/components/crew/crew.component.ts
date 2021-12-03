import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { AppComponent } from '../../../app.component';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { CrewService } from '../../services/crew.service';
import { AppConstants } from '../../../shared/models/app.constants';
import { ConfirmationService, Confirmation } from 'primeng/api';

@Component({
  selector: 'app-crew',
  templateUrl: './crew.component.html',
  styleUrls: ['./crew.component.css']
})
export class CrewComponent implements OnInit {
  CrewResources: any;
  CrewForm: FormGroup;
  globalResource: any;
  public employees: any[];
  public Monitorlist:any[];
  SaveButtonText = 'Save';
  Clear = 'Clear';
  pageheading = 'Add New Crew';
  IsActive: boolean;
  public _Cookieservice: any;
  public msgs: any[];
  public allCrewlist: any
  paginationValues: any;
  public CrewIDForUpdate=0
  public CrewOnEdit:any;
  public submitted: boolean;
  public event: any;
  
  constructor(
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private appComponentData: AppComponent,
    private dropdownDataService: DropdownValuesService,
    private dropdwonTransformService: DropdwonTransformService,
    private appCommonservice: AppCommonService,
    private crewService: CrewService,
    private confirmationService: ConfirmationService,
    ) { 
    this.GetCrewList()
    }

  ngOnInit() {
    this.IsActive = true;
    this.CrewResources = MastersResource.getResources().en.addNewCrew
    this.globalResource = GlobalResources.getResources().en;
    this._Cookieservice=this.appCommonservice.getUserProfile();
    this.appComponentData.setTitle('Crew');
    this.CrewForm = this.fb.group({
      'crew': new FormControl(null, Validators.required ),
      'description': new FormControl(null),
      'chkIsActive': new FormControl(null)
    });
    this.loaderService.display(false);
  }


ResetForm() {
  this.CrewForm.reset({chkIsActive: true });
  this.pageheading = 'Add New Crew';
  this.Clear = 'Clear';
  this.SaveButtonText = 'Save';
}

onSubmit(value: string){
  let crewDetailsForApi
  crewDetailsForApi = {
    Crew: {
      ClientId:this._Cookieservice.ClientId,
      CrewID : this.CrewIDForUpdate,
      CrewName: this.CrewForm.value.crew,
      Description: this.CrewForm.value.description,
      IsDeleted: 0,
      IsActive:this.CrewForm.value.chkIsActive === true?1:0,
      ActiveInactive:0,
      VirtualRoleId: this._Cookieservice.VirtualRoleId, 
    },
  };
  if (this.CrewForm.valid) {
    this.loaderService.display(true);
    this.crewService.addCrewDetails(crewDetailsForApi)
      .subscribe(
        data => {
          this.msgs = [];
          if (data[0]['RESULTKEY'].toLocaleUpperCase() == 'SUCCESS') {
            this.msgs.push({
              severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.CrewResources.crewsaved
            });
            this.ResetForm();
            this.GetCrewList();
            this.CrewIDForUpdate=0;
          }
          else if (data[0]['RESULTKEY'] === 'Please Inactivate the sub crews') {
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail:data[0]['RESULTKEY']  });
            this.GetCrewList();
          }
          else if(data[0]['RESULTKEY'].toLocaleUpperCase() == 'UPDATED'){
            this.msgs.push({
              severity: 'success', summary: this.globalResource.applicationmsg,
              detail: this.CrewResources.CrewUpdated
            });
            this.ResetForm();
            this.GetCrewList();
            this.CrewIDForUpdate=0;
          }
          else {
            this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
          }
          this.loaderService.display(false);
        },
            
      error => {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
        // http call end
        this.ResetForm();
        this.loaderService.display(false);
      }
      )
  }
  else{
    //this.appCommonservice.validateAllCrews(this.CrewForm);
  }
}



GetCrewList() {
  this.loaderService.display(true);
  this.crewService.getAllCrewList().subscribe(data=>{
    if(data!="No Data Found"){
      this.allCrewlist=data;
      this.paginationValues=AppConstants.getPaginationOptions;
      if(this.allCrewlist.length>20)
      {
        this.paginationValues[AppConstants.getPaginationOptions.length] = this.allCrewlist.length;
      }
    }
    else{
      this.allCrewlist=[];
    }
    this.loaderService.display(false);
  },
  error => { console.log(error); this.loaderService.display(false); },
  () => console.log('GetAllCrewListbyClient complete'));
}

onPageChange(e) {
  this.event = e;
}
GetCrewOnEdit(CrewID)
{
  const data = this.allCrewlist.filter(x => x.CrewID === CrewID);
  console.log(data);
   if (data != 'No data found!') {
     this.CrewIDForUpdate = CrewID;
     this.CrewOnEdit = data;
     const crew = this.CrewForm.controls['crew'];
     const description = this.CrewForm.controls['description'];
     const chkIsActive = this.CrewForm.controls['chkIsActive'];
      
     crew.patchValue(this.CrewOnEdit[0].CrewName);
     description.patchValue(this.CrewOnEdit[0].Description);
      chkIsActive.patchValue(this.CrewOnEdit[0].IsActive);
     
      this.Clear = 'Cancel';
     this.SaveButtonText = 'Update';
     this.pageheading = 'Edit Crew';

    
     
   } else {
   this.allCrewlist = [];
   }
   this.loaderService.display(false);
}

ShowConformationMessaegForDelete(CrewID, Crew, IsDeleted, ActiveInactiveFlag){
  let strMessage: any;
  strMessage = this.CrewResources.deleteCrewMsg;
  this.confirmationService.confirm({
    message: strMessage,
    header: 'Confirmation',
    icon: 'fa fa-exclamation-triangle',
    accept: () => {
      this.activateDeleteCrew(CrewID, Crew, IsDeleted, ActiveInactiveFlag);
    },
    reject: () => {
    }
});
}

showConformationMessaegForDeactive(CrewID, Crew, rowIndex, IsDeleted, ActiveInactiveFlag) {
  console.log(CrewID);
  let strMessage: any;
  if (this.allCrewlist[rowIndex].IsActive === true) {
    strMessage = this.CrewResources.activeCrewMsg ;
  } else {
    strMessage = this.CrewResources.deactivateCrewMsg ;
  }
  this.confirmationService.confirm({
    message: strMessage,
    header: 'Confirmation',
    icon: 'fa fa-exclamation-triangle',
    accept: () => {
       this.activateDeleteCrew(CrewID, Crew, IsDeleted, ActiveInactiveFlag);
      },
      reject: () => {
        Crew.IsActive = !Crew.IsActive;
      }
  });
}

activateDeleteCrew(CrewID, Crew,IsDeleted, ActiveInactiveFlag) {
  this.submitted = true;

    const CrewDetailsForApi = {
      Crew: {
        ClientId:this._Cookieservice.ClientId,
        CrewID : CrewID,
        CrewName:Crew.CrewName,
        Description: Crew.Description,
        IsDeleted: IsDeleted,
        IsActive: Crew.IsActive === true?1:0,
        ActiveInactive:ActiveInactiveFlag,
        VirtualRoleId: this._Cookieservice.VirtualRoleId, 
    }
  };
    // console.log(strainDetailsForApi);
    this.loaderService.display(true);
    this.crewService.addCrewDetails(CrewDetailsForApi)
    .subscribe(
        data => {
          // console.log(data);
          this.msgs = [];
          if (data[0]['RESULTKEY'].toLocaleUpperCase()  === 'SUCCESS' && ActiveInactiveFlag === 1) {
            if (Crew.IsActive === true) {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail:  this.CrewResources.activated});
              this.ResetForm();
              this.GetCrewList();
              this.loaderService.display(false);
            } else {
              this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
              detail:this.CrewResources.inactivated});
              this.ResetForm();
              this.GetCrewList();
              this.loaderService.display(false);
            }
          } else if (data[0]['RESULTKEY'].toLocaleUpperCase()  === 'SUCCESS' && IsDeleted === 1) {
            this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg,
            detail: this.CrewResources.deletedSuccess});
            this.ResetForm();
            this.GetCrewList();
            this.loaderService.display(false);
          } else if (String(data) === 'NOTUPDATED') {
            if (IsDeleted === 1) {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.CrewResources.notdeleted});
              this.loaderService.display(false);
            } else if (Crew.IsActive === true) {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.CrewResources.notactivated });
              Crew.IsActive = !Crew.IsActive;
              this.loaderService.display(false);
            } else {
              this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
              detail: this.CrewResources.notinactivated });
              Crew.IsActive = !Crew.IsActive;
              this.loaderService.display(false);
            }
          }  else if (data[0]['RESULTKEY'] === 'Please Delete the sub crews') {
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail:data[0]['RESULTKEY']  });
            this.GetCrewList();
          } else if (data[0]['RESULTKEY'] === 'Please Inactivate the sub crews') {
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail:data[0]['RESULTKEY']  });
            this.GetCrewList();
          }
          else if (data[0]['RESULTKEY'] === 'Duplicate Record') {
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail:data[0]['RESULTKEY']  });
            this.ResetForm();
            this.GetCrewList();
            this.loaderService.display(false);
          } 
          else if (data[0]['RESULTKEY'] === 'Duplicate record found') {
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail:data[0]['RESULTKEY']  });
            this.ResetForm();
            this.GetCrewList();
            this.loaderService.display(false);
          }
          else if (data[0]['RESULTKEY'] === 'Already Deleted') {
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail:"Already Deleted"});
            this.ResetForm();
            this.GetCrewList();
            this.loaderService.display(false);
          }
           else if (data === 'Failure') {
            this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
          } else if (data === 'Duplicate') {
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.CrewResources.CrewAlreadyExists });
            this.GetCrewList();
          } else if (data === 'InUse') {
            this.msgs = [];
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg,
            detail: 'Can`t delete. Record is in use.'});
            this.GetCrewList();
          } else {
            this.msgs.push({severity: 'warn', summary: this.globalResource.applicationmsg, detail: data });
          }
            // http call end
            this.loaderService.display(false);
        },
        error => {
          this.msgs = [];
          this.msgs.push({severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
          // http call end
          this.ResetForm();
          this.loaderService.display(false);
        });
}
}
