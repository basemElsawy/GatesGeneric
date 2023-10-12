import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './view.component';

const routes: Routes = [
  {
    path: '',
    component: ViewComponent,
    children: [
      {
        path: 'BasicData',
        loadChildren: () =>
          import('../basic-data/basic-data.module').then(
            (m) => m.BasicDataModule
          ),
      },
      {
        path: 'Pricing',
        loadChildren: () =>
          import('../pricing/pricing.module').then((m) => m.PricingModule),
      },
      {
        path: 'Report',
        loadChildren: () =>
          import('../report/report.module').then((m) => m.ReportModule),
      },
      {
        path: 'SystemView',
        loadChildren: () =>
          import('../system-view/system-view.module').then(
            (m) => m.SystemViewModule
          ),
      },
      {
        path: 'User',
        loadChildren: () =>
          import('../user/user.module').then((m) => m.UserModule),
      },

      {
        path: 'Subscription',
        loadChildren: () =>
          import('../subscription/subscription.module').then((m) => m.SubscriptionModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewRoutingModule { }
