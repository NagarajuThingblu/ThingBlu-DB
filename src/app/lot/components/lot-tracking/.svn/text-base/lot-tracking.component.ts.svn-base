import { Component, OnInit } from '@angular/core';
import { GlobalResources } from './../../../global resource/global.resource';
import { PositiveIntegerValidator } from './../../../shared/validators/positive-integer.validator';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Message, SelectItem } from 'primeng/api';
import { TaskResources } from '../../../task/task.resources';
import { Title } from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  selector: 'app-lot-tracking',
  templateUrl: './lot-tracking.component.html'
})
export class LotTrackingComponent implements OnInit {
  constructor(private fb: FormBuilder,
    private titleService: Title,
  ) { }

  lotTrackingForm: FormGroup;
  items: FormArray;

  public tasknames: SelectItem[];
  public strains: SelectItem[];
  public skewed: SelectItem[];
  public lots: SelectItem[];
  public status: SelectItem[];

  public msgs: Message[] = [];

  public globalResource: any;
  public lotTrackingDetails: any;

  public lotTrackingModel: any;
  public lotTrackingModel1: any;
  public lotTrackingModel1_copy: any;

  public rowAdded = false;
  public firstRowAdded = true;

  ngOnInit() {

    this.lotTrackingDetails = TaskResources.getResources().en.lotTrackingDetails;
    this.globalResource = GlobalResources.getResources().en;
    this.titleService.setTitle(this.lotTrackingDetails.Title);
    this.lotTrackingForm = this.fb.group({
      items: new FormArray([ this.createItem() ]),
    });

    this.lotTrackingModel = {
      task: '',
      skewed: '',
      lotno: '1',
      debit: '',
      credit: '',
      balance: '',
      nexttask: '',
      status: '',
    };

    this.lotTrackingModel1 = {
      budassigned: 0,
      jointsassigned: 0,
      oilassigned: 0,
      wasteassigned: 0,
      budbal: 0,
      jointsbal: 0,
      oilbal: 0,
      wastebal: 0,
      unskewedassigned: 0,
      unskewedbal: 0
    };

    this.tasknames = [
      {label: 'Select', value: null},
      {label: 'Lot Entry', value: '1'},
      {label: 'Trimming', value: '2'},
      {label: 'Sifting', value: '3'},
      {label: 'Bud Processing', value: '4'},
      {label: 'Bud Packaging Task', value: '5'},
      {label: 'Grinding Task', value: '6'},
      {label: 'Cone Filling', value: '7'},
      {label: 'Tamping', value: '8'},
      {label: 'Tubing', value: '9'},
      {label: 'Order Fullfillment', value: '10'},
      // {label: 'Branding and Labeling Task',value: '6'},
      // {label: 'QA Checking',value: '7'},
      // {label: 'Destroy Packaging',value: '8'},
    ];

    this.skewed =  [
      {label: 'Select', value: null},
      {label: 'Bud', value: '1'},
      {label: 'Joints', value: '2'},
      {label: 'Oil', value: '3'},
      {label: 'Waste', value: '4'},
    ];

    this.status =  [
      {label: 'Select', value: null},
      {label: 'Assigned', value: '1'},
      {label: 'Completed', value: '2'}
    ];

    this.lots =  [
      {label: 'L101R2', value: '1'},
      {label: 'L100R1', value: '2'},
      {label: 'L102R3', value: '3'}
    ];

  }

  addItem(): void {
    this.rowAdded = true;
    this.firstRowAdded = false;
    this.lotTrackingModel1_copy = Object.assign({}, this.lotTrackingModel1);

    this.items = this.lotTrackingForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  deleteItem(index: number) {
    // control refers to your formarray
    const control = <FormArray>this.lotTrackingForm.controls['items'];
    // remove the chosen row
    control.removeAt(index);
  }

  createItem(): FormGroup {
      return this.fb.group({
        task: new FormControl(''),
        skewed: new FormControl(''),
        debit: new FormControl('0'),
        credit: new FormControl('0'),
        balance: new FormControl('0'),
        nexttask: new FormControl(''),
        status: new FormControl(''),
      });
  }

  get taskDetails(): FormArray { return this.lotTrackingForm.get('items') as FormArray; }

  UpdateInventory(flag, currentRow) {
    // console.log(currentRow.value);

    if (this.firstRowAdded === true) {

      // this.lotTrackingModel1_copy = this.lotTrackingModel1;
      this.lotTrackingModel1_copy = Object.assign({}, this.lotTrackingModel1);

    }

    // else if (this.rowAdded ===  true) {
    //   alert(2);
    //   this.lotTrackingModel1_copy = this.lotTrackingModel1;
    //   this.rowAdded = false;
    // }

    if (currentRow.value.skewed === '' && currentRow.value.task === '1') {

     // if (currentRow.value.status === '1') {
       this.lotTrackingModel1.unskewedbal = 0;

        this.lotTrackingModel1.unskewedbal  = parseFloat(this.lotTrackingModel1_copy.unskewedbal) + parseFloat(currentRow.value.credit) ;
        this.lotTrackingModel1.unskewedassigned = 0;
      // } else {
      //   this.lotTrackingModel1.unskewedbal  = this.lotTrackingModel1.unskewedbal - parseFloat(currentRow.value.debit) ;
      //   this.lotTrackingModel1.unskewedassigned = this.lotTrackingModel1.unskewedassigned + parseFloat(currentRow.value.debit);
      // }

    } else if ((currentRow.value.task === '2' || currentRow.value.task === '3')) {

      if (currentRow.value.status === '1') {
        // Unskewed
        this.lotTrackingModel1.unskewedbal  = this.positiveValue(parseFloat(this.lotTrackingModel1_copy.unskewedbal) - parseFloat(currentRow.value.debit));
        this.lotTrackingModel1.unskewedassigned = parseFloat(this.lotTrackingModel1_copy.unskewedbal) - parseFloat(this.lotTrackingModel1.unskewedbal);

      } else if (currentRow.value.status === '2') {
        // Unskewed
        // if (currentRow.value.skewed === '') {
        //   this.lotTrackingModel1.unskewedbal  = parseFloat(this.lotTrackingModel1_copy.unskewedbal) + parseFloat(currentRow.value.credit) ;
        //   this.lotTrackingModel1.unskewedassigned = parseFloat(this.lotTrackingModel1_copy.unskewedassigned) - parseFloat(currentRow.value.credit);
        // }
        // A Bud
        if (currentRow.value.skewed === '1') {
          this.lotTrackingModel1.budbal  = parseFloat(this.lotTrackingModel1_copy.budbal) + parseFloat(currentRow.value.credit);
          this.lotTrackingModel1.budassigned = parseFloat(this.lotTrackingModel1_copy.budassigned);
        }
        // B Joints
        if (currentRow.value.skewed === '2') {
          this.lotTrackingModel1.jointsbal  = parseFloat(this.lotTrackingModel1_copy.jointsbal) + parseFloat(currentRow.value.credit);
          this.lotTrackingModel1.jointsassigned = parseFloat(this.lotTrackingModel1_copy.jointsassigned);
        }
        // C Oil
        if (currentRow.value.skewed === '3') {
          this.lotTrackingModel1.oilbal  = parseFloat(this.lotTrackingModel1_copy.oilbal) + parseFloat(currentRow.value.credit);
          this.lotTrackingModel1.oilassigned = parseFloat(this.lotTrackingModel1_copy.oilassigned);
        }
        // D Wate
        if (currentRow.value.skewed === '4') {
          this.lotTrackingModel1.wastebal  = parseFloat(this.lotTrackingModel1_copy.wastebal) + parseFloat(currentRow.value.credit);
          this.lotTrackingModel1.wasteassigned = parseFloat(this.lotTrackingModel1_copy.wasteassigned);
        }

         // Unskewed
         if (currentRow.value.task === '2') {
          this.lotTrackingModel1.unskewedbal  = parseFloat(this.lotTrackingModel1_copy.unskewedbal) + parseFloat(currentRow.value.credit);
          this.lotTrackingModel1.unskewedassigned =
              parseFloat(this.lotTrackingModel1_copy.unskewedassigned) - parseFloat(currentRow.value.credit);
         } else {
          this.lotTrackingModel1.unskewedbal  = this.positiveValue(parseFloat(this.lotTrackingModel1_copy.unskewedbal) - parseFloat(currentRow.value.credit));
          this.lotTrackingModel1.unskewedassigned =
              this.positiveValue(parseFloat(this.lotTrackingModel1_copy.unskewedassigned) - parseFloat(currentRow.value.credit));
         }

      }
    } else if ((currentRow.value.task === '4' || currentRow.value.task === '5')) {

      if (currentRow.value.status === '1') {
        // Unskewed
        this.lotTrackingModel1.budbal  = parseFloat(this.lotTrackingModel1_copy.budbal) - parseFloat(currentRow.value.debit) ;
        this.lotTrackingModel1.budassigned = parseFloat(this.lotTrackingModel1_copy.budbal) - parseFloat(this.lotTrackingModel1.budbal);

      } else if (currentRow.value.status === '2') {
        // A Bud
        if (currentRow.value.skewed === '1') {
          this.lotTrackingModel1.budbal  = parseFloat(this.lotTrackingModel1_copy.budbal) + parseFloat(currentRow.value.credit);
          this.lotTrackingModel1.budassigned = parseFloat(this.lotTrackingModel1_copy.budassigned);
        }
        // B Joints
        if (currentRow.value.skewed === '2') {
          this.lotTrackingModel1.jointsbal  = parseFloat(this.lotTrackingModel1_copy.jointsbal) + parseFloat(currentRow.value.credit);
          this.lotTrackingModel1.jointsassigned = parseFloat(this.lotTrackingModel1_copy.jointsassigned);
        }
        // C Oil
        if (currentRow.value.skewed === '3') {
          this.lotTrackingModel1.oilbal  = parseFloat(this.lotTrackingModel1_copy.oilbal) + parseFloat(currentRow.value.credit);
          this.lotTrackingModel1.oilassigned = parseFloat(this.lotTrackingModel1_copy.oilassigned);
        }
        // D Wate
        if (currentRow.value.skewed === '4') {
          this.lotTrackingModel1.wastebal  = parseFloat(this.lotTrackingModel1_copy.wastebal) + parseFloat(currentRow.value.credit);
          this.lotTrackingModel1.wasteassigned = parseFloat(this.lotTrackingModel1_copy.wasteassigned);
        }

         // Unskewed
         if (currentRow.value.task === '2') {
          this.lotTrackingModel1.unskewedbal  = parseFloat(this.lotTrackingModel1_copy.unskewedbal) + parseFloat(currentRow.value.credit);
          this.lotTrackingModel1.unskewedassigned =
              parseFloat(this.lotTrackingModel1_copy.unskewedassigned) - parseFloat(currentRow.value.credit);
         } else {
          this.lotTrackingModel1.unskewedbal  = this.positiveValue(parseFloat(this.lotTrackingModel1_copy.unskewedbal) - parseFloat(currentRow.value.credit));
          this.lotTrackingModel1.unskewedassigned =
              this.positiveValue(parseFloat(this.lotTrackingModel1_copy.unskewedassigned) - parseFloat(currentRow.value.credit));
         }
      }

    } else if ((currentRow.value.task === '6' || currentRow.value.task === '7' || currentRow.value.task === '8' || currentRow.value.task === '9')) {

      if (currentRow.value.status === '1') {
        // Joints
        this.lotTrackingModel1.jointsbal  = parseFloat(this.lotTrackingModel1_copy.jointsbal) - parseFloat(currentRow.value.debit) ;
        this.lotTrackingModel1.jointsassigned = parseFloat(this.lotTrackingModel1_copy.jointsbal) - parseFloat(this.lotTrackingModel1.jointsbal);

      } else if (currentRow.value.status === '2') {

        // A Bud
        if (currentRow.value.skewed === '1') {
          this.lotTrackingModel1.budbal  = parseFloat(this.lotTrackingModel1_copy.budbal) + parseFloat(currentRow.value.credit);
          this.lotTrackingModel1.budassigned = parseFloat(this.lotTrackingModel1_copy.budassigned);
        }
        // B Joints
        if (currentRow.value.skewed === '2') {
          this.lotTrackingModel1.jointsbal  = parseFloat(this.lotTrackingModel1_copy.jointsbal) + parseFloat(currentRow.value.credit);
          this.lotTrackingModel1.jointsassigned = parseFloat(this.lotTrackingModel1_copy.jointsassigned);
        }
        // C Oil
        if (currentRow.value.skewed === '3') {
          this.lotTrackingModel1.oilbal  = parseFloat(this.lotTrackingModel1_copy.oilbal) + parseFloat(currentRow.value.credit);
          this.lotTrackingModel1.oilassigned = parseFloat(this.lotTrackingModel1_copy.oilassigned);
        }
        // D Wate
        if (currentRow.value.skewed === '4') {
          this.lotTrackingModel1.wastebal  = parseFloat(this.lotTrackingModel1_copy.wastebal) + parseFloat(currentRow.value.credit);
          this.lotTrackingModel1.wasteassigned = parseFloat(this.lotTrackingModel1_copy.wasteassigned);
        }

        // Unskewed
        if (currentRow.value.task === '2') {
          this.lotTrackingModel1.unskewedbal  = parseFloat(this.lotTrackingModel1_copy.unskewedbal) + parseFloat(currentRow.value.credit);
          this.lotTrackingModel1.unskewedassigned =
              parseFloat(this.lotTrackingModel1_copy.unskewedassigned) - parseFloat(currentRow.value.credit);
         } else {
          this.lotTrackingModel1.unskewedbal  = this.positiveValue(parseFloat(this.lotTrackingModel1_copy.unskewedbal) - parseFloat(currentRow.value.credit));
          this.lotTrackingModel1.unskewedassigned =
              this.positiveValue(parseFloat(this.lotTrackingModel1_copy.unskewedassigned) - parseFloat(currentRow.value.credit));
         }
      }

    }
    // alert(formModel.controls.get('debit'));
  }
  positiveValue(num) {
    return Math.max(0, num);
  }

  onSubmit(formModel) {

  }
}
