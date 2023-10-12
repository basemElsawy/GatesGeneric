import { getTestBed } from '@angular/core/testing';
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
import { TableFormate } from 'src/app/Interfaces/TableFormate';
import { WeightCode } from 'src/app/Interfaces/WeightCode';
import { RequestService } from 'src/app/https/request.service';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import { ControlModelService } from 'src/app/shared-serviceses/Model/control-model.service';
import { ErrorView } from 'src/app/classes/ErrorView';

@Component({
  selector: 'app-Weight-Code',
  templateUrl: './Weight-Code.component.html',
  styleUrls: ['./Weight-Code.component.css'],
})
export class WeightCodeComponent implements OnInit {
  isNewMode = false;
  isEditMode = false;
  isDeleteMode = false;
  weightCode!: FormGroup;
  page: number = 1;
  pageSize: number = 5;
  updateApi: EventEmitter<any> = new EventEmitter();
  holdOriginalData: Subject<WeightCode[]> = new Subject<WeightCode[]>();
  holdCollectionDataAfterFilter: Subject<any> = new Subject();
  holdListOfFilterData: Subject<WeightCode[]> = new Subject<WeightCode[]>();
  holdSingleRaw!: WeightCode;
  constructor(
    protected lang: LangService,
    private modelService: ControlModelService,
    private apiService: RequestService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  holdListOfDatakeys: ListOfDataKey[] = [
    { key: 'description' },
    { key: 'weight' },
  ];
  listOfHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: ' الوصف ', en: 'description' },
    { ar: ' القيمة', en: 'weight' },
    { ar: 'اعدادات', en: 'options' },
  ];

  ngOnInit() {
    this.weightCode = this.fb.group({
      description: [null, Validators.required],
      weight: [null, Validators.required],
    });
  }

  get f() {
    return this.weightCode as FormGroup;
  }
  get description() {
    return this.f?.controls['description'] as FormControl;
  }

  get weight() {
    return this.f.controls['weight'] as FormControl;
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

  editModel(singleWeightCode: any) {
    this.holdSingleRaw = singleWeightCode as WeightCode;
    // this.status_id.setValue(singleCamira.status_id?.status_id);
    // this.lane_id.setValue(singleCamira.lane_id?.lane_id);
    this.isNewMode = false;
    this.isEditMode = true;
    this.isDeleteMode = false;
    this.modelService.setNewMode();
  }

  handleDataChange(pageValue: number) {
    this.page = pageValue;
    this.updateApi.emit(pageValue);
  }

  submitRequest() {
    if (this.isNewMode) {
      this.sendDataToServer();
    } else if (this.isEditMode) {
      this.editDataInServer();
    }
  }

  sendDataToServer() {
    if (this.weightCode.invalid) return;
    let data = this.weightCode.getRawValue();
    this.apiService.PostMethodWithPipe('weights/weight-code/', data).subscribe({
      next: (res: any) => {
        this.weightCode.reset();
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
    if (this.weightCode.invalid) return;
    let data = this.weightCode.getRawValue();
    let sendData = { ...this.weightCode, ...data };
    this.apiService
      .UpdateMethodWithPipe('weights/weight-code/', null, sendData)
      .subscribe({
        next: (res: any) => {
          this.weightCode.reset();
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
