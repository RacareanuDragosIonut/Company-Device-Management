import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthServiceService } from '../../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-user',
  templateUrl: './editUser.component.html',
  styleUrls: ['./editUser.component.scss']
})
export class EditUserComponent implements OnInit {
  editUserForm!: FormGroup;
  groups: string[] = [];
  locations: string[] = [];
  roles: string[] = [];
  user: any;
  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    public authService: AuthServiceService, public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.groups = this.authService.acceptedGroups;
      this.locations = this.authService.acceptedLocations;
      this.roles = this.authService.acceptedRoles;
      this.user = data.user;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.editUserForm = new FormGroup({
      username: new FormControl(this.user.username, [Validators.required]),
      location: new FormControl(this.user.location, [Validators.required]),
      group: new FormControl(this.user.group, [Validators.required]),
      role: new FormControl(this.user.role, [Validators.required])
    })

    if(this.groups.length == 1){
      this.editUserForm.get('group')?.disable();
    }
    if(this.locations.length == 1){
      this.editUserForm.get('location')?.disable();
    }
  }
  onUpdateClick(): void {
    this.authService.editUser({userId: this.user.userId, ...this.editUserForm.value}).subscribe((response: any)=>{
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
