import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthServiceService } from '../../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-device',
  templateUrl: './editDevice.component.html',
  styleUrls: ['./editDevice.component.scss']
})
export class EditDeviceComponent implements OnInit {
  editDeviceForm!: FormGroup;
  groups: string[] = [];
  locations: string[] = [];
  roles: string[] = [];
  deviceTypes: string[] = [];
  device: any;
  constructor(
    public dialogRef: MatDialogRef<EditDeviceComponent>,
    public authService: AuthServiceService, public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.device = data.device;
  }

  ngOnInit(): void {
    this.groups = this.authService.acceptedGroups;
    if(!this.groups.includes(this.device.group)){
      this.groups.push(this.device.group)
    }
    this.locations = this.authService.acceptedLocations;
    if(!this.locations.includes(this.device.location)){
      this.locations.push(this.device.location);
    }
    this.roles = this.authService.acceptedRoles;
    this.deviceTypes = this.authService.deviceTypes;
    this.initForm();
  }

  initForm(){
    this.editDeviceForm = new FormGroup({
      name: new FormControl(this.device.name, [Validators.required]),
      location: new FormControl(this.device.location, [Validators.required]),
      group: new FormControl(this.device.group, [Validators.required]),
      type: new FormControl(this.device.type, [Validators.required]),
      model: new FormControl(this.device.model, [Validators.required]),
      ip: new FormControl(this.device.ip, [Validators.required, this.ipv4Validator()]),
      productionDate: new FormControl(this.device.productionDate, [Validators.required]),
      returnDate: new FormControl(this.device.returnDate, [Validators.required]),
    })

    if(this.groups.length == 1){
      this.editDeviceForm.get('group')?.disable();
    }
    if(this.locations.length == 1){
      this.editDeviceForm.get('location')?.disable();
    }
  }

  ipv4Validator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const ipAddress = control.value;

      if (!ipAddress) {
        return null;
      }

      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;

      if (!ipPattern.test(ipAddress)) {
        return { invalidIp: true };
      }

      const parts = ipAddress.split('.');

      if (
        parts.some((part: string) => parseInt(part, 10) > 255 || isNaN(parseInt(part, 10))) ||
        parts.length !== 4
      ) {
        return { invalidIp: true };
      }

      return null;
    };
    }

  onUpdateClick(): void {
    this.authService.editDevice({deviceId: this.device.deviceId, sharedUsersId: this.device.sharedUsersId,
      owner: this.device.owner, ...this.editDeviceForm.getRawValue()}).subscribe((response: any)=>{
      if (response && response.message) {
        const snackBarConfig = {
          duration: 3000,
          panelClass: response.message.includes('successfully') ? ['success-snackbar'] : ['error-snackbar'],
        };
        this.snackBar.open(response.message, 'OK', snackBarConfig);
        if(response.message.includes('successfully')){
          this.dialogRef.close();
        }

      }
    },
    (error) => {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      const snackBarConfig = { duration: 5000, panelClass: ['error-snackbar'] };
      this.snackBar.open(errorMessage, 'OK', snackBarConfig);
    })
  }


  onCancelClick(): void {
    this.dialogRef.close();
  }
}
