import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DefaultComponent } from './components/default/default.component';
import { AddInvitationComponent } from './components/add-invitation/add-invitation.component';
import { InvitationDetailsComponent } from './components/invitation-details/invitation-details.component';
import { MealRequestComponent } from './components/meal-request/meal-request.component';

@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    HeaderComponent,
    FooterComponent,
    SignupComponent,
    ProfileComponent,
    DefaultComponent,
    AddInvitationComponent,
    InvitationDetailsComponent,
    MealRequestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
