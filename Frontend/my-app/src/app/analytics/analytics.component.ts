import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import Chart from 'chart.js/auto';
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent implements OnInit{
  @ViewChild('deviceChart') deviceChartRef!: ElementRef;
  @ViewChild('groupChart') groupChartRef!: ElementRef;
  @ViewChild('locationChart') locationChartRef!: ElementRef;
  [key: string]: any;
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
      this.drawCharts();
    })
  }

  drawCharts(): void {
    this.drawChart('deviceChart', this.deviceTypes, 'Device Types Analytics', this.deviceTypesCounts);
    this.drawChart('groupChart', this.groups, 'Group Devices Analytics', this.groupCounts);
    this.drawChart('locationChart', this.locations, 'Location Devices Analytics', this.locationCounts);
  }

  drawChart(chartId: string, labels: string[], title: string, data: any): void {
    const elementRef = this[chartId + 'Ref'];
    if (!elementRef || !elementRef.nativeElement) return;

    const ctx = elementRef.nativeElement.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: labels.map(label => data[label] || 0),
          backgroundColor: this.getRandomColorArray(labels.length),
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  getRandomColorArray(length: number): string[] {
    const colors = [];
    for (let i = 0; i < length; i++) {
      colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    }
    return colors;
  }

}
