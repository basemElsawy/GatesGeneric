import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomComponent } from '../shared-ui/welcom/welcom.component';
import { ShiftDetailsComponent } from './shift-details/shift-details.component';
import { UserTOMComponent } from './user-tom.component';
import { RecetComponent } from '../shared-ui/recet/recet.component'
const routes: Routes = [{
  path: '', component: UserTOMComponent, children: [
    { path: 'welcome', component: WelcomComponent },
    { path: 'shiftDetails', component: ShiftDetailsComponent },
    { path: 'receit', component: RecetComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserTOMRoutingModule { }
