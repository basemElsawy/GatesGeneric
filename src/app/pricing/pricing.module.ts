import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PricingRoutingModule } from './pricing-routing.module';
import { PricingComponent } from './pricing.component';
import { VehicleClassesComponent } from './vehicle-classes/vehicle-classes.component';
import { DeductionsComponent } from './deductions/deductions.component';
import { PriceTableComponent } from './price-table/price-table.component';
import { SharedUiModule } from '../shared-ui/shared-ui.module';
import { PriceDetailsComponent } from './price-details/price-details.component';

@NgModule({
  declarations: [
    PricingComponent,
    VehicleClassesComponent,
    DeductionsComponent,
    PriceTableComponent,
    PriceDetailsComponent,
  ],
  imports: [CommonModule, PricingRoutingModule, SharedUiModule],
})
export class PricingModule {}
