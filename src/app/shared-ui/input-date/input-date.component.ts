import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDateComponent implements OnInit {
  @Input() Type!: string;
  @Input() Placeholder!: string;
  @Input() FormConterName!: string | number;
  @Input() InputClass!: string;
  @Input() Id!: string | number;
  @Input() FormParent!: FormGroup;
  @Input() disable: boolean = false;
  @Input() isClicked!: boolean; // allow on click Function
  @Input() isChanges!: boolean; // allow in change function
  @Input() icon?: string;
  @Input() Lang?: string;
  @Input() Min!: string;
  @Input() Max!: string;
  @Output() callBack: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    this.toggleEditablity();
  }

  toggleEditablity() {
    if (this.disable) {
      this.FormParent &&
        this.FormConterName &&
        this.FormParent.controls[this.FormConterName].disable();
    } else {
      this.FormParent &&
        this.FormConterName &&
        this.FormParent.controls[this.FormConterName].enable();
    }
  }
  handleOnClick(value: any) {
    this.callBack.emit(value.traget.value);
  }

  handleOnChange(value: any) {
    this.callBack.emit(value.traget.value);
  }
}
