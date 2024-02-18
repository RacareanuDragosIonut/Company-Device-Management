import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthServiceService } from '../../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-device',
  templateUrl: './deleteDevice.component.html',
  styleUrls: ['./deleteDevice.component.scss']
})
export class DeleteDeviceComponent implements OnInit {
  device: any;
  constructor(
    public dialogRef: MatDialogRef<DeleteDeviceComponent>,
    public authService: AuthServiceService, public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

      this.device = data.device;
  }

  ngOnInit(): void {

  }

  onDeleteClick(){
    this.authService.deleteDevice({'deviceId': this.device.deviceId}).subscribe((response: any)=>{
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
