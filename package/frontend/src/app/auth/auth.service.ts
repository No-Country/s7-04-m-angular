import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import * as moment from 'moment';
import { Observable, shareReplay, tap } from 'rxjs';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt'; // Importar JwtModule y JwtHelperService
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url: string = 'http://s7-04-backend-dev.us-east-1.elasticbeanstalk.com/';
  secret: string = 'mysecret';
  jwtHelper: JwtHelperService = new JwtHelperService(); // Crear instancia de JwtHelperService
  token: string ='';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(this.url + 'api/v1/login', { email, password })
      .pipe(
        tap((res) => {
          const authResult = {
            id: res.id,
            expiresIn: res.expiresIn,
            token: res.token.toString(),
             // Utilizar jwt_decode en lugar de JwtHelperService
          };
          this.setSession(authResult);
          this.router.navigate(['/home']);
        }),
        shareReplay()
      );
  }

  private setSession(authResult: { expiresIn: number; token: string,id:number }) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('token', authResult.token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    
  localStorage.setItem('user_id', authResult.id.toString());
}

  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user_id');
  }

 isLoggedIn(): boolean {
  const token = localStorage.getItem('token'); // Corregir el uso de la variable token
  return token !== null; // Devolver true si el token existe, false en caso contrario
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
