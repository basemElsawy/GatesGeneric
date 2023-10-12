import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicDataComponent } from './basic-data.component';
import { CameraNPRComponent } from './camera-npr/camera-npr.component';
import { CamerasComponent } from './cameras/cameras.component';
import { DirectionsComponent } from './directions/directions.component';
import { GateArmComponent } from './gate-arm/gate-arm.component';
import { GatesComponent } from './gates/gates.component';
import { LaneComponent } from './lane/lane.component';
import { RoadsComponent } from './roads/roads.component';
import { KiloPriceComponent } from './Kilo-Price/Kilo-Price.component';
import { CargoTypeComponent } from './Cargo-Type/Cargo-Type.component';
import { WeightCodeComponent } from './Weight-Code/Weight-Code.component';
import { ShippingTypeComponent } from './Shipping-Type/Shipping-Type.component';
import { GovernoratesComponent } from './governorates/governorates.component';
const routes: Routes = [
  {
    path: '',
    component: BasicDataComponent,
    children: [
      { path: 'Roads', component: RoadsComponent },
      { path: 'Lane', component: LaneComponent },
      { path: 'Direction', component: DirectionsComponent },
      { path: 'Gates', component: GatesComponent },
      { path: 'GateArm', component: GateArmComponent },
      { path: 'Camira', component: CamerasComponent },
      { path: 'CamiraNPR', component: CameraNPRComponent },
      { path: 'kiloprice', component: KiloPriceComponent },
      { path: 'cargoType', component: CargoTypeComponent },
      { path: 'weightCode', component: WeightCodeComponent },
      { path: 'shippingType', component: ShippingTypeComponent },
      { path: 'govs', component: GovernoratesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BasicDataRoutingModule {}
