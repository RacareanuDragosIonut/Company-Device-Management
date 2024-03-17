import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent implements OnInit{
  groups: string[] = [];
  locations: string[] = [];
  deviceTypes: string[] = [];
  role: string = '';
  username: string = '';
  showDeviceTypesAnalytics: boolean = false;
  showGroupAnalytics: boolean = false;
  showLocationAnalytics: boolean = false;
  deviceTypesCounts: any = {};
  locationCounts: any  = {};
  groupCounts: any  = {};
  totalCount: number = 0;
  analytics: any = {}
    constructor(
    public authService: AuthServiceService, public snackBar: MatSnackBar
  ) {
      this.groups = this.authService.acceptedGroups;
      this.locations = this.authService.acceptedLocations;
      this.deviceTypes = this.authService.deviceTypes;
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username')!!;
    this.role = localStorage.getItem('role')!!;
    this.authService.getAnalytics().subscribe((res: any) =>{
      this.analytics = res.response;
      this.deviceTypesCounts = this.analytics.deviceTypes;
      if(this.analytics.location !== undefined){
        this.locationCounts = this.analytics.location;
      }
      if(this.analytics.group !== undefined){
        this.groupCounts = this.analytics.group;
      }
      this.totalCount = res.total_count_devices;
    })
  }


  getPercentage(name: string, typeOfCount: string): string{
    let retMessage = ""
    if(typeOfCount == "location"){
      let number = this.locationCounts[name]
      let percentage = (number / this.totalCount * 100).toFixed(2);
      retMessage += number.toString() + ' / ' + this.totalCount + ' (' + percentage + ' %)'
    }
    if(typeOfCount == "group"){
      let number = this.groupCounts[name]
      let percentage = (number / this.totalCount * 100).toFixed(2);
      retMessage += number.toString() + ' / ' + this.totalCount + ' (' + percentage + ' %)'
    }
    if(typeOfCount == "deviceType"){
      let number = this.deviceTypesCounts[name]
      let percentage = (number / this.totalCount * 100).toFixed(2);
      retMessage += number.toString() + ' / ' + this.totalCount + ' (' + percentage + ' %)'
    }
    return retMessage
  }


  switchCheck(checkboxType: string){
    if(checkboxType == "location"){
      this.showLocationAnalytics = !this.showLocationAnalytics;
    }
    if(checkboxType == "group"){
      this.showGroupAnalytics = !this.showGroupAnalytics;
    }
    if(checkboxType == "deviceType"){
      this.showDeviceTypesAnalytics = !this.showDeviceTypesAnalytics;
    }
  }
}
