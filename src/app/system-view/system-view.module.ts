import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemViewRoutingModule } from './system-view-routing.module';
import { SystemViewComponent } from './system-view.component';
import { SharedUiModule } from '../shared-ui/shared-ui.module';
import { HomeSystemComponent } from './home-system/home-system.component';
import { WieghtDetailsComponent } from './wieght-details/wieght-details.component';

@NgModule({
  declarations: [
    SystemViewComponent,
    HomeSystemComponent,
    WieghtDetailsComponent,
  ],
  imports: [CommonModule, SystemViewRoutingModule, SharedUiModule],
})
export class SystemViewModule {}
