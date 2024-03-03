import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddDeviceComponent } from './addDevice/addDevice.component';
import { DeleteDeviceComponent } from './deleteDevice/deleteDevice.component';
import { EditDeviceComponent } from './editDevice/editDevice.component';
import { ChangeOwnerComponent } from './changeOwner/changeOwner.component';
import { ShareDeviceComponent } from './shareDevice/shareDevice.component';
import { UnshareDeviceComponent } from './unshareDevice/unshareDevice.component';
import { FilterDevicesComponent } from './filterDevices/filterDevices.component';
import { GeoLocationComponent } from './geoLocation/geoLocation.component';
@Component({
  selector: 'app-devicemngmnt',
  templateUrl: './devicemngmnt.component.html',
  styleUrl: './devicemngmnt.component.scss'
})
export class DeviceMngmntComponent implements OnInit{
      devices: any[] = [];
      searchDevices: any[] = [];
      paginatedDevices: any[] = [];
      pageSize = 10;
      pageIndex = 0;
      userRole: string = "";
      userLocation: string ="";
      userGroup: string = "";
      deviceTypeFilters: string[] = []
      constructor(public authService: AuthServiceService, public router: Router, public dialog: MatDialog){

      }
      ngOnInit(): void {

        this.deviceTypeFilters = localStorage.getItem('deviceTypes')?.split(',')!
        this.getData();
        this.userRole = this.authService.userRole;
        this.userLocation = this.authService.userLocation;
        this.userGroup = this.authService.userGroup;
      }

      getData(){
        this.authService.getDevices().subscribe((response: any) => {
          this.devices = response.devices;
          this.devices = this.devices.filter( device => this.deviceTypeFilters.includes(device.type));
          this.searchDevices = this.devices;
          this.paginatedDevices = this.getPaginatedDevices(this.devices);
        })
      }

      applySearch(event: any): void {
        let searchTerm: string = (event.target as HTMLInputElement).value;
        this.searchDevices = this.devices.filter( device => device.name.toLowerCase().includes(searchTerm));
        this.paginatedDevices = this.getPaginatedDevices(this.searchDevices);
      }
      addDevice(){
        const dialogRef = this.dialog.open(
          AddDeviceComponent,
          { width: '600px', height: '600px' }
        );

        dialogRef.afterClosed().subscribe(() => {
          this.getData();
        });
      }

      onPaginatorChange(event: any){
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;

        this.paginatedDevices = this.getPaginatedDevices(this.devices);
      }

      getPaginatedDevices(devices: any[]): any[] {
        const startIndex = this.pageIndex * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return devices.slice(startIndex, endIndex);
      }

      goToHomePage(){
        this.router.navigate(['/home']);
      }

      editDevice(device: any){
        const dialogRef = this.dialog.open(
          EditDeviceComponent,
          { width: '600px', height: '600px',
          data: {device: device} }
        );

        dialogRef.afterClosed().subscribe(() => {
          this.getData();
        });
      }

      deleteDevice(device: any){
        const dialogRef = this.dialog.open(
          DeleteDeviceComponent,
          { width: '400px', height: '250px',
          data: {device: device} }
        );

        dialogRef.afterClosed().subscribe(() => {
          this.getData();
        });

      }



      share(device: any){
        const dialogRef = this.dialog.open(
          ShareDeviceComponent,
          { width: '400px', height: '400px',
          data: {device: device} }
        );

        dialogRef.afterClosed().subscribe(() => {
          this.getData();
        });
      }

      unshare(device: any){
        const dialogRef = this.dialog.open(
          UnshareDeviceComponent,
          { width: '400px', height: '400px',
          data: {device: device} }
        );

        dialogRef.afterClosed().subscribe(() => {
          this.getData();
        });

      }

      changeOwner(device: any){
        const dialogRef = this.dialog.open(
          ChangeOwnerComponent,
          { width: '400px', height: '400px',
          data: {device: device} }
        );

        dialogRef.afterClosed().subscribe(() => {
          this.getData();
        });
      }


      filterByDeviceType(){
        const dialogRef = this.dialog.open(
          FilterDevicesComponent,
          { width: '400px', height: '400px',
          }
        );

        dialogRef.afterClosed().subscribe(() => {
          this.deviceTypeFilters = localStorage.getItem('deviceTypes')?.split(',')!
          this.getData()
        });
      }

      openLocationCheck(ip: any){
        this.dialog.open(
          GeoLocationComponent,
          { width: '600px', height: '600px',
          data: {ip: ip} }
        );
      }
}
