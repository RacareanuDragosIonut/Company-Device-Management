import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  url: string;
  constructor(private http: HttpClient, private router: Router) {
    this.url = "http://127.0.0.1:5000"
  }

  login(data: any): Observable<any>{
    return this.http.post(this.url + '/login', data);
  }
  signup(data: any): Observable<any>{
    return this.http.post(this.url + '/signup', data);
  }
}
