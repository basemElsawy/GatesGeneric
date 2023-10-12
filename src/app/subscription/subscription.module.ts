import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionComponent } from './subscription.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { SubscriptionRoutingModule } from './subscription-routing.module';
import { SharedUiModule } from '../shared-ui/shared-ui.module';
import { MatStepperModule } from '@angular/material/stepper';
import { NewSubscriptionComponent } from './new-subscription/new-subscription.component';
import { SubscriptionDurationComponent } from './subscription-duration/subscription-duration.component';
import { SubscriptionPricesComponent } from './subscription-prices/subscription-prices.component';
@NgModule({
  declarations: [
    SubscriptionComponent,
    SubscribeComponent,
    NewSubscriptionComponent,
    SubscriptionDurationComponent,
    SubscriptionPricesComponent,
  ],
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    SharedUiModule,
    MatStepperModule,
  ],
})
export class SubscriptionModule {}
