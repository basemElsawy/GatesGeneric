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
import { Gates } from 'src/app/Interfaces/Gates';
import { ListOfDataKey } from 'src/app/Interfaces/ListOfDataKeys';
import { Roads } from 'src/app/Interfaces/roads';
import { RoadStatus } from 'src/app/Interfaces/RoadStatus';
import { TableFormate } from 'src/app/Interfaces/TableFormate';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import { ControlModelService } from 'src/app/shared-serviceses/Model/control-model.service';

@Component({
  selector: 'app-roads',
  templateUrl: './roads.component.html',
  styleUrls: ['./roads.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoadsComponent implements OnInit {
  isNewMode = false;
  isEditMode = false;
  isDeleteMode = false;
  isShowModel = false;
  page: number = 1;
  pageSize: number = 5;
  holdCollectionDataAfterFilter: Subject<any> = new Subject();
  holdOriginalData: Subject<Roads[]> = new Subject<Roads[]>();
  holdListOfFilterData: Subject<Roads[]> = new Subject<Roads[]>();
  holdSingleRoad!: Roads;
  holdRoadStatusList: RoadStatus[] = [];
  updateApi: EventEmitter<any> = new EventEmitter();
  holdListOfGates: Subject<Gates[]> = new Subject<Gates[]>();
  constructor(
    protected lang: LangService,
    private modelService: ControlModelService,
    private apiService: RequestService,
    private toastr: ToastrService
  ) {}
  holdListOfDatakeys: ListOfDataKey[] = [
    { key: 'road_name_ar' },
    { key: 'road_name_en' },
    { key: 'status_id', sub: 'status_name_ar' },
    { key: 'note' },
  ];
  holdLisOfGate: ListOfDataKey[] = [
    { key: 'gate_id' },
    { key: 'gate_name_ar' },
    { key: 'status_id', sub: 'status_name_ar' },
    { key: 'note' },
  ];

  listOfHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'الطريق بالعربية', en: 'Road Name ar' },
    { ar: 'الطريق بالانجليزية', en: 'Road Name En' },
    { ar: ' حالة الطريق', en: 'Status' },
    { ar: 'ملاحظة', en: 'note' },
    { ar: 'اعدادات', en: 'options' },
  ];

  listOfGateHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'كود البوابة', en: 'Gate Code' },
    { ar: 'البوابة بالعربية', en: 'Gate Name ar' },
    { ar: 'حالة البوابة', en: 'Gate status' },
    { ar: 'ملاحظات', en: 'Gate notes' },
  ];

  roadForm!: FormGroup;
  ngOnInit(): void {
    this.getCurrentLanguage();
    this.initalForm();
    this.roadStatusLookup();
  }

  initalForm() {
    this.roadForm = new FormGroup({
      road_name_ar: new FormControl('', [
        Validators.required,
        Validators.pattern('^[\u0621-\u064A0-9 -_ ]+$'),
      ]),
      road_name_en: new FormControl('', Validators.required),
      status_id: new FormControl('', Validators.required),
      note: new FormControl(''),
    });
  }
  get f() {
    return this.roadForm as FormGroup;
  }
  get road_name_ar() {
    return this.f?.controls['road_name_ar'] as FormControl;
  }
  get road_name_en() {
    return this.f.controls['road_name_en'] as FormControl;
  }
  get status_id() {
    return this.f.controls['status_id'] as FormControl;
  }
  get note() {
    return this.f.controls['note'] as FormControl;
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

  editModel(singleRoad: any) {
    this.holdSingleRoad = singleRoad as Roads;
    this.road_name_ar.setValue(singleRoad.road_name_ar);
    this.road_name_en.setValue(singleRoad.road_name_en);
    this.status_id.setValue(singleRoad.status_id?.status_id);
    this.note.setValue(singleRoad.note);
    this.isNewMode = false;
    this.isEditMode = true;
    this.isDeleteMode = false;
    this.isShowModel = false;
    this.modelService.setNewMode();
  }

  deleteModel(singleRoad: any) {
    this.holdSingleRoad = singleRoad as Roads;
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
    if (this.roadForm.invalid) return;
    let data = this.roadForm.getRawValue();
    console.log(data);
    this.apiService.PostMethodWithPipe('roads/roads/', data).subscribe({
      next: (res: any) => {
        this.roadForm.reset();
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
    if (this.roadForm.invalid) return;
    let data = this.roadForm.getRawValue();
    console.log(data);
    let sendData = { ...this.holdSingleRoad, ...data };
    this.apiService
      .UpdateMethodWithPipe('roads/roads/', null, sendData)
      .subscribe({
        next: (res: any) => {
          this.roadForm.reset();
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
      .DeleteMethodWithPipe('roads/roads/', null, {
        road_id: this.holdSingleRoad.road_id,
      })
      .subscribe({
        next: (res: any) => {
          this.roadForm.reset();
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
        this.holdRoadStatusList = res;
      },
      error: (error) => {
        this.toastr.error(error);
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      },
    });
  }

  RoadName!: Roads;
  handleShowLane(rowDate: any) {
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.isShowModel = true;
    this.RoadName = rowDate.road_name_ar;
    this.getListOfLane(rowDate.road_id);
    this.modelService.setNull();
    this.modelService.closeModel('success');
  }

  getListOfLane(road_id: number) {
    this.apiService
      .GetMethodWithPipe(
        `roads/gates/?field_name=road_id&field_value=${road_id}`
      )
      .subscribe({
        next: (res: Gates[]) => {
          this.holdListOfGates.next(res);
          this.modelService.setNewMode();
        },
        error: (error: any) => {
          this.toastr.error(error);
          let errorz = new ErrorView(this.toastr);
          errorz.showError(error);
        },
      });
  }
}
