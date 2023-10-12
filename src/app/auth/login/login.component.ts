import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/https/request.service';
import { Lane } from 'src/app/Interfaces/Lane';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  private currentLang!: string;
  holdListOfFilterData: Lane[] = [];
  constructor(
    private translate: TranslateService,
    protected lang: LangService,
    private router: Router,
    private apiService: RequestService,
    private loginService: ServicesService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.initalForm();
    if (localStorage.getItem('token')) {
      this.loginService.toDashboard();
    }
  }
  initalForm() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      lane_id: new FormControl(null),
      open_shift: new FormControl(false),
      subscription_shift: new FormControl(false),
    });
  }

  get f() {
    return this.loginForm as FormGroup;
  }
  get serName() {
    return this.f?.controls['username'] as FormControl;
  }
  get password() {
    return this.f?.controls['password'] as FormControl;
  }
  get open_shift() {
    return this.f?.controls['open_shift'] as FormControl;
  }

  get subscription_shift() {
    return this.f?.controls['subscription_shift'] as FormControl;
  }
  handleLaneChange(val: any) {}
  handleInputCallback(val: any) {}

  handleButtonEvent(btnEvent: any) {
    if (!this.f.invalid) {
      this.loginService.login(this.f.getRawValue());
      // this.router.navigate(['/View/BasicData/Roads']);
    } else {
      this.toaster.error('برجاء ادخال  اسم المستخدم او كلمة المرور');
    }
  }
  getListOfRoads() {
    this.apiService.GetMethodWithPipe('roads/lane/').subscribe({
      next: (res: any) => {
        this.holdListOfFilterData = res;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  choosedsetsubscription_shift: any;
  setsubscription_shift(event: any) {
    this.choosedsetsubscription_shift = this.subscription_shift.setValue(
      (event.target as HTMLInputElement).checked
    );

    // this.open_shift.setValue(true);
  }

  handleUserAdminValdation(event: any) {
    this.open_shift.setValue((event.target as HTMLInputElement).checked);
    // console.log((event.target as HTMLInputElement).checked)
  }
}
