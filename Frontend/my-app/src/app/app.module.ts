import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginComponent } from './login/login.component';
import { AuthServiceService } from './auth-service.service';
import { DevicesetComponent } from './deviceset/deviceset.component';
import { DevicemngmntComponent } from './devicemngmnt/devicemngmnt.component';
import { UsermngmntComponent } from './usermngmnt/usermngmnt.component';
import { UserinfoComponent } from './userinfo/userinfo.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';
import {MatButtonModule} from '@angular/material/button';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    LoginComponent,
    DevicesetComponent,
    DevicemngmntComponent,
    UsermngmntComponent,
    UserinfoComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuardService,
    AuthServiceService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
