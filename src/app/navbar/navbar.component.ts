import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from '../auth/services/services.service';
import { TitleServiceService } from '../shared-serviceses/title-service.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  Title: string = '';
  isHidden: boolean = true;
  constructor(private titleService: TitleServiceService, public service: ServicesService) {
    this.Title = titleService.title;



  }

  ngOnInit() {

  }

  goBack() {
    //fucntion body go here
  }
}
