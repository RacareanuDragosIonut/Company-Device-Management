import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
     loginForm!: FormGroup;
     constructor(
      public router: Router, public authService: AuthServiceService,
      private snackBar: MatSnackBar, public dialog: MatDialog
     ){

     }
     ngOnInit(): void {
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      localStorage.removeItem('location');
      localStorage.removeItem('group');
      this.initForm();
     }

     initForm(){
      this.loginForm = new FormGroup({
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
      })
     }

     login(){
        this.authService.login(this.loginForm.value).subscribe( (response: any) =>{

      if (response && response.message) {

        const snackBarConfig = {
          duration: 3000,
        };

        if (response.message === 'Successful Login') {
          let user = response.user;
          this.snackBar.open('Login successful', 'OK', { ...snackBarConfig, panelClass: ['success-snackbar'] });
          this.router.navigate(['/home']);
          localStorage.setItem('username', user.username);
          localStorage.setItem('location', user.location);
          localStorage.setItem('group', user.group);
          localStorage.setItem('role', user.role);
          localStorage.setItem('deviceTypes', "Mobile Phone,Laptop,Headphones,Laboratory Engineer Device")
        } else if (response.message === 'Invalid password' || response.message === 'Invalid user') {
          this.snackBar.open('Invalid username or password', 'OK', { ...snackBarConfig, panelClass: ['error-snackbar'] });
        } else {
          this.snackBar.open('An unexpected error occurred', 'OK', { ...snackBarConfig, panelClass: ['error-snackbar'] });
        }
      }
        })

        }
}

