import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListOfDataKey } from 'src/app/Interfaces/ListOfDataKeys';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit, OnChanges {
  @Input() isHidden: boolean = true;
  @Input() tableClass!: string;
  @Input() tableHeaderList!: any;
  @Input() listofObject!: ListOfDataKey[]; //model object key
  @Input() tableBodyList!: any; //incoming data
  @Input() tableHeadderClass?: string;
  @Input() isEditable: boolean = false;
  @Input() isDeleteble: boolean = false;
  @Input() isAdding: boolean = false;
  @Input() isShowing: boolean = false;
  @Input() isViewed: boolean = false;
  @Input() isList: boolean = false;
  @Output() callbackEdit: EventEmitter<any> = new EventEmitter();
  @Output() callbackDelete: EventEmitter<any> = new EventEmitter();
  @Output() callbackAdded: EventEmitter<any> = new EventEmitter();
  @Output() callbackShow: EventEmitter<any> = new EventEmitter();
  holdImgToView!: string;
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['tableBodyList'].currentValue?.length > 0) {
      this.tableBodyList = changes?.['tableBodyList'].currentValue;
    }
  }
  handleEitMode(rowData: any) {
    this.callbackEdit.emit(rowData);
  }

  handleDeleiteMode(rowData: any) {
    this.callbackDelete.emit(rowData);
  }

  handleAddMode(rowData: any) {
    this.callbackAdded.emit(rowData);
  }
  handleShowModel(rowData: any) {
    this.callbackShow.emit(rowData);
  }

  open(content: any, url: string) {
    this.holdImgToView = url;
    this.modalService.open(content, { size: 'lg', centered: true });
  }
}
