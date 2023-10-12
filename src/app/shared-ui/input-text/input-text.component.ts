import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { toBase64 } from 'src/app/classes/convertFilebase64';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent implements OnInit {
  @Input() Type!: string;
  @Input() Placeholder!: string;
  @Input() inputmax!: string;
  @Input() FormConterName!: string | number;
  @Input() InputClass!: string;
  @Input() isFile: boolean = false;
  @Input() Id!: string | number;
  @Input() FormParent!: FormGroup;
  @Input() userValue?: string;
  @Input() disable: boolean = false;
  @Input() isClicked!: boolean; // allow on click Function
  @Input() isChanges!: boolean; // allow in change function
  @Input() isFocused!: boolean; // allow focused function
  @Input() icon?: string;
  @Input() Lang?: string;
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
    this.callBack.emit(value.target.value);
  }

  handleOnChange(value: any) {
    if (this.isFile == true) {
      let x = this.handleFile(value);
    } else {
      this.callBack.emit(value.target.value);
    }
  }

  handleOnFocus(value: any) {
    this.callBack.emit(value.target.value);
  }

  async handleFile(event: any) {
    let file = await toBase64(event.target.files[0]);
    this.callBack.emit(file);
  }
}
