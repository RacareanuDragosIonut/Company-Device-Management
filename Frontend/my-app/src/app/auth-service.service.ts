import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  url: string;
  loggedInUser: any;
  userRole: string;
  userLocation: string;
  userGroup: string;
  roles: string[] = ["masteradmin", "locationadmin", "admin", "user"]
  locations: string[]= ["Bucharest", "Paris", "Berlin", "London", "Rome", "Budapest"]
  groups: string[] = ["Development","Network", "Human Resources", "Sales", "Management"]
  acceptedRoles: string[] = [];
  acceptedLocations: string[] = [];
  acceptedGroups: string[]= [];
  constructor(private http: HttpClient, private router: Router) {
    this.url = "http://127.0.0.1:5000"
    this.userRole = localStorage.getItem('role')!;
    this.userLocation = localStorage.getItem('location')!;
    this.userGroup = localStorage.getItem('group')!;
    if(this.userRole == "masteradmin"){
      this.acceptedRoles = this.roles;
      this.acceptedLocations = this.locations;
      this.acceptedGroups = this.groups;
    }
    if(this.userRole == "locationadmin"){
      this.acceptedRoles = ["locationadmin", "admin", "user"];
      this.acceptedLocations = [this.userLocation];
      this.acceptedGroups = this.groups;
    }
    if(this.userRole == "admin"){
      this.acceptedRoles = ["admin", "user"];
      this.acceptedLocations = [this.userLocation];
      this.acceptedGroups = [this.userGroup];
  }
}

  login(data: any): Observable<any>{
    return this.http.post(this.url + '/login', data);
  }
  logout(): Observable<any>{
    return this.http.post(this.url + '/logout', {})
  }
  signup(data: any): Observable<any>{
    return this.http.post(this.url + '/signup', data);
  }
  getUsers(){
    return this.http.get(this.url + '/users');
  }


}
