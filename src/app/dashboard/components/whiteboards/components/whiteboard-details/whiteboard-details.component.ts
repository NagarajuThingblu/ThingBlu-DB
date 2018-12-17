import { Component, OnInit } from '@angular/core';
import { Route, Router, ActivatedRoute } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-whiteboard-details',
  templateUrl: 'whiteboard-details.component.html',
  styleUrls: ['whiteboard-details.component.css']
})
export class WhiteboardDetailsComponent implements OnInit {

  whiteboardFlag: string;
  cols: any[];

  whiteboardData: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params.forEach((urlParams) => {
      this.whiteboardFlag = urlParams['flag'];
    });

    switch (this.whiteboardFlag) {
      case 'Quarantine': {
        this.cols = [
          {field: 'brand', header: 'Brand'},
          {field: 'strain', header: 'Strain'},
          {field: 'lotcount', header: 'Lot Count'},
          {field: 'totalweight', header: 'Total Weight'}
        ];
          this.whiteboardData = [{
            'brand': 'brand',
            'strain': 'strain',
            'lotcount': 'lotcount',
            'totalweight': 'totalweight'
          }];

          break;
      }
      case 'Trimming': {
        this.cols = [
          {field: 'brand', header: 'Brand'},
          {field: 'strain', header: 'Strain'},
          {field: 'lot', header: 'lot'},
          {field: 'wtfortrimming', header: 'Weight For Trimming'},
          {field: 'date', header: 'Date'}
        ];

        break;
      }
      case 'Sifting': {
        this.cols = [
          {field: 'brand', header: 'Brand'},
          {field: 'strain', header: 'Strain'},
          {field: 'lot', header: 'lot'},
          {field: 'wtforsifting', header: 'Weight For Sifting'},
          {field: 'date', header: 'Date'}
        ];

        break;
      }
      case 'A Bud Processing': {
        this.cols = [
          {field: 'brand', header: 'Brand'},
          {field: 'strain', header: 'Strain'},
          {field: 'lotcount', header: 'Lot Count'},
          {field: 'budweight', header: 'A Bud Weight'}
        ];
        break;
      }
      case 'B Joints Processing': {
        this.cols = [
          {field: 'vin', header: 'Vin'},
          {field: 'year', header: 'Year'},
          {field: 'brand', header: 'Brand'},
          {field: 'color', header: 'Color'}
        ];
        break;
      }
      case 'C Oil Processing': {
        this.cols = [
          {field: 'vin', header: 'Vin'},
          {field: 'year', header: 'Year'},
          {field: 'brand', header: 'Brand'},
          {field: 'color', header: 'Color'}
        ];
        break;
      }
      default: {
        break;
      }
    }

  }

}
