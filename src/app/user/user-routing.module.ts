import { GroupsComponent } from './groups/groups.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: 'Permission', component: PermissionsComponent },
      { path: 'Group', component: GroupsComponent },
      { path: 'Users', component: UsersComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }
