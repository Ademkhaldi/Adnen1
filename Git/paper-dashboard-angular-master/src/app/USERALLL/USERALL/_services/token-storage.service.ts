import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  
  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }
  
  // New method to save profile image associated with the user
  public saveProfileImg(imageUrl: string): void {
    let user = this.getUser();
    if (user) {
      user.profileImg = imageUrl;
      this.saveUser(user);  // Save the user back with the new profile image
    }
  }

  public getProfileImg(): string | null {
    const user = this.getUser();
    return user && user.profileImg ? user.profileImg : null;
  }
}
