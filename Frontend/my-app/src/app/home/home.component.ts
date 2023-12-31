import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  username: string = "";
  constructor(
    public router: Router, public authService: AuthServiceService,
   ){

   }
   ngOnInit(): void {
     this.username = localStorage.getItem('username')!!;
   }

   logout(){
      localStorage.removeItem('username');
      this.router.navigate(['/login']);
   }
}
