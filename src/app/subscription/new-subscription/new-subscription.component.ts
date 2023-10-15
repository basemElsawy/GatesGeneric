import { Vehicle } from './../../Interfaces/vehicle';
import { RequestService } from './../../https/request.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LangService } from './../../shared-serviceses/Lang.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ErrorView } from 'src/app/classes/ErrorView';

@Component({
  selector: 'app-new-subscription',
  templateUrl: './new-subscription.component.html',
  styleUrls: ['./new-subscription.component.css'],
})
export class NewSubscriptionComponent implements OnInit {
  userData!: FormGroup;
  DrivingLicensce!: FormGroup;
  categories!: FormGroup;
  holdListOfCars: Vehicle[] = [];
  subscription_shift_details: any;

  constructor(
    protected lang: LangService,
    private apiService: RequestService,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    debugger;
    if (this.subscription_shift_details) {
      this.subscription_shift_details = JSON.parse(
        localStorage.getItem('subscriptions_shift_details') || ''
      );
    }
    this.userData = this._formBuilder.group({
      fullname: [
        null,
        [Validators.required, Validators.pattern('/^[a-zA-Z]+ [a-zA-Z]+$/')],
      ],
      subscription_start_date: [null, Validators.required],
      // licenceStartDate: [null, Validators.required],
      // licenceEndDate: [null, Validators.required],
      Commercialssn: [null, Validators.required],
      type_of_identification: [null, Validators.required],
      poi_number: [null, Validators.required],
      subscription_number: [null, Validators.required],
    });
    this.DrivingLicensce = this._formBuilder.group({
      platteNumber: [null, Validators.required],
      motorNumber: [null, Validators.required],
      chaisseNumber: [null, Validators.required],
      car_Model: [null, Validators.required],
      model_date: [null, Validators.required],
    });
    this.categories = this._formBuilder.group({
      carCategories: [null, Validators.required],
    });
    this.getListOfCars();
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

  shownationalSSnType: boolean = false;
  choosedsubType(ev: any) {
    if (ev.target.value == 'P') {
      this.shownationalSSnType = true;
    } else {
      this.shownationalSSnType = false;
    }
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

  setReadervalue(ev: any) {
    if (
      ev.target.value == null ||
      ev.target.value == '' ||
      ev.target.value == undefined
    ) {
      return;
    } else {
      this.userData.controls['subscription_number'].disable();
    }
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

  choosedPriceListCategory: any;
  setPriceChoosedlist(selected_item: any) {
    this.choosedPriceListCategory = selected_item;
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
      subscription_number: this.userData.controls['subscription_number'].value,
    };
    this.apiService
      .PostMethodWithPipe('subscriptions/subscribe/', body)
      .subscribe(
        (data) => {
          this.toastr.success('تم اضافة اشتراك جديد بنجاح');
          this.DrivingLicensce.reset();
          this.userData.reset();
          this.categories.reset();
          this.userData.controls['subscription_number'].enable();
        },
        (error) => {
          this.toastr.error('هناك خطأ برجاء المحاولة مرة اخري');
        }
      );
  }
}
