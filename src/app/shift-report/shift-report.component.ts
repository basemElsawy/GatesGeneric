import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from '../auth/services/services.service';
var _ = require('lodash');

@Component({
  selector: 'app-shift-report',
  templateUrl: './shift-report.component.html',
  styleUrls: ['./shift-report.component.css'],
})
export class ShiftReportComponent implements OnInit {
  subscriptionShiftDetails: any;
  gate_details: any;
  ReportHeader: any;
  constructor(private router: Router, private apiService: ServicesService) {
    this.subscriptionShiftDetails = JSON.parse(
      localStorage.getItem('subscriptions_shift_details') || ''
    );
    this.gate_details = JSON.parse(localStorage.getItem('gates') || '');
  }

  shift_details: any[] = [];
  count: number = 0;
  counts: any = {};
  ngOnInit() {
    this.apiService.CloseShift();
    this.apiService.state.subscribe((data) => {
      this.shift_details = [];
      data.shift_details.forEach((element: any) => {
        if (element.car_class_id == 2) {
          if (element.duration_type == 'M') {
            this.shift_details.push({
              number_of_subscriptions: element.subscription_id,
              category: element.car_classe_name_ar,
              price: element.Total_Price,
              subscription_tupe: 'شهر' + ' ' + element.duration,
            });
          } else if (element.duration_type == 'Y') {
            this.shift_details.push({
              number_of_subscriptions: element.subscription_id,
              category: element.car_classe_name_ar,
              price: element.Total_Price,
              subscription_tupe: 'سنة' + ' ' + element.duration,
            });
          } else if (element.duration_type == 'D') {
            this.shift_details.push({
              number_of_subscriptions: element.subscription_id,
              category: element.car_classe_name_ar,
              price: element.Total_Price,
              subscription_tupe: 'يوم' + ' ' + element.duration,
            });
          } else if (element.duration_type == 'W') {
            this.shift_details.push({
              number_of_subscriptions: element.subscription_id,
              category: element.car_classe_name_ar,
              price: element.Total_Price,
              subscription_tupe: 'اسبوع' + ' ' + element.duration,
            });
          }
        } else if (element.car_class_id == 3) {
          if (element.duration_type == 'M') {
            this.shift_details.push({
              number_of_subscriptions: element.subscription_id,
              category: element.car_classe_name_ar,
              price: element.Total_Price,
              subscription_tupe: 'شهر' + ' ' + element.duration,
            });
          } else if (element.duration_type == 'Y') {
            this.shift_details.push({
              number_of_subscriptions: element.subscription_id,
              category: element.car_classe_name_ar,
              price: element.Total_Price,
              subscription_tupe: 'سنة' + ' ' + element.duration,
            });
          } else if (element.duration_type == 'D') {
            this.shift_details.push({
              number_of_subscriptions: element.subscription_id,
              category: element.car_classe_name_ar,
              price: element.Total_Price,
              subscription_tupe: 'يوم' + ' ' + element.duration,
            });
          } else if (element.duration_type == 'W') {
            this.shift_details.push({
              number_of_subscriptions: element.subscription_id,
              category: element.car_classe_name_ar,
              price: element.Total_Price,
              subscription_tupe: 'اسبوع' + ' ' + element.duration,
            });
          }
        } else if (element.car_class_id == 4) {
          if (element.duration_type == 'M') {
            this.shift_details.push({
              number_of_subscriptions: element.subscription_id,
              category: element.car_classe_name_ar,
              price: element.Total_Price,
              subscription_tupe: 'شهر' + ' ' + element.duration,
            });
          } else if (element.duration_type == 'Y') {
            this.shift_details.push({
              number_of_subscriptions: element.subscription_id,
              category: element.car_classe_name_ar,
              price: element.Total_Price,
              subscription_tupe: 'سنة' + ' ' + element.duration,
            });
          } else if (element.duration_type == 'D') {
            this.shift_details.push({
              number_of_subscriptions: element.subscription_id,
              category: element.car_classe_name_ar,
              price: element.Total_Price,
              subscription_tupe: 'يوم' + ' ' + element.duration,
            });
          } else if (element.duration_type == 'W') {
            this.shift_details.push({
              number_of_subscriptions: element.subscription_id,
              category: element.car_classe_name_ar,
              price: element.Total_Price,
              subscription_tupe: 'اسبوع' + ' ' + element.duration,
            });
          }
        } else {
          if (element.duration_type == 'M') {
            this.shift_details.push({
              number_of_subscriptions: element.subscription_id,
              category: element.car_classe_name_ar,
              price: element.Total_Price,
              subscription_tupe: 'شهر' + ' ' + element.duration,
            });
          } else if (element.duration_type == 'Y') {
            this.shift_details.push({
              number_of_subscriptions: element.subscription_id,
              category: element.car_classe_name_ar,
              price: element.Total_Price,
              subscription_tupe: 'سنة' + ' ' + element.duration,
            });
          } else if (element.duration_type == 'D') {
            this.shift_details.push({
              number_of_subscriptions: element.subscription_id,
              category: element.car_classe_name_ar,
              price: element.Total_Price,
              subscription_tupe: 'يوم' + ' ' + element.duration,
            });
          } else if (element.duration_type == 'W') {
            this.shift_details.push({
              number_of_subscriptions: element.subscription_id,
              category: element.car_classe_name_ar,
              price: element.Total_Price,
              subscription_tupe: 'اسبوع' + ' ' + element.duration,
            });
          }
        }
      });
      this.ReportHeader = {
        username:
          this.subscriptionShiftDetails.user_id.first_name +
          ' ' +
          this.subscriptionShiftDetails.user_id.middle_name +
          ' ' +
          this.subscriptionShiftDetails.user_id.last_name,
        openDate: data.shift[0].created_at,
        closeDate: data.shift[0].shift_close_date,
        gate: this.gate_details,
        reportData: this.shift_details,
        // gate :
      };
    });
  }

  printReport() {
    window.print();
    localStorage.clear();
    this.router.navigate(['./auth/login']);
  }
}
