import { Component, OnInit } from '@angular/core';
import{LoaderService}from '../../../shared/services/loader.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  constructor(private LoaderService:LoaderService) { }

  ngOnInit() {
    this.LoaderService.display(false);
  }

}
