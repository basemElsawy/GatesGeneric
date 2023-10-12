import { Component, EventEmitter, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { KiloPrice } from 'src/app/Interfaces/KiloPrice';
import { ListOfDataKey } from 'src/app/Interfaces/ListOfDataKeys';
import { TableFormate } from 'src/app/Interfaces/TableFormate';
import { ErrorView } from 'src/app/classes/ErrorView';
import { RequestService } from 'src/app/https/request.service';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import { ControlModelService } from 'src/app/shared-serviceses/Model/control-model.service';

@Component({
  selector: 'app-Kilo-Price',
  templateUrl: './Kilo-Price.component.html',
  styleUrls: ['./Kilo-Price.component.css'],
})
export class KiloPriceComponent implements OnInit {
  isNewMode = false;
  isEditMode = false;
  isDeleteMode = false;
  holdOriginalData: Subject<KiloPrice[]> = new Subject<KiloPrice[]>();
  updateApi: EventEmitter<any> = new EventEmitter();
  holdCollectionDataAfterFilter: Subject<any> = new Subject();
  holdListOfFilterData: Subject<KiloPrice[]> = new Subject<KiloPrice[]>();
  page: number = 1;
  pageSize: number = 5;
  holdSingleRow!: KiloPrice;

  kiloPriceForm!: FormGroup;

  holdListOfDatakeys: ListOfDataKey[] = [{ key: 'kilo_price' }];
  listOfHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: ' سعر الكيلو ', en: 'Kilo Price' },
    { ar: 'اعدادات', en: 'options' },
  ];
  constructor(
    protected lang: LangService,
    private modelService: ControlModelService,
    private apiService: RequestService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.kiloPriceForm = this.fb.group({
      kilo_price: [null, Validators.required],
    });
  }

  get f() {
    return this.kiloPriceForm as FormGroup;
  }

  get number() {
    return this.f?.controls['kilo_price'] as FormControl;
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

  openModel() {
    this.isNewMode = true;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.modelService.setNewMode();
  }

  handleDataChange(pageValue: number) {
    this.page = pageValue;
    this.updateApi.emit(pageValue);
  }

  editModel(selectedKiloPrice: any) {
    this.holdSingleRow = selectedKiloPrice as KiloPrice;
    this.number.setValue(selectedKiloPrice.kilo_price);
    this.isNewMode = false;
    this.isEditMode = true;
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
    if (this.kiloPriceForm.invalid) return;
    let data = this.kiloPriceForm.getRawValue();
    this.apiService.PostMethodWithPipe('weights/kilo-price/', data).subscribe({
      next: (res: any) => {
        this.kiloPriceForm.reset();
        this.updateApi.emit(res);
        this.modelService.closeModel('');
      },
      error: (error: any) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      },
    });
  }

  editDataInServer() {
    if (this.kiloPriceForm.invalid) return;
    let data = this.kiloPriceForm.getRawValue();
    let sendData = { ...this.holdSingleRow, ...data };
    this.apiService
      .UpdateMethodWithPipe('weights/kilo-price/', null, sendData)
      .subscribe({
        next: (res: any) => {
          this.kiloPriceForm.reset();
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
