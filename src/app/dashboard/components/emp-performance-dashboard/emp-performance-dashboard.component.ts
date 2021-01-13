import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';
import { DashobardService } from '../../services/dashobard.service';
import { SelectItem } from 'primeng/api';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { AppConstants } from '../../../shared/models/app.constants';
import { AppCommonService } from '../../../shared/services/app-common.service';

@Component({
  selector: 'app-emp-performance-dashboard',
  templateUrl: './emp-performance-dashboard.component.html',
  styleUrls: ['./emp-performance-dashboard.component.css']
})
export class EmpPerformanceDashboardComponent implements OnInit {
  dropdowndatefilter:any;
  data: any;
  EmployeeList:any;
  allYtdlist:any;
  ytdlistdist:any;
  public taskTypes: SelectItem[];
  filtername:any;
  Tasktypetotaltime:any;
  datefilter:any;
  FilterempId:any=0;
  userdetails:any;
  UserRoles=AppConstants.getUserRoles;
  constructor(private loaderService: LoaderService,private dashboardService: DashobardService,  private dropdownDataService: DropdownValuesService,
    private dropdwonTransformService: DropdwonTransformService,private appCommonService: AppCommonService,) { 
    this.data = {
          
      };
this.userdetails=this.appCommonService.getUserProfile()
  }

  ngOnInit() {
    this.loaderService.display(false);
    this.datefilter= [{ id:1, Title:"Last Week"},
    { id:2, Title:"YTD"},
    { id:3, Title:"MTD"}]
    this.dropdowndatefilter =this.dropdwonTransformService.transform(this.datefilter, 'Title', 'Title', '-- Select --', false) ;
    //this.datefilter= this.datefilter[0].Title;
    if(this.UserRoles.Employee!=this.userdetails.UserRole)
    {
          this.GetEmployeeList();
    }
    else{
      this.GetProductivityStatistics(this.FilterempId);
this.GetTaskTypetotalTime(this.datefilter,this.FilterempId);
    }
    //this.GetProductivityStatistics();
    
  }

  GetTaskTypetotalTime(Filterdata,Filterempid)
  {
    
this.dashboardService.GetTasktypeTotaltime(Filterdata,Filterempid).subscribe(data=>{
  if(data!='No data found!')
  {
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
  }
})
  }

  Ondropdownchange(event)
  {
  this.GetProductivityStatistics(event.value);
  this.FilterempId=event.value;
  this.GetTaskTypetotalTime(this.datefilter,this.FilterempId);
  }
  Ondropdowndatefilterchange(event)
  {
this.datefilter=event.value;
this.GetTaskTypetotalTime(this.datefilter,this.FilterempId);
  }
  GetEmployeeList()
   {
     this.dashboardService.GetemployeeList().subscribe(data=>{
this.EmployeeList=this.dropdwonTransformService.transform(data,"EmpName","EmpId","Show ALL",false);
this.GetProductivityStatistics(this.FilterempId);
this.GetTaskTypetotalTime(this.datefilter,this.FilterempId);

     },
     
     error=>{ console.log(error);this.loaderService.display(false);  },
     );
   }
   GetProductivityStatistics(FilterEmpId)
   {
     this.dashboardService.GetProductivityStatistics(FilterEmpId).subscribe(data=>{
       if(data!='No data found!')
       {
       this.allYtdlist=data;
       this.ytdlistdist=this.allYtdlist.map(item => item.Category)
       .filter((value, index, self) => self.indexOf(value) === index);
       }
       else{
         this.allYtdlist=[];
         this.ytdlistdist=[];
       }
     })
     
   }

}
