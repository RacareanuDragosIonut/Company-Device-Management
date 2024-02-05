import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from './add-user/addUser.component';
import { EditUserComponent } from './edit-user/editUser.component';
import { DeleteUserComponent } from './delete-user/deleteUser.component';
@Component({
  selector: 'app-usermngmnt',
  templateUrl: './usermngmnt.component.html',
  styleUrl: './usermngmnt.component.scss'
})
export class UsermngmntComponent implements OnInit{
      users: any[] = [];
      searchUsers: any[] = [];
      paginatedUsers: any[] = [];
      pageSize = 10;
      pageIndex = 0;
      constructor(public authService: AuthServiceService, public router: Router, public dialog: MatDialog){

      }
      ngOnInit(): void {
        this.getData();
      }

      getData(){
        this.authService.getUsers().subscribe((response: any) => {
          this.users = response.users;
          this.searchUsers = response.users;
          this.paginatedUsers = this.getPaginatedUsers(this.users);
        })
      }

      applySearch(event: any): void {
        let searchTerm: string = (event.target as HTMLInputElement).value;
        this.searchUsers = this.users.filter( user => user.username.toLowerCase().includes(searchTerm));
        this.paginatedUsers = this.getPaginatedUsers(this.searchUsers);
      }
      addUser(){
        const dialogRef = this.dialog.open(
          AddUserComponent,
          { width: '600px', height: '600px' }
        );

        dialogRef.afterClosed().subscribe(() => {
          this.getData();
        });
      }

      onPaginatorChange(event: any){
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;

        this.paginatedUsers = this.getPaginatedUsers(this.users);
      }

      getPaginatedUsers(users: any[]): any[] {
        const startIndex = this.pageIndex * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return users.slice(startIndex, endIndex);
      }

      goToHomePage(){
        this.router.navigate(['/home']);
      }

      editUser(user: any){
        const dialogRef = this.dialog.open(
          EditUserComponent,
          { width: '600px', height: '600px',
          data: {user: user} }
        );

        dialogRef.afterClosed().subscribe(() => {
          this.getData();
        });
      }

      deleteUser(user: any){
        const dialogRef = this.dialog.open(
          DeleteUserComponent,
          { width: '400px', height: '250px',
          data: {user: user} }
        );

        dialogRef.afterClosed().subscribe(() => {
          this.getData();
        });

      }
}
