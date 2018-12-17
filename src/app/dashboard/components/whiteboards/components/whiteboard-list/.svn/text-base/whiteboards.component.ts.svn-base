import { Whiteboards } from './../../../../models/whiteboards.model';
import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-whiteboards',
  templateUrl: 'whiteboards.component.html',
  styleUrls: ['whiteboards.component.css']
})
export class WhiteboardsComponent implements OnInit {

  constructor() { }

  whiteboards: Whiteboards[] = [];

  ngOnInit() {

    this.whiteboards.push(
      { id: 1, name: 'Quarantine'},
      { id: 2, name: 'Trimming'},
      { id: 3, name: 'Sifting'},
      { id: 4, name: 'A Bud Processing'},
      { id: 5, name: 'B Joints Processing'},
      { id: 6, name: 'C Oil Processing'},
    );
  }

}
