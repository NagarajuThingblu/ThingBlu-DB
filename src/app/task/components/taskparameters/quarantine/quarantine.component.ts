import { Component, OnInit, Input, ComponentFactoryResolver } from '@angular/core';
import { FormGroup, NgModel, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Message, SelectItem } from 'primeng/api';
import { TaskResources } from '../../../task.resources';
import { DropdownValuesService } from '../../../../shared/services/dropdown-values.service';
import { TaskCommonService } from '../../../services/task-common.service';
import { PositiveIntegerValidator } from '../../../../shared/validators/positive-integer.validator';
import { GlobalResources } from '../../../../global resource/global.resource';
import { Title } from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  selector: 'app-quarantine',
  templateUrl: 'quarantine.component.html'
})
export class QuarantineComponent implements OnInit {
  Quarantine: FormGroup;
  quarantineCompleteForm: FormGroup;
  @Input() TaskModel: any;
  @Input() PageFlag: any;
  @Input() ParentFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dropdownDataService: DropdownValuesService,
    private titleService: Title
  ) { }

  public msgs: Message[] = [];

  public Lots: SelectItem[];
  public Employees: SelectItem[];
  public Priorities: SelectItem[];

  public assignTaskResources: any;
  public globalResource: any;

  TaskCompletionModel = {
    misccost: '',
  };

  TaskActionDetails: any;

  ngOnInit() {
    this.assignTaskResources = TaskResources.getResources().en.assigntask;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle(this.assignTaskResources.quarantinetitle);

    if (this.PageFlag.page !== 'TaskAction') {
      this.TaskModel.quarantine = {
        lotno: '',
        brand: '',
        strain: '',
        startdate: '',
        enddate: '',
        endtime: '',
        esthrs: '',
        priority: '',
        notifymanager: '',
        notifyemployee: '',
        usercomment: '',
        quarantinehrs: '24'
      };

      this.Quarantine = this.fb.group({
        'lotno': new FormControl('', Validators.required),
        'brand': new FormControl(''),
        'strain': new FormControl(''),
        'employee': new FormControl('', Validators.required),
        'estimatedstartdate': new FormControl('',  Validators.compose([Validators.required])),
        'estimatedenddate': new FormControl('',  Validators.compose([Validators.required])),
        // 'estimatedenddate': new FormControl('',  Validators.compose([Validators.required])),
        'esthrs': new FormControl('',  Validators.compose([Validators.required, PositiveIntegerValidator.allowOnlyPositiveInteger ])),
        'priority': new FormControl(''),
        'notifymanager': new FormControl(''),
        'notifyemployee': new FormControl(''),
        'comment': new FormControl('', Validators.maxLength(500)),
        'quarantinehrs': new FormControl('24'),
      });

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
        {label: 'Normal', value: '1'},
        {label: 'Important', value: '2'},
        {label: 'Critical', value: '3'}
      ];

      this.ParentFormGroup.addControl('Quarantine', this.Quarantine);
    } else {
      this.TaskActionDetails = {
        type: 'Sifting',
        employee: 'Kevin',
        lotno: 'L101R1',
        status: 'In-Process',
        brand: 'Dawg Star',
        strain: 'Blueberry Kush',
        esthrs: '8',
        estenddate: '04/02/2018 11:00 AM',
        comment: 'Assign Task Comment...'
      };

      this.quarantineCompleteForm = this.fb.group({
        'misccost': new FormControl(''),
      });
    }
  }

  submitCompleteParameter(formModel) {
    console.log(formModel);

    this.msgs = [];
    this.msgs.push({severity: 'success', summary: this.globalResource.applicationmsg, detail: 'Task completion details saved successfully.' });
  }

}
