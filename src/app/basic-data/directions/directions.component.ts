import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ErrorView } from 'src/app/classes/ErrorView';
import { RequestService } from 'src/app/https/request.service';
import { Direction } from 'src/app/Interfaces/Direction';
import { Gates } from 'src/app/Interfaces/Gates';
import { Lane } from 'src/app/Interfaces/Lane';
import { ListOfDataKey } from 'src/app/Interfaces/ListOfDataKeys';
import { RoadStatus } from 'src/app/Interfaces/RoadStatus';
import { TableFormate } from 'src/app/Interfaces/TableFormate';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import { ControlModelService } from 'src/app/shared-serviceses/Model/control-model.service';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectionsComponent implements OnInit {
  isNewMode = false;
  isEditMode = false;
  isDeleteMode = false;
  isShowModel = false;
  page: number = 1;
  pageSize: number = 5;
  holdCollectionDataAfterFilter: Subject<any> = new Subject();
  holdOriginalData: Subject<Direction[]> = new Subject<Direction[]>();
  holdListOfFilterData: Subject<Direction[]> = new Subject<Direction[]>();
  holdSingleRaw!: Direction;
  holdStatusList: RoadStatus[] = [];
  holdListOfGates: Gates[] = [];
  updateApi: EventEmitter<any> = new EventEmitter();
  holsListOfLane: Subject<Lane[]> = new Subject<Lane[]>();
  constructor(
    protected lang: LangService,
    private modelService: ControlModelService,
    private toastr: ToastrService,
    private apiService: RequestService
  ) {}
  holdListOfDatakeys: ListOfDataKey[] = [
    { key: 'directions_name_ar' },
    { key: 'gate_id', sub: 'gate_name_ar' },
    { key: 'status_id', sub: 'status_name_ar' },
    { key: 'note' },
  ];
  holdListOfLane: ListOfDataKey[] = [
    { key: 'lane_code' },
    { key: 'status_id', sub: 'status_name_ar' },
    { key: 'note' },
  ];
  listOfHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'اسم الاتجاة بالعربية', en: 'Direction Name ar' },
    { ar: 'اسم البوابة', en: 'Gate Name' },
    { ar: ' حالة الاتجاة', en: 'Status' },
    { ar: 'ملاحظة', en: 'note' },
    { ar: 'اعدادات', en: 'options' },
  ];

  listOfLaneHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'كود الحارة', en: 'lane code' },
    { ar: 'حالة الحارة', en: 'lane status' },
    { ar: 'ملاحظات', en: 'lane notes' },
  ];
  directionForm!: FormGroup;
  ngOnInit(): void {
    this.getCurrentLanguage();
    this.initalForm();
    this.roadStatusLookup();
    this.getListOfgates();
  }

  initalForm() {
    this.directionForm = new FormGroup({
      directions_name_ar: new FormControl('', [
        Validators.required,
        Validators.pattern('^[\u0621-\u064A0-9 -_ ]+$'),
      ]),
      directions_name_en: new FormControl('', Validators.required),
      status_id: new FormControl('', Validators.required),
      gate_id: new FormControl('', Validators.required),
      note: new FormControl(''),
    });
  }
  get f() {
    return this.directionForm as FormGroup;
  }
  get directions_name_ar() {
    return this.f?.controls['directions_name_ar'] as FormControl;
  }
  get directions_name_en() {
    return this.f.controls['directions_name_en'] as FormControl;
  }
  get status_id() {
    return this.f.controls['status_id'] as FormControl;
  }
  get gate_id() {
    return this.f.controls['gate_id'] as FormControl;
  }
  get note() {
    return this.f.controls['note'] as FormControl;
  }

  get hasDropDownError() {
    return (
      this.directionForm.get('gate_id')?.touched &&
      this.directionForm.get('gate_id')?.errors?.required
    );
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
    this.isShowModel = false;
    this.modelService.setNewMode();
  }

  editModel(singleDirection: any) {
    this.holdSingleRaw = singleDirection as Direction;
    this.directions_name_ar.setValue(singleDirection.directions_name_ar);
    this.directions_name_en.setValue(singleDirection.directions_name_en);
    this.status_id.setValue(singleDirection.status_id?.status_id);
    this.gate_id.setValue(singleDirection.gate_id?.gate_id);
    this.note.setValue(singleDirection.note);
    this.isNewMode = false;
    this.isEditMode = true;
    this.isDeleteMode = false;
    this.isShowModel = false;
    this.modelService.setNewMode();
  }

  deleteModel(singleDirection: any) {
    this.holdSingleRaw = singleDirection as Direction;
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = true;
    this.isShowModel = false;
    this.modelService.setNewMode();
  }

  handleInputCallback(val: any) {}

  submitRequest() {
    if (this.isNewMode) {
      this.sendDataToServer();
    } else if (this.isEditMode) {
      this.editDataInServer();
    } else if (this.isDeleteMode) {
      this.removeDataFormServer();
    }
  }

  sendDataToServer() {
    if (this.directionForm.invalid) return;
    let data = this.directionForm.getRawValue();
    console.log(data);
    this.apiService.PostMethodWithPipe('roads/directions/', data).subscribe({
      next: (res: any) => {
        this.directionForm.reset();
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
    if (this.directionForm.invalid) return;
    let data = this.directionForm.getRawValue();
    let sendData = { ...this.holdSingleRaw, ...data };
    this.apiService
      .UpdateMethodWithPipe('roads/directions/', null, sendData)
      .subscribe({
        next: (res: any) => {
          this.directionForm.reset();
          this.updateApi.emit(res);
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
      .DeleteMethodWithPipe('roads/directions/', null, {
        directions_id: this.holdSingleRaw.directions_id,
      })
      .subscribe({
        next: (res: any) => {
          this.directionForm.reset();
          let x = Math.random() * 500;
          this.updateApi.emit(x);
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

  roadStatusLookup() {
    this.apiService.GetMethodWithPipe('roads/status/').subscribe({
      next: (res: RoadStatus[]) => {
        this.holdStatusList = res;
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

  SelectedDirection!: Direction;
  handleShowLane(rowDate: any) {
    console.log('function is fired');
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.isShowModel = true;
    this.SelectedDirection = rowDate.directions_name_ar;
    this.getListOfLane(rowDate.directions_id);
    this.modelService.setNull();
    this.modelService.closeModel('success');
  }

  emptyLanesUnderDirection: string = '';
  showEmptyString: boolean = false;
  getListOfLane(directions_id: number) {
    this.apiService
      .GetMethodWithPipe(
        `roads/lane/?field_name=directions_id&field_value=${directions_id}`
      )
      .subscribe({
        next: (res: Lane[]) => {
          this.holsListOfLane.next(res);
          if (res.length == 0) {
            this.emptyLanesUnderDirection =
              'لا يوجد حارات مضافة للاتجاه المحدد';
            this.showEmptyString = true;
            this.modelService.setNewMode();
          } else {
            this.modelService.setNewMode();
            this.holsListOfLane.next(res);
            this.showEmptyString = false;
          }
        },
        error: (error: any) => {
          let errorz = new ErrorView(this.toastr);
          errorz.showError(error);
        },
      });
  }
}
