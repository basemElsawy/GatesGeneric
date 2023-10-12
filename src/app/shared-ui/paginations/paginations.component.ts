import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paginations',
  templateUrl: './paginations.component.html',
  styleUrls: ['./paginations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationsComponent implements OnInit {
  @Input() pageSize: number = 10
  @Input() maxSize: number = 5;
  @Input() collectionSize = 0;
  @Input() page = 1;
  @Output() callBackk: EventEmitter<any> = new EventEmitter<any>()
  constructor() { }

  ngOnInit(): void {
  }


  apiURl() {

    this.callBackk.emit(this.page)
  }
}
