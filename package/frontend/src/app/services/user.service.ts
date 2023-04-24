import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url =
    'https://s7-04-backend.joardev.co/api/v1/auth/me';

  constructor(private http: HttpClient) {}
  getUsers(): Observable<any> {
    return this.http.get(`${this.url}`);
  }
}
