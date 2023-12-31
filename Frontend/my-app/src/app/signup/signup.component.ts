import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm!: FormGroup;
  roles: string[] = ["masteradmin", "locationadmin", "admin", "user"]
  locations: string[]= ["Bucharest", "Paris", "Berlin", "London", "Rome", "Budapest"]
  groups: string[] = ["Development","Network", "Human Resources", "Sales", "Management"]
     constructor(
      public router: Router, public authService: AuthServiceService,private snackBar: MatSnackBar
     ){

     }
     ngOnInit(): void {
      this.initForm();
     }

     initForm(){
      this.signupForm = new FormGroup({
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        role: new FormControl('', [Validators.required]),
        location: new FormControl('', [Validators.required]),
        group: new FormControl('', [Validators.required])
      })
     }
  signup(){
      this.authService.signup(this.signupForm.value).subscribe( (response: any) =>{
        if (response && response.message) {
          const snackBarConfig = {
            duration: 3000,
            panelClass: response.message.includes('successfully') ? ['success-snackbar'] : ['error-snackbar'],
          };
          this.snackBar.open(response.message, 'OK', snackBarConfig);
        }
      },
      (error) => {
        const errorMessage = 'An unexpected error occurred. Please try again.';
        const snackBarConfig = { duration: 5000, panelClass: ['error-snackbar'] };
        this.snackBar.open(errorMessage, 'OK', snackBarConfig);
      })
      }
  }

