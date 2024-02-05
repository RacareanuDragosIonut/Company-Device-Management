import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthServiceService } from '../../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-user-details',
  templateUrl: './changeUserDetails.component.html',
  styleUrls: ['./changeUserDetails.component.scss']
})
export class ChangeUserDetailsComponent implements OnInit {
  changeUserDetailsForm!: FormGroup;
  groups: string[] = [];
  locations: string[] = [];
  roles: string[] = [];
  user: any;
  constructor(
    public dialogRef: MatDialogRef<ChangeUserDetailsComponent>,
    public authService: AuthServiceService, public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.authService.updatePermissions();
      this.groups = this.authService.acceptedGroups;
      this.locations = this.authService.acceptedLocations;
      this.roles = this.authService.acceptedRoles;

  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.changeUserDetailsForm = new FormGroup({
      username: new FormControl(this.data.username, [Validators.required]),
      location: new FormControl(this.data.location, [Validators.required]),
      group: new FormControl(this.data.group, [Validators.required]),
      role: new FormControl(this.data.role, [Validators.required])
    })

    if(this.groups.length == 1){
      this.changeUserDetailsForm.get('group')?.disable();
    }
    if(this.locations.length == 1){
      this.changeUserDetailsForm.get('location')?.disable();
    }
  }
  onUpdateClick(): void {
    this.authService.editUser(this.changeUserDetailsForm.getRawValue()).subscribe((response: any)=>{
      if (response && response.message) {
        const snackBarConfig = {
          duration: 3000,
          panelClass: response.message.includes('successfully') ? ['success-snackbar'] : ['error-snackbar'],
        };
        this.snackBar.open(response.message, 'OK', snackBarConfig);
        if(response.message.includes('successfully')){
            this.authService.updatePermissions();
            this.groups = this.authService.acceptedGroups;
            this.locations = this.authService.acceptedLocations;
            this.roles = this.authService.acceptedRoles;
            localStorage.setItem('username', this.changeUserDetailsForm.getRawValue().username);
            localStorage.setItem('role', this.changeUserDetailsForm.getRawValue().role);
            localStorage.setItem('location', this.changeUserDetailsForm.getRawValue().location);
            localStorage.setItem('group', this.changeUserDetailsForm.getRawValue().group);
        }
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
