import { Component, Input, OnInit } from '@angular/core';
import { Datasource } from '../datasource.model';
import { Chart } from 'app/CRUD/chart/chart.model';
import { ChartService } from 'app/CRUD/chart/service/chart.service';
import { DatasourceService } from '../service/datasource.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chart-to-datasource-assignment',
  templateUrl: './chart-to-datasource-assignment.component.html',
  styleUrls: ['./chart-to-datasource-assignment.component.scss']
})
export class ChartToDatasourceAssignmentComponent implements OnInit {

  datasources: Datasource[] = [];
  chart: Chart[] = [];
  selectedDatasourceId: string | null = null;
  selectedChartId: string | null = null;

  identifier: string = '';
  @Input() datasource: Datasource | undefined;
  @Input() datasourceId: string = '';
  constructor(
    private datasourceService: DatasourceService,
    private chartService: ChartService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.datasourceId = params.get('idDatasource') || ''; // Retrieve idDatasource
      //this.selectedChartId = params.get('idChart') || ''; // Retrieve idChart
  
      if (this.datasourceId) {
        this.datasourceService.retrieveDatasource(this.datasourceId).subscribe(
          (data: Datasource) => {
            this.datasource = data;
            console.log('Datasource retrieved:', this.datasource); // Debugging line
            
            // Load charts only after datasource is retrieved
            this.loadCharts();
          },
          (error) => {
            console.error('Error retrieving datasource:', error); // Debugging line
          }
        );
      } else {
        console.error('Datasource ID is missing or invalid.');
      }
    });
  }
  
  
  
  hidePassword(password: string): string {
    if (!password) {
      return ''; // Or some placeholder if the password is undefined
    }
    return '*'.repeat(password.length); // Replace each character with an asterisk
  }

  list() {
    this.router.navigate(['/getAllDatasources']);
  }

  loadCharts() {
    this.chartService.getAllCharts().subscribe(data => {
      this.chart = data;
    });
  }

  affecterChartADatasource() {
    if (this.datasourceId !== null && this.selectedChartId !== null) {
      this.datasourceService.affecterChartADatasource(this.datasourceId, this.selectedChartId)
        .subscribe(() => {
          this.loadCharts();
          this.datasourceId = null;
          this.selectedChartId = null;
          this.gotoList();
        },
        error => console.log(error)
      );
    }
  }

  gotoList() {
    this.router.navigate(['/getAllDatasources']);
  }
}
