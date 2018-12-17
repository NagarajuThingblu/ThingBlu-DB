import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from './../../models/question-base';

@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html'
})
export class DynamicFormQuestionComponent implements OnInit {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;
  @Input() showLable: Boolean = true;

  ngOnInit() {
    console.log('new group');
    console.log(this.form);
  }
   get isValid() { return (!this.form.controls[this.question.key].valid && this.form.controls[this.question.key].dirty); }
}
