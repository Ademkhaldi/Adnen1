import { Component, Input, OnInit } from '@angular/core';
import { Portlet } from '../../portlet.model';
import { Chart } from 'app/CRUD/chart/chart.model';
import { PortletService } from '../../service/portlet.service';
import { ChartService } from 'app/CRUD/chart/service/chart.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-portlet-chart-assignment',
  templateUrl: './portlet-chart-assignment.component.html',
  styleUrls: ['./portlet-chart-assignment.component.scss']
})
export class PortletChartAssignmentComponent implements OnInit {

  portlets: Portlet[] = [];
  chart: Chart[] = [];
  selectedPortletId: string | null = null;
  selectedChartId: string | null = null;

  identifier: string = '';
  @Input() portlet: Portlet | undefined;
  @Input() portletId: string = '';
  constructor(
    private portletService: PortletService,
    private chartService: ChartService,
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
            this.loadCharts();
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
  
  


  loadCharts() {
    this.chartService.getAllCharts().subscribe(data => {
      this.chart = data;
    });
  }

  affecterChartAPortlet() {
    if (this.portletId !== null && this.selectedChartId !== null) {
      this.portletService.affecterChartAPortlet(this.portletId, this.selectedChartId)
        .subscribe(() => {
          this.loadCharts();
          this.portletId = null;
          this.selectedChartId = null;
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
