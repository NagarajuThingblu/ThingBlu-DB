import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { QuestionBase } from './../models/question-base';

@Injectable()
export class QuestionControlService {
  constructor() { }

  toFormGroup(questions: QuestionBase<any>[] ) {
    // tslint:disable-next-line:prefer-const
    let group: any = {};

    questions.forEach(question => {
      group[question.key] = question.required ? new FormControl(question.value || 0, Validators.required)
                                              : new FormControl(question.value || 0);
    });
    return new FormGroup(group);
  }

  toFormGroupWithoutValidation(questions: QuestionBase<any>[] ) {
    // tslint:disable-next-line:prefer-const
    let group: any = {};

    questions.forEach(question => {
      group[question.key] = question.required ? new FormControl(question.value || 0)
                                              : new FormControl(question.value || 0);
    });
    return new FormGroup(group);
  }
}
