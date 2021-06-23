import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';
@Component({
  selector: 'app-section-details',
  templateUrl: './section-details.component.html',
  styleUrls: ['./section-details.component.css']
})
export class SectionDetailsComponent implements OnInit {

  constructor(
    private loaderService: LoaderService,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.loaderService.display(false);
    }, 500);
  }

}
