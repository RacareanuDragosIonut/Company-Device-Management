import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthServiceService } from '../../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password',
  templateUrl: './changePassword.component.html',
  styleUrls: ['./changePassword.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    public authService: AuthServiceService, public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {


  }

  ngOnInit(): void {
    this.initForm();

  }

  togglePasswordVisibility(controlName: string): void {
    if (controlName === 'newPassword') {
      this.showPassword = !this.showPassword;
    } else if (controlName === 'confirmNewPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  initForm(){
    this.changePasswordForm = new FormGroup({
      originalPassword: new FormControl('',[Validators.required]),
      newPassword: new FormControl('',[Validators.required]),
      confirmNewPassword: new FormControl('',[Validators.required])
    })
  }
  onUpdateClick(): void {
    this.authService.changePassword(this.changePasswordForm.getRawValue()).subscribe((response: any)=>{
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
