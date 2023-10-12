import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';
import { StationReportDetailsComponent } from './StationReportDetails/StationReportDetails.component';
import { StaticalStationDetailsComponent } from './StaticalStationDetails/StaticalStationDetails.component';
import { DialyResultsComponent } from './dialy-results/dialy-results.component';
import { TotaloperationCategoryComponent } from './totaloperationCategory/totaloperationCategory.component';
import { SharedUiModule } from '../shared-ui/shared-ui.module';
import { ChartModule } from 'angular2-chartjs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { WeightsReportComponent } from './Weights-report/Weights-report.component';
@NgModule({
  declarations: [
    ReportComponent,
    StationReportDetailsComponent,
    StaticalStationDetailsComponent,
    DialyResultsComponent,
    TotaloperationCategoryComponent,
    WeightsReportComponent,
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedUiModule,
    ChartModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class ReportModule {}
