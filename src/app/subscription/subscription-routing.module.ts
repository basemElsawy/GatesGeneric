import { NgModule } from '@angular/core';
import { NewSubscriptionComponent } from './new-subscription/new-subscription.component';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionComponent } from './subscription.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { SubscriptionDurationComponent } from './subscription-duration/subscription-duration.component';
import { SubscriptionPricesComponent } from './subscription-prices/subscription-prices.component';
const routes: Routes = [
  {
    path: '',
    component: SubscriptionComponent,
    children: [
      { path: 'subscription', component: SubscribeComponent },
      { path: 'newSubscription', component: NewSubscriptionComponent },
      {
        path: 'subscriptionDuration',
        component: SubscriptionDurationComponent,
      },
      {
        path: 'subscriptionprices',
        component: SubscriptionPricesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionRoutingModule {}
