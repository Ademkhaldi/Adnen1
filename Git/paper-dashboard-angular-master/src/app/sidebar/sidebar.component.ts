import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { AuthService } from 'app/USERALLL/USERALL/_services/auth.service';
import { TokenStorageService } from 'app/USERALLL/USERALL/_services/token-storage.service';
import { ERole } from 'app/USERALLL/USERALL/user/role.model';
import { User } from 'app/USERALLL/USERALL/user/user.model';
import { filter, map } from 'rxjs';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    children?: RouteInfo[]; // Ajoutez une propriété pour les sous-menus

}

export const ROUTES: RouteInfo[] = [                  
    
    { path: '/getAllDashboards',     title: 'Dashboards',         icon:'nc-icon nc-chart-pie-36',       class: '' },
    { path: '/getAllPortlets',     title: 'Portlets',         icon:'nc-icon nc-box-2',       class: '' },
    { path: '/getAllDatasources',     title: 'Datasources',         icon:'nc-icon nc-cloud-upload-94',       class: '' },
    
    { path: '/getAllCharts',     title: 'Chart',         icon:'nc-icon nc-vector',       class: '' },


    
    

    
    { path: '/icons',         title: 'Others',             icon:'nc-diamond',    class: '' },
    { path: '/user',          title: 'User Profile',      icon:'nc-single-02',  class: '' },
   
    { path: '/user-list',          title: 'user-list ',      icon:'nc-single-02',  class: '' },




];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    private roles: string[] = [];
    currentUser: User | null = null; // Déclarez la variable currentUser de type User ou null
    public isAdmin: boolean = false;
    public isUser: boolean = false;
    username?: string;
    displayRoles: string = ''; // Nouvelle propriété pour afficher les rôles

    



    constructor(
        private tokenStorageService: TokenStorageService,
        private authService: AuthService, // Use AuthService to get the current user
      ) { }
    
      ngOnInit() {
        
        this.loadUserRole();  // Load the user's role first
        const user = this.tokenStorageService.getUser();
        this.roles = user.roles;
        this.username = user.username;
        this.displayRoles = this.roles.map(role => this.getReadableRole(role)).join(', ');

        if (this.isUser) {
            // Show only specific menu items for the 'USER' role
            this.menuItems = ROUTES.filter(menuItem => 
                menuItem.path === '/getAllDashboards' || 
                menuItem.path === '/getAllCharts'||
                menuItem.path === '/icons'||
                menuItem.path === '/user'||
                menuItem.path === '/table'||
                menuItem.path === '/user-list'
            );
        } else {
            // Show all menu items for other roles
            this.menuItems = ROUTES.filter(menuItem => menuItem);
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


    loadUserRole() {
        this.currentUser = this.authService.getCurrentUser();
        // Vérifiez si l'utilisateur a le rôle admin
        this.isAdmin = this.authService.hasRole('ROLE_ADMIN');
        // Vérifiez si l'utilisateur a le rôle user
        this.isUser = this.authService.hasRole('ROLE_USER');
      }
      

}
