import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-checkbox',
  templateUrl: './input-checkbox.component.html',
  styleUrls: ['./input-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputCheckboxComponent implements OnInit {
  @Input() Placeholder!: string;
  @Input() ParentForm!: FormGroup;
  @Input() FormConterName!: string;
  @Input() Class!: string;
  @Input() isChanges!: boolean;
  @Output() callBack: EventEmitter<any> = new EventEmitter<any>()
  constructor() { }

  ngOnInit(): void {
  }

  handleOnChange(event: Event): void {
    this.callBack.emit(event);
  }
}
