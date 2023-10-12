import { Component, EventEmitter, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { RequestService } from 'src/app/https/request.service';
import { Gates } from 'src/app/Interfaces/Gates';
import { Lane } from 'src/app/Interfaces/Lane';
import { Roads } from 'src/app/Interfaces/roads';
import { TableFormate } from 'src/app/Interfaces/TableFormate';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import { ErrorView } from 'src/app/classes/ErrorView';
import { FilterResult } from 'src/app/Interfaces/FilterDropDown';
import { SystemView } from 'src/app/Interfaces/SystemView';
import { DatePipe } from '@angular/common';
import { Vehicle } from 'src/app/Interfaces/vehicle';

@Component({
  selector: 'app-totaloperationCategory',
  templateUrl: './totaloperationCategory.component.html',
  styleUrls: ['./totaloperationCategory.component.css'],
})
export class TotaloperationCategoryComponent implements OnInit {
  updateApi: EventEmitter<any> = new EventEmitter();
  holdOriginalData: Subject<any> = new Subject<any>();
  holdListOfRoads: Subject<Roads[]> = new Subject<Roads[]>();
  holdListOfGates: Subject<Gates[]> = new Subject<Gates[]>();
  holdListOfLanes: Subject<Lane[]> = new Subject<Lane[]>();
  holdListOfCategories: Subject<Vehicle[]> = new Subject<Vehicle[]>();
  holdListOfSystemView: BehaviorSubject<SystemView[]> = new BehaviorSubject<
    SystemView[]
  >([]);
  isEmpty: Subject<boolean> = new Subject<boolean>();

  timer: any;

  page: number = 1;
  pageSize: number = 5;
  listOfHeader: TableFormate[] = [
    { ar: 'رقم الحارة', en: 'Lane number' },
    { ar: ' اسم البوابة ', en: 'Gate name' },
    { ar: 'اتجاه المرور', en: 'Direction' },
    { ar: 'الفئة', en: 'Category' },
    { ar: 'عدد السيارات', en: 'Car count' },
    { ar: 'المبالغ', en: 'Total car count' },
  ];

  constructor(
    private apiService: RequestService,
    private toastr: ToastrService,
    protected lang: LangService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.isEmpty.next(false);
    this.getCurrentLanguage();
    this.getListOfRoads();
    this.getListOfCategories();
  }

  getCurrentLanguage(): string {
    let langWeb = this.lang.getcurrentLange().getValue();
    return langWeb;
  }

  handleDataChange(pageValue: number) {
    this.page = pageValue;
    this.updateApi.emit(pageValue);
  }

  handlListOfData(data: any) {
    this.holdOriginalData.next(data);
  }

  getListOfRoads() {
    this.apiService.GetMethodWithPipe(`roads/roads/`).subscribe({
      next: (res: Roads[]) => {
        this.holdListOfRoads.next(res);
      },
      error: (error: any) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      },
    });
  }

  getListOfCategories() {
    this.apiService.GetMethodWithPipe(`car`).subscribe({
      next: (res: Vehicle[]) => {
        this.holdListOfCategories.next(res);
      },
      error: (error: any) => {
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      },
    });
  }

  getGateDetials(gate_id: number) {
    if (gate_id) {
      this.getMethodForGate(gate_id);
      this.timer = setInterval(() => {
        this.getMethodForGate(gate_id);
      }, 1000 * 4);
    } else {
    }
  }

  getListOfGate(road_id: number) {
    this.apiService
      .GetMethodWithPipe(
        `roads/gates/?field_name=road_id&field_value=${road_id}`
      )
      .subscribe({
        next: (res: Gates[]) => {
          // this.holdListOfRoads.next(this.holdRow)
          this.holdListOfGates.next(res);
        },
        error: (error: any) => {
          let errorz = new ErrorView(this.toastr);
          errorz.showError(error);
        },
      });
  }

  getMethodForGate(gate_id: number) {
    this.apiService
      .GetMethodWithPipe(`roads/lane_details_under_gate/?gate_id=${gate_id}`)
      .subscribe({
        next: (res: any[]) => {
          console.log(res);
          if (res.length > 0) {
            this.isEmpty.next(true);
            res.forEach((el) => {
              el.lane.status_direction = el.lane.status_id.status_name_ar;
              el.lane.directions_name =
                el.lane.directions_id.directions_name_ar;
              el.lane.created_at &&
                (el.lane.created_Custom =
                  this.datePipe.transform(
                    new Date(el.lane.created_at),
                    'yyyy-MM-dd HH:MM'
                  ) || el.lane.created_at);
              el.lane.shift_id &&
                el.lane.shift_id.shift_close_date &&
                (el.lane.shift_id.ShiftClose =
                  this.datePipe.transform(
                    new Date(el.lane.shift_id?.shift_close_date),
                    'yyyy-MM-dd HH:MM'
                  ) || el.lane.shift_id?.shift_close_date);
            });
            this.holdListOfSystemView.next(res);

            // setTimeout(() => { this.view.nativeElement.append(), 1000 })
          } else {
            this.isEmpty.next(false);
            this.holdListOfSystemView.next([]);
          }
        },
        error: (error: any) => {
          let errorz = new ErrorView(this.toastr);
          errorz.showError(error);
        },
      });
  }
  from_date: any;
  to_date: any;
  handleResultOfSearch(searchResult: FilterResult) {
    if (searchResult.road_id && searchResult.gate_id) {
      clearInterval(this.timer);
      this.getGateDetials(searchResult.gate_id);
    } else if (searchResult.gate_id && searchResult.date && searchResult.date) {
      this.getDialyReportResults(
        searchResult.gate_id,
        searchResult.date,
        searchResult.date2
      );
      this.from_date = searchResult.date;
      this.to_date = searchResult.date2;
    } else {
      if (searchResult.road_id) {
        this.getListOfGate(searchResult.road_id);
      }
    }
  }
  FetchedDialyReportData: any;
  ShowReportData: boolean = false;
  getDialyReportResults(gate_id: number, from_date: any, to_date: any) {
    this.apiService
      .GetMethodWithPipe(
        `reports/daily_gate_totals/?gate_id=${gate_id}&from_date=${from_date}&to_date=${to_date}`
      )
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.ShowReportData = true;
            this.FetchedDialyReportData = {
              lane_detail: res.lane_detail,
              total_cars: res.total_cars,
              totla_price: res.total_price,
            };
          }
        },
        error: (error: any) => {
          let errorz = new ErrorView(this.toastr);
          errorz.showError(error);
        },
      });
  }

  print() {
    window.print();
  }
}
