import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasicDataRoutingModule } from './basic-data-routing.module';
import { BasicDataComponent } from './basic-data.component';
import { RoadsComponent } from './roads/roads.component';
import { GatesComponent } from './gates/gates.component';
import { LaneComponent } from './lane/lane.component';
import { DirectionsComponent } from './directions/directions.component';
import { CamerasComponent } from './cameras/cameras.component';
import { CameraNPRComponent } from './camera-npr/camera-npr.component';
import { GateArmComponent } from './gate-arm/gate-arm.component';
import { KiloPriceComponent } from './Kilo-Price/Kilo-Price.component';
import { SharedUiModule } from '../shared-ui/shared-ui.module';
import { CargoTypeComponent } from './Cargo-Type/Cargo-Type.component';
import { WeightCodeComponent } from './Weight-Code/Weight-Code.component';
import { ShippingTypeComponent } from './Shipping-Type/Shipping-Type.component';
import { GovernoratesComponent } from './governorates/governorates.component';
@NgModule({
  declarations: [
    BasicDataComponent,
    RoadsComponent,
    GatesComponent,
    WeightCodeComponent,
    LaneComponent,
    KiloPriceComponent,
    DirectionsComponent,
    ShippingTypeComponent,
    CamerasComponent,
    CargoTypeComponent,
    CameraNPRComponent,
    GateArmComponent,
    GovernoratesComponent,
  ],
  imports: [CommonModule, BasicDataRoutingModule, SharedUiModule],
})
export class BasicDataModule {}
