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
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dp-single-select',
  templateUrl: './dp-single-select.component.html',
  styleUrls: ['./dp-single-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DpSingleSelectComponent implements OnInit, OnChanges {
  @Input() Placeholder!: string;
  @Input() FormConterName!: string | number;
  @Input() InputClass!: string;
  @Input() Id!: string | number;
  @Input() FormParent!: any;
  @Input() disable: boolean = false;
  @Input() isClicked!: boolean; // allow on click Function
  @Input() isChanges!: boolean; // allow in change function
  @Input() icon?: string;
  @Input() Options: any;
  @Input() Lang!: string;

  @Input() returnKey!: string;
  @Input() viewKeyAr!: string;
  @Input() viewKeyEn!: string;
  @Output() callBack: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    this.toggleEditablity();
  }

  toggleEditablity() {
    if (this.disable) {
      this.FormParent &&
        this.FormConterName &&
        this.FormParent?.controls[this.FormConterName]?.disable();
    } else {
      this.FormParent &&
        this.FormConterName &&
        this.FormParent?.controls[this.FormConterName]?.enable();
    }
  }
  handleOnClick(event: any) {
    this.callBack.emit((event.target as HTMLInputElement).value);
  }

  handleOnChange(event: any) {
    this.callBack.emit((event.target as HTMLInputElement).value);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.Options.currentValue?.length > 0) {
      this.Options = changes.Options.currentValue;
    }
  }
}
