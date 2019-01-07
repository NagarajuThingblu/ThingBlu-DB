import { UserModel } from './../../../../shared/models/user.model';
import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
// import { CookieService } from 'ngx-cookie-service';

@Component({
  moduleId: module.id,
  selector: 'app-lot-note-icon',
  templateUrl: 'lot-note-icon.component.html'
})
export class LotNoteIconComponent implements OnInit {

  @Input() LotId: number;
  // @Input() LotCommentsCount: number;
  @Output() NoteIconClicked: EventEmitter<any> = new EventEmitter<any>();

  public _cookieService: any;

  // constructor(
  //   private cookieService: CookieService,
  // ) {
  //   this._cookieService = this.appCommonService.getUserProfile();
  // }

  ngOnInit() {
// console.log('icon lot', this.LotId);
// console.log('icon LotCommentsCount', this.LotCommentsCount);
  }

  onNoteIconClick() {
    this.NoteIconClicked.emit(this.LotId);
  }

}
