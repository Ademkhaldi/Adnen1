import { Component, Input, OnInit } from '@angular/core';
import { ChartService } from '../../service/chart.service';
import { PortletService } from 'app/CRUD/portlet/service/portlet.service';
import { Portlet } from 'app/CRUD/portlet/portlet.model';
import { Chart } from '../../chart.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-portlet-to-chart-assignment',
  templateUrl: './portlet-to-chart-assignment.component.html',
  styleUrls: ['./portlet-to-chart-assignment.component.scss']
})
export class PortletToChartAssignmentComponent implements OnInit {

  charts: Chart[] = [];
  portlet: Portlet[] = [];
  selectedChartId: string | null = null;
  selectedPortletId: string | null = null;

  identifier: string = '';
  @Input() chart: Chart | undefined;
  @Input() chartId: string = '';
  constructor(
    private portletService: PortletService,
    private chartService: ChartService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.chartId = params.get('idChart') || ''; // Retrieve idChart
  
      if (this.chartId) {
        this.chartService.retrieveChart(this.chartId).subscribe(
          (data: Chart) => {
            this.chart = data;
            console.log('Chart retrieved:', this.chart); // Debugging line
            
            // Load charts only after datasource is retrieved
            this.loadPortlets();
          },
          (error) => {
            console.error('Error retrieving chart:', error); // Debugging line
          }
        );
      } else {
        console.error('Chart ID is missing or invalid.');
      }
    });
  }
  

  loadPortlets() {
    this.portletService.getAllPortlets().subscribe(data => {
      this.portlet = data;
    });
  }

  affecterPortletAChart() {
    if (this.chartId !== null && this.selectedPortletId !== null) {
      this.chartService.affecterPortletAChart(this.chartId, this.selectedPortletId)
        .subscribe(() => {
          this.loadPortlets();
          this.chartId = null;
          this.selectedPortletId = null;
          this.gotoList();
        },
        error => console.log(error)
      );
    }
  }

  gotoList() {
    this.router.navigate(['getAllCharts']); // Ajustez la route de navigation vers le formulaire
  }


}
