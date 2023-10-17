import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from 'src/app/auth/services/services.service';
import { ShiftInfo } from 'src/app/Interfaces/shiftInfo';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor(private auth: ServicesService, private router: Router) {}
  isHidden: boolean = true;
  shiftInfp!: ShiftInfo;
  ngOnInit() {
    // if (localStorage.getItem('shiftInfio')) {
    //   let data = localStorage.getItem('shiftInfio');
    //   this.shiftInfp = JSON.parse(data ? data : '');
    // }
  }

  navigateToShiftDetails() {
    // this.router.navigate(['./UserTOM/shiftDetails']);
  }

  logout() {
    // let body = {};
    // this.isHidden = false;
    // this.auth.clearLocalStorage('close');
  }
}
