import { Component, OnInit } from '@angular/core';
import{LoaderService}from '../../../shared/services/loader.service';

@Component({
  selector: 'app-rooms-tables',
  templateUrl: './rooms-tables.component.html',
  styleUrls: ['./rooms-tables.component.css']
})
export class RoomsTablesComponent implements OnInit {

  constructor(private loaderservice:LoaderService) { }

  ngOnInit() {
    this.loaderservice.display(false);
  }

}
