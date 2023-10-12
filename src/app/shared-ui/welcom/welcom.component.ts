import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { RequestService } from 'src/app/https/request.service';
import { ToastrService } from 'ngx-toastr';
import { Tiket } from 'src/app/Interfaces/tiket';
import { DatePipe } from '@angular/common';
import { ErrorView } from 'src/app/classes/ErrorView';
import { LoaderService } from 'src/app/shared-serviceses/Loader.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-welcom',
  templateUrl: './welcom.component.html',
  styleUrls: ['./welcom.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomComponent implements OnInit {
  public readonly imgUrl: string = environment.img_url;
  ViewTemplate: any;
  ViewTemplateImg: any;
  public webcamImage!: WebcamImage;

  currentDateTime: any;
  checkOpen: Subject<boolean> = new Subject<boolean>();
  private trigger: Subject<void> = new Subject<void>();

  constructor(
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private service: RequestService
  ) {
    this.currentDateTime = this.datePipe.transform(
      new Date(),
      'dd/MM/yyyy h:mm:ss'
    );
  }

  ngOnInit(): void {
    this.checkOpen.next(true);
    this.GetAllCategories();
    this.ViewTemplateImg = [
      '../../../assets/car.png',
      '../../../assets/bus.png',
      '../../../assets/van.png',
      '../../../assets/debit-card.png',
      '../../../assets/free-shipping.png',
    ];
  }

  SelectedItem: any;
  isActiveGate: boolean = false;
  triggerSnapshot(x: any): void {
    if (this.isActiveGate) return;
    this.isActiveGate = true; //gate is open
    this.SelectedItem = {
      car_id: x.car_class_id.car_classe_id,
      price: x.amount,
    };
    this.trigger.next();
    this.SubmitNeededData();
  }

  handleImage(webcamImage: WebcamImage): void {
    console.info('Saved webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  //here is the function needed to get all categories
  ParsedArray: any[] = [];
  GetAllCategories() {
    this.ViewTemplate = JSON.parse(localStorage.getItem('prices') || '[]');
  }
  holdUserInfo!: Tiket;
  QrObject!: Tiket;
  Departure_Time: any;
  NeededTripTime: any;
  FinalDepartureTime: any;
  LatestFinalDepartureTime: any;
  lane_id: any;
  SubmitNeededData() {
    this.lane_id = JSON.parse(localStorage.getItem('shiftInfio') || '');
    this.checkOpen.next(false);
    let shiftInfo = JSON.parse(
      localStorage.getItem('shiftInfio') || ''
    ).shift_id;
    let body = {
      car_class_id: this.SelectedItem.car_id,
      shift_id: shiftInfo,
      lane_id: this.lane_id.lane_id,
      transaction_status: 1,
      camira_code_id: 200,
      camira_npc_code_id: 200,
      gate_arm_code_id: 200,
      price: this.SelectedItem.price,
      camira_image_path: this.webcamImage.imageAsBase64,
      camira_npr_image_path: this.webcamImage.imageAsBase64,
    };
    this.service.SendData(body).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.holdUserInfo = res;
        this.Departure_Time = this.holdUserInfo.created_at;
        this.NeededTripTime = this.Departure_Time.split('T')[1];
        this.FinalDepartureTime = this.NeededTripTime.split('', 5);
        this.LatestFinalDepartureTime = this.FinalDepartureTime.concat();
        setTimeout(() => {
          window.print();
          return false;
        }, 500);
      },
      error: (error: any) => {
        this.loaderService.hide();
        let errorz = new ErrorView(this.toastr);
        errorz.showError(error);
      },
    });
  }

  print() {
    window.print();
  }

  //here is the function needed to show the ticket in the modal
  ShiftData: any;
  ShiftSubtraction: any;
  GetReportData() {
    this.service
      .GetMethodWithPipe(
        `shifts/shift_details/?shift_id=${
          JSON.parse(localStorage.getItem('shiftInfio') || '').shift_id
        }`
      )
      .subscribe(
        (data) => {
          this.ShiftData = data;
          this.ShiftSubtraction =
            data.shift_revenue - data.shift_dediction_total;
        },
        (error) => {
          let errorz = new ErrorView(this.toastr);
          errorz.showError(error);
        }
      );
  }

  handleTogglingBtn() {
    this.checkOpen.next(false);
  }

  changeAMPM(fetchedDate: any) {
    //here is the logic for change am
  }

  habdleGateOpreation() {
    if (this.isActiveGate == false) return;
    this.isActiveGate = false; //close gate
  }
}
