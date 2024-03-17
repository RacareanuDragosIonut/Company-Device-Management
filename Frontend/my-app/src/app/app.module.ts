import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginComponent } from './login/login.component';
import { AuthServiceService } from './auth-service.service';
import { AnalyticsComponent} from './analytics/analytics.component';
import { DeviceMngmntComponent } from './devicemngmnt/devicemngmnt.component';
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
import {MatSelectModule} from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule } from '@angular/material/icon'
import { HomeComponent } from './home/home.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AddUserComponent } from './usermngmnt/add-user/addUser.component';
import {MatMenuModule} from '@angular/material/menu'
import { EditUserComponent } from './usermngmnt/edit-user/editUser.component';
import { DeleteUserComponent } from './usermngmnt/delete-user/deleteUser.component';
import { ChangeUserDetailsComponent } from './userinfo/changeUserDetails/changeUserDetails.component';
import { ChangePasswordComponent } from './userinfo/changePassword/changePassword.component';
import { AddDeviceComponent } from './devicemngmnt/addDevice/addDevice.component';
import { DeleteDeviceComponent } from './devicemngmnt/deleteDevice/deleteDevice.component';
import { EditDeviceComponent } from './devicemngmnt/editDevice/editDevice.component';
import { ChangeOwnerComponent } from './devicemngmnt/changeOwner/changeOwner.component';
import { ShareDeviceComponent } from './devicemngmnt/shareDevice/shareDevice.component';
import { UnshareDeviceComponent } from './devicemngmnt/unshareDevice/unshareDevice.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FilterDevicesComponent } from './devicemngmnt/filterDevices/filterDevices.component';
import { GeoLocationComponent } from './devicemngmnt/geoLocation/geoLocation.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AnalyticsComponent,
    UsermngmntComponent,
    UserinfoComponent,
    SignupComponent,
    HomeComponent,
    AddUserComponent,
    EditUserComponent,
    DeleteUserComponent,
    ChangeUserDetailsComponent,
    ChangePasswordComponent,
    DeviceMngmntComponent,
    AddDeviceComponent,
    DeleteDeviceComponent,
    EditDeviceComponent,
    ChangeOwnerComponent,
    ShareDeviceComponent,
    UnshareDeviceComponent,
    FilterDevicesComponent,
    GeoLocationComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuardService,
    AuthServiceService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
