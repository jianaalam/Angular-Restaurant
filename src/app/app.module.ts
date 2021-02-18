// Modules Imports Here :
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from "@angular/common/http";

// Components Imports Here :
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

// Services Imports Here :
import { UsersService } from './services/users.service';
import { UserLoginService } from './services/user-login.service';
import { SignupService } from './services/signup.service';
import { RestaurantService } from './services/restaurant.service';
import { PersonService } from './services/person.service';
import { MealService } from './services/meal.service';
import { MealRequestService } from './services/meal-request.service';
import { InvitationService } from './services/invitation.service';
import { InitiativeService } from './services/initiative.service';
import { HeaderService } from './services/header.service';
import { ProcessHttpErrorMsgService } from './services/process-http-error-msg.service';

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
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [UsersService,
    UserLoginService,
    SignupService,
    RestaurantService,
    PersonService,
    MealService,
    MealRequestService,
    InvitationService,
    InitiativeService,
    HeaderService,
    ProcessHttpErrorMsgService],
  bootstrap: [AppComponent]
})
export class AppModule { }
