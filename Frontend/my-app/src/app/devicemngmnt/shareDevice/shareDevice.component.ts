import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthServiceService } from '../../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-share-device',
  templateUrl: './shareDevice.component.html',
  styleUrls: ['./shareDevice.component.scss']
})
export class ShareDeviceComponent implements OnInit {
  shareDeviceForm!: FormGroup;
  owner: string = "";
  device: any;
  availableUsers: any[] = [];
  filteredUsernames: string[] = [];
  availableUsernames: string[] = [];
  loggedInUsername: string = "";
  constructor(
    public dialogRef: MatDialogRef<ShareDeviceComponent>,
    public authService: AuthServiceService, public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.device = data.device;
  }

  ngOnInit(): void {
    this.loggedInUsername = localStorage.getItem('username')!;
    this.authService.getUsers().subscribe((response: any) => {
      this.availableUsers = response.users;
      this.availableUsers = this.availableUsers.filter(user => {
        return user.username != this.loggedInUsername && !this.device.sharedUsersId.includes(user.userId)
      })
      for(const user of this.availableUsers){
        this.filteredUsernames.push(user.username)
      }
      this.availableUsernames = this.filteredUsernames
    })
    this.initForm();
  }

  initForm(){
    this.shareDeviceForm = new FormGroup({
      user: new FormControl('', [Validators.required])
    })
  }

  onSearch(){
    this.filteredUsernames = this.availableUsernames.filter(username => {
      return username.toLowerCase().includes(this.shareDeviceForm.value.user.toLowerCase())
    })
  }

  onShareClick(): void {

    this.authService.shareDevice({'username': this.shareDeviceForm.value.user, 'device_id': this.device.deviceId}).subscribe((response: any) =>{
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
