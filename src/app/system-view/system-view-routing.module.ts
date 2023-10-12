import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeSystemComponent } from './home-system/home-system.component';
import { SystemViewComponent } from './system-view.component';
import { WieghtDetailsComponent } from './wieght-details/wieght-details.component';

const routes: Routes = [
  {
    path: '',
    component: SystemViewComponent,
    children: [
      { path: 'Home', component: HomeSystemComponent },
      { path: 'weightDetails', component: WieghtDetailsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemViewRoutingModule {}
