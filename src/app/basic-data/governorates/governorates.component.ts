import { Component, EventEmitter, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Governorates } from 'src/app/Interfaces/Governorates';
import { ListOfDataKey } from 'src/app/Interfaces/ListOfDataKeys';
import { TableFormate } from 'src/app/Interfaces/TableFormate';
import { ErrorView } from 'src/app/classes/ErrorView';
import { RequestService } from 'src/app/https/request.service';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import { ControlModelService } from 'src/app/shared-serviceses/Model/control-model.service';
@Component({
  selector: 'app-governorates',
  templateUrl: './governorates.component.html',
  styleUrls: ['./governorates.component.css'],
})
export class GovernoratesComponent implements OnInit {
  isNewMode = false;
  isEditMode = false;
  page: number = 1;
  holdSingleRaw!: Governorates;
  pageSize: number = 5;
  isDeleteMode = false;
  Governoratesform!: FormGroup;
  holdOriginalData: Subject<Governorates[]> = new Subject<Governorates[]>();
  updateApi: EventEmitter<any> = new EventEmitter();
  holdCollectionDataAfterFilter: Subject<any> = new Subject();
  holdListOfFilterData: Subject<Governorates[]> = new Subject<Governorates[]>();
  listOfHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'المحافظة', en: 'governorate' },
    { ar: 'المحافظة (EN)', en: 'governorate en' },
    { ar: 'اعدادات', en: 'options' },
  ];
  holdListOfDatakeys: ListOfDataKey[] = [
    { key: 'gov_name_ar' },
    { key: 'gov_name_en' },
  ];

  constructor(
    protected lang: LangService,
    private modelService: ControlModelService,
    private apiService: RequestService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.Governoratesform = this.fb.group({
      gov_name_en: [null, Validators.required],
      gov_name_ar: [null, Validators.required],
    });
    this.getCurrentLanguage();
  }

  get f() {
    return this.Governoratesform as FormGroup;
  }
  get nameAr() {
    return this.f?.controls['gov_name_ar'] as FormControl;
  }
  get nameEn() {
    return this.f?.controls['gov_name_en'] as FormControl;
  }

  openModel() {
    this.isNewMode = true;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.modelService.setNewMode();
  }

  getCurrentLanguage(): string {
    let langWeb = this.lang.getcurrentLange().getValue();
    return langWeb;
  }
  handleDataChange(pageValue: number) {
    this.page = pageValue;
    this.updateApi.emit(pageValue);
  }

  editModel(selectedGovs: any) {
    this.holdSingleRaw = selectedGovs as Governorates;
    this.nameAr.setValue(selectedGovs.gov_name_ar);
    this.nameEn.setValue(selectedGovs.gov_name_en);
    this.isNewMode = false;
    this.isEditMode = true;
    this.isDeleteMode = false;
    this.modelService.setNewMode();
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
  submitRequest() {
    if (this.isNewMode) {
      this.sendDataToServer();
    } else if (this.isEditMode) {
      this.editDataInServer();
    }
  }

  sendDataToServer() {
    if (this.Governoratesform.invalid) return;
    let data = this.Governoratesform.getRawValue();
    this.apiService.PostMethodWithPipe('roads/governorate/', data).subscribe({
      next: (res: any) => {
        this.Governoratesform.reset();
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
    if (this.Governoratesform.invalid) return;
    let data = this.Governoratesform.getRawValue();
    let sendData = { ...this.holdSingleRaw, ...data };
    this.apiService
      .UpdateMethodWithPipe('roads/governorate/', null, sendData)
      .subscribe({
        next: (res: any) => {
          this.Governoratesform.reset();
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
