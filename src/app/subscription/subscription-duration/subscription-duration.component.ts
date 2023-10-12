import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/https/request.service';
import { LangService } from 'src/app/shared-serviceses/Lang.service';

@Component({
  selector: 'app-subscription-duration',
  templateUrl: './subscription-duration.component.html',
  styleUrls: ['./subscription-duration.component.css'],
})
export class SubscriptionDurationComponent implements OnInit {
  durationTypes: any[] = [];
  FetchedData: any[] = [];

  subscriptionDuration!: FormGroup;

  constructor(
    protected lang: LangService,
    private apiService: RequestService,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.durationTypes = [
      { id: 1, name: 'Y' },
      { id: 2, name: 'D' },
      { id: 3, name: 'M' },
      { id: 4, name: 'W' },
    ];

    this.subscriptionDuration = this._formBuilder.group({
      duration_time: [null, Validators.required],
      duration_type: [null, Validators.required],
    });
    this.getallSubscriptions();
  }

  getCurrentLanguage(): string {
    let langWeb = this.lang.getcurrentLange().getValue();
    return langWeb;
  }

  getallSubscriptions() {
    this.apiService
      .GetMethodWithPipe('subscriptions/subscription_duration_type/')
      .subscribe(
        (data) => {
          if (data) {
            this.FetchedData = data;
          }
        },
        (error) => {
          this.toastr.error(error);
        }
      );
  }

  addSubscriptionDuration() {
    let body = {
      duration: this.subscriptionDuration.controls['duration_time'].value,
      duration_type: this.subscriptionDuration.controls['duration_type'].value,
    };
    this.apiService
      .PostMethodWithPipe('subscriptions/subscription_duration_type/', body)
      .subscribe(
        (data) => {
          this.toastr.success('تم اضافة مدة الاشتراك بنجاح');
          this.getallSubscriptions();
          this.subscriptionDuration.reset();
        },
        (error) => {
          this.toastr.error('يوجد خطأ في البيانات المرسلة');
        }
      );
  }
}
