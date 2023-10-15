import { Component, OnInit } from '@angular/core';
import { SideRoutes } from 'src/app/Classes/sideRoutes';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  SideRoutes = SideRoutes;
  constructor() {}

  ngOnInit(): void {
    console.log(SideRoutes);
  }
}
