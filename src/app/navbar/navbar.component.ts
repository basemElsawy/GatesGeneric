import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from '../auth/services/services.service';
import { TitleServiceService } from '../shared-serviceses/title-service.service';
import { ShiftInfo } from 'src/app/Interfaces/shiftInfo';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  Title: string = '';
  isHidden: boolean = true;
  shiftInfp!: ShiftInfo;
  constructor(
    private titleService: TitleServiceService,
    public service: ServicesService
  ) {
    this.Title = titleService.title;
  }

  ngOnInit() {
    if (localStorage.getItem('shiftInfio')) {
      let data = localStorage.getItem('shiftInfio');
      this.shiftInfp = JSON.parse(data ? data : '');
    }
  }

  goBack() {
    //fucntion body go here
  }
}
