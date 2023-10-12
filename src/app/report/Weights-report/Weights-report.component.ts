import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/https/request.service';
import { LangService } from 'src/app/shared-serviceses/Lang.service';

@Component({
  selector: 'app-Weights-report',
  templateUrl: './Weights-report.component.html',
  styleUrls: ['./Weights-report.component.scss'],
})
export class WeightsReportComponent implements OnInit {
  searchReportFilter!: FormGroup;
  isFilterTableDate: boolean = false;
  ReportData: any;
  fetchedReportData: any[] = [];
  days: any[] = [];

  constructor(
    private apiService: RequestService,
    private toastr: ToastrService,
    protected lang: LangService,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.searchReportFilter = this.fb.group({
      date: [null, Validators.required],
    });
    this.days = [
      'اﻷحد',
      'اﻷثنين',
      'الثلاثاء',
      'اﻷربعاء',
      'الخميس',
      'الجمعة',
      'السبت',
    ];
  }

  getCurrentLanguage(): string {
    let langWeb = this.lang.getcurrentLange().getValue();
    return langWeb;
  }

  delDateString: any;
  showReportResults() {
    let choosedDate = this.searchReportFilter.controls['date'].value;
    this.apiService
      .GetMethodWithPipe(`reports/weight-daily-report/?day=${choosedDate}`)
      .subscribe({
        next: (res) => {
          this.isFilterTableDate = true;
          this.fetchedReportData = [];
          res.forEach((element: any) => {
            element.totals.forEach((el: any) => {
              debugger;
              el.detialed.forEach((ele: any) => {
                this.fetchedReportData.push({
                  gate_name: ele.weight_shifts__gate__gate_name_ar,
                  gov_name: ele.weight_shifts__gate__gov__gov_name_ar,
                  weight_count: ele.weight_count,
                  total_income: ele.total_income,
                });
              });
            });
          });
          // this.fetchedReportData = res[0].totals;

          this.ReportData = {
            date: res[0].actual_created_date__date,
            total_income: res[0].total_income,
            weight_count: res[0].weight_count,
          };

          let ReportDate = new Date(this.ReportData.date);
          this.delDateString = this.days[ReportDate.getDay()];

          // let dayName = this.datePipe.transform(
          //   res[0].actual_created_date__date,
          //   'EEEE',
          //   'ar'
          // );
          // this.translate.get('dayNames').subscribe((dayNames: string[]) => {
          //   debugger;
          //   dayName = dayNames[this.ReportData.dayname];
          // });

          // this.getDayOfDate(this.ReportData.date);
        },
        error: (error) => {
          this.isFilterTableDate = false;
          this.toastr.error('يوجد خطأ في عرض بيانات التقارير');
        },
      });
  }

  getDayOfDate(date: Date) {
    debugger;
    const dateStr = this.ReportData.date;
    const [year, month, day] = dateStr.split('-');
    const newDate = new Date(`${year}-${month}-${day}`);
    console.log('here is the current day : ', newDate.getDay());
    // const dayOfWeek = new Intl.DateTimeFormat('en-US', {
    //   weekday: 'long',
    // }).format(date);
    // console.log(dayOfWeek);
  }
}
