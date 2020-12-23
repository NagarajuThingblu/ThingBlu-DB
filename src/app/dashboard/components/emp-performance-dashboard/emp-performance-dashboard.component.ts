import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';
import { DashobardService } from '../../services/dashobard.service';

@Component({
  selector: 'app-emp-performance-dashboard',
  templateUrl: './emp-performance-dashboard.component.html',
  styleUrls: ['./emp-performance-dashboard.component.css']
})
export class EmpPerformanceDashboardComponent implements OnInit {
  data: any;
  Tasktypetotaltime:any;
  constructor(private loaderService: LoaderService,private dashboardService: DashobardService) { 
    this.data = {
      labels: ['A','B','C'],
      datasets: [
          {
              data: [300, 50, 100],
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
  }

  ngOnInit() {
    this.loaderService.display(false);
    this.GetTaskTypetotalTime();
    
  }

  GetTaskTypetotalTime()
  {
this.dashboardService.GetTasktypeTotaltime().subscribe(data=>{
  this.Tasktypetotaltime=data;
  this.data = {
    labels: this.Tasktypetotaltime.TaskTypeName,
    datasets: [
        {
            data: this.Tasktypetotaltime.TotalTime
            
        }]    
    };
})
  }

}
