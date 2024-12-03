import { Component, Input, OnInit } from '@angular/core';
import { Dashboard } from 'app/CRUD/dashboard/dashboard.model';
import { Portlet } from '../../portlet.model';
import { DashboardService } from 'app/CRUD/dashboard/service/dashboard.service';
import { PortletService } from '../../service/portlet.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-portlet-dashboard-assignment',
  templateUrl: './portlet-dashboard-assignment.component.html',
  styleUrls: ['./portlet-dashboard-assignment.component.scss']
})
export class PortletDashboardAssignmentComponent implements OnInit {

  portlets: Portlet[] = [];
  dashboard: Dashboard[] = [];
  selectedPortletId: string | null = null;
  selectedDashboardId: string | null = null;

  identifier: string = '';
  @Input() portlet: Portlet | undefined;
  @Input() portletId: string = '';
  constructor(
    private portletService: PortletService,
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.portletId = params.get('idPortlet') || ''; // Retrieve idPortlet
  
      if (this.portletId) {
        this.portletService.retrievePortlet(this.portletId).subscribe(
          (data: Portlet) => {
            this.portlet = data;
            console.log('Portlet retrieved:', this.portlet); // Debugging line
            
            // Load charts only after datasource is retrieved
            this.loadDasboards();
          },
          (error) => {
            console.error('Error retrieving portlet:', error); // Debugging line
          }
        );
      } else {
        console.error('portlet ID is missing or invalid.');
      }
    });
  }
  
  


  loadDasboards() {
    this.dashboardService.getAllDashboards().subscribe(data => {
      this.dashboard = data;
    });
  }

  affecterDashboardAPortlet() {
    if (this.portletId !== null && this.selectedDashboardId !== null) {
      this.portletService.affecterDashboardAPortlet(this.portletId, this.selectedDashboardId)
        .subscribe(() => {
          this.loadDasboards();
          this.portletId = null;
          this.selectedDashboardId = null;
          this.gotoList();
        },
        error => console.log(error)
      );
    }
  }

  gotoList() {
    this.router.navigate(['/getAllPortlets']); // Make sure the URL is correct for the list of datasources
  }


}
