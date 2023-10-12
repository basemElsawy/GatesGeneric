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
import { Lane } from 'src/app/Interfaces/Lane';
import { ListOfDataKey } from 'src/app/Interfaces/ListOfDataKeys';
import { RoadStatus } from 'src/app/Interfaces/RoadStatus';
import { TableFormate } from 'src/app/Interfaces/TableFormate';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import { ControlModelService } from 'src/app/shared-serviceses/Model/control-model.service';

@Component({
  selector: 'app-lane',
  templateUrl: './lane.component.html',
  styleUrls: ['./lane.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaneComponent implements OnInit {
  isNewMode = false;
  isEditMode = false;
  isDeleteMode = false;
  isShowModel = false;
  page: number = 1;
  pageSize: number = 5;
  holdCollectionDataAfterFilter: Subject<any> = new Subject();
  holdOriginalData: Subject<Lane[]> = new Subject<Lane[]>();
  holdListOfFilterData: Subject<Lane[]> = new Subject<Lane[]>();
  holdSingleRaw!: Lane;
  holdStatusList: RoadStatus[] = [];
  holdListOfDirections: Direction[] = [];
  updateApi: EventEmitter<any> = new EventEmitter();
  holdListOfCaimra: Subject<Direction[]> = new Subject<Direction[]>();

  constructor(
    protected lang: LangService,
    private modelService: ControlModelService,
    private apiService: RequestService,
    private toastr: ToastrService
  ) {}
  holdListOfDatakeys: ListOfDataKey[] = [
    { key: 'lane_code' },
    { key: 'directions_id', sub: 'directions_name_ar' },
    { key: 'status_id', sub: 'status_name_ar' },
    { key: 'lane_subscriptions' },
    { key: 'note' },
  ];
  holdLisOfCar: ListOfDataKey[] = [
    { key: 'camira_id' },
    { key: 'number' },
    { key: 'note' },
  ];

  listOfHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: ' كود الحارة ', en: 'Lane Code' },
    { ar: 'اسم الاتجاة', en: 'Directions Name' },
    { ar: ' حالة الاتجاة', en: 'Status' },
    { ar: 'مفعل اشتراكات', en: 'Is subscription' },
    { ar: 'ملاحظة', en: 'note' },
    { ar: 'اعدادات', en: 'options' },
  ];

  listOfCarHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'رقم الكاميرة', en: 'Camira No' },
    { ar: 'كود الكاميرة', en: 'Camira Code' },
    { ar: 'الملاحظات ', en: 'Note ' },
  ];

  laneForm!: FormGroup;
  ngOnInit(): void {
    this.getCurrentLanguage();
    this.initalForm();
    this.roadStatusLookup();
    this.getListOfgates();
  }

  initalForm() {
    this.laneForm = new FormGroup({
      lane_code: new FormControl('', Validators.required),
      status_id: new FormControl('', Validators.required),
      directions_id: new FormControl('', Validators.required),
      note: new FormControl(''),
      lane_subscriptions: new FormControl('', Validators.required),
      lane_ip_address: new FormControl('', Validators.required),
    });
  }
  get f() {
    return this.laneForm as FormGroup;
  }
  get lane_code() {
    return this.f?.controls['lane_code'] as FormControl;
  }

  get status_id() {
    return this.f.controls['status_id'] as FormControl;
  }
  get directions_id() {
    return this.f.controls['directions_id'] as FormControl;
  }
  get note() {
    return this.f.controls['note'] as FormControl;
  }
  get subscription_lane() {
    return this.f.controls['lane_subscriptions'] as FormControl;
  }
  get lane_ip_address() {
    return this.f.controls['lane_ip_address'] as FormControl;
  }
  getCurrentLanguage(): string {
    let langWeb = this.lang.getcurrentLange().getValue();
    return langWeb;
  }

  parsedData: any[] = [];
  handlListOfData(data: any) {
    this.parsedData = [];
    data.forEach((element: any) => {
      if (element.lane_subscriptions == true) {
        this.parsedData.push({
          created_at: element.created_at,
          directions_id: element.directions_id,
          lane_code: element.lane_code,
          lane_id: element.lane_id,
          lane_ip_address: element.lane_ip_address,
          lane_subscriptions: 'مفعل اشتراكات',
          modified_at: element.modified_at,
          note: element.note,
          status_id: element.status_id,
        });
      } else {
        this.parsedData.push({
          created_at: element.created_at,
          directions_id: element.directions_id,
          lane_code: element.lane_code,
          lane_id: element.lane_id,
          lane_ip_address: element.lane_ip_address,
          lane_subscriptions: 'غير مفعل اشتراكات',
          modified_at: element.modified_at,
          note: element.note,
          status_id: element.status_id,
        });
      }
    });
    this.holdOriginalData.next(this.parsedData);
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

  editModel(singleLane: any) {
    this.holdSingleRaw = singleLane as Lane;
    this.lane_code.setValue(singleLane.lane_code);
    this.status_id.setValue(singleLane.status_id?.status_id);
    this.directions_id.setValue(singleLane.directions_id?.directions_id);
    this.lane_ip_address.setValue(singleLane?.lane_ip_address);
    this.note.setValue(singleLane.note);
    this.isNewMode = false;
    this.isEditMode = true;
    this.isDeleteMode = false;
    this.isShowModel = false;
    this.modelService.setNewMode();
  }

  deleteModel(singleLane: any) {
    this.holdSingleRaw = singleLane as Lane;
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
    if (this.laneForm.invalid) return;
    let data = this.laneForm.getRawValue();
    this.apiService.PostMethodWithPipe('roads/lane/', data).subscribe({
      next: (res: any) => {
        this.laneForm.reset();
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
    if (this.laneForm.invalid) return;
    let data = this.laneForm.getRawValue();
    let sendData = { ...this.holdSingleRaw, ...data };
    this.apiService
      .UpdateMethodWithPipe('roads/lane/', null, sendData)
      .subscribe({
        next: (res: any) => {
          this.laneForm.reset();
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
      .DeleteMethodWithPipe('roads/lane/', null, {
        lane_id: this.holdSingleRaw.lane_id,
      })
      .subscribe({
        next: (res: any) => {
          this.laneForm.reset();
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
    this.apiService.GetMethodWithPipe('roads/directions/').subscribe({
      next: (res: any) => {
        this.holdListOfDirections = res;
      },
      error: (error: any) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      },
    });
  }

  handleShowCamira(rowDate: any) {
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.isShowModel = true;
    this.getListOfCamira(rowDate.lane_id);
    this.modelService.setNull();
    this.modelService.closeModel('success');
  }
  getListOfCamira(lane_id: number) {
    this.apiService
      .GetMethodWithPipe(`camira/?field_name=lane_id&field_value=${lane_id}`)
      .subscribe({
        next: (res: Direction[]) => {
          this.holdListOfCaimra.next(res);
          this.modelService.setNewMode();
        },
        error: (error: any) => {
          let errorz = new ErrorView(this.toastr);
          errorz.showError(error);
        },
      });
  }
}
