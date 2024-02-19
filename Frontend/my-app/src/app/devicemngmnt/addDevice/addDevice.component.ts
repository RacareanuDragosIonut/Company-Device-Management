import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
      ip: new FormControl('', [Validators.required])
    })
    if(this.groups.length == 1){
      this.addDeviceForm.get('group')?.disable();
    }
    if(this.locations.length == 1){
      this.addDeviceForm.get('location')?.disable();
    }
  }
  onAddClick(): void {
    this.authService.addDevice({...this.addDeviceForm.value, owner: this.owner}).subscribe((response: any) =>{
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
