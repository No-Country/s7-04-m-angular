import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  submitLoginForm(loginForm: any): Observable<any> {
    const url = 'http://localhost:3000';
    return this.http.post(url, loginForm);
  }
}
