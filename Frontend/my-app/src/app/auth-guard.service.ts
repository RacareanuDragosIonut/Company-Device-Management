import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthServiceService } from "./auth-service.service";
import { Observable } from "rxjs";



@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{


  constructor(public authService: AuthServiceService,
    public router: Router){

    }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(localStorage.getItem('username') == undefined || localStorage.getItem('username') == null){
        this.router.navigate(['login'])
      }
      return true;
    }
}
