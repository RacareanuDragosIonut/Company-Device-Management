import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    this.locations = this.authService.acceptedLocations;
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
      ip: new FormControl(this.device.ip, [Validators.required])
    })

    if(this.groups.length == 1){
      this.editDeviceForm.get('group')?.disable();
    }
    if(this.locations.length == 1){
      this.editDeviceForm.get('location')?.disable();
    }
  }
  onUpdateClick(): void {
    this.authService.editDevice({deviceId: this.device.deviceId, sharedUsersId: this.device.sharedUsersId,
      owner: this.device.owner, ...this.editDeviceForm.value}).subscribe((response: any)=>{
      if (response && response.message) {
        const snackBarConfig = {
          duration: 3000,
          panelClass: response.message.includes('successfully') ? ['success-snackbar'] : ['error-snackbar'],
        };
        this.snackBar.open(response.message, 'OK', snackBarConfig);
        this.dialogRef.close();
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
