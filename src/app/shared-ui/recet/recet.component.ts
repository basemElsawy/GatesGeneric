import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, Subject } from 'rxjs';
import { ServicesService } from 'src/app/auth/services/services.service';

@Component({
  selector: 'app-recet',
  templateUrl: './recet.component.html',
  styleUrls: ['./recet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecetComponent implements OnInit {
  state$: any;

  state!: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    private service: ServicesService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      window.print();
    }, 1000);

    this.state$ = this.service.state.subscribe((state) => {
      this.state = state;
    });

    //  this.activatedRoute.paramMap.subscribe(params => {
    //   window.history.state
    //  })
    // this.state.subscribe(data => {
    //   debugger
    //   console.log(data)
    // })
  }
}
