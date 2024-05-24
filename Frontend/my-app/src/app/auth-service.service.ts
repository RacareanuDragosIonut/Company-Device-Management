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
  userRole: string = "";
  userLocation: string = "";
  userGroup: string = "";
  userUsername: string = "";
  roles: string[] = ["companyadmin", "locationadmin", "admin", "user"]
  locations: string[]= ["Bucharest", "Paris", "Berlin", "London", "Rome", "Budapest"]
  groups: string[] = ["Development","Network", "Human Resources", "Sales", "Management"]
  deviceTypes: string[] = ["Mobile Phone", "Laptop", "Headphones", "Laboratory Engineer Device"]
  acceptedRoles: string[] = [];
  acceptedLocations: string[] = [];
  acceptedGroups: string[]= [];
  constructor(private http: HttpClient, private router: Router) {
    this.url = "http://127.0.0.1:5000"
   this.updatePermissions();
}
  updatePermissions(){
    this.userRole = localStorage.getItem('role')!;
    this.userLocation = localStorage.getItem('location')!;
    this.userGroup = localStorage.getItem('group')!;
    this.userUsername = localStorage.getItem('username')!;
    if(this.userRole == "companyadmin"){
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

  editUser(data: any){
    return this.http.post(this.url + '/edit-user', data);
  }

  deleteUser(data: any){
    return this.http.post(this.url + '/delete-user', data);
  }

  changePassword(data: any){
    return this.http.post(this.url + '/change-password', data);
  }

  getDevices(){
    return this.http.get(this.url + '/devices');
  }

  editDevice(data: any){
    return this.http.post(this.url + '/edit-device', data);
  }

  deleteDevice(data: any){
    return this.http.post(this.url + '/delete-device', data);
  }

  addDevice(data: any){
    return this.http.post(this.url + '/add-device', data);
  }

  shareDevice(data: any){
    return this.http.post(this.url + '/share-to-user', data);
  }

  unshareDevice(data: any){
    return this.http.post(this.url + '/unshare-from-users', data);
  }

  getUsernameById(id: any){
    return this.http.get(this.url + '/get-username/' + id);
  }


  getAnalytics(){
    return this.http.get(this.url + '/analytics');
  }
}
