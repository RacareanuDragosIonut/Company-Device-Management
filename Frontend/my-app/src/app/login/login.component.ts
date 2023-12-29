import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
     loginForm!: FormGroup;
     constructor(
      public router: Router
     ){

     }
     ngOnInit(): void {
      this.initForm();
     }

     initForm(){
      this.loginForm = new FormGroup({
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
      })
     }

     login(){

     }
}
