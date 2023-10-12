import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { RequestService } from 'src/app/https/request.service';
import { Gates } from 'src/app/Interfaces/Gates';
import { Lane } from 'src/app/Interfaces/Lane';
import { Roads } from 'src/app/Interfaces/roads';
import { Vehicle } from 'src/app/Interfaces/vehicle';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import { FilterResult } from 'src/app/Interfaces/FilterDropDown';
import { SystemView } from 'src/app/Interfaces/SystemView';
import { ErrorView } from 'src/app/classes/ErrorView';
import { TableFormate } from 'src/app/Interfaces/TableFormate';
// import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';

//@ts-ignore

@Component({
  selector: 'app-StaticalStationDetails',
  templateUrl: './StaticalStationDetails.component.html',
  styleUrls: ['./StaticalStationDetails.component.css'],
})
export class StaticalStationDetailsComponent implements OnInit {
  holdOriginalData: Subject<any> = new Subject<any>();
  holdListOfRoads: Subject<Roads[]> = new Subject<Roads[]>();
  holdListOfGates: Subject<Gates[]> = new Subject<Gates[]>();
  holdListOfLanes: Subject<Lane[]> = new Subject<Lane[]>();
  holdListOfCategories: Subject<Vehicle[]> = new Subject<Vehicle[]>();
  isEmpty: Subject<boolean> = new Subject<boolean>();
  holdListOfSystemView: BehaviorSubject<SystemView[]> = new BehaviorSubject<
    SystemView[]
  >([]);
  timer: any;
  constructor(
    private apiService: RequestService,
    private toastr: ToastrService,
    protected lang: LangService,
    private datePipe: DatePipe
  ) {}

  type = 'bar';
  options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      yAxes: [
        {
          ticks: {
            max: 10,
            min: 0,
          },
        },
      ],
    },
  };

  data: any;
  barchart: any;

  ngOnInit() {
    this.isEmpty.next(false);
    this.getCurrentLanguage();
    this.getListOfRoads();
  }

  getCurrentLanguage(): string {
    let langWeb = this.lang.getcurrentLange().getValue();
    return langWeb;
  }

  handleResultOfSearch(searchResult: FilterResult) {
    if (searchResult.road_id && searchResult.gate_id) {
      clearInterval(this.timer);
      this.getGateDetials(searchResult.gate_id);
    } else if (
      searchResult.gate_id ||
      searchResult.date ||
      searchResult.date2
    ) {
      this.generateStatisticalReport(
        searchResult.gate_id,
        searchResult.date,
        searchResult.date2
      );
    } else {
      if (searchResult.road_id) {
        this.getListOfGate(searchResult.road_id);
      }
    }
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

  FetchedReportData: any;
  lane_details: any[] = [];
  shift_details: any[] = [];
  labels: any[] = [];
  datasets: any[] = [];
  generateStatisticalReport(gate_id: any, from_date: any, to_date: any) {
    this.apiService
      .GetMethodWithPipe(
        `reports/daily_gate_totals/?gate_id=${gate_id}&from_date=${from_date}&to_date=${to_date}`
      )
      .subscribe({
        next: (res: any) => {
          this.shift_details = [];
          this.lane_details = res.lane_detail;
          this.lane_details.forEach((element) => {
            element.shifts_detail.forEach((ele: any) => {
              this.shift_details.push({
                car_classe_Name_Ar: ele.car_classe_Name_Ar,
                car_classe_Name_En: ele.car_classe_Name_En,
                car_classe_id: ele.car_classe_id,
                directions_id: ele.directions_id,
                lane_code: ele.lane_code,
                lane_id: ele.lane_id,
                total_cars: ele.total_cars,
                total_price: ele.total_price,
              });
            });
          });
          this.labels = [];
          this.datasets = [];
          this.barchart = this.shift_details;
          this.barchart.forEach((element: any) => {
            this.labels.push(element.lane_code);
            this.datasets.push({
              label: element.car_classe_Name_Ar,
              data: [element.total_cars],
              backgroundColor: this.GenerateColors(),
            });
          });
          this.data = {
            labels: this.labels,
            datasets: this.datasets,
          };

          // this.FetchedReportData = {
          //   lane_detail: res.lane_detail,
          //   directions_name_ar: res.directions_name_ar,
          //   total_cars: res.total_cars,
          //   total_price: res.total_price
          // }
        },
        error: (error) => {
          let errorz = new ErrorView(this.toastr);
          errorz.showError(error);
        },
      });
  }

  //here is a function needed to generate colors
  color: any;
  GenerateColors() {
    for (let i = 0; i < this.shift_details.length; i++) {
      this.color =
        'rgb(' +
        Math.floor(Math.random() * 256) +
        ', ' +
        Math.floor(Math.random() * 256) +
        ', ' +
        Math.floor(Math.random() * 256) +
        ')';
    }
    return this.color;
  }
}
