import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserTOMRoutingModule } from './user-tom-routing.module';
import { UserTOMComponent } from './user-tom.component';
import { SharedUiModule } from '../shared-ui/shared-ui.module';
import { ShiftDetailsComponent } from './shift-details/shift-details.component';

@NgModule({
  declarations: [UserTOMComponent, ShiftDetailsComponent],
  imports: [CommonModule, UserTOMRoutingModule, SharedUiModule],
})
export class UserTOMModule {}
