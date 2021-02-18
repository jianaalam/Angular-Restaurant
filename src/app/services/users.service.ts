import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from "rxjs/operators";
import { Users } from '../shared/AllClasses';
import { API_URL } from '../shared/API_URL';
import { ProcessHttpErrorMsgService } from './process-http-error-msg.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, private errorService: ProcessHttpErrorMsgService) { }

  getUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(API_URL + "Users")
      .pipe(catchError(this.errorService.handleError));
  }

  getUserByID(ID: number): Observable<Users> {
    return this.http.get<Users>(API_URL + "Users/" + ID)
    .pipe(catchError(this.errorService.handleError));
  }

  updateUser(user: Users): void {
    const httpOptions = {headers: new HttpHeaders({"Content-Type": "application/json"})};
    this.http.put<void>(API_URL + "Users/" + user.id,user,httpOptions)
    .pipe(catchError(this.errorService.handleError));
  }

  saveUser(user: Users): Observable<Users> {
    const httpOptions = {headers: new HttpHeaders({"Content-Type": "application/json"})};
    return this.http.post<Users>(API_URL + "Users",user,httpOptions)
    .pipe(catchError(this.errorService.handleError));
  }

  deleteUser(ID: number): Observable<Users> {
    return this.http.delete<Users>(API_URL + "Users/" + ID)
    .pipe(catchError(this.errorService.handleError));
  }
}
