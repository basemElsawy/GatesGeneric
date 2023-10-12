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
import { Governorates } from 'src/app/Interfaces/Governorates';
import { ListOfDataKey } from 'src/app/Interfaces/ListOfDataKeys';
import { Roads } from 'src/app/Interfaces/roads';
import { RoadStatus } from 'src/app/Interfaces/RoadStatus';
import { TableFormate } from 'src/app/Interfaces/TableFormate';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import { ControlModelService } from 'src/app/shared-serviceses/Model/control-model.service';

@Component({
  selector: 'app-gates',
  templateUrl: './gates.component.html',
  styleUrls: ['./gates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GatesComponent implements OnInit {
  isNewMode = false;
  govs: Governorates[] = [];
  isEditMode = false;
  isDeleteMode = false;
  isShowModel = false;
  page: number = 1;
  pageSize: number = 5;
  holdCollectionDataAfterFilter: Subject<any> = new Subject();
  holdOriginalData: Subject<Gates[]> = new Subject<Gates[]>();
  holdListOfFilterData: Subject<Gates[]> = new Subject<Gates[]>();
  holdSingleRaw!: Gates;
  holdStatusList: RoadStatus[] = [];
  holdListOfRoads: Roads[] = [];
  updateApi: EventEmitter<any> = new EventEmitter();
  holdListOfDirection: Subject<Direction[]> = new Subject<Direction[]>();
  constructor(
    protected lang: LangService,
    private modelService: ControlModelService,
    private apiService: RequestService,
    private toastr: ToastrService
  ) {}
  holdListOfDatakeys: ListOfDataKey[] = [
    { key: 'gate_name_ar' },
    { key: 'road_id', sub: 'road_name_ar' },
    { key: 'status_id', sub: 'status_name_ar' },
    { key: 'note' },
  ];
  holdLisOfDirection: ListOfDataKey[] = [
    { key: 'directions_id' },
    { key: 'directions_name_ar' },
    { key: 'status_id', sub: 'status_name_ar' },
    { key: 'note' },
  ];

  listOfHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'اسم البوابة بالعربية', en: 'Gate Name ar' },
    { ar: 'اسم الطريق', en: 'Road Name' },
    { ar: ' حالة البوابة', en: 'Status' },
    { ar: 'ملاحظة', en: 'note' },
    { ar: 'اعدادات', en: 'options' },
  ];

  listOfDirectionHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'كود الاتجاه', en: 'Direction Code' },
    { ar: 'الاتجاه بالعربية', en: 'Direction Name ar' },
    { ar: 'الحالة', en: 'Direction status' },
    { ar: 'الملاحظات', en: 'Direction note' },
  ];

  gateForm!: FormGroup;
  ngOnInit(): void {
    this.getCurrentLanguage();
    this.initalForm();
    this.roadStatusLookup();
    this.getListOfRoads();
    this.getAllGovernorates();
  }

  initalForm() {
    this.gateForm = new FormGroup({
      gate_name_ar: new FormControl('', [
        Validators.required,
        Validators.pattern('^[\u0621-\u064A0-9 -_ ]+$'),
      ]),
      gate_name_en: new FormControl('', Validators.required),
      status_id: new FormControl('', Validators.required),
      road_id: new FormControl('', Validators.required),
      note: new FormControl(''),
      gov: new FormControl('', Validators.required),
    });
  }
  get f() {
    return this.gateForm as FormGroup;
  }
  get gate_name_ar() {
    return this.f?.controls['gate_name_ar'] as FormControl;
  }
  get gate_name_en() {
    return this.f.controls['gate_name_en'] as FormControl;
  }
  get status_id() {
    return this.f.controls['status_id'] as FormControl;
  }
  get road_id() {
    return this.f.controls['road_id'] as FormControl;
  }
  get note() {
    return this.f.controls['note'] as FormControl;
  }
  get gov() {
    return this.f.controls['gov'] as FormControl;
  }

  get hasDropDownError() {
    return (
      this.gateForm.get('road_id')?.touched &&
      this.gateForm.get('road_id')?.errors?.required
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

  editModel(singleGate: any) {
    debugger;
    this.holdSingleRaw = singleGate as Gates;
    this.gate_name_ar.setValue(singleGate.gate_name_ar);
    this.gate_name_en.setValue(singleGate.gate_name_en);
    this.status_id.setValue(singleGate.status_id?.status_id);
    this.road_id.setValue(singleGate.road_id?.road_id);
    this.note.setValue(singleGate.note);
    this.isNewMode = false;
    this.isEditMode = true;
    this.isDeleteMode = false;
    this.isShowModel = false;
    this.modelService.setNewMode();
  }

  deleteModel(singleGate: any) {
    this.holdSingleRaw = singleGate as Gates;
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

  getAllGovernorates() {
    this.apiService.GetMethodWithPipe('roads/governorate/').subscribe({
      next: (res) => {
        this.govs = res;
      },
      error: (error) => {
        this.toastr.error('يوجد خطأ في تحميل بيانات المحافظات');
      },
    });
  }

  sendDataToServer() {
    debugger;
    if (this.gateForm.invalid) return;
    let data = this.gateForm.getRawValue();
    console.log(data);
    this.apiService.PostMethodWithPipe('roads/gates/', data).subscribe({
      next: (res: any) => {
        this.gateForm.reset();
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
    if (this.gateForm.invalid) return;
    let data = this.gateForm.getRawValue();
    console.log(data);
    let sendData = { ...this.holdSingleRaw, ...data };
    this.apiService
      .UpdateMethodWithPipe('roads/gates/', null, sendData)
      .subscribe({
        next: (res: any) => {
          this.gateForm.reset();
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
      .DeleteMethodWithPipe('roads/gates/', null, {
        gate_id: this.holdSingleRaw.gate_id,
      })
      .subscribe({
        next: (res: any) => {
          this.gateForm.reset();
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

  getListOfRoads() {
    this.apiService.GetMethodWithPipe('roads/roads/').subscribe({
      next: (res: any) => {
        this.holdListOfRoads = res;
      },
      error: (error: any) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      },
    });
  }

  GateName!: Gates;
  handleShowDirection(rowDate: any) {
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.isShowModel = true;
    this.GateName = rowDate.gate_name_ar;
    this.getListOfDirection(rowDate.gate_id);
    this.modelService.setNull();
    this.modelService.closeModel('success');
  }

  getListOfDirection(gate_id: number) {
    this.apiService
      .GetMethodWithPipe(
        `roads/directions/?field_name=gate_id&field_value=${gate_id}`
      )
      .subscribe({
        next: (res: Direction[]) => {
          this.holdListOfDirection.next(res);
          this.modelService.setNewMode();
        },
        error: (error: any) => {
          let errorz = new ErrorView(this.toastr);
          errorz.showError(error);
        },
      });
  }
}
