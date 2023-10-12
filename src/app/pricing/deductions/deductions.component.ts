import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  selector: 'app-deductions',
  templateUrl: './deductions.component.html',
  styleUrls: ['./deductions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeductionsComponent implements OnInit {
  @ViewChild('model') contnt!: any;
  isNewMode: boolean = false;
  isEditMode: boolean = false;
  isDeleteMode: boolean = false;
  isAdding: boolean = false;
  isShow: boolean = false;
  page: number = 1;
  pageSize: number = 5;
  holdCollectionDataAfterFilter: Subject<any> = new Subject();
  holdOriginalData: Subject<TablePrice[]> = new Subject<TablePrice[]>();
  holdListOfFilterData: Subject<TablePrice[]> = new Subject<TablePrice[]>()
  holdSingleRoad!: TablePrice;
  // holdRoadStatusList: RoadStatus[] = []
  holdListOfgate: Gates[] = [];
  holdListOfCar: Vehicle[] = []
  holdListOfPriceDeials: Subject<PriceDetails[]> = new Subject<PriceDetails[]>();
  holdSignlePriceDeialts!: PriceDetails;
  updateApi: EventEmitter<any> = new EventEmitter();;
  constructor(protected lang: LangService,
    private modelService: ControlModelService,
    private elementRef: ElementRef,
    private apiService: RequestService,
    private toastr: ToastrService) { }
  holdListOfDatakeys: ListOfDataKey[] = [{ key: "price_table_name_ar" }, { key: "price_table_name_en" }, { key: "gate_id", sub: 'gate_name_ar' }, { key: 'start_date', isDate: true }, { key: 'end_date', isDate: true }];
  holdListOfPriceDetails: ListOfDataKey[] = [{ key: "car_classe_id", sub: 'car_classe_Name_Ar' }, { key: 'amount' }]

  listOfHeader: TableFormate[] = [{ ar: '#', en: '#' },
  { ar: 'اسم الجدوال بالعربية', en: 'Price Table Name Ar' },
  { ar: 'اسم الجدوال بالانجليزية', en: 'Price Table Name En' },
  { ar: ' اسم البوابة', en: 'Gate' },
  { ar: 'تاريخ البداء', en: 'start date' },
  { ar: 'تاريخ الانتهاء', en: 'End date' },
  { ar: 'اعدادات', en: 'options' }]
  listPriceOfHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'فئة المركبة', en: 'vichle class' },
    { ar: 'قيمة', en: 'Amount' },
    { ar: 'اعدادات', en: 'options' }
  ]

  tablePriceForm!: FormGroup
  priceDetails!: FormGroup
  ngOnInit(): void {
    this.getCurrentLanguage();
    this.initalForm();
    this.getListOfgates();
    this.getListOfVehicles();
  }
  ngOnDestroy(): void {
    this.elementRef.nativeElement.remove()
  }

  initalForm() {
    this.tablePriceForm = new FormGroup({
      price_table_name_ar: new FormControl('', Validators.required),
      price_table_name_en: new FormControl('', Validators.required),
      start_date: new FormControl('', Validators.required),
      end_date: new FormControl('', Validators.required),
    })

    this.priceDetails = new FormGroup({
      amount: new FormControl(0, Validators.required),
      price_table_id: new FormControl('', Validators.required),
      car_classe_id: new FormControl('', Validators.required),
    })
  }
  get f() {
    return this.tablePriceForm as FormGroup;
  }
  get price_table_name_ar() {
    return this.f?.controls['price_table_name_ar'] as FormControl;
  }
  get price_table_name_en() {
    return this.f.controls['price_table_name_en'] as FormControl;
  }
  get start_date() {
    return this.f.controls['start_date'] as FormControl;
  }
  get end_date() {
    return this.f.controls['end_date'] as FormControl;
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

  getCurrentLanguage(): string {
    let langWeb = this.lang.getcurrentLange().getValue();
    return langWeb;
  }

  handlListOfData(data: any) {

    this.holdOriginalData.next(data)
  }

  handleFilterdData(dataFiltered: any) {
    //this.holdListOfFilterData = dataFiltered
    this.holdCollectionDataAfterFilter.next(dataFiltered)
    this.holdListOfFilterData.next(dataFiltered?.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    ))
  }

  handleAddModelModel(rowData: TablePrice) {
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.isAdding = true;
    this.isShow = false
    this.price_table_id.setValue(rowData.price_table_id)
    this.modelService.setNewMode()
  }

  openModel() {
    this.f2.reset();
    this.isNewMode = true;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.isAdding = false;
    this.isShow = false;
    this.modelService.setNewMode()

  }

  handleShowPrice(rowData: any) {
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.isAdding = false;
    this.isShow = true;
    this.getListOfPriceDetails(rowData.price_table_id)
    this.modelService.setNewMode()
  }
  editModel(singleRoad: any) {
    this.holdSingleRoad = (singleRoad as TablePrice)
    this.price_table_name_ar.setValue(singleRoad.price_table_name_ar)
    this.price_table_name_en.setValue(singleRoad.price_table_name_en)
    this.start_date.setValue(singleRoad.start_date)
    this.end_date.setValue(singleRoad.end_date)
    this.isNewMode = false;
    this.isEditMode = true;
    this.isDeleteMode = false;
    this.isAdding = false;
    this.isShow = false;
    this.modelService.setNewMode()
  }

  handlePriceDetails(rowData: any) {
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.isAdding = true;
    this.isShow = false;
    this.holdSignlePriceDeialts = rowData;
    this.f2.reset();
    this.amount.setValue(rowData.amount)
    this.car_classe_id.setValue(rowData.car_classe_id?.car_classe_id)
    this.price_table_id.setValue(rowData.price_table_id?.price_table_id)
    this.modelService.setNull()
    this.modelService.closeModel('success')
    setTimeout(() => this.modelService.setNewMode(), 200)
  }


  deleteModel(singleRoad: any) {
    this.holdSingleRoad = (singleRoad as TablePrice)
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = true;
    this.isAdding = false;
    this.isShow = false;
    this.modelService.setNewMode()
  }

  handleInputCallback(val: any) {

  }

  submitRequest() {
    if (!this.isAdding && !this.isShow) {
      if (this.isNewMode) {
        this.sendDataToServer()
      } else if (this.isEditMode) {
        this.editDataInServer()
      } else if (this.isDeleteMode) {
        this.removeDataFormServer()
      }
    } else if (this.isAdding) {
      if (!this.holdSignlePriceDeialts) {
        this.postTableDetials()
      } else {
        this.editTablePrice()
      }
    } else if (this.isShow) {

    }
  }

  sendDataToServer() {
    if (this.tablePriceForm.invalid) return;
    let data = this.tablePriceForm.getRawValue();
    console.log(data);
    this.apiService.PostMethodWithPipe('price/price/', data).subscribe({
      next: (res: any) => {
        this.tablePriceForm.reset();
        this.updateApi.emit(res)
        this.modelService.setNull()
        this.getListOfVehicles()
        this.modelService.closeModel('success')

      }, error: (error: any) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      }
    })

  }

  editDataInServer() {
    if (this.tablePriceForm.invalid) return;
    let data = this.tablePriceForm.getRawValue();
    console.log(data);
    let sendData = { ...this.holdSingleRoad, ...data }
    this.apiService.UpdateMethodWithPipe('price/price/', null, sendData).subscribe({
      next: (res: any) => {
        this.tablePriceForm.reset();
        this.updateApi.emit(res)
        this.modelService.setNull()
        this.getListOfVehicles()
        this.modelService.closeModel('success')
      }, error: (error: any) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      }
    })

  }

  removeDataFormServer() {
    this.apiService.DeleteMethodWithPipe('price/price/', null, { price_table_id: this.holdSingleRoad.price_table_id }).subscribe({
      next: (res: any) => {
        this.tablePriceForm.reset();
        let x = Math.random() * 500
        this.updateApi.emit(x)
        this.getListOfVehicles()
        this.modelService.closeModel('success')
      }, error: (error: any) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      }
    })

  }


  postTableDetials() {
    if (this.priceDetails.invalid) return
    let data = this.priceDetails.getRawValue();
    this.apiService.PostMethodWithPipe('price/price_details/', data).subscribe({
      next: (res: any) => {
        this.priceDetails.reset();
        this.updateApi.emit(res)
        this.modelService.setNull()
        this.getListOfVehicles();
        this.modelService.closeModel('success')
      }, error: (error: any) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      }
    })
  }

  editTablePrice() {

    if (this.priceDetails.invalid) return
    let data = this.priceDetails.getRawValue();
    let sendValue = { ...this.holdSignlePriceDeialts, ...data }
    this.apiService.UpdateMethodWithPipe('price/price_details/', null, sendValue).subscribe({
      next: (res: any) => {
        this.priceDetails.reset();
        this.updateApi.emit(res)
        this.modelService.setNull()
        this.getListOfVehicles();
        this.modelService.closeModel('success')
      }, error: (error: any) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      }
    })
  }

  handleDataChange(pageValue: number) {
    this.page = pageValue;
    this.updateApi.emit(pageValue)
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
        this.holdListOfgate = (res)
      }, error: (error: any) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      }
    })
  }

  getListOfVehicles() {
    this.apiService.GetMethodWithPipe('car/').subscribe({
      next: (res: any) => {
        this.holdListOfCar = (res)
      }, error: (error: any) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      }
    })
  }

  getListOfPriceDetails(subId: number) {
    this.apiService.GetMethodWithPipe(`price/price_details/?field_name=price_table_id&field_value=${subId}`).subscribe({
      next: (res: any) => {
        this.holdListOfPriceDeials.next(res)
      }, error: (error: any) => {
        console.log(error)
      }
    })
  }
}
