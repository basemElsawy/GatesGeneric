import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { ErrorView } from 'src/app/classes/ErrorView';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import { LoaderService } from 'src/app/shared-serviceses/Loader.service';
import { ControlModelService } from 'src/app/shared-serviceses/Model/control-model.service';
import { RequestService } from '../../https/request.service';
@Component({
  selector: 'app-shift-details',
  templateUrl: './shift-details.component.html',
  styleUrls: ['./shift-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShiftDetailsComponent implements OnInit {
  username: any;
  ShiftData: any;
  Fullname: any;
  isLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  Payment!: FormGroup;
  adminAuth!: FormGroup;
  updateApi: EventEmitter<any> = new EventEmitter();
  constructor(
    protected lang: LangService,
    private modelService: ControlModelService,
    private service: RequestService,
    private loaderService: LoaderService,
    private toastr: ToastrService
  ) {
    this.username = JSON.parse(
      localStorage.getItem('shiftInfio') || '{}'
    ).user_id;
    console.log(this.username);

    this.Fullname =
      this.username.first_name +
      ' ' +
      this.username.middle_name +
      ' ' +
      this.username.last_name;

    this.GetReportData();
  }

  ngOnInit(): void {
    this.getCurrentLanguage();
    this.inialForms();
  }
  getCurrentLanguage(): string {
    let langWeb = this.lang.getcurrentLange().getValue();
    return langWeb;
  }
  inialForms() {
    this.Payment = new FormGroup({
      amount: new FormControl(0, Validators.required),
    });
    this.adminAuth = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }
  handlListOfData(resData: any) {}

  handleInputCallback(inputValue: any) {}

  submitRequest() {
    this.adminAuth.reset();
    this.modelService.setNewMode();
  }
  closeShift() {}

  holdUserInfo: any;
  payamAmount: any;
  submitManger() {
    const body = {
      shift_dediction_amount: this.Payment.controls.amount.value,
      username: this.adminAuth.controls.username.value,
      password: this.adminAuth.controls.password.value,
      action_user: 1,
      shift_id: JSON.parse(localStorage.getItem('shiftInfio') || '{}').shift_id,
    };
    this.service.PostMethodWithPipe('shifts/shift_dedictions/', body).subscribe(
      (data) => {
        this.holdUserInfo = data;
        this.modelService.closeModel('success');
        this.payamAmount = this.Payment.controls.amount.value;
        setTimeout(() => {
          window.print();
          return false;
        }, 20);

        // this.modelService.close()
      },
      (error) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      }
    );
    // if (this.adminAuth.invalid) return;
    // if (this.Payment.invalid) return;
    // this.modelService.closeModel('success')
    // this.isLogin.next(true);
  }

  collectMoney() {
    this.Payment.reset();
    this.isLogin.next(false);
  }

  //here is the function needed to get data for specific report
  ShiftSubtraction: any;
  GetReportData() {
    this.service
      .GetMethodWithPipe(
        `shifts/shift_details/?shift_id=${
          JSON.parse(localStorage.getItem('shiftInfio') || '').shift_id
        }`
      )
      .subscribe(
        (data) => {
          this.ShiftData = data;
          this.ShiftSubtraction =
            data.shift_revenue - data.shift_dediction_total;
        },
        (error) => {
          this.loaderService.hide();
          let errorz = new ErrorView(this.toastr);
          errorz.showError(error);
        }
      );
  }
}
