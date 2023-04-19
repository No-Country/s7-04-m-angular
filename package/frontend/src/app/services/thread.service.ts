import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {
  private apiUrl = 'https://s7-04-backend.joardev.co/api/v1/threads';

  constructor(private http: HttpClient) { }

  getThreads(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
