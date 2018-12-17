import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-lot-comment',
  templateUrl: './lot-comment.component.html',
  styleUrls: ['./lot-comment.component.css']
})
export class LotCommentComponent {

  @Input() LotId: any;
  @Input() LotCommentsCount: any;
  @Input() styleClass: string;
  @Output() CommentIconClicked: EventEmitter<any> = new EventEmitter<any>();

  constructor(
  ) { }

  onLotCommentClick() {
    this.CommentIconClicked.emit(this.LotId);
  }
}
