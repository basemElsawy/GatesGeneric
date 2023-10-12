import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ErrorView } from 'src/app/classes/ErrorView';
import { RequestService } from 'src/app/https/request.service';
import { GateArm } from 'src/app/Interfaces/Gate-Arm';
import { Lane } from 'src/app/Interfaces/Lane';
import { ListOfDataKey } from 'src/app/Interfaces/ListOfDataKeys';
import { RoadStatus } from 'src/app/Interfaces/RoadStatus';
import { TableFormate } from 'src/app/Interfaces/TableFormate';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import { ControlModelService } from 'src/app/shared-serviceses/Model/control-model.service';

@Component({
  selector: 'app-gate-arm',
  templateUrl: './gate-arm.component.html',
  styleUrls: ['./gate-arm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GateArmComponent implements OnInit {
  isNewMode = false;
  isEditMode = false;
  isDeleteMode = false;
  page: number = 1;
  pageSize: number = 5;
  holdCollectionDataAfterFilter: Subject<any> = new Subject();
  holdOriginalData: Subject<GateArm[]> = new Subject<GateArm[]>();
  holdListOfFilterData: Subject<GateArm[]> = new Subject<GateArm[]>()
  holdSingleRaw!: GateArm;
  holdStatusList: RoadStatus[] = []
  holdListOfLane: Lane[] = []
  updateApi: EventEmitter<any> = new EventEmitter();;
  constructor(protected lang: LangService,
    private modelService: ControlModelService,
    private apiService: RequestService,
    private toastr: ToastrService) { }
  holdListOfDatakeys: ListOfDataKey[] = [{ key: "number" }, { key: "status_id", sub: 'status_name_ar' },/* { key: 'note' },*/ { key: 'lane_id', sub: 'lane_code' }];
  listOfHeader: TableFormate[] = [{ ar: '#', en: '#' },
  { ar: ' كود الكاميرة ', en: 'Camira Code' },
  { ar: ' حالة الكاميرة', en: 'Status' },
  // { ar: 'ملاحظة', en: 'note' },
  { ar: 'اسم الخط', en: 'lane Name' },
  { ar: 'اعدادات', en: 'options' }]


  gateArmForm!: FormGroup
  ngOnInit(): void {
    this.getCurrentLanguage();
    this.initalForm();
    this.roadStatusLookup();
    this.getListOfLane();
  }

  initalForm() {
    this.gateArmForm = new FormGroup({
      number: new FormControl('', Validators.required),
      status_id: new FormControl('', Validators.required),
      lane_id: new FormControl('', Validators.required),
      // note: new FormControl(''),
    })
  }
  get f() {
    return this.gateArmForm as FormGroup;
  }
  get number() {
    return this.f?.controls['number'] as FormControl;
  }

  get status_id() {
    return this.f.controls['status_id'] as FormControl;
  }
  get lane_id() {
    return this.f.controls['lane_id'] as FormControl;
  }
  // get note() {
  //   return this.f.controls['note'] as FormControl;
  // }
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

  openModel() {
    this.isNewMode = true;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.modelService.setNewMode()
  }

  editModel(singleGateArm: any) {
    this.holdSingleRaw = (singleGateArm as GateArm)
    this.number.setValue(singleGateArm.number)
    this.status_id.setValue(singleGateArm.status_id?.status_id)
    this.lane_id.setValue(singleGateArm.lane_id?.lane_id)
    // this.note.setValue(singleGateArm.note)
    this.isNewMode = false;
    this.isEditMode = true;
    this.isDeleteMode = false;
    this.modelService.setNewMode()
  }

  deleteModel(singleCamira: any) {
    this.holdSingleRaw = (singleCamira as GateArm)
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = true;
    this.modelService.setNewMode()
  }

  handleInputCallback(val: any) {

  }

  submitRequest() {

    if (this.isNewMode) {
      this.sendDataToServer()
    } else if (this.isEditMode) {
      this.editDataInServer()
    } else if (this.isDeleteMode) {
      this.removeDataFormServer()
    }
  }

  sendDataToServer() {
    if (this.gateArmForm.invalid) return;
    let data = this.gateArmForm.getRawValue();
    console.log(data);
    this.apiService.PostMethodWithPipe('roads/gatesarm/', data).subscribe({
      next: (res: any) => {
        this.gateArmForm.reset();
        this.updateApi.emit(res)
        this.modelService.closeModel('success')
      }, error: (error: any) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      }
    })

  }

  editDataInServer() {
    if (this.gateArmForm.invalid) return;
    let data = this.gateArmForm.getRawValue();
    console.log(data);
    let sendData = { ...this.holdSingleRaw, ...data }
    this.apiService.UpdateMethodWithPipe('roads/gatesarm/', null, sendData).subscribe({
      next: (res: any) => {
        this.gateArmForm.reset();
        this.updateApi.emit(res)
        this.modelService.closeModel('success')
      }, error: (error: any) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      }
    })

  }

  removeDataFormServer() {
    this.apiService.DeleteMethodWithPipe('roads/gatesarm/', null, { gate_arm_id: this.holdSingleRaw.gate_arm_id }).subscribe({
      next: (res: any) => {
        this.gateArmForm.reset();
        let x = Math.random() * 500
        this.updateApi.emit(x)
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

  roadStatusLookup() {
    this.apiService.GetMethodWithPipe('roads/status/').subscribe({
      next: (res: RoadStatus[]) => {
        this.holdStatusList = (res)
      }, error: error => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      }
    })
  }

  getListOfLane() {
    this.apiService.GetMethodWithPipe('roads/lane/').subscribe({
      next: (res: any) => {
        this.holdListOfLane = (res)
      }, error: error => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      }
    })
  }

}
