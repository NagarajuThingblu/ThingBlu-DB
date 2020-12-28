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
  EmployeeList:any;
  allYtdlist:any;
  ytdlistdist:any;
  public taskTypes: SelectItem[];
  Tasktypetotaltime:any;
  constructor(private loaderService: LoaderService,private dashboardService: DashobardService,  private dropdownDataService: DropdownValuesService,
    private dropdwonTransformService: DropdwonTransformService,) { 
    this.data = {
          
      };
  }

  ngOnInit() {
    this.loaderService.display(false);
    this.getAllTaskTypes();
    this.GetTaskTypetotalTime();
    this.GetEmployeeList();
    this.GetProductivityStatistics();
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

   GetEmployeeList()
   {
     this.dashboardService.GetemployeeList().subscribe(data=>{
this.EmployeeList=this.dropdwonTransformService.transform(data,"EmpName","EmpId","Show ALL",false);

     },
     
     error=>{ console.log(error);this.loaderService.display(false);  },
     );
   }
   GetProductivityStatistics()
   {
     this.dashboardService.GetProductivityStatistics().subscribe(data=>{
       this.allYtdlist=data;
       this.ytdlistdist=this.allYtdlist.map(item => item.Category)
       .filter((value, index, self) => self.indexOf(value) === index);
     })
   }

}
