import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TaskCommonService } from '../services/task-common.service';

@Injectable()
export class TaskResolver implements Resolve<any> {
  constructor(
    private taskCommonService: TaskCommonService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.taskCommonService.getTaskDetailsByTask(route.params.id);
  }
}
