import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './USERALLL/USERALL/_services/token-storage.service';
import { ERole } from './USERALLL/USERALL/user/role.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentUser: any;
  profileImgSrc: string = ''; // Initialize with an empty string or a valid default URL
  title = 'Angular12JwtAuth';
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  id?: string;
  displayRoles: string = ''; // Nouvelle propriété pour afficher les rôles
  isAdmin: any;

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.username = user.username;
      this.id = user.id; // Assuming id is part of the user object

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
      this.displayRoles = this.roles.map(role => this.getReadableRole(role)).join(', ');

      // Retrieve profile image from local storage using the username
      const savedProfileImg = this.username ? localStorage.getItem(`profileImg_${this.username}`) : null;
      if (savedProfileImg) {
        this.profileImgSrc = savedProfileImg;
      } else {
        this.profileImgSrc = 'assets/images/avatar.png';
      }
    }
  }

  getReadableRole(role: string): string {
    switch (role) {
      case ERole.ROLE_ADMIN:
        return 'Admin';
      case ERole.ROLE_USER:
        return 'User';
      default:
        return 'Unknown Role';
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
