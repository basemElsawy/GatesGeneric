import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewRoutingModule } from './view-routing.module';
import { ViewComponent } from './view.component';
import { SharedUiModule } from '../shared-ui/shared-ui.module';
@NgModule({
  declarations: [ViewComponent],
  imports: [CommonModule, ViewRoutingModule, SharedUiModule],
})
export class ViewModule {}
