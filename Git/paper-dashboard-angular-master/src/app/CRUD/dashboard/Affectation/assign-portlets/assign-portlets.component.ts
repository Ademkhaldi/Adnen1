import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../service/dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Portlet } from 'app/CRUD/portlet/portlet.model';
import { Dashboard } from '../../dashboard.model';
import { PortletService } from 'app/CRUD/portlet/service/portlet.service';

@Component({
  selector: 'app-assign-portlets',
  templateUrl: './assign-portlets.component.html',
  styleUrls: ['./assign-portlets.component.scss']
})
export class AssignPortletsComponent implements OnInit {
  portlets: Portlet[] = [];
  dashboards: Dashboard[] = [];
  selectedDashboardId: string | null = null;
  selectedPortlet: Portlet = new Portlet(); // Portlet sélectionné
  identifier: string = '';


  @Input() dashboard: Dashboard | undefined;
  @Input() dashboardId: string = '';
  constructor(private dashboardService: DashboardService, private router: Router, private portletService: PortletService,private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    

this.route.paramMap.subscribe(params => {
  this.dashboardId = params.get('idDashboard') || ''; // Retrieve iddashboard
  //this.selectedChartId = params.get('idChart') || ''; // Retrieve idChart

  if (this.dashboardId) {
    this.dashboardService.retrieveDashboard(this.dashboardId).subscribe(
      (data: Dashboard) => {
        this.dashboard = data;
        console.log('Dashboard retrieved:', this.dashboard); // Debugging line
        
        // Load charts only after datasource is retrieved
        this.loadPortlets();
      },
      (error) => {
        console.error('Error retrieving dashboard:', error); // Debugging line
      }
    );
  } else {
    console.error('dashboard ID is missing or invalid.');
  }
});
}


  loadPortlets() {
    this.portletService.getAllPortlets().subscribe(data => {
      this.portlets = data;
    });
  }

  assignerListePortletsADashboard(): void {
    if (!this.dashboardId) {
      console.error('No dashboard selected.');
      return;
    }

    this.dashboardService.assignerListePortletsADashboard(this.dashboardId, [this.selectedPortlet]).subscribe({
      next: (dashboard) => {
        console.log('Portlets assigned successfully to dashboard:', dashboard);
        //this.errorOccurred = false; // Réinitialiser l'état d'erreur
        this.router.navigate(['dashboard/getPortletsForDashboard', this.dashboardId]);
      },
    });
  }
}
