import { Component, OnInit, Input } from '@angular/core';
import { AppConstants } from '../../models/app.constants';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pagination-counts',
  templateUrl: './pagination-counts.component.html',
  styleUrls: ['./pagination-counts.component.css']
})
export class PaginationCountsComponent implements OnInit {

  @Input() inputData: any;
  @Input() inputEvent: any;
  @Input() defaultPaginationRow: number = AppConstants.defaultPageRows;

  pageinationcount: any;

  constructor() { }

  ngOnInit() {
    if (!this.inputEvent) {
      this.inputEvent = {
        first: 0,
        rows: this.defaultPaginationRow
      };
    }
  }
}
