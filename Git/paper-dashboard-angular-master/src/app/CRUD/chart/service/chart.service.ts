import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chart } from '../chart.model';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  apiUrl = 'http://localhost:9100/Charts'; // API Gateway URL for Charts

  constructor(private http: HttpClient) { }

  getAllCharts(): Observable<Chart[]> {
    return this.http.get<Chart[]>(`${this.apiUrl}/getAllCharts`);
  }

  retrieveChart(id: string): Observable<Chart> {
    return this.http.get<Chart>(`${this.apiUrl}/${id}`);
  }


  createChart(chart: any, idDatasource: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Add/${idDatasource}`, chart);
  }

  updateChart(idChart: string, idDatasource: string, chart: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Update/${idChart}/${idDatasource}`, chart);
  }

  deleteChart(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Delete/${id}`, { responseType: 'text' });
  }

  deleteAllCharts(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteAllCharts`, { responseType: 'text' });
  }

  affecterDatasourceAChart(idChart: string, idDatasource: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/affecterDatasourceAChart/${idChart}/${idDatasource}`, {});
  }

  affecterPortletAChart(idChart: string, idPortlet: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/affecterPortletAChart/${idChart}/${idPortlet}`, {});
  }


  getCamambertData(chartId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/camembert/${chartId}`);
  }
  
  
  getTableData(chartId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/table/${chartId}`);
  }
  
  
  getHistogramme2(chartId: string): Observable<Map<string, { label: string, values: number[] }[]>> {
    return this.http.get<Map<string, { label: string, values: number[] }[]>>(`${this.apiUrl}/histogramme2/${chartId}`);
  }



}
