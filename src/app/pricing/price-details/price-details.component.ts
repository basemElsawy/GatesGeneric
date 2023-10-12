import { Types } from './../../Interfaces/Types';
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
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-price-details',
  templateUrl: './price-details.component.html',
  styleUrls: ['./price-details.component.css'],
})
export class PriceDetailsComponent implements OnInit {
  @ViewChild('model') contnt!: any;
  isNewMode: boolean = false;
  isEditMode: boolean = false;
  isDeleteMode: boolean = false;
  isAdding: boolean = false;
  isShow: boolean = false;
  page: number = 1;
  pageSize: number = 5;
  holdListOfTypes: Types[] = [];
  holdListOfDetails: PriceDetails[] = [];
  holdListOfDatakeys: ListOfDataKey[] = [
    { key: 'details_name_ar' },
    { key: 'details_name' },
    { key: 'details_type' },
  ];

  holdCollectionDataAfterFilter: Subject<any> = new Subject();
  holdOriginalData: Subject<TablePrice[]> = new Subject<TablePrice[]>();
  holdListOfFilterData: Subject<TablePrice[]> = new Subject<TablePrice[]>();

  updateApi: EventEmitter<any> = new EventEmitter();
  listOfHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'الاسم', en: 'Details name' },
    { ar: 'الاسم باللغة الانجليزية', en: 'English details name' },
    { ar: 'النوع', en: 'Details type' },
  ];

  detailsForm!: FormGroup;
  constructor(
    protected lang: LangService,
    private modelService: ControlModelService,
    private elementRef: ElementRef,
    private apiService: RequestService,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.initialForm();
    this.holdListOfTypes = [
      { id: 1, name: 'Percentage' },
      { id: 2, name: 'Value' },
    ];
  }

  initialForm() {
    this.detailsForm = new FormGroup({
      details_name: new FormControl('', Validators.required),
      details_type: new FormControl('', Validators.required),
      details_name_ar: new FormControl('', Validators.required),
    });
  }

  get form() {
    return this.detailsForm as FormGroup;
  }

  get name() {
    return this.form?.controls['name'] as FormControl;
  }

  get type() {
    return this.form?.controls['type'] as FormControl;
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

  handleInputCallback(val: any) {}

  openModel() {
    this.isNewMode = true;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.isAdding = false;
    this.isShow = false;
    this.modelService.setNewMode();
  }

  editModel(singleRoad: any) {
    // this.holdSingleRoad = (singleRoad as TablePrice)
    // this.price_table_name_ar.setValue(singleRoad.price_table_name_ar)
    // this.price_table_name_en.setValue(singleRoad.price_table_name_en)
    // this.gate_id.setValue(singleRoad.gate_id?.gate_id)
    // this.start_date.setValue(singleRoad.start_date)
    // this.end_date.setValue(singleRoad.end_date)
    // this.isNewMode = false;
    // this.isEditMode = true;
    // this.isDeleteMode = false;
    // this.isAdding = false;
    // this.isShow = false;
    // this.modelService.setNewMode()
  }

  deleteModel(singleRoad: any) {
    // this.holdSingleRoad = (singleRoad as TablePrice)
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = true;
    this.isAdding = false;
    this.isShow = false;
    this.modelService.setNewMode();
  }

  handleAddModelModel(rowData: PriceDetails) {
    // this.isNewMode = false;
    // this.isEditMode = false;
    // this.isDeleteMode = false;
    // this.isAdding = true;
    // this.isShow = false;
    // this.price_table_id.setValue(rowData.price_table_id)
    // this.modelService.setNewMode();
  }

  handleShowPrice(rowData: any) {
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.isAdding = false;
    this.isShow = true;
    // this.getListOfPriceDetails(rowData.price_table_id)
    this.modelService.setNewMode();
  }

  handleDataChange(pageValue: number) {
    this.page = pageValue;
    this.updateApi.emit(pageValue);
  }

  getListOfDetails() {
    this.apiService.GetMethodWithPipe('price/details/').subscribe({
      next: (res: any) => {
        this.holdListOfDetails = res;
      },
      error: (error) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      },
    });
  }

  sendDataToServer() {
    if (this.detailsForm.invalid) return;
    let data = this.detailsForm.getRawValue();
    this.apiService.PostMethodWithPipe('price/details/', data).subscribe({
      next: (res: any) => {
        this.detailsForm.reset();
        this.updateApi.emit(res);
        this.modelService.setNull();
        this.getListOfDetails();
        this.modelService.closeModel('success');
      },
      error: (error: any) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      },
    });
  }

  editDataInServer() {
    // if (this.tablePriceForm.invalid) return;
    // let data = this.tablePriceForm.getRawValue();
    // console.log(data);
    // let sendData = { ...this.holdSingleRoad, ...data }
    // this.apiService.UpdateMethodWithPipe('price/price/', null, sendData).subscribe({
    //   next: (res: any) => {
    //     this.tablePriceForm.reset();
    //     this.updateApi.emit(res)
    //     this.modelService.setNull()
    //     this.getListOfVehicles()
    //     this.modelService.closeModel('success')
    //   }, error: (error: any) => {
    //     let errorz = new ErrorView(this.toastr);
    //     errorz.showError(error);
    //   }
    // })
  }

  removeDataFormServer() {
    // this.apiService
    //   .DeleteMethodWithPipe('price/details/', null, {
    //     price_table_id: this.holdSingleRoad.price_table_id,
    //   })
    //   .subscribe({
    //     next: (res: any) => {
    //       this.detailsForm.reset();
    //       let x = Math.random() * 500;
    //       this.updateApi.emit(x);
    //       this.getListOfDetails();
    //       this.modelService.closeModel('success');
    //     },
    //     error: (error: any) => {
    //       let errorz = new ErrorView(this.toastr);
    //       errorz.showError(error);
    //     },
    //   });
  }

  submitRequest() {
    if (!this.isAdding && !this.isShow) {
      if (this.isNewMode) {
        this.sendDataToServer();
      }

      // else if (this.isEditMode) {
      //   this.editDataInServer();
      // } else if (this.isDeleteMode) {
      //   this.removeDataFormServer();
      // }
    }

    // else if (this.isAdding) {
    //   if (!this.holdSignlePriceDeialts) {
    //     this.postTableDetials();
    //   } else {
    //     this.editTablePrice();
    //   }
    // } else if (this.isShow) {
    // }
  }
}
