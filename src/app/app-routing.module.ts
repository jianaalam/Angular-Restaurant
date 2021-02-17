import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddInvitationComponent } from './components/add-invitation/add-invitation.component';
import { DefaultComponent } from './components/default/default.component';
import { InvitationDetailsComponent } from './components/invitation-details/invitation-details.component';
import { MealRequestComponent } from './components/meal-request/meal-request.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserLoginComponent } from './components/user-login/user-login.component';

const routes: Routes = [
  {path: "login", component: UserLoginComponent},
  {path: "signup", component: SignupComponent},
  {path: "profile", component: ProfileComponent, children:[
    {path: "default", component: DefaultComponent},
    {path: "addInvitation", component: AddInvitationComponent},
    {path: "invitaionDetails", component: InvitationDetailsComponent},
    {path: "mealRequest", component: MealRequestComponent}
  ]},
  {path: "", redirectTo: "login", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
