import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ErrorView } from 'src/app/classes/ErrorView';
import { RequestService } from 'src/app/https/request.service';
import { Gates } from 'src/app/Interfaces/Gates';
import { ListOfDataKey } from 'src/app/Interfaces/ListOfDataKeys';
import { PriceDetails } from 'src/app/Interfaces/PriceDetails';
import { TableFormate } from 'src/app/Interfaces/TableFormate';
import { TablePrice } from 'src/app/Interfaces/tablePrice';
import { Vehicle } from 'src/app/Interfaces/vehicle';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import { ControlModelService } from 'src/app/shared-serviceses/Model/control-model.service';

@Component({
  selector: 'app-price-table',
  templateUrl: './price-table.component.html',
  styleUrls: ['./price-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceTableComponent implements OnInit, OnDestroy {
  @ViewChild('model') contnt!: any;
  isNewMode: boolean = false;
  isEditMode: boolean = false;
  isDeleteMode: boolean = false;
  isAdding: boolean = false;
  isShow: boolean = false;
  page: number = 1;
  pageSize: number = 5;
  holdListOfDetails: PriceDetails[] = [];
  holdCollectionDataAfterFilter: Subject<any> = new Subject();
  holdOriginalData: Subject<TablePrice[]> = new Subject<TablePrice[]>();
  holdListOfFilterData: Subject<TablePrice[]> = new Subject<TablePrice[]>();
  holdSingleRoad!: TablePrice;
  // holdRoadStatusList: RoadStatus[] = []
  holdListOfgate: Gates[] = [];
  holdListOfCar: Vehicle[] = [];
  holdListOfPriceDeials: Subject<PriceDetails[]> = new Subject<
    PriceDetails[]
  >();
  holdSignlePriceDeialts!: PriceDetails;
  updateApi: EventEmitter<any> = new EventEmitter();
  constructor(
    protected lang: LangService,
    private modelService: ControlModelService,
    private elementRef: ElementRef,
    private apiService: RequestService,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) {}
  holdListOfDatakeys: ListOfDataKey[] = [
    { key: 'price_table_name_ar' },
    { key: 'price_table_name_en' },
    { key: 'gate_id', sub: 'gate_name_ar' },
  ];
  holdListOfPriceDetails: ListOfDataKey[] = [
    { key: 'car_class_id', sub: 'car_classe_Name_Ar' },
    { key: 'details_id', sub: 'details_name_ar' },
    { key: 'amount' },
  ];

  listOfHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'اسم الجدوال بالعربية', en: 'Price Table Name Ar' },
    { ar: 'اسم الجدوال بالانجليزية', en: 'Price Table Name En' },
    { ar: ' اسم البوابة', en: 'Gate' },
    { ar: 'اعدادات', en: 'options' },
  ];
  listPriceOfHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'فئة المركبة', en: 'vichle class' },
    { ar: 'الاستقطاع', en: 'Deduction name' },
    { ar: 'قيمة', en: 'Amount' },
    { ar: 'اعدادات', en: 'options' },
  ];

  listVeichleHeader: TableFormate[] = [
    { ar: 'نوع السيارة', en: 'car type' },
    { ar: 'تفاصيل السعر', en: 'price detail' },
  ];

  holdListOfViechle: ListOfDataKey[] = [
    { key: 'car_classe_Name_Ar', sub: 'car_classe_id' },
    { key: 'amount' },
  ];

  tablePriceForm!: FormGroup;
  priceDetails!: FormGroup;
  async ngOnInit() {
    await this.getListOfVehicles();
    await this.getListofPriceDetails();
    this.initalForm();
  }
  ngOnDestroy(): void {
    this.elementRef.nativeElement.remove();
  }

  initalForm() {
    this.tablePriceForm = new FormGroup({
      price_table_name_ar: new FormControl('', Validators.required),
      price_table_name_en: new FormControl('', Validators.required),
      gate_id: new FormControl('', Validators.required),
      priceTableDetails: new FormArray([]),
    });

    this.priceDetails = new FormGroup({
      amount: new FormControl(0, Validators.required),
      price_table_id: new FormControl('', Validators.required),
      car_classe_id: new FormControl('', Validators.required),
    });

    for (let item of this.holdListOfCar) {
      let parent_form_group = new FormGroup({});
      parent_form_group.addControl(
        'car_class_id',
        new FormControl(item.car_classe_id, Validators.required)
      );

      for (let detail of this.holdListOfDetails) {
        parent_form_group.addControl(
          detail.details_name,
          new FormControl('', Validators.required)
        );
      }
      (<FormArray>this.tablePriceForm.get('priceTableDetails')).push(
        parent_form_group
      );
    }
    console.log(this.tablePriceForm);
  }

  // initalForm() {
  //   this.tablePriceForm = new FormGroup({
  //     price_table_name_ar: new FormControl('', Validators.required),
  //     price_table_name_en: new FormControl('', Validators.required),
  //     gate_id: new FormControl('', Validators.required),
  //     priceTableDetails: new FormArray([]),
  //   });

  //   this.priceDetails = new FormGroup({
  //     amount: new FormControl(0, Validators.required),
  //     price_table_id: new FormControl('', Validators.required),
  //     car_classe_id: new FormControl('', Validators.required),
  //   });

  //   for (let item of this.holdListOfCar) {
  //     let parent_form_group = new FormGroup({});
  //     parent_form_group.addControl(
  //       JSON.stringify(item.car_classe_id),
  //       new FormControl(item.car_classe_id, Validators.required)
  //     );
  //     let form_group = new FormGroup({});
  //     for (let detail of this.holdListOfDetails) {
  //       form_group.addControl(
  //         detail.details_name,
  //         new FormControl('', Validators.required)
  //       );
  //     }
  //     parent_form_group.addControl('detials', form_group);
  //     (<FormArray>this.tablePriceForm.get('priceTableDetails')).push(
  //       parent_form_group
  //     );
  //   }
  //   console.log(this.tablePriceForm);
  // }

  FetchCarClass() {}
  get f() {
    return this.tablePriceForm as FormGroup;
  }
  get price_table_name_ar() {
    return this.f?.controls['price_table_name_ar'] as FormControl;
  }
  get price_table_name_en() {
    return this.f.controls['price_table_name_en'] as FormControl;
  }
  get gate_id() {
    return this.f.controls['gate_id'] as FormControl;
  }

  get f2() {
    return this.priceDetails as FormGroup;
  }

  get amount() {
    return this.f2.controls['amount'] as FormControl;
  }

  get price_table_id() {
    return this.f2.controls['price_table_id'] as FormControl;
  }

  get car_classe_id() {
    return this.f2.controls['car_classe_id'] as FormControl;
  }

  get priceTableDetails() {
    return this.tablePriceForm.controls.priceTableDetails as FormArray;
  }

  getCurrentLanguage(): string {
    let langWeb = this.lang.getcurrentLange().getValue();
    return langWeb;
  }

  handlListOfData(data: any) {
    this.holdOriginalData.next(data);
  }

  handleFilterdData(dataFiltered: any) {
    //this.holdListOfFilterData = dataFiltered
    this.holdCollectionDataAfterFilter.next(dataFiltered);
    this.holdListOfFilterData.next(
      dataFiltered?.slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      )
    );
  }

  handleAddModelModel(rowData: TablePrice) {
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.isAdding = true;
    this.isShow = false;
    this.price_table_id.setValue(rowData.price_table_id);
    this.modelService.setNewMode();
  }

  openModel() {
    this.f2.reset();
    this.isNewMode = true;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.isAdding = false;
    this.isShow = false;
    this.modelService.setNewMode();
    this.getListOfgates();
  }

  PriceTableName: any;
  handleShowPrice(rowData: any) {
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.isAdding = false;
    this.isShow = true;
    this.PriceTableName = rowData.price_table_name_ar;
    this.getListOfPriceDetails(rowData.gate_id.gate_id);
    this.modelService.setNewMode();
  }
  editModel(singleRoad: any) {
    this.holdSingleRoad = singleRoad as TablePrice;
    this.price_table_name_ar.setValue(singleRoad.price_table_name_ar);
    this.price_table_name_en.setValue(singleRoad.price_table_name_en);
    this.gate_id.setValue(singleRoad.gate_id?.gate_id);
    // this.start_date.setValue(singleRoad.start_date);
    // this.end_date.setValue(singleRoad.end_date);
    this.isNewMode = false;
    this.isEditMode = true;
    this.isDeleteMode = false;
    this.isAdding = false;
    this.isShow = false;
    this.modelService.setNewMode();
  }

  handlePriceDetails(rowData: any) {
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.isAdding = true;
    this.isShow = false;
    this.holdSignlePriceDeialts = rowData;
    this.f2.reset();
    this.amount.setValue(rowData.amount);
    this.car_classe_id.setValue(rowData.car_classe_id?.car_classe_id);
    this.price_table_id.setValue(rowData.price_table_id?.price_table_id);
    this.modelService.setNull();
    this.modelService.closeModel('success');
    setTimeout(() => this.modelService.setNewMode(), 200);
  }

  deleteModel(singleRoad: any) {
    this.holdSingleRoad = singleRoad as TablePrice;
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = true;
    this.isAdding = false;
    this.isShow = false;
    this.modelService.setNewMode();
  }

  handleInputCallback(val: any) {}

  submitRequest() {
    if (!this.isAdding && !this.isShow) {
      if (this.isNewMode) {
        this.sendDataToServer();
      } else if (this.isEditMode) {
        this.editDataInServer();
      } else if (this.isDeleteMode) {
        this.removeDataFormServer();
      }
    } else if (this.isAdding) {
      if (!this.holdSignlePriceDeialts) {
        this.postTableDetials();
      } else {
        this.editTablePrice();
      }
    } else if (this.isShow) {
    }
  }

  parsedAmounts: any[] = [];
  sendDataToServer() {
    let body = {
      price_table_name_en: this.price_table_name_en.value,
      price_table_name_ar: this.price_table_name_ar.value,
      gate_id: +this.gate_id.value,
      amounts: this.parsedAmounts,
    };
    let car_class_id: number = 0;
    for (let row of this.priceTableDetails.value) {
      car_class_id = row['car_class_id'];
      for (let x in row) {
        if (x === 'car_class_id') {
          continue;
        }
        body.amounts.push({
          car_class_id: car_class_id,
          details_id: this.holdListOfDetails.find((item) => {
            return item.details_name === x;
          })?.details_id,
          amount: row[x],
        });
      }
    }

    this.apiService.PostMethodWithPipe('price/price/', body).subscribe({
      next: (res: any) => {
        this.tablePriceForm.reset();
        this.updateApi.emit(res);
        this.modelService.setNull();
        this.getListOfVehicles();
        this.modelService.closeModel('success');
      },
      error: (error: any) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      },
    });
  }

  editDataInServer() {
    if (this.tablePriceForm.invalid) return;
    let data = this.tablePriceForm.getRawValue();
    console.log(data);
    let sendData = { ...this.holdSingleRoad, ...data };
    this.apiService
      .UpdateMethodWithPipe('price/price/', null, sendData)
      .subscribe({
        next: (res: any) => {
          this.tablePriceForm.reset();
          this.updateApi.emit(res);
          this.modelService.setNull();
          this.getListOfVehicles();
          this.modelService.closeModel('success');
        },
        error: (error: any) => {
          let errorz = new ErrorView(this.toastr);
          errorz.showError(error);
        },
      });
  }

  removeDataFormServer() {
    this.apiService
      .DeleteMethodWithPipe('price/price/', null, {
        price_table_id: this.holdSingleRoad.price_table_id,
      })
      .subscribe({
        next: (res: any) => {
          this.tablePriceForm.reset();
          let x = Math.random() * 500;
          this.updateApi.emit(x);
          this.getListOfVehicles();
          this.modelService.closeModel('success');
        },
        error: (error: any) => {
          let errorz = new ErrorView(this.toastr);
          errorz.showError(error);
        },
      });
  }

  postTableDetials() {
    if (this.priceDetails.invalid) return;
    let data = this.priceDetails.getRawValue();
    this.apiService.PostMethodWithPipe('price/price_details/', data).subscribe({
      next: (res: any) => {
        this.priceDetails.reset();
        this.updateApi.emit(res);
        this.modelService.setNull();
        this.getListOfVehicles();
        this.modelService.closeModel('success');
      },
      error: (error: any) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      },
    });
  }

  divideThePricrTable(event: any) {
    // if (this.f.invalid) return;
    // // let currentData: any = this.datePipe.transform(new Date(), 'YYYY-MM-dd')
    // let firstDivide = this.f.value;
    // let secondDivide = this.f.value;
    // if (this.start_date.value < this.end_date.value) {
    //   firstDivide = {
    //     ...firstDivide,
    //     price_table_id: this.holdSingleRoad.price_table_id,
    //   };
    //   let date = new Date(this.end_date.value);
    //   let startNew = this.datePipe.transform(
    //     `${date.getFullYear()}-${date.getMonth()}-${date.getDay() + 1} `,
    //     'YYYY-MM-dd'
    //   );
    //   secondDivide = {
    //     ...secondDivide,
    //     end_date: this.holdSingleRoad.end_date,
    //     start_date: startNew,
    //   };
    // }
  }
  editTablePrice() {
    if (this.priceDetails.invalid) return;
    let data = this.priceDetails.getRawValue();
    let sendValue = { ...this.holdSignlePriceDeialts, ...data };
    this.apiService
      .UpdateMethodWithPipe('price/price_details/', null, sendValue)
      .subscribe({
        next: (res: any) => {
          this.priceDetails.reset();
          this.updateApi.emit(res);
          this.modelService.setNull();
          this.getListOfVehicles();
          this.modelService.closeModel('success');
        },
        error: (error: any) => {
          let errorz = new ErrorView(this.toastr);
          errorz.showError(error);
        },
      });
  }

  handleDataChange(pageValue: number) {
    this.page = pageValue;
    this.updateApi.emit(pageValue);
  }

  // roadStatusLookup() {
  //   this.apiService.GetMethodWithPipe('roads/status/').subscribe({
  //     next: (res: RoadStatus[]) => {
  //       this.holdRoadStatusList = (res)
  //     }, error: error => {
  //       console.log(error)
  //     }
  //   })
  // }

  getListOfgates() {
    this.apiService.GetMethodWithPipe('roads/gates/').subscribe({
      next: (res: any) => {
        this.holdListOfgate = res;
      },
      error: (error) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      },
    });
  }

  async getListOfVehicles() {
    let response = await this.apiService.getListSerivce('car/');
    if (response) {
      this.holdListOfCar = response;
    }
  }

  getListOfPriceDetails(subId: number) {
    this.apiService
      .GetMethodWithPipe(`price/price/?gate_id=${subId}`)
      .subscribe({
        next: (res: any) => {
          this.holdListOfPriceDeials.next(res.price_table_details);
        },
        error: (error) => {
          let errorz = new ErrorView(this.toastr);
          errorz.showError(error);
        },
      });
  }

  async getListofPriceDetails() {
    let response = await this.apiService.getListSerivce('price/details');
    if (response) {
      this.holdListOfDetails = response;
    }
    // this.apiService.GetMethodWithPipe('price/details').subscribe({
    //   next: (res: any) => {
    //     this.holdListOfDetails = res;
    //   },
    //   error: (error) => {
    //     let errorz = new ErrorView(this.toastr);
    //     errorz.showError(error);
    //   },
    // });
  }

  choosedDetail!: PriceDetails;
  setChoosedDetail(ev: any) {
    this.choosedDetail = JSON.parse(ev.target.value);
  }

  choosedCar!: Vehicle;
  setChoosedCar(ev: any) {
    this.choosedCar = JSON.parse(ev.target.value);
  }

  ShowedItems: any[] = [];
  amounts: any[] = [];
  pushItems() {
    this.ShowedItems.push({
      car_name: this.choosedCar.car_classe_Name_Ar,
      price_detail: this.choosedDetail.details_name,
      amount: +this.tablePriceForm.controls['amount'].value,
    });
    this.amounts.push({
      car_class_id: this.choosedCar.car_classe_id,
      details_id: this.choosedDetail.details_id,
      amount: +this.tablePriceForm.controls['amount'].value,
    });
  }

  deleteItem(i: any) {
    this.ShowedItems.splice(i, 1);
    this.amounts.splice(i, 1);
  }
}
