import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, isEmpty, Observable, of, Subject } from 'rxjs';
import { ErrorView } from 'src/app/classes/ErrorView';
import { RequestService } from 'src/app/https/request.service';
import { FilterResult } from 'src/app/Interfaces/FilterDropDown';
import { Gates } from 'src/app/Interfaces/Gates';
import { Lane } from 'src/app/Interfaces/Lane';
import { ListOfDataKey } from 'src/app/Interfaces/ListOfDataKeys';
import { Roads } from 'src/app/Interfaces/roads';
import { RoadStatus } from 'src/app/Interfaces/RoadStatus';
import { ShitTransaction } from 'src/app/Interfaces/ShitTransaction';
import { SystemView } from 'src/app/Interfaces/SystemView';
import { TableFormate } from 'src/app/Interfaces/TableFormate';
import { LangService } from 'src/app/shared-serviceses/Lang.service';
import { ControlModelService } from 'src/app/shared-serviceses/Model/control-model.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home-system',
  templateUrl: './home-system.component.html',
  styleUrls: ['./home-system.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeSystemComponent implements OnInit {
  private url = environment.base_url;
  isNewMode = false;
  isEditMode = false;
  isDeleteMode = false;
  page: number = 1;
  pageSize: number = 5;
  holdCollectionDataAfterFilter: Subject<any> = new Subject();
  holdOriginalData: Subject<any> = new Subject<any>();
  holdListOfFilterData: Subject<any> = new Subject<any>();
  holdSingleRoad!: any;
  holdRoadStatusList: RoadStatus[] = [];
  updateApi: EventEmitter<any> = new EventEmitter();
  holdRoadList: Roads[] = [];
  holdGateList: Gates[] = [];
  holdListOfRoads: Subject<Roads[]> = new Subject<Roads[]>();
  holdListOfGates: Subject<Gates[]> = new Subject<Gates[]>();
  holdListOfLanes: Subject<Lane[]> = new Subject<Lane[]>();
  holdListOfSystemView: BehaviorSubject<SystemView[]> = new BehaviorSubject<
    SystemView[]
  >([]);
  isEmpty: Subject<boolean> = new Subject<boolean>();
  holdListOfShiftDetails: Subject<ShitTransaction[]> = new Subject<
    ShitTransaction[]
  >();
  listOfHeader: ListOfDataKey[] = [
    { key: 'car_classe_name_ar' },
    { key: 'ticket_count' },
    { key: 'Total_Price' },
  ];
  listOfInfoHeader: ListOfDataKey[] = [
    { key: 'lane_code' },
    { key: 'status_direction' },
    { key: 'directions_name' },
  ];
  listOfDetailsVehicleHeader: ListOfDataKey[] = [
    { key: 'ticket_number_id' },
    { key: '' },
    { key: 'created_at', isDateTime: true },
    { key: 'price' },
    { key: 'camira_image_path', isImg: true },
    { key: 'camira_npr_image_path', isImg: true },
  ];
  listOfGateHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'الاسم', en: 'name' },
    { ar: 'العدد', en: 'Count' },
    { ar: 'السعر', en: 'Price' },
  ];
  listOfStatusHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'رقم الحارة', en: 'Lane code' },
    { ar: 'حالة الحارة', en: 'Lane state' },
    { ar: 'اتجاة الحارة', en: 'direction of lane' },
  ];

  listOfDetailsShiftHeader: TableFormate[] = [
    { ar: '#', en: '#' },
    { ar: 'رقم التذكرة', en: 'Taket No' },
    { ar: 'نوع الفئة', en: 'Vehical Type' },
    { ar: 'تاريخ و وقت الاصدار', en: 'Date& time of shift' },
    { ar: 'السعر', en: 'Price' },
    { ar: 'صورة العربة', en: 'Vehical Price' },
    { ar: 'صورة اللوحة', en: 'Vehical No' },
  ];
  timer: any;
  @ViewChild('view') view!: ElementRef<HTMLDivElement>;
  constructor(
    protected lang: LangService,
    private modelService: ControlModelService,
    private toastr: ToastrService,
    private apiService: RequestService,
    private datePipe: DatePipe
  ) { }
  ngOnInit(): void {
    this.isEmpty.next(false);
    this.getCurrentLanguage();
    this.getListOfRoads();
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
    this.modelService.setNewMode();
  }

  editModel(singleRoad: any) {
    this.isNewMode = false;
    this.isEditMode = true;
    this.isDeleteMode = false;
    this.modelService.setNewMode();
  }

  deleteModel(singleRoad: any) {
    this.isNewMode = false;
    this.isEditMode = false;
    this.isDeleteMode = true;
    this.modelService.setNewMode();
  }

  handleInputCallback(val: any) { }

  handleDataChange(pageValue: number) {
    this.page = pageValue;
    this.updateApi.emit(pageValue);
  }

  handleResultOfSearch(searchResult: FilterResult) {
    if (searchResult.road_id && searchResult.gate_id) {
      clearInterval(this.timer);
      this.getGateDetials(searchResult.gate_id);
    } else {
      if (searchResult.road_id) {
        this.getListOfGate(searchResult.road_id);
      }
      // if (searchResult.gate_id) {
      //   this.getListOfLane(searchResult.gate_id)
      // }
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
    } else {
    }
  }

  getMethodForGate(gate_id: number) {
    this.apiService
      .GetMethodWithPipe(`roads/lane_details_under_gate/?gate_id=${gate_id}`)
      .subscribe({
        next: (res: SystemView[]) => {

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

  handleShowLane(backData: any) { }

  showTableDetails(shift_id: number) {
    if (!shift_id || shift_id == null) return;
    this.modelService.closeModel('close');
    this.apiService
      .GetMethodWithPipe('transactions/transaction/?shift_id=' + shift_id)
      .subscribe({
        next: (res: ShitTransaction[]) => {
          if (res.length > 0) {
            for (let item of res) {
              item.camira_image_path =
                this.url + 'static/' + item.camira_image_path;
              item.camira_npr_image_path =
                this.url + 'static/' + item.camira_npr_image_path;
            }
            console.log(res);
            this.holdListOfShiftDetails.next(res);
            this.openModel();
          } else {
            this.holdListOfShiftDetails.next([]);
          }
        },
        error: (error: any) => {
          let errorz = new ErrorView(this.toastr);
          errorz.showError(error);
        },
      });
  }
  // getListOfLane(gate_id: number) {
  //   this.apiService.GetMethodWithPipe(`roads/lane_under_gate/?gate_id=${gate_id}`).subscribe({
  //     next: (res: Lane[]) => {
  //       this.holdListOfLanes.next(res)
  //     }, error: (error: any) => {
  //       this.toastr.error(error)
  //     }
  //   })
  // }
}
