import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorView } from 'src/app/classes/ErrorView';
import { RequestService } from 'src/app/https/request.service';
import { Gates } from 'src/app/Interfaces/Gates';
import { Vehicle } from 'src/app/Interfaces/vehicle';
import { LangService } from 'src/app/shared-serviceses/Lang.service';

@Component({
  selector: 'app-subscription-prices',
  templateUrl: './subscription-prices.component.html',
  styleUrls: ['./subscription-prices.component.css'],
})
export class SubscriptionPricesComponent implements OnInit {
  subscriptionPrices!: FormGroup;
  FetchedData: any[] = [];
  holdListOfGates: Gates[] = [];
  holdListOfCars: Vehicle[] = [];
  constructor(
    protected lang: LangService,
    private apiService: RequestService,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.subscriptionPrices = this._formBuilder.group({
      subscriptionType: [null, Validators.required],
      carClasses: [null, Validators.required],
      gates: [null, Validators.required],
      price: [null, Validators.required],
    });
    this.getListOfCars();
    this.getListOfgates();
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

  getListOfCars() {
    this.apiService.GetMethodWithPipe('car/').subscribe({
      next: (res: any) => {
        this.holdListOfCars = res;
      },
      error: (error: any) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      },
    });
  }

  getListOfgates() {
    this.apiService.GetMethodWithPipe('roads/gates/').subscribe({
      next: (res: any) => {
        this.holdListOfGates = res;
      },
      error: (error: any) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      },
    });
  }

  holdDataSubsecriptionResults: any[] = [];
  showGateResults!: boolean;
  showPriceData(ev: any) {
    if (ev.target != undefined) {
      let gate_id = ev.target.value;
      this.apiService
        .GetMethodWithPipe(
          `subscriptions/gate_subscription_price/?gate_id=${gate_id}`
        )
        .subscribe({
          next: (res: any) => {
            this.holdDataSubsecriptionResults = res;
            if (res) {
              this.showGateResults = true;
            } else {
              this.showGateResults = false;
            }
          },
          error: (error: any) => {
            let errorz = new ErrorView(this.toastr);
            errorz.showError(error);
          },
        });
    } else {
      let gate_id = this.subscriptionPrices.controls['gates'].value;
      this.apiService
        .GetMethodWithPipe(
          `subscriptions/gate_subscription_price/?gate_id=${gate_id}`
        )
        .subscribe({
          next: (res: any) => {
            this.holdDataSubsecriptionResults = res;
            if (res) {
              this.showGateResults = true;
            } else {
              this.showGateResults = false;
            }
          },
          error: (error: any) => {
            let errorz = new ErrorView(this.toastr);
            errorz.showError(error);
          },
        });
    }
  }
  holdListOfPrices: any[] = [];
  addSubscriptionPrice() {
    let body = {
      gate_id: this.subscriptionPrices.controls['gates'].value,
      subscription_type:
        this.subscriptionPrices.controls['subscriptionType'].value,
      car_class_id: this.subscriptionPrices.controls['carClasses'].value,
      price: this.subscriptionPrices.controls['price'].value,
    };
    this.apiService
      .PostMethodWithPipe('subscriptions/gate_subscription_price/', body)
      .subscribe({
        next: (res: any) => {
          this.toastr.success('تم اضافة سعر الاشتراك بنجاح');
          this.showPriceData(body.gate_id);
        },
        error: (error: any) => {
          let errorz = new ErrorView(this.toastr);
          errorz.showError(error);
        },
      });
  }
}
