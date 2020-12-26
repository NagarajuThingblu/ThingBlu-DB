import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';
import { DashobardService } from '../../services/dashobard.service';
import { SelectItem } from 'primeng/api';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';

@Component({
  selector: 'app-emp-performance-dashboard',
  templateUrl: './emp-performance-dashboard.component.html',
  styleUrls: ['./emp-performance-dashboard.component.css']
})
export class EmpPerformanceDashboardComponent implements OnInit {
  dropdowndata:any;
  data: any;
  public taskTypes: SelectItem[];
  Tasktypetotaltime:any;
  constructor(private loaderService: LoaderService,private dashboardService: DashobardService,  private dropdownDataService: DropdownValuesService,
    private dropdwonTransformService: DropdwonTransformService,) { 
    this.data = {
      labels: ['A','B','C','D','E','F','G','H','abc bcd efg','ijk klm mno','jyothi','abc icd ehg','ijk hjhjlm mno','jyothi1','mani'],
      datasets: [
          {
              data: [300, 50, 100,300, 50, 100,300, 50, 100,300, 50, 100,300, 50, 100],
              backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                 
                 
              ],
              hoverBackgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
              ]
          }]    
      };
  }

  ngOnInit() {
    this.loaderService.display(false);
    this.getAllTaskTypes();
    this.GetTaskTypetotalTime();
    this.dropdowndata = [{ id:1, Title:"Last Week"},
                           { id:2, Title:"YTD"},
                           { id:3, Title:"MTD"}]
  }

  GetTaskTypetotalTime()
  {
this.dashboardService.GetTasktypeTotaltime().subscribe(data=>{
  this.Tasktypetotaltime=data;
  this.data = {
    labels: this.Tasktypetotaltime[0],
    datasets: [
        {
            data: this.Tasktypetotaltime[1],
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56"
          ],
          hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56"
          ]
            
        }]    
    };
})
  }

  getAllTaskTypes() {
    // this.loaderService.display(true);
     this.dropdownDataService.getAllTask().subscribe(
       data => {
         // console.log(data);
        //  this.globalData.taskTypes = data;
         this.taskTypes = this.dropdwonTransformService.transform(data, 'TaskTypeName', 'TaskTypeId', 'Show All', false) ;
        // this.loaderService.display(false);
       } ,
       error => { console.log(error); this.loaderService.display(false); },
       );
   }

}
