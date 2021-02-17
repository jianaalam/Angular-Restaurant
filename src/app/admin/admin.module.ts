import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { FoodManageComponent } from './components/food-manage/food-manage.component';
import { PeopleManageComponent } from './components/people-manage/people-manage.component';



@NgModule({
  declarations: [AdminLoginComponent, AdminDashboardComponent, FoodManageComponent, PeopleManageComponent],
  imports: [
    CommonModule
  ]
})
export class AdminModule { }
