import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { Users } from 'src/app/shared/AllClasses';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  public myUser: Users = new Users()
  public myUsers: Users[] = [];
  public errorMsgUsers: string = "";
  public errorMsgUser: string = "";

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {

    // this.myUser.id = "4";
    // this.myUser.UserName = "Mohammed Rateb";
    // this.myUser.Email = "mohammed_rateb@hotmail.com";


    this.usersService.getUsers().subscribe(
      (data) => {this.myUsers = data;},
      (error) => {this.errorMsgUsers = error;}
    );

    this.usersService.getUserByID(1).subscribe(
      (data) => {this.myUser = data;},
      (error) => {this.errorMsgUser = error;}
    );

    // this.usersService.saveUser(this.myUser).subscribe(
    //   (data) => {console.log(data);},
    //   (error) => {this.errorMsgUser = error;}
    // );
  }

}
