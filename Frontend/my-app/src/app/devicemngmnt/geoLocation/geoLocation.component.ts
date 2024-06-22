import { Component, Inject, OnInit } from '@angular/core';

import { HttpClient  } from '@angular/common/http';
import { AuthServiceService } from '../../auth-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { api_key } from './hidden-key';
@Component({

  selector: 'app-geo-location',
  templateUrl: './geoLocation.component.html',
  styleUrls: ['./geoLocation.component.scss']

})

export class GeoLocationComponent implements OnInit {

  api_key = api_key;
  apiUrl: string = ""
  ip: string = ""
  locationDetails: any = {}
  isRetrieved: boolean = false;
  constructor(private http:HttpClient, public dialogRef: MatDialogRef<GeoLocationComponent>,
    public authService: AuthServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.ip = data.ip
      this.apiUrl = 'https://ipgeolocation.abstractapi.com/v1/?api_key=' + this.api_key + '&ip_address=' + this.ip;
     }

  ngOnInit() {
      this.getGeolocationData();
  }

  getGeolocationData()

  {
    this.http.get(this.apiUrl).subscribe((res:any)=>{

      this.locationDetails = res;
      this.isRetrieved = true;
    });

  }

  onCancelClick(){
    this.dialogRef.close();
  }

}
