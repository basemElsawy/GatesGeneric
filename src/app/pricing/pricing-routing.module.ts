import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeductionsComponent } from './deductions/deductions.component';
import { PriceTableComponent } from './price-table/price-table.component';
import { PricingComponent } from './pricing.component';
import { VehicleClassesComponent } from './vehicle-classes/vehicle-classes.component';
import { PriceDetailsComponent } from './price-details/price-details.component';

const routes: Routes = [
  {
    path: '',
    component: PricingComponent,
    children: [
      { path: 'VehicleClass', component: VehicleClassesComponent },
      { path: 'PriceTable', component: PriceTableComponent },
      { path: 'Deduction', component: DeductionsComponent },
      { path: 'priceDetails', component: PriceDetailsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PricingRoutingModule {}
