import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatasourceService } from '../service/datasource.service';
import { Datasource } from '../datasource.model';

@Component({
  selector: 'app-datasource-details',
  templateUrl: './datasource-details.component.html',
  styleUrls: ['./datasource-details.component.scss']
})
export class DatasourceDetailsComponent implements OnInit {

  identifier: string = '';

  @Input() datasource: Datasource | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private datasourceService: DatasourceService, // Utilisez correctement le service MarketService
  ) {}

  ngOnInit(): void {
    if (this.datasource == null) {
      this.datasource = new Datasource();//une nouvelle instance de l'objet Datasource est créée et assignée à cette variable.Cela garantit que la propriété datasource ne reste pas vide, même si aucune donnée n'a été initialement passée. Ce comportement peut être utile pour éviter les erreurs dans le modèle de données (comme l'accès à une propriété d'un objet null), et permet d'initialiser un nouvel objet Datasource prêt à être utilisé ou modifié.
    }
    this.identifier = this.route.snapshot.params['id'];

    this.datasourceService.retrieveDatasource(this.identifier).subscribe(
      (data: Datasource) => {
        this.datasource = data;
      },
      (error) => console.log(error)
    );
  }
  hidePassword(password: string): string {
    if (!password) {
      return ''; // Or some placeholder if the password is undefined
    }
    return '*'.repeat(password.length); // Replace each character with an asterisk
  }
    list() {
    this.router.navigate(['/getAllDatasources']); // Ajustez la route de navigation
  }
}