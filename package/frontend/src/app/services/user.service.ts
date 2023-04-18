import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url =
    'http://s7-04-backend-dev.us-east-1.elasticbeanstalk.com/api/v1/users';

  constructor(private http: HttpClient) {}
  getUsers(): Observable<any> {
    return this.http.get(`${this.url}`);
  }
}
