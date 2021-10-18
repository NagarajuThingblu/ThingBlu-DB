import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';
import { ActivatedRoute,Router } from '@angular/router';
import { NewSectionDetailsActionService } from '../../../task/services/add-section-details.service';
@Component({
  selector: 'app-section-details',
  templateUrl: './section-details.component.html',
  styleUrls: ['./section-details.component.css']
})
export class SectionDetailsComponent implements OnInit {
public allUpdatedPhaseslist: any;
public sectionId: any
public sectionDetails: any;
public showPopUp:boolean = false;
public NoData:boolean = false;
public completeInfo:any;
  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private router: Router,
    private newSectionDetailsActionService: NewSectionDetailsActionService,
  ) {
    this.route.params.forEach((urlParams) => {
      this.sectionId = urlParams['SectionId'];
       this.sectionDetails = urlParams
       console.log(urlParams)
     });
   }

  ngOnInit() {
    this.GetCompleteData();
    setTimeout(() => {
      this.loaderService.display(false);
    }, 500);
  }

  GetCompleteData(){
    this.newSectionDetailsActionService.GetPhasesInfo(this.sectionDetails.SectionId).subscribe(
      data=>{
        if (data !== 'No Data Found') {
          this.allUpdatedPhaseslist = data
          // this.allUpdatedTerminationlist=data.Table;
          // this.Phases = this.dropdwonTransformService.transform(data.Table1, 'TaskTypeName', 'TaskTypeId', '-- Select --'); 
        
      } else {
        this.allUpdatedPhaseslist = [];
       }
       this.loaderService.display(false);
      },
       error => { console.log(error);  this.loaderService.display(false); },
       () => console.log('Get Complete Data'));
  }

  showCompleteInfo(section){
    this.completeInfo = []
    this.showPopUp = true;
    this.newSectionDetailsActionService.GetCompleteInfo(this.sectionDetails.SectionId,section.TaskTypeId).subscribe(
      data=>{
        if(data !='No Data Found'){
        this.completeInfo = data
      this.NoData = true;
        }
      else{
        this.NoData = false
      }
      }
    )
    
  }
  backToSectionsPge(){
    this.router.navigate(['../home/master/sections']);
  }

}
