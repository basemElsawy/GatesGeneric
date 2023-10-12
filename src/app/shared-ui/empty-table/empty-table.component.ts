import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-table',
  templateUrl: './empty-table.component.html',
  styleUrls: ['./empty-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyTableComponent implements OnInit {
  @Input() isEmpty!: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
