import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelComponent implements OnInit {
  @Input() LabelValue!: string
  @Input() LabelClass!: string
  @Input() LabelFor!: string
  constructor() { }

  ngOnInit(): void {
  }

}
