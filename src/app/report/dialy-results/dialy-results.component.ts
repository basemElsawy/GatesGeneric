import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
const htmlToPdfmake = require('html-to-pdfmake');
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-dialy-results',
  templateUrl: './dialy-results.component.html',
  styleUrls: ['./dialy-results.component.css'],
})
export class DialyResultsComponent implements OnInit {
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

  handleResultOfSearch(searchResult: FilterResult) {
    if (searchResult.road_id && searchResult.gate_id) {
      clearInterval(this.timer);
      this.getGateDetials(searchResult.gate_id);
    } else if (searchResult.gate_id && searchResult.date) {
      this.getReportData(searchResult.gate_id, searchResult.date);
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

  FetchedReport: any;
  FetchedReportHeader: any;
  parsedReportHeader: any[] = [];
  ShowReportTable: boolean = false;
  parsedDetails: any[] = [];
  choosedDate: any;
  totalCount!: number;
  getReportData(gate_id: number, date: string) {
    this.choosedDate = date;
    this.apiService
      .GetMethodWithPipe(`reports/daily_gate/?gate_id=${gate_id}&date=${date}`)
      .subscribe({
        next: (res: any) => {
          this.FetchedReportHeader = [];
          if (res) {
            this.ShowReportTable = true;
            this.FetchedReport = {
              shifts_data: res.shifts,
              shifts_detail_previous: res.shifts_detail_previous,
              total_day: res.total_day,
              total_night: res.total_night,
            };
            this.totalCount = 0;
            this.totalCount =
              this.FetchedReport.shifts_detail_previous +
              this.FetchedReport.total_night +
              this.FetchedReport.total_day;
            this.FetchedReportHeader = res.headers;
            this.FetchedReportHeader.forEach((element: any) => {
              if (element.details_id != 1) {
                this.parsedReportHeader.push({
                  details_name_ar: element.details_name_ar,
                });
              }
            });
          } else {
            this.ShowReportTable = false;
            this.FetchedReport = [];
            this.FetchedReportHeader = [];
          }
          console.log(this.parsedReportHeader.length);
        },
        error: (error: any) => {
          let errorz = new ErrorView(this.toastr);
          errorz.showError(error);
        },
      });
  }

  @ViewChild('pdfTable') pdfTable!: ElementRef;

  downloadAsPDF() {
    const pdfTable = this.pdfTable.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).open();
  }

  Print(): void {
    window.print();
  }
}
