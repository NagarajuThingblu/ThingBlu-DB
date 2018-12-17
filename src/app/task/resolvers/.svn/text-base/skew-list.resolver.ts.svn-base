import { DropdownValuesService } from './../../shared/services/dropdown-values.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TaskCommonService } from '../services/task-common.service';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

@Injectable()
export class SkewListResolver implements Resolve<any> {
    private URL = './assets/api/question.json';
  constructor(
    private dropdownValuesService: DropdownValuesService,
    private _http: Http,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    // return this.dropdownValuesService.GetSkewListByClient();
    return this._http.get(this.URL)
    .map(this.extractData)
    .map( data => {
      return data.sort((a, b) => a.order - b.order);
    })
    .catch(this.handleError);
    // return Observable.of('Hello Alligator!').delay(2000);
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
