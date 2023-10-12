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
import { ListOfDataKey } from 'src/app/Interfaces/ListOfDataKeys';
import { RoadStatus } from 'src/app/Interfaces/RoadStatus';
import { TableFormate } from 'src/app/Interfaces/TableFormate';
import { Vehicle } from 'src/app/Interfaces/vehicle';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import { ControlModelService } from 'src/app/shared-serviceses/Model/control-model.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vehicle-classes',
  templateUrl: './vehicle-classes.component.html',
  styleUrls: ['./vehicle-classes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleClassesComponent implements OnInit {
  public readonly img_url: string = environment.img_url;
  baseUrl = environment.base_url;
  isNewMode = false;
  isEditMode = false;
  isDeleteMode = false;
  isShowModel = false;
  page: number = 1;
  pageSize: number = 5;
  holdCollectionDataAfterFilter: Subject<any> = new Subject();
  holdOriginalData: Subject<Vehicle[]> = new Subject<Vehicle[]>();
  holdListOfFilterData: Subject<Vehicle[]> = new Subject<Vehicle[]>();
  holdSingleRoad!: Vehicle;
  holdRoadStatusList: RoadStatus[] = [];
  updateApi: EventEmitter<any> = new EventEmitter();
  showImageLinks: string = '';
  constructor(
    protected lang: LangService,
    private modelService: ControlModelService,
    private apiService: RequestService,
    private toastr: ToastrService
  ) {}
  holdListOfDatakeys: ListOfDataKey[] = [
    { key: 'car_classe_Name_Ar' },
    { key: 'car_classe_Name_En' },
    { key: 'status_id', sub: 'status_name_ar' },
    { key: 'note' },
  ];
  listOfHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'فئة المركبة بالعربية', en: 'Vehicle Class Name ar' },
    { ar: 'فئة المركبة بالانجليزية', en: 'Vehicle Class Name En' },
    { ar: ' حالة فئة المركبة', en: 'Vehicle Class Status' },
    { ar: 'ملاحظة', en: 'note' },
    { ar: 'اعدادات', en: 'options' },
  ];

  holdImageUpload!: File;
  vehicleClassForm!: FormGroup;
  ngOnInit(): void {
    this.getCurrentLanguage();
    this.initalForm();
    this.roadStatusLookup();
  }

  initalForm() {
    this.vehicleClassForm = new FormGroup({
      car_classe_Name_Ar: new FormControl('', Validators.required),
      car_classe_Name_En: new FormControl('', Validators.required),
      status_id: new FormControl('', Validators.required),
      note: new FormControl(''),
      car_image: new FormControl(null),
    });
  }
  get f() {
    return this.vehicleClassForm as FormGroup;
  }
  get car_classe_Name_Ar() {
    return this.f?.controls['car_classe_Name_Ar'] as FormControl;
  }
  get car_classe_Name_En() {
    return this.f.controls['car_classe_Name_En'] as FormControl;
  }
  get status_id() {
    return this.f.controls['status_id'] as FormControl;
  }
  get note() {
    return this.f.controls['note'] as FormControl;
  }

  get car_image() {
    return this.f.controls['car_image'] as FormControl;
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
    this.holdSingleRoad = singleRoad as Vehicle;
    this.car_classe_Name_Ar.setValue(singleRoad.car_classe_Name_Ar);
    this.car_classe_Name_En.setValue(singleRoad.car_classe_Name_En);
    this.status_id.setValue(singleRoad.status_id?.status_id);
    this.note.setValue(singleRoad.note);

    this.showImageLinks = this.baseUrl + 'static/' + singleRoad.car_image;
    console.log(this.showImageLinks);
    this.isNewMode = false;
    this.isEditMode = true;
    this.isDeleteMode = false;
    this.isShowModel = false;
    this.modelService.setNewMode();
  }

  deleteModel(singleRoad: any) {
    this.holdSingleRoad = singleRoad as Vehicle;
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = true;
    this.modelService.setNewMode();
  }

  img: any;
  handleShowLane(singleViechle: any) {
    this.isShowModel = true;
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.img = singleViechle.car_image;
    console.log(this.img);
    this.modelService.setNull();
    this.modelService.closeModel('success');
    this.modelService.setNewMode();
  }

  handleInputCallback(val: any) {}

  handleFileUpload(e: any) {
    // this.holdImageUpload = e.target.files[0];
    this.holdImageUpload = e;
    // if (
    //   e.target.files.length > 0 &&
    //   e.target.files[0].type.indexOf('image') > -1
    // ) {
    // }
  }

  submitRequest() {
    if (this.isNewMode) {
      this.sendDataToServer();
    } else if (this.isEditMode) {
      this.editDataInServer();
    } else if (this.isDeleteMode) {
      this.removeDataFormServer();
    }
  }

  ViechelsFormData = new FormData();
  sendDataToServer() {
    let body = {
      car_classe_Name_Ar: this.car_classe_Name_Ar.value,
      car_classe_Name_En: this.car_classe_Name_En.value,
      status_id: this.status_id.value,
      note: this.note.value,
      car_image: this.holdImageUpload,
    };
    // let data = this.vehicleClassForm.getRawValue();
    // let formData = new FormData();
    // for (const [key, value] of Object.entries(data)) {
    //   console.log(key, value);
    //   formData.append(key, `${value}`);
    // }
    // // formData.delete('car_image');
    // formData.append('car_image', this.holdImageUpload);
    this.apiService.PostMethodWithPipe('car/', body).subscribe({
      next: (res: any) => {
        this.vehicleClassForm.reset();
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
    if (this.vehicleClassForm.invalid) return;
    let data = this.vehicleClassForm.getRawValue();
    let formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, `${value}`);
    }
    formData.delete('car_image');
    formData.append('car_image', this.holdImageUpload);
    formData.append('car_classe_id', `${this.holdSingleRoad.car_classe_id}`);
    let sendData = { ...this.holdSingleRoad, ...data };
    this.apiService.UpdateMethodWithPipe('car/', null, sendData).subscribe({
      next: (res: any) => {
        this.vehicleClassForm.reset();
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
      .DeleteMethodWithPipe('car/', null, {
        car_classe_id: this.holdSingleRoad.car_classe_id,
      })
      .subscribe({
        next: (res: any) => {
          this.vehicleClassForm.reset();
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
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      },
    });
  }
}
