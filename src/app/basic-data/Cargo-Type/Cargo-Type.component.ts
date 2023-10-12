import { Component, EventEmitter, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { RequestService } from 'src/app/https/request.service';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import { ControlModelService } from 'src/app/shared-serviceses/Model/control-model.service';
import { CargoType } from 'src/app/Interfaces/CargoType';
import { TableFormate } from 'src/app/Interfaces/TableFormate';
import { ListOfDataKey } from 'src/app/Interfaces/ListOfDataKeys';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ErrorView } from 'src/app/classes/ErrorView';

@Component({
  selector: 'app-Cargo-Type',
  templateUrl: './Cargo-Type.component.html',
  styleUrls: ['./Cargo-Type.component.css'],
})
export class CargoTypeComponent implements OnInit {
  CargoTypeForm!: FormGroup;
  holdOriginalData: Subject<CargoType[]> = new Subject<CargoType[]>();
  updateApi: EventEmitter<any> = new EventEmitter();
  holdSingleRaw!: CargoType;
  isNewMode = false;
  isEditMode = false;
  isDeleteMode = false;
  holdCollectionDataAfterFilter: Subject<any> = new Subject();
  holdListOfFilterData: Subject<CargoType[]> = new Subject<CargoType[]>();
  page: number = 1;
  pageSize: number = 5;
  constructor(
    protected lang: LangService,
    private modelService: ControlModelService,
    private apiService: RequestService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.CargoTypeForm = this.fb.group({
      description: [null, Validators.required],
    });
  }

  get f() {
    return this.CargoTypeForm as FormGroup;
  }
  get description() {
    return this.f?.controls['description'] as FormControl;
  }

  listOfHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'نوع البضائع', en: 'Category type' },
    { ar: 'اعدادات', en: 'options' },
  ];

  holdListOfDatakeys: ListOfDataKey[] = [{ key: 'description' }];

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

  editModel(selectedCargoType: any) {
    this.holdSingleRaw = selectedCargoType as CargoType;
    this.description.setValue(selectedCargoType.description);
    this.isNewMode = false;
    this.isEditMode = true;
    this.isDeleteMode = false;
    this.modelService.setNewMode();
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

  handleDataChange(pageValue: number) {
    this.page = pageValue;
    this.updateApi.emit(pageValue);
  }

  sendDataToServer() {
    if (this.CargoTypeForm.invalid) return;
    let data = this.CargoTypeForm.getRawValue();
    this.apiService.PostMethodWithPipe('weights/cargo-type/', data).subscribe({
      next: (res: any) => {
        this.CargoTypeForm.reset();
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
    if (this.CargoTypeForm.invalid) return;
    let data = this.CargoTypeForm.getRawValue();
    let sendData = { ...this.holdSingleRaw, ...data };
    this.apiService
      .UpdateMethodWithPipe('weights/cargo-type/', null, sendData)
      .subscribe({
        next: (res: any) => {
          this.CargoTypeForm.reset();
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
