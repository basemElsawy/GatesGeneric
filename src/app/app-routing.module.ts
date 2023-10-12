import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './https/auth.guard';
import { NFoundComponent } from './shared-ui/nfound/nfound.component';
import { ShiftReportComponent } from './shift-report/shift-report.component';
const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'shiftreports', component: ShiftReportComponent },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'View',
    loadChildren: () => import('./view/view.module').then((m) => m.ViewModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'UserTOM',
    loadChildren: () =>
      import('./user-tom/user-tom.module').then((m) => m.UserTOMModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
