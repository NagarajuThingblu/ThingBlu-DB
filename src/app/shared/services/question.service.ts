import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DropdownQuestion } from './../models/question-dropdown';
import { QuestionBase } from './../models/question-base';
import { TextboxQuestion } from './../models/question-textbox';
import { DropdownValuesService } from './dropdown-values.service';
import { DataService } from './DataService.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Http, Response } from '@angular/http';

@Injectable()
export class QuestionService {

  public skewTypeList: any;
  data: any;
  questions: QuestionBase<any>[] = [];
  private URL = './assets/api/question.json';

  constructor(
    private dropdownValuesService: DropdownValuesService,
    private _http: Http,
  ) {

  }
  // TODO: get from a remote source of question metadata
  // TODO: make asynchronous

    load() {
      console.log(`++++++++++++ url: api/Skew/GetSkewListByClient`);
      return this._http.get( 'api/Skew/GetSkewListByClient?ClientId=1' )
          .map( res => res.json() );
          // .map( data => {
          //     this.data = data;
          //     return this.buildQuestions(data);
          // }
        // );
    }

    buildQuestions(data) {
      let questionsArr: QuestionBase<any>[];

      questionsArr = [];
      const obj = JSON.parse(JSON.stringify(Object.assign({}, data)));

      for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          const question = new TextboxQuestion();

          question.key = obj[prop].SkwTypeName + 'materialwt';
          question.label = obj[prop].SkwTypeName + ' Material Weight';
          // question.required = true;
          question.type = 'text';
          question.controlType = 'textbox';
          question.order = Number(prop) + 1;

          questionsArr.push(question);
        }
      }
      return questionsArr;
  }
  getQuestions() {

       // tslint:disable-next-line:prefer-const
    let questions: QuestionBase<any>[] = [

      // new DropdownQuestion({
      //   key: 'brave',
      //   label: 'Bravery Rating',
      //   options: [
      //     {key: 'solid',  value: 'Solid'},
      //     {key: 'great',  value: 'Great'},
      //     {key: 'good',   value: 'Good'},
      //     {key: 'unproven', value: 'Unproven'}
      //   ],
      //   order: 3
      // }),

      new TextboxQuestion({
        key: 'budmaterialwt',
        label: 'Bud Material Weight',
        required: true,
        type: 'text',
        order: 1
      }),

      new TextboxQuestion({
        key: 'jointsmaterialwt',
        label: 'Joints Material Weight',
        required: true,
        type: 'text',
        order: 2
      }),

      new TextboxQuestion({
        key: 'oilmaterialwt',
        label: 'Oil Material Weight',
        required: true,
        type: 'text',
        order: 3
      }),

      new TextboxQuestion({
        key: 'wastematerialwt',
        label: 'Waste Material Weight',
        required: true,
        type: 'text',
        order: 4
      })
    ];

    return questions.sort((a, b) => a.order - b.order);
  }

  getQuestionsSet(): Observable<any> {
    return this._http.get(this.URL)
    .map(this.extractData)
    .map( data => {
          return data.sort((a, b) => a.order - b.order);
      })
    .catch(this.handleError);
  }

  // private functions
  private extractData(res: Response) {
      const body = res.json();
      return body || {};
  }
  private handleError(error: any) {
      const errMsg = error.message || error.statusText || 'Server Error';
      console.log(errMsg);
      return Observable.throw(errMsg);
  }
}
