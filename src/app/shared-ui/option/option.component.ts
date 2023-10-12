import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionComponent implements OnInit {

  @Input() returnKey!: string;
  @Input() viewKeyAr!: string;
  @Input() viewKeyEn!: string;
  @Input() listOfOptions: any;
  @Input() Lang!: string;
  constructor() { }

  ngOnInit(): void {
    this.Lang
    this.returnKey
    this.viewKeyAr
    this.viewKeyEn
    this.listOfOptions
  }

}
