import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';
import { ActivatedRoute,Router } from '@angular/router';
import { NewLabelDetailsActionService } from '../../../task/services/add-label-details.service';

@Component({
  selector: 'app-label-details',
  templateUrl: './label-details.component.html',
  styleUrls: ['./label-details.component.css']
})
export class LabelDetailsComponent implements OnInit {
  public allLabelDetails: any;
  public LabelId: any
  public LabelDetails: any;
  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private router: Router,
    private newLabelDetailsActionService: NewLabelDetailsActionService,
  ) {
    this.route.params.forEach((urlParams) => {
      this.LabelId = urlParams['LabelId'];
       this.LabelDetails = urlParams
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
    this.newLabelDetailsActionService.GetLabelsInfo(this.LabelDetails.LabelId).subscribe(
      data=>{
        if (data !== 'No Data Found') {
          this.allLabelDetails = data.Table1
          // this.allUpdatedTerminationlist=data.Table;
          // this.Phases = this.dropdwonTransformService.transform(data.Table1, 'TaskTypeName', 'TaskTypeId', '-- Select --'); 
        
      } else {
        this.allLabelDetails = [];
       }
       this.loaderService.display(false);
      },
       error => { console.log(error);  this.loaderService.display(false); },
       () => console.log('Get Complete Data'));
  }
  backToLabelsPge(){
    this.router.navigate(['../home/labels']);
  }
}
