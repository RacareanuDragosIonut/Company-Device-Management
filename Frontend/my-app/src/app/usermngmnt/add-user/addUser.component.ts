import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthServiceService } from '../../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-user',
  templateUrl: './addUser.component.html',
  styleUrls: ['./addUser.component.scss']
})
export class AddUserComponent implements OnInit {
  addUserForm!: FormGroup;
  groups: string[] = [];
  locations: string[] = [];
  roles: string[] = [];
  constructor(
    public dialogRef: MatDialogRef<AddUserComponent>,
    public authService: AuthServiceService, public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.groups = this.authService.acceptedGroups;
      this.locations = this.authService.acceptedLocations;
      this.roles = this.authService.acceptedRoles;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.addUserForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      location: new FormControl('', [Validators.required]),
      group: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required])
    })
    if(this.groups.length == 1){
      this.addUserForm.get('group')?.disable();
    }
    if(this.locations.length == 1){
      this.addUserForm.get('location')?.disable();
    }
  }
  onAddClick(): void {
    this.authService.signup(this.addUserForm.value).subscribe((response: any) =>{
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
