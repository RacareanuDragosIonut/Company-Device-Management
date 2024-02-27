import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthServiceService } from '../../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-unshare-device',
  templateUrl: './unshareDevice.component.html',
  styleUrls: ['./unshareDevice.component.scss']
})
export class UnshareDeviceComponent {
  unshareDeviceForm!: FormGroup;
  sharedUsersId: string[] = [];
  usernameIdList: any[] = []
  owner: string = "";
  device: any;
  unsharedUsersId: string[] = [];
  constructor(
    public dialogRef: MatDialogRef<UnshareDeviceComponent>,
    public authService: AuthServiceService, public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.device = data.device;
      this.sharedUsersId = this.device.sharedUsersId
      for(const sharedUserId of this.sharedUsersId){
        this.authService.getUsernameById(sharedUserId).subscribe((response: any) =>{
          if(response && response.message){
            if(response.message.includes('successfully')){
              let username = response.username
              this.usernameIdList.push({'id': sharedUserId, 'username': username})
            }
          }
        })
      }
  }

  onUnshareClick(): void {

    this.authService.unshareDevice({'user_ids': this.unsharedUsersId, 'device_id': this.device.deviceId}).subscribe((response: any) =>{
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

  onSelectCheckbox(id: any, checked: boolean){
    if(checked == true){
      this.unsharedUsersId.push(id)
    }
    if(checked == false){
      this.unsharedUsersId = this.unsharedUsersId.filter(selectedId => selectedId != id)
    }
  }
}
