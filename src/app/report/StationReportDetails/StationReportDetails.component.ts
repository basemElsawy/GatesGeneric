import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ErrorView } from 'src/app/classes/ErrorView';
import { RequestService } from 'src/app/https/request.service';
import { FilterResult } from 'src/app/Interfaces/FilterDropDown';
import { Gates } from 'src/app/Interfaces/Gates';
import { Lane } from 'src/app/Interfaces/Lane';
import { Roads } from 'src/app/Interfaces/roads';
import { Vehicle } from 'src/app/Interfaces/vehicle';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-StationReportDetails',
  templateUrl: './StationReportDetails.component.html',
  styleUrls: ['./StationReportDetails.component.css'],
})
export class StationReportDetailsComponent implements OnInit {
  searchform!: FormGroup;
  holdOriginalData: Subject<any> = new Subject<any>();
  holdListOfRoads: Subject<Roads[]> = new Subject<Roads[]>();
  holdListOfGates: Subject<Gates[]> = new Subject<Gates[]>();
  holdListOfLanes: Subject<Lane[]> = new Subject<Lane[]>();
  timer: any;
  isEmpty: any;
  holdListOfSystemView: any;

  holdListOfCategories: Subject<Vehicle[]> = new Subject<Vehicle[]>();

  bsValue: Date = new Date(2017, 7);
  minMode: BsDatepickerViewMode = 'month'; // change for month:year

  bsConfig!: Partial<BsDatepickerConfig>;

  constructor(
    private apiService: RequestService,
    private toastr: ToastrService,
    protected lang: LangService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // this.isEmpty.next(false);
    this.getCurrentLanguage();
    this.bsConfig = Object.assign(
      {},
      {
        minMode: this.minMode,
      }
    );
    this.searchform = this.fb.group({
      dateYear: [null, Validators.required],
    });
  }

  getCurrentLanguage(): string {
    let langWeb = this.lang.getcurrentLange().getValue();
    return langWeb;
  }

  // ShowneededData() {
  //   this.searchform.controls['dateYear'].value;
  //   let x = this.searchform.controls['dateYear'].value.split('-');
  // }

  getGateDetials(gate_id: number) {
    if (gate_id) {
      this.getMethodForGate(gate_id);
      this.timer = setInterval(() => {
        this.getMethodForGate(gate_id);
      }, 1000 * 4);
    }
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

  handleResultOfSearch(searchResult: FilterResult) {
    if (searchResult.road_id && searchResult.gate_id) {
      clearInterval(this.timer);
      this.getGateDetials(searchResult.gate_id);
    } else if (
      searchResult.gate_id &&
      searchResult.date &&
      searchResult.date2
    ) {
      this.generateDialyReports(searchResult.date, searchResult.year);
    } else {
      if (searchResult.road_id) {
        this.getListOfGate(searchResult.road_id);
      }
    }
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

  fetchedReportData: any = [];
  fetchedGates: any[] = [];
  date: any;
  year: any;
  total: any;
  showFetchedData!: boolean;
  generateDialyReports(date?: any, year?: any) {
    let monthYear = this.searchform.controls['dateYear'].value.split('-');
    year = monthYear[0];
    this.year = year;
    date = monthYear[1];
    this.date = date;
    this.apiService
      .GetMethodWithPipe(`reports/monthly_value/?month=${date}&year=${year}`)
      .subscribe({
        next: (res: any) => {
          this.fetchedReportData = res;
          this.fetchedGates = [];
          this.total = 0;
          this.fetchedReportData.forEach((element: any) => {
            element.gates.forEach((ele: any) => {
              this.total += ele.total;
              this.showFetchedData = true;
              if (this.fetchedGates.length == 0) {
                this.fetchedGates.push({
                  name: ele.gate_name_ar,
                  gate_id: ele.gate_id,
                  total: ele.total,
                });
              } else {
                let foundRepeated = this.fetchedGates.find((el) => {
                  return el.gate_id === ele.gate_id;
                });
                if (foundRepeated) {
                  foundRepeated = null;
                  return;
                } else {
                  this.fetchedGates.push({
                    name: ele.gate_name_ar,
                    gate_id: ele.gate_id,
                    total: ele.total,
                  });
                }
              }
            });
          });
        },
        error: (error: any) => {},
      });
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

  print() {
    window.print();
  }

  getAllneededgatesTotal() {}
}
