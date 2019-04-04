import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  constructor(
    private loaderService: LoaderService,
    private titleService: Title,

  ) {
   }

  ngOnInit() {
    this.loaderService.display(false);
    this.titleService.setTitle('Employees');
  }

}
