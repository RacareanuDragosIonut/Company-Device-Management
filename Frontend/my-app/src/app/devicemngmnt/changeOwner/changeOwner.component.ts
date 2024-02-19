import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthServiceService } from '../../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-owner',
  templateUrl: './changeOwner.component.html',
  styleUrls: ['./changeOwner.component.scss']
})
export class ChangeOwnerComponent implements OnInit {
  changeOwnerForm!: FormGroup;
  owner: string = "";
  device: any;
  constructor(
    public dialogRef: MatDialogRef<ChangeOwnerComponent>,
    public authService: AuthServiceService, public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.device = data.device;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.changeOwnerForm = new FormGroup({
      owner: new FormControl(this.device.owner, [Validators.required])
    })
  }
  onChangeOwnerClick(): void {
    const { owner, ...newDevice } = this.device;

    this.authService.editDevice({...newDevice, owner: this.changeOwnerForm.value.owner}).subscribe((response: any) =>{
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
