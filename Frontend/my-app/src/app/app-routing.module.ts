import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DeviceMngmntComponent } from './devicemngmnt/devicemngmnt.component';
import { DevicesetComponent } from './deviceset/deviceset.component';
import { UsermngmntComponent } from './usermngmnt/usermngmnt.component';
import { UserinfoComponent } from './userinfo/userinfo.component';
import { NgModule } from '@angular/core';
import { AuthGuardService } from './auth-guard.service';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
{
  path:'login',
  component: LoginComponent
},
{
  path:'signup',
  component: SignupComponent
},
{
   path: '',
   component: AppComponent,
   canActivate: [AuthGuardService]

},
{
  path: 'home',
  component: HomeComponent,
  canActivate: [AuthGuardService]

},
{
  path: 'devicemngmnt',
  component: DeviceMngmntComponent,
  canActivate: [AuthGuardService]

},
{
  path: 'deviceSets',
  component: DevicesetComponent,
  canActivate: [AuthGuardService]

},
{
  path: 'usermngmnt',
  component: UsermngmntComponent,
  canActivate: [AuthGuardService]
},
{
  path: 'user-info',
  component: UserinfoComponent,
  canActivate: [AuthGuardService]
},


];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
