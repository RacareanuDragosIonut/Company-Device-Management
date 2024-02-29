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
export class FilterDevicesComponent {
  deviceTypesList: string[] = [];
  selectedDeviceTypes: string[] = [];
  constructor(
    public dialogRef: MatDialogRef<FilterDevicesComponent>,
    public authService: AuthServiceService, public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.deviceTypesList = this.authService.deviceTypes;
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

  }
}
