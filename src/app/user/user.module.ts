import { SharedUiModule } from './../shared-ui/shared-ui.module';
import { PermissionsComponent } from './permissions/permissions.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { GroupsComponent } from './groups/groups.component';
import { UsersComponent } from './users/users.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UserComponent,
    PermissionsComponent,
    GroupsComponent,
    UsersComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedUiModule,
    ReactiveFormsModule,
  ],
})
export class UserModule {}
