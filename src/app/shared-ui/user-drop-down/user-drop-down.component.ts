import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from 'src/app/auth/services/services.service';

@Component({
  selector: 'app-user-drop-down',
  templateUrl: './user-drop-down.component.html',
  styleUrls: ['./user-drop-down.component.scss'],
})
export class UserDropDownComponent implements OnInit {
  showList: boolean = false;
  @Output() roleType: EventEmitter<string> = new EventEmitter();
  @Output() toggleOpen: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isCollapsed: boolean = true;
  constructor(private router: Router, private auth: ServicesService) {}
  userData: any = localStorage.getItem('userData');
  name: any = JSON.parse(this.userData)?.name;
  img: any = JSON.parse(this.userData)?.img;
  role: any = JSON.parse(this.userData)?.role;

  ngOnInit(): void {}
  changeRole(type: string) {
    this.roleType.emit(type);
    this.toggleOpen.emit(!!type);
  }

  // logout() {
  //   debugger;
  //   if (localStorage.getItem('subscription_shift') == 'true') {
  //     this.router.navigate(['shiftreports']);
  //     return;
  //   }
  //   this.auth.clearLocalStorage();
  // }

  logout() {
    if (localStorage.getItem('subscription_shift') == 'true') {
      this.router.navigate(['shiftreports']);
      return;
    }
    this.auth.clearLocalStorage();
  }
  tellParent() {
    this.toggleOpen.emit(this.isCollapsed);
    console.log(this.isCollapsed);
  }
}
