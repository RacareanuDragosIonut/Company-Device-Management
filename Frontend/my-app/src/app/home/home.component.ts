import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  username: string = "";
  role: string = "";
  constructor(
    public router: Router, public authService: AuthServiceService,private snackBar: MatSnackBar
   ){

   }
   ngOnInit(): void {
     this.username = localStorage.getItem('username')!!;
     this.role = localStorage.getItem('role')!!;
   }

   logout(){
      this.authService.logout().subscribe((response: any) => {
        if(response && response.message){
          const snackBarConfig = {
            duration: 3000,
          };
          if(response.message == "User successfully logged out"){
            localStorage.removeItem('username');
            localStorage.removeItem('location');
            localStorage.removeItem('group');
            localStorage.removeItem('role');
            this.router.navigate(['/login']);
            this.snackBar.open('Logout successful', 'OK', { ...snackBarConfig, panelClass: ['success-snackbar'] });
          }
          else{
            this.snackBar.open('Error when trying to logout', 'OK', { ...snackBarConfig, panelClass: ['error-snackbar'] });
          }
        }
      })

   }
}
