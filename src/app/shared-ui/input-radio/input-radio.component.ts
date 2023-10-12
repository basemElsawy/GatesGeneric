import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-radio',
  templateUrl: './input-radio.component.html',
  styleUrls: ['./input-radio.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputRadioComponent implements OnInit {
  @Input() Placeholder!: string;
  @Input() ParentForm!: FormGroup;
  @Input() FormConterName!: string;
  @Input() Class!: string;
  @Input() isChanges!: boolean;
  @Input() Value!: string;
  @Output() callBack: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  handleOnChange(event: Event): void {
    this.callBack.emit(event);
  }
}
