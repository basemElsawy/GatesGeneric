import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputNumberComponent implements OnInit {

  @Input() Type!: string;
  @Input() Placeholder!: string;
  @Input() FormConterName!: string | number
  @Input() InputClass!: string
  @Input() Id!: string | number
  @Input() FormParent!: FormGroup
  @Input() disable: boolean = false;
  @Input() isClicked!: boolean; // allow on click Function
  @Input() isChanges!: boolean; // allow in change function
  @Input() icon?: string;
  @Input() Lang?: string;
  @Input() step!: string
  @Output() callBack: EventEmitter<any> = new EventEmitter<any>()
  constructor(private disNumber: DecimalPipe) { }

  ngOnInit(): void {
    this.toggleEditablity()
  }

  toggleEditablity() {
    if (this.disable) {
      this.FormParent && this.FormConterName && this.FormParent.controls[this.FormConterName].disable()
    } else {
      this.FormParent && this.FormConterName && this.FormParent.controls[this.FormConterName].enable()
    }
  }
  handleOnClick(value: any) {
    this.callBack.emit(value.traget.value)
  }

  handleOnChange(value: Event) {
    // let rgx = new RegExp(/^\d{0,18}\.?\d{0,2}$/g)
    let userValue = (value['target'] as HTMLInputElement).value

    // if (userValue.match(rgx)) {
    // this.FormParent.controls[this.FormConterName].setValue(this.disNumber.transform(userValue, '1.2-2'))
    // }
    this.callBack.emit((value['target'] as HTMLInputElement).value)
  }
}
