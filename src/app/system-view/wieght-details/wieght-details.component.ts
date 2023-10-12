import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { Governorates } from 'src/app/Interfaces/Governorates';
import { ListOfDataKey } from 'src/app/Interfaces/ListOfDataKeys';
import { SystemView } from 'src/app/Interfaces/SystemView';
import { TableFormate } from 'src/app/Interfaces/TableFormate';
import { RequestService } from 'src/app/https/request.service';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import { ControlModelService } from 'src/app/shared-serviceses/Model/control-model.service';

@Component({
  selector: 'app-wieght-details',
  templateUrl: './wieght-details.component.html',
  styleUrls: ['./wieght-details.component.css'],
})
export class WieghtDetailsComponent implements OnInit {
  isNewMode = false;
  isEditMode = false;
  isDeleteMode = false;
  showInitialData: boolean = false;
  isSearchByGov: boolean = false;
  searchByGovData: any[] = [];
  page: number = 1;
  pageSize: number = 5;
  updateApi: EventEmitter<any> = new EventEmitter();
  holdOriginalData: Subject<any> = new Subject<any>();
  isEmpty: Subject<boolean> = new Subject<boolean>();
  holdListOfSystemView: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  Governroates: Governorates[] = [];
  searchForm!: FormGroup;
  listOfInfoHeader: ListOfDataKey[] = [
    { key: 'gate_name' },
    { key: 'gov_name' },
    { key: '' },
  ];
  listOfStatusHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'اسم البوابة', en: 'Gate name' },
    { ar: 'المحافظة', en: 'Governorate' },
    { ar: 'حالة البوابة', en: 'Gate status' },
  ];

  searchlistOfStatusHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'اسم البوابة', en: 'Gate name' },
    { ar: 'حالة البوابة', en: 'Gate Status' },
  ];

  searchlistOfInfoHeader: ListOfDataKey[] = [
    { key: 'gate_name_ar' },
    { key: 'status_id', sub: 'status_name_ar' },
  ];
  constructor(
    protected lang: LangService,
    private modelService: ControlModelService,
    private apiService: RequestService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getCurrentLanguage();
    this.isEmpty.next(false);
    this.getFilteredFetchedData();
    this.getAllGovernorates();
    this.searchForm = this.fb.group({
      id: [null, Validators.required],
    });
  }

  getCurrentLanguage(): string {
    let langWeb = this.lang.getcurrentLange().getValue();
    return langWeb;
  }

  handlListOfData(data: any) {
    this.holdOriginalData.next(data);
  }

  getAllResults(ev: any) {
    debugger;
    if (ev.target.value == 'allGovs') {
      this.getFilteredFetchedData();
    } else {
      this.getSearchResultsByGovs();
    }
  }

  getFilteredFetchedData() {
    this.isSearchByGov = false;
    this.apiService
      .GetMethodWithPipe(
        `roads/weight-shift-detail/?field_name=shift_status&field_value=true`
      )
      .subscribe({
        next: (res) => {
          this.showInitialData = true;
          if (res.length > 0) {
            this.isEmpty.next(true);
            this.holdListOfSystemView.next(res);
          } else {
            this.isEmpty.next(false);
            this.showInitialData = false;
            this.holdListOfSystemView.next([]);
          }
        },
        error: (error) => {
          this.toastr.error('لا يوجد بيانات حالياً');
          this.isEmpty.next(false);
          this.holdListOfSystemView.next([]);
          this.showInitialData = false;
        },
      });
  }

  getAllGovernorates() {
    this.apiService.GetMethodWithPipe('roads/governorate/').subscribe({
      next: (res) => {
        this.Governroates = res;
      },
      error: (error) => {
        this.toastr.error('يوجد خطأ في تحميل بيانات المحافظات');
      },
    });
  }

  getSearchResultsByGovs() {
    let choosedGov = this.searchForm.controls['id'].value;
    this.apiService
      .GetMethodWithPipe(
        `roads/gates/?field_name=gov&field_value=${choosedGov}`
      )
      .subscribe({
        next: (res) => {
          this.searchByGovData = res;
          this.isSearchByGov = true;
          this.showInitialData = false;
        },
        error: (error) => {
          this.toastr.error('يوجد خطأ في تحميل بيانات البحث ');
        },
      });
  }
}
