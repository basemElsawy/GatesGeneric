import { Component, EventEmitter, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ListOfDataKey } from 'src/app/Interfaces/ListOfDataKeys';
import { ShippingType } from 'src/app/Interfaces/Shipping-Type';
import { TableFormate } from 'src/app/Interfaces/TableFormate';
import { ErrorView } from 'src/app/classes/ErrorView';
import { RequestService } from 'src/app/https/request.service';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import { ControlModelService } from 'src/app/shared-serviceses/Model/control-model.service';

@Component({
  selector: 'app-Shipping-Type',
  templateUrl: './Shipping-Type.component.html',
  styleUrls: ['./Shipping-Type.component.css'],
})
export class ShippingTypeComponent implements OnInit {
  shippingType!: FormGroup;
  page: number = 1;
  isNewMode = false;
  isEditMode = false;
  isDeleteMode = false;
  pageSize: number = 5;
  updateApi: EventEmitter<any> = new EventEmitter();
  holdOriginalData: Subject<ShippingType[]> = new Subject<ShippingType[]>();
  holdCollectionDataAfterFilter: Subject<any> = new Subject();
  holdListOfFilterData: Subject<ShippingType[]> = new Subject<ShippingType[]>();
  holdSingleRaw!: ShippingType;
  constructor(
    protected lang: LangService,
    private modelService: ControlModelService,
    private apiService: RequestService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.shippingType = this.fb.group({
      description: [null, Validators.required],
    });
  }

  getCurrentLanguage(): string {
    let langWeb = this.lang.getcurrentLange().getValue();
    return langWeb;
  }

  get f() {
    return this.shippingType as FormGroup;
  }
  get description() {
    return this.f?.controls['description'] as FormControl;
  }
  listOfHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'نوع عملية الشحن', en: 'Shipping type' },
    { ar: 'اعدادات', en: 'options' },
  ];

  holdListOfDatakeys: ListOfDataKey[] = [{ key: 'description' }];

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

  editModel(selectedShippingType: any) {
    this.holdSingleRaw = selectedShippingType as ShippingType;
    this.description.setValue(selectedShippingType.description);
    this.isNewMode = false;
    this.isEditMode = true;
    this.isDeleteMode = false;
    this.modelService.setNewMode();
  }
  handleDataChange(pageValue: number) {
    this.page = pageValue;
    this.updateApi.emit(pageValue);
  }

  openModel() {
    this.isNewMode = true;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.modelService.setNewMode();
  }
  submitRequest() {
    if (this.isNewMode) {
      this.sendDataToServer();
    } else if (this.isEditMode) {
      this.editDataInServer();
    }
  }
  sendDataToServer() {
    if (this.shippingType.invalid) return;
    let data = this.shippingType.getRawValue();
    this.apiService
      .PostMethodWithPipe('weights/shipping-type/', data)
      .subscribe({
        next: (res: any) => {
          this.shippingType.reset();
          this.updateApi.emit(res);
          this.modelService.closeModel('success');
        },
        error: (error: any) => {
          let errorz = new ErrorView(this.toastr);
          errorz.showError(error);
        },
      });
  }

  editDataInServer() {
    if (this.shippingType.invalid) return;
    let data = this.shippingType.getRawValue();
    let sendData = { ...this.holdSingleRaw, ...data };
    this.apiService
      .UpdateMethodWithPipe('weights/shipping-type/', null, sendData)
      .subscribe({
        next: (res: any) => {
          this.shippingType.reset();
          this.updateApi.emit(res);
          this.modelService.closeModel('success');
        },
        error: (error: any) => {
          let errorz = new ErrorView(this.toastr);
          errorz.showError(error);
        },
      });
  }
}
