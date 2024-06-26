import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthServiceService } from '../../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-device',
  templateUrl: './addDevice.component.html',
  styleUrls: ['./addDevice.component.scss']
})
export class AddDeviceComponent implements OnInit {
  addDeviceForm!: FormGroup;
  groups: string[] = [];
  locations: string[] = [];
  roles: string[] = [];
  deviceTypes: string[] = [];
  owner: string = "";
  constructor(
    public dialogRef: MatDialogRef<AddDeviceComponent>,
    public authService: AuthServiceService, public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.groups = this.authService.acceptedGroups;
      this.locations = this.authService.acceptedLocations;
      this.roles = this.authService.acceptedRoles;
      this.deviceTypes = this.authService.deviceTypes;
      this.owner = this.authService.userUsername;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.addDeviceForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      group: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      model: new FormControl('', [Validators.required]),
      ip: new FormControl('', [Validators.required, this.ipv4Validator()]),
      productionDate: new FormControl('', [Validators.required]),
      returnDate: new FormControl('', [Validators.required])
    })
    if(this.groups.length == 1){
      this.addDeviceForm.get('group')?.disable();
      this.addDeviceForm.get('group')?.setValue(this.groups[0]);
    }
    if(this.locations.length == 1){
      this.addDeviceForm.get('location')?.disable();
      this.addDeviceForm.get('location')?.setValue(this.locations[0]);
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


  onAddClick(): void {
    this.authService.addDevice({...this.addDeviceForm.getRawValue(), owner: this.owner}).subscribe((response: any) =>{
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
