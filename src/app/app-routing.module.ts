import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { Error404Component } from './pages/error404/error404.component';
import { AuthComponent } from './pages/auth/auth.component';
import { AuthGuard } from './guards/auth.guard';
import { UserOptionsComponent } from './pages/user-options/user-options.component';

const routes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'home',
    },
    {
      path: 'home',
      canActivate: [AuthGuard],
      component: HomeComponent,
    },
    {
      path: 'auth',
      component: AuthComponent,
    },
    {
      path: 'user-options/:id',
      canActivate: [AuthGuard],
      component: UserOptionsComponent
    },
    {
      path: '**',
      component: Error404Component
    }
  ]
}];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
