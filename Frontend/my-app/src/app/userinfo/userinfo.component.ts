import { Component } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangeUserDetailsComponent } from './changeUserDetails/changeUserDetails.component';
import { ChangePasswordComponent } from './changePassword/changePassword.component';
@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrl: './userinfo.component.scss'
})
export class UserinfoComponent {
  username: string | null = "";
  role: string | null = "";
  location: string | null = "";
  group: string | null = "";
  constructor(public authService: AuthServiceService, public router: Router, public dialog: MatDialog){

  }
  ngOnInit(): void {
    this.getData();
  }

  getData(): any{
    this.username = localStorage.getItem('username');
    this.role = localStorage.getItem('role');
    this.location = localStorage.getItem('location');
    this.group = localStorage.getItem('group');

  }

  openChangePasswordDialog(){
    const dialogRef = this.dialog.open(
      ChangePasswordComponent,
      { width: '600px', height: '600px',
      }
    );

    dialogRef.afterClosed().subscribe(() => {
      this.getData();
    });
  }

  openChangeUserDetailsDialog(){

    const dialogRef = this.dialog.open(
      ChangeUserDetailsComponent,
      { width: '600px', height: '600px',
      data: {username: this.username, role: this.role, location: this.location, group: this.group} }
    );

    dialogRef.afterClosed().subscribe(() => {
      this.getData();
    });

  }

  goToHomePage(){
    this.router.navigate(['/home']);
  }
}
