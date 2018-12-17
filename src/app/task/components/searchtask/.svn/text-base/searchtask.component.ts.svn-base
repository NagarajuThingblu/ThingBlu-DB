import { GlobalResources } from './../../../global resource/global.resource';
import { TaskResources } from './../../task.resources';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SelectItem } from 'primeng/components/common/selectitem';
import { Title } from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  selector: 'app-searchtask',
  templateUrl: 'searchtask.component.html',
  styleUrls: ['./searchtask.component.css']
})
export class SearchtaskComponent implements OnInit {

  public searchForm: FormGroup;

  public tasknames: SelectItem[];
  public Lots: SelectItem[];
  public Employees: SelectItem[];
  public Priorities: SelectItem[];
  public Brands: SelectItem[];
  public Strains: SelectItem[];
  public Status: SelectItem[];

  public submitted: boolean;
  public tasks;

  public searchTaskResource: any;
  public globalResource: any;

  constructor(
    private fb: FormBuilder,
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.searchTaskResource = TaskResources.getResources().en.searchtask;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle(this.searchTaskResource.searchtasktitle);
    this.searchForm = this.fb.group({
      'taskname': new FormControl(''),
      'brand': new FormControl(''),
      'strain': new FormControl(''),
      'employee': new FormControl(''),
      // 'estimatedstartdatetime': new FormControl('',  Validators.compose([Validators.required])),
      'estimatedstartdate': new FormControl(''),
      'estimatedenddate': new FormControl(''),
      'priority': new FormControl(''),
      'status': new FormControl(''),
    });

    this.tasknames = [
      {label: '-- Select --', value: null},
      {label: 'Quarantine', value: '1'},
      {label: 'Trimming', value: '2'},
      {label: 'Sifting', value: '3'},
    ];

    this.Lots = [
      {label: '-- Select --', value: null},
      {label: 'Lot101R1', value: '1'},
      {label: 'Lot102R2', value: '2'},
      {label: 'Lot201R1', value: '3'},
      {label: 'Lot202R2', value: '4'},
      {label: 'Lot202R3', value: '5'},
    ];

    this.Employees = [
      {label: '-- Select --', value: null},
      {label: 'Kevin', value: '1'},
      {label: 'Randy Carroll', value: '2'},
      {label: 'David Miller', value: '3'}
    ];

    this.Priorities =  [
      {label: '-- Select --', value: null},
      {label: 'Low', value: '1'},
      {label: 'Normal', value: '2'},
      {label: 'Critical', value: '3'}
    ];

    this.Brands =  [
      {label: '-- Select --', value: null},
      {label: 'Dawg Star', value: '1'},
      {label: 'Forbidden Garden', value: '2'}
    ];

    this.Strains =  [
      {label: '-- Select --', value: null},
      {label: 'Blueberry Kush', value: '1'},
      {label: 'Blue Dream', value: '2'},
      {label: 'Strawberry Ice', value: '3'}
    ];

    this.Status =  [
      {label: '-- Select --', value: null},
      {label: 'Assigned', value: '1'},
      {label: 'In-Process', value: '2'},
      {label: 'Paused', value: '3'},
      {label: 'Completed', value: '3'}
    ];

    this.tasks = [
      {task: 'qurantine', employee: 'Kevin', taskid: '1', brand: 'Dawg Star', strain: 'Blueberry Kush', lotno: 'L101R2', enddatetime: '04/05/2018 03:00 PM'},
    ];

  }



  onSubmit(assignTaskFormValues: string) {
    this.submitted = true;
    console.log(assignTaskFormValues);
    if (this.searchForm.valid) {

      // this.TaskCommonService.assignTask(this.searchForm.value)
      // .subscribe(
      //     data => {
      //       // this.router.navigate(['']);
      //       console.log(data);
      //     },
      //     error => {
      //         console.log(error);
      //     });


      // this.assignTaskForm.reset();
    }
  }

  get diagnostic() { return JSON.stringify(this.searchForm.value); }

}
