import { Component, OnInit, Input } from '@angular/core';
import { AppConstants } from '../../models/app.constants';

@Component({
  selector: 'app-characters-count',
  templateUrl: './characters-count.component.html',
  styleUrls: ['./characters-count.component.css']
})
export class CharactersCountComponent implements OnInit {

  @Input() ControlLength = AppConstants.defaultTextAreaLength;
  @Input() elementRef;
  constructor() { }

  ngOnInit() {
  }
}
