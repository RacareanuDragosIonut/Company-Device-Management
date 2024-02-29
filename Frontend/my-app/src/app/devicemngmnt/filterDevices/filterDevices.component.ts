import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthServiceService } from '../../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-filter-devices',
  templateUrl: './filterDevices.component.html',
  styleUrls: ['./filterDevices.component.scss']
})
export class FilterDevicesComponent implements OnInit{
  deviceTypesList: string[] = [];
  selectedDeviceTypes: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<FilterDevicesComponent>,
    public authService: AuthServiceService, public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.deviceTypesList = this.authService.deviceTypes;
  }

 ngOnInit(): void {
   if(localStorage.getItem('deviceTypes')){
    this.selectedDeviceTypes = localStorage.getItem('deviceTypes')?.split(",")!
   }
 }

 isSelected(type: string): boolean {
  return this.selectedDeviceTypes.includes(type);
}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSelectCheckbox(type: string, checked: boolean){
    if(checked){
      this.selectedDeviceTypes.push(type)
    }
    else{
      this.selectedDeviceTypes = this.selectedDeviceTypes.filter(deviceType=> type != deviceType)
    }
  }


  onFilterClick(){
      localStorage.setItem('deviceTypes', this.selectedDeviceTypes.toString())
      this.dialogRef.close()
  }
}
