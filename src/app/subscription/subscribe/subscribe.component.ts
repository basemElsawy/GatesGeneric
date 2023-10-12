import { Gates } from 'src/app/Interfaces/Gates';
import { LangService } from './../../shared-serviceses/Lang.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs';
import { RequestService } from 'src/app/https/request.service';
import { ErrorView } from 'src/app/classes/ErrorView';
import { ToastrService } from 'ngx-toastr';
import { Vehicle } from 'src/app/Interfaces/vehicle';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css'],
})
export class SubscribeComponent implements OnInit {
  userData!: FormGroup;
  DrivingLicensce!: FormGroup;
  categories!: FormGroup;
  FetchedData: any[] = [];
  durationTypes: any[] = [];
  holdListOfGates: Gates[] = [];
  holdListOfCars: Vehicle[] = [];
  subscriptionDuration!: FormGroup;
  subscriptionPrices!: FormGroup;
  searchFilter!: FormGroup;

  subscription_shift_details: any;
  constructor(
    protected lang: LangService,
    private apiService: RequestService,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.subscription_shift_details = JSON.parse(
      localStorage.getItem('subscriptions_shift_details') || ''
    );
    this.durationTypes = [
      { id: 1, name: 'Y' },
      { id: 2, name: 'D' },
      { id: 3, name: 'M' },
      { id: 4, name: 'W' },
    ];
    // this.userData = this._formBuilder.group({
    //   fullname: [
    //     null,
    //     [Validators.required, Validators.pattern('/^[a-zA-Z]+ [a-zA-Z]+$/')],
    //   ],
    //   subscription_start_date: [null, Validators.required],
    //   // licenceStartDate: [null, Validators.required],
    //   // licenceEndDate: [null, Validators.required],
    //   Commercialssn: [null, Validators.required],
    //   type_of_identification: [null, Validators.required],
    //   poi_number: [null, Validators.required],
    // });
    // this.DrivingLicensce = this._formBuilder.group({
    //   platteNumber: [null, Validators.required],
    //   motorNumber: [null, Validators.required],
    //   chaisseNumber: [null, Validators.required],
    //   car_Model: [null, Validators.required],
    //   model_date: [null, Validators.required],
    // });
    // this.categories = this._formBuilder.group({
    //   carCategories: [null, Validators.required],
    // });
    this.subscriptionDuration = this._formBuilder.group({
      duration_time: [null, Validators.required],
      duration_type: [null, Validators.required],
    });

    this.subscriptionPrices = this._formBuilder.group({
      subscriptionType: [null, Validators.required],
      carClasses: [null, Validators.required],
      gates: [null, Validators.required],
      price: [null, Validators.required],
    });

    this.searchFilter = this._formBuilder.group({
      searched_gates: [null, Validators.required],
    });
    this.getallSubscriptions();
    this.getListOfgates();
    this.getListOfCars();
  }

  getCurrentLanguage(): string {
    let langWeb = this.lang.getcurrentLange().getValue();
    return langWeb;
  }

  get fullname() {
    return this.userData.controls['fullname'];
  }

  get subscription_start_date() {
    return this.userData.controls['subscription_start_date'];
  }

  get Commercialssn() {
    return this.userData.controls['Commercialssn'];
  }

  get type_of_identification() {
    return this.userData.controls['type_of_identification'];
  }

  get poi_number() {
    return this.userData.controls['poi_number'];
  }

  get platteNumber() {
    return this.DrivingLicensce.controls['platteNumber'];
  }

  get motorNumber() {
    return this.DrivingLicensce.controls['motorNumber'];
  }

  get chaisseNumber() {
    return this.DrivingLicensce.controls['chaisseNumber'];
  }

  get car_Model() {
    return this.DrivingLicensce.controls['car_Model'];
  }

  get model_date() {
    return this.DrivingLicensce.controls['model_date'];
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
          this.toastr.success('تم اضافة الاضافة بنجاح');
          this.getallSubscriptions();
        },
        (error) => {
          this.toastr.error('يوجد خطأ في البيانات المرسلة');
        }
      );
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

  parsedPriceLists: any[] = [];
  fetchedPrices: any;
  setChoosedcarCat(ev: any) {
    this.parsedPriceLists = [];
    this.fetchedPrices = JSON.parse(
      localStorage.getItem('isSubscriptionPrices') || ''
    );
    this.fetchedPrices.forEach((element: any) => {
      if (ev.target.value == '2' && element.car_class_id.car_classe_id == 2) {
        this.parsedPriceLists.push({
          needed_id: element.id,
          id: element.car_class_id.car_classe_id,
          name: element.car_class_id.car_classe_Name_Ar,
          subscriptions: element.subscription_type,
          price: element.price,
        });
      } else if (
        ev.target.value == '3' &&
        element.car_class_id.car_classe_id == 3
      ) {
        this.parsedPriceLists.push({
          needed_id: element.id,
          id: element.car_class_id.car_classe_id,
          name: element.car_class_id.car_classe_Name_Ar,
          subscriptions: element.subscription_type,
          price: element.price,
        });
      } else if (
        ev.target.value == '4' &&
        element.car_class_id.car_classe_id == 4
      ) {
        this.parsedPriceLists.push({
          needed_id: element.id,
          id: element.car_class_id.car_classe_id,
          name: element.car_class_id.car_classe_Name_Ar,
          subscriptions: element.subscription_type,
          price: element.price,
        });
      } else if (
        ev.target.value == '5' &&
        element.car_class_id.car_classe_id == 5
      ) {
        this.parsedPriceLists.push({
          needed_id: element.id,
          id: element.car_class_id.car_classe_id,
          name: element.car_class_id.car_classe_Name_Ar,
          subscriptions: element.subscription_type,
          price: element.price,
        });
      }
    });
  }

  choosedPriceListCategory: any;
  setPriceChoosedlist(selected_item: any) {
    this.choosedPriceListCategory = selected_item;
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

  shownationalSSnType: boolean = false;
  choosedsubType(ev: any) {
    if (ev.target.value == 'P') {
      this.shownationalSSnType = true;
    } else {
      this.shownationalSSnType = false;
    }
  }

  setIdentificationNumber(): any {
    if (this.shownationalSSnType == true) {
      return 'P';
    } else {
      return 'C';
    }
  }

  setPOI_NumberofIdentification() {
    if (this.setIdentificationNumber() == 'P') {
      return (this.poiNumber = this.poi_number.value);
    } else {
      return (this.numberofIdentification = this.Commercialssn.value);
    }
  }

  poiNumber: any;
  numberofIdentification: any;
  addNewSubscription() {
    const body = {
      full_name: this.fullname.value,
      identification_number: this.setPOI_NumberofIdentification(),
      type_of_applicant: this.setIdentificationNumber(),
      plate_number: this.platteNumber.value,
      motor_number: this.motorNumber.value,
      body_number: this.chaisseNumber.value,
      car_model: this.car_Model.value,
      model_year: this.model_date.value,
      car_class_id: this.choosedPriceListCategory.id,
      subscription_shift_id:
        this.subscription_shift_details.subscription_shift_id,
      gates_subscription_prieces_id: this.choosedPriceListCategory.needed_id,
      price: this.choosedPriceListCategory.price,
      start_date: this.subscription_start_date.value,
      subscription_number: 111111111,
    };
    this.apiService
      .PostMethodWithPipe('subscriptions/subscribe/', body)
      .subscribe(
        (data) => {
          this.toastr.success('تم اضافة اشتراك جديد بنجاح');
          this.DrivingLicensce.reset();
          this.userData.reset();
          this.categories.reset();
        },
        (error) => {
          this.toastr.error('هناك خطأ برجاء المحاولة مرة اخري');
        }
      );
  }
}
