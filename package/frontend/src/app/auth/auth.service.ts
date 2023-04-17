import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import * as moment from 'moment';
import { Observable, shareReplay, tap } from 'rxjs';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt'; // Importar JwtModule y JwtHelperService
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url: string = 'http://s7-04-backend-dev.us-east-1.elasticbeanstalk.com/';
  secret: string = 'mysecret';
  jwtHelper: JwtHelperService = new JwtHelperService(); // Crear instancia de JwtHelperService


  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(this.url + 'api/v1/login', { email, password })
      .pipe(
        tap((res) => {
          const authResult = {
            expiresIn: res.expiresIn,
            idToken: res.id.toString() // Utilizar jwt_decode en lugar de JwtHelperService
          };
          this.setSession(authResult);
        }),
        shareReplay()
      );
  }
  
  private setSession(authResult: { expiresIn: number; idToken: string }) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    if (!expiration) {
      return null;
    }
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
