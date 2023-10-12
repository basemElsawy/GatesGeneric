import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-error-input',
  templateUrl: './error-input.component.html',
  styleUrls: ['./error-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorInputComponent implements OnInit {

  @Input() FormParent!: FormGroup;
  @Input() FormConterName!: string | number;
  @Input() Lang!: string;

  constructor() { }

  ngOnInit(): void {
    this.FormParent.controls[this.FormConterName]
  }

  get f() {
    return this.FormParent?.controls
  }

}
