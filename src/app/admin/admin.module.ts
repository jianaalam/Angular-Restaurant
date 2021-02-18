// Modules Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from "./admin-routing.module";

// Components Import
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { FoodManageComponent } from './components/food-manage/food-manage.component';
import { PeopleManageComponent } from './components/people-manage/people-manage.component';

// Services Imports


// Angular Materials Imports



@NgModule({
  declarations: [AdminLoginComponent, AdminDashboardComponent, FoodManageComponent, PeopleManageComponent],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
