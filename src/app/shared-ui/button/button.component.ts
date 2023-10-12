import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent implements OnInit {


  @Input() btnClass!: string;
  @Input() btnText!: string;
  @Input() fontAwesomeClass?: string;
  @Input() disable?: any;
  @Output() CallBack: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
    console.log(this.disable)
  }

  handleBtnEvent() {
    this.CallBack.emit('click')
  }

}
