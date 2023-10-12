import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-inline-text',
  templateUrl: './inline-text.component.html',
  styleUrls: ['./inline-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineTextComponent implements OnInit {

  @Input() showValue!: string | number | undefined;
  @Input() Class!: string
  @Input() dir?: string;
  constructor() { }

  ngOnInit(): void {
  }

}
