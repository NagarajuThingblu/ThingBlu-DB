import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-brand-strain-lots',
  templateUrl: './brand-strain-lots.component.html'
})
export class BrandStrainLotsComponent implements OnInit {

  @Input() completeParamArr: FormArray;
  @Input() BrandStrainLots;
  @Input() rowIndex: number;
  @Input() ParentFormGroup: FormGroup;

  public formGroup: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {

    // console.log(this.completeParamArr);
console.log(this.ParentFormGroup);
    // console.log(this.getFormGroup().controls.push());

    // console.log((this.completeParamArr.controls[this.rowIndex] as FormGroup).controls['LotDetails']);

    this.BrandStrainLots.forEach((object, index) => {
      // this.formGroup.addControl('lotno', new FormControl());
      // const control = [null, [Validators.required]];

      this.getFormGroup().push(this.createItem(object, index));
    });

    // this.BrandStrainLots.forEach((element, index) => {
    //   this.completeParamArr.push(this.fb.array(this.completionParameters.map(this.GenerateCompletionParams(this.fb))
    // });
  }

  createItem(object, index): FormGroup {
    return this.fb.group({
      lotno: new FormControl(null, [Validators.required]),
    });
}

get budOrderPackets(): FormArray {
  return this.completeParamArr.get('budOrderPackets') as FormArray;
}

   getFormGroup(): FormArray {
    return (this.completeParamArr.controls[this.rowIndex] as FormGroup).controls['LotDetails'] as FormArray;
  }

}
