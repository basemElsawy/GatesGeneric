import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nfound',
  templateUrl: './nfound.component.html',
  styleUrls: ['./nfound.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
