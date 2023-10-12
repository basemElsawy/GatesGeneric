import { StaticalStationDetailsComponent } from './StaticalStationDetails/StaticalStationDetails.component';
import { StationReportDetailsComponent } from './StationReportDetails/StationReportDetails.component';
import { TotaloperationCategoryComponent } from './totaloperationCategory/totaloperationCategory.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './report.component';
import { DialyResultsComponent } from './dialy-results/dialy-results.component';
import { WeightsReportComponent } from './Weights-report/Weights-report.component';
const routes: Routes = [
  { path: '', component: ReportComponent },
  { path: 'totalOperation', component: TotaloperationCategoryComponent },
  { path: 'stationDetails', component: StationReportDetailsComponent },
  { path: 'staticalDetails', component: StaticalStationDetailsComponent },
  {
    path: 'dialyResults',
    component: DialyResultsComponent,
  },
  {
    path: 'weightsreport',
    component: WeightsReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
