import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  constructor(
    private loaderService: LoaderService,
  ) {
   }

  ngOnInit() {
    this.loaderService.display(false);
  }

}
