import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { ErrorView } from 'src/app/classes/ErrorView';
import { RequestService } from 'src/app/https/request.service';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  isLoading = new BehaviorSubject(false);
  user = new BehaviorSubject(null);
  permissions = new BehaviorSubject(localStorage.getItem('permissions'));

  state = new BehaviorSubject<any>(null);

  constructor(
    private router: Router,
    private service: RequestService,
    private toastr: ToastrService
  ) {}

  login(userForm: any) {
    debugger;
    this.clearLocalStorage();
    this.isLoading.next(true);
    userForm;
    this.service.PostMethodWithPipe('user/login/', userForm).subscribe({
      next: (res: any) => {
        debugger;
        if (!localStorage.getItem('token'))
          localStorage.setItem('token', res?.token.token);
        localStorage.setItem('normal', userForm?.open_shift);
        localStorage.setItem('user', res?.job?.job_title_Ar);
        localStorage.setItem('shiftInfio', JSON.stringify(res.shift));
        localStorage.setItem('permissions', JSON.stringify(res?.permissions));
        localStorage.setItem('prices', JSON.stringify(res?.prices));
        localStorage.setItem('gates', JSON.stringify(res?.gate));
        // localStorage.setItem('lane_id', userForm?.lane_id);
        localStorage.setItem(
          'subscription_shift',
          userForm?.subscription_shift
        );
        localStorage.setItem(
          'isSubscriptionPrices',
          JSON.stringify(res.prices)
        );
        localStorage.setItem(
          'subscriptions_shift_details',
          JSON.stringify(res.shift)
        );
      },
      error: (err) => {
        this.isLoading.next(false);
        let errorz = new ErrorView(this.toastr);
        errorz.showError(err);
      },
      complete: () => {
        this.toastr.success('تم تسجيل الدخول بنجاح');
        this.toDashboard();
        this.isLoading.next(false);
      },
    });
  }

  ngOnInit(): void {}

  toDashboard() {
    let isAdmin = localStorage.getItem('normal');
    if (isAdmin == 'false') {
      this.router.navigate(['./View/BasicData/Roads']);
    } else {
      this.router.navigate(['./UserTOM/welcome']);
    }
  }

  clearLocalStorage(message?: string) {
    let isAdmin = localStorage.getItem('normal');
    let isSubscription = localStorage.getItem('subscription_shift');
    if (isAdmin != 'true' && isSubscription != 'true') {
      // localStorage.removeItem('token');
      // localStorage.removeItem('permissions');
      // localStorage.removeItem('user');
      // localStorage.removeItem('role');
      // localStorage.removeItem('shiftInfio');
      // localStorage.removeItem('normal');
      // localStorage.removeItem('subscription_shift');
      // localStorage.removeItem('isSubscriptionPrices');
      localStorage.clear();

      this.router.navigate(['./auth/login']);
    } else if (isAdmin != 'true' && isSubscription != 'false') {
      this.CloseShift();
    } else if (isAdmin != 'false' && isSubscription != 'true') {
      this.CloseShift();
    }

    // else (message) {
    //   this.CloseShift();
    // }
  }

  //here is the function needed to close shift and log out
  fetchedLaneId: any;
  fetchedsubscription: any;
  CloseShift() {
    // this.fetchedLaneId = localStorage.getItem('lane_id');
    let fetchedsubscription = localStorage.getItem('subscription_shift');
    let isAdmin = localStorage.getItem('normal');
    if (!isAdmin) return;
    let body = {
      open_shift: isAdmin == 'true' ? true : false,
      subscription_shift: fetchedsubscription == 'true' ? true : false,
      // lane_id: +this.fetchedLaneId,
    };
    this.service.PostMethodWithPipe('user/logout/', body).subscribe(
      (data) => {
        debugger;
        // localStorage.removeItem('token');
        localStorage.removeItem('permissions');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('shiftInfio');
        localStorage.removeItem('normal');
        localStorage.removeItem('subscription_shift');
        localStorage.removeItem('isSubscriptionPrices');

        this.state.next(data);

        //incase of user is TOM user
        if (isAdmin == 'true') {
          this.router.navigate(['./UserTOM/receit/'], { state: { data } });
        } else if (fetchedsubscription == 'true') {
          this.state.next(data);
        } else {
          this.router.navigate(['./auth/login']);
        }
      },
      (error) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      }
    );
  }
}
