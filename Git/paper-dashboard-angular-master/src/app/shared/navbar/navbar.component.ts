import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { Location} from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit{
    private listTitles: any[];
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;

    public isCollapsed = true;
    @ViewChild("navbar-cmp", {static: false}) button;

    constructor(location:Location, private renderer : Renderer2, private element : ElementRef, private router: Router) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    ngOnInit(){
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        this.router.events.subscribe((event) => {
          this.sidebarClose();
       });
    }
    getTitle() {
    const path = this.location.prepareExternalUrl(this.location.path());
    console.log('Current path:', path);
    
    const titlee = path.split('/')[1]; // Obtenez le segment de l'URL après le premier slash (/)
    console.log('Extracted title:', titlee);
      switch (titlee) {
        case 'getAllPortlets':
              return 'Portlets';
        case 'AddPortlet':
              return 'Portlet';
        case 'UpdatePortlet':
              return 'Portlet';
        case 'portlet':
              return 'Portlet';
        case 'portlet/affecterDashboardAPortlet/:idPortlet/:idDashboard':
              return 'Portlet';
        case 'portlet/affecterChartAPortlet/:idPortlet/:idChart':              
              return 'Portlet';
 



        case 'getAllCharts':
              return 'Chart';
        case 'AddChart':
              return 'Chart';
        case 'UpdateChart':
              return 'Chart';
        case 'chart':
              return 'Chart';
        case 'chart/affecterDatasourceAChart/:idChart/:idDatasource':
            return 'Chart';
        case 'chart/affecterPortletAChart/:idChart/:idPortlet':
            return 'Chart';


            case 'portlet/affecterChartAPortlet/:idPortlet/:idChart':              
            return 'Portlet';

        
         case 'getAllDatasources':
            return 'Datasources';
         case 'AddDatasource':
            return 'Datasources';
         case 'UpdateDatasource':
            return 'Datasources';
         case 'datasource':
            return 'Datasources';
         case 'datasource/details/:id':
            return 'Datasources';

            case 'datasource/affecterChartADatasource/:idDatasource/:idChart':
              return 'Datasources';
          



/*
              
*/

              case 'getAllDashboards':
                return 'dashboard';
             case 'AddDashboard':
                return 'dashboard';
             case 'dashboard':
                return 'dashboards';
             case 'UpdateDashboard':
                return 'dashboard';
             
             case 'dashboard/details/:id':
                return 'dashboard';
    
                
                


         case 'user':
             return 'content';
         case 'user-list':
             return 'user';
                

         
              default:
              // Si aucun des cas ci-dessus ne correspond, renvoyez une chaîne vide
              return 'Dashboard';
      }
  }
  
        sidebarToggle() {
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
      }
      sidebarOpen() {
          const toggleButton = this.toggleButton;
          const html = document.getElementsByTagName('html')[0];
          const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
          setTimeout(function(){
              toggleButton.classList.add('toggled');
          }, 500);

          html.classList.add('nav-open');
          if (window.innerWidth < 991) {
            mainPanel.style.position = 'fixed';
          }
          this.sidebarVisible = true;
      };
      sidebarClose() {
          const html = document.getElementsByTagName('html')[0];
          const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
          if (window.innerWidth < 991) {
            setTimeout(function(){
              mainPanel.style.position = '';
            }, 500);
          }
          this.toggleButton.classList.remove('toggled');
          this.sidebarVisible = false;
          html.classList.remove('nav-open');
      };
      collapse(){
        this.isCollapsed = !this.isCollapsed;
        const navbar = document.getElementsByTagName('nav')[0];
        console.log(navbar);
        if (!this.isCollapsed) {
          navbar.classList.remove('navbar-transparent');
          navbar.classList.add('bg-white');
        }else{
          navbar.classList.add('navbar-transparent');
          navbar.classList.remove('bg-white');
        }

      }

}
