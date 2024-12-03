import { Component, OnInit } from '@angular/core';
import { ChartService } from '../service/chart.service';
import { Router } from '@angular/router';
import { charttype, charttypeLabelMapping } from '../charttype.model';
import { Chart } from '../chart.model';
import { User } from 'app/USERALLL/USERALL/user/user.model';
import { AuthService } from 'app/USERALLL/USERALL/_services/auth.service';
import { UserService } from 'app/USERALLL/USERALL/_services/user.service';
import { DatasourceService } from 'app/CRUD/datasource/service/datasource.service';
import { Datasource } from 'app/CRUD/datasource/datasource.model';

@Component({
  selector: 'app-add-chart',
  templateUrl: './add-chart.component.html',
  styleUrls: ['./add-chart.component.scss']
})
export class AddChartComponent implements OnInit {
  identifier: string = ''; // Variable pour stocker l'identifiant du graphique (ou autre usage).
  idDatasource: string = ''; // ID de la source de données sélectionnée.
  public charttypeLabelMapping = charttypeLabelMapping; // Mappage des types de graphiques pour l'affichage des labels.
  public Charttypes = Object.values(charttype); // Liste des types de graphiques disponibles.
  public datasources: Datasource[] = []; // Tableau contenant toutes les sources de données.
  public indices: string[] = []; // Liste des indices disponibles pour la source de données sélectionnée.
  public attributes: string[] = []; // Liste des attributs disponibles pour l'indice sélectionné.
  
  chart: Chart = { // Objet représentant un graphique, avec ses propriétés.
    title: '', 
    type: charttype.Line, // Type par défaut de graphique.
    x_axis: '', // Axe X du graphique.
    y_axis: '', // Axe Y du graphique.
    aggreg: '', // Méthode d'agrégation.
    index: '', // Indice sélectionné.
  };
  submitted = false; // Flag indiquant si le formulaire a été soumis ou non.
  public users: User[] = []; // Tableau des utilisateurs disponibles (par exemple pour attribution).
  updator_id: string; // ID de l'utilisateur qui modifie le graphique.
  user: User = new User(); // Objet représentant l'utilisateur actuel.
  currentUser: User | null = null; // Utilisateur actuellement connecté.
  creator_id: string; // ID de l'utilisateur qui a créé le graphique.
  navbarTitle: string = 'List'; // Titre de la barre de navigation.

  constructor(
    private chartService: ChartService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private datasourceService: DatasourceService
  ) { }



  /*ngOnInit est utilisé pour exécuter des méthodes au démarrage du composant. 
  Il permet de charger les données ou exécuter des opérations initiales 
  (comme obtenir les informations de l'utilisateur ou charger des données spécifiques).*/
  ngOnInit(): void {
    this.reloadData2(); // Charger les informations de l'utilisateur connecté.
    this.datasourceData(); // Charger les sources de données disponibles.
  }
/*Résumé IndexData: Cette méthode récupère les indices liés à une source de données spécifique et réinitialise les attributs lorsque l'indice change.

*/ 
  IndexData(idDataSource: string) { // Méthode appelée pour récupérer les indices pour une source de données donnée.
    this.datasourceService.getAllIndexByDatasourceId(idDataSource).subscribe(
      (data: string[]) => {
        this.indices = data; // Remplir la liste des indices avec les données reçues.
        console.log(this.indices); // Afficher les indices dans la console pour le débogage.
        this.attributes = []; // Réinitialiser la liste des attributs à chaque changement d'indice.
      },
      (error) => console.log(error) // Afficher l'erreur dans la console si la requête échoue.
    );
  }

/*Résumé onIndexChange: Cette méthode est déclenchée lorsqu'un utilisateur sélectionne un indice. Elle récupère et affiche les attributs associés à cet indice.

*/
  onIndexChange(index: string) { // Méthode appelée lors du changement d'indice dans le formulaire.
    console.log(`idDataSource: ${this.idDatasource}, index: ${index}`); // Affichage des données pour débogage.
    
    this.datasourceService.getAttributesByIndex(this.idDatasource, index).subscribe(
      (data: string[]) => {
        console.log('Attributes received:', data); // Vérification des attributs reçus.
       /*Cette condition permet de s'assurer que les données reçues sont valides et qu'il y a des attributs à afficher avant de procéder à leur utilisation dans le reste du code.Presente et sa longueur>0
*/  
        if (data && data.length > 0) {
          this.attributes = data; // Mettre à jour les attributs s'ils existent.
          console.log('Updated attributes:', this.attributes); // Afficher les attributs mis à jour.
        } else {
          console.log('No attributes found for the given index.');
        }
      },
      (error) => {
        console.log('Error fetching attributes:', error); // Affichage des erreurs en cas d'échec.
      }
    );
  }

/*Résumé: Cette méthode charge toutes les sources de données et les affiche dans le formulaire pour permettre à l'utilisateur de choisir.
*/
  datasourceData() { // Récupérer toutes les sources de données disponibles.
    this.datasourceService.getAllDatasources().subscribe(data => {
      this.datasources = data.map(Datasource => ({ // Mapper et stocker les données dans la variable.
        ...Datasource,
      }));
      console.log(data); // Afficher les sources de données pour le débogage.
    });
  }

/*Résumé reloadData2: Cette méthode permet de charger les informations de l'utilisateur actuellement connecté et de les affecter aux champs creator_id et updator_id du graphique.

*/
  reloadData2() { // Récupérer les informations de l'utilisateur actuellement connecté.
    const currentUser = this.authService.getCurrentUser(); // Obtenir l'utilisateur actuel.
    if (currentUser && currentUser.id) {
      this.creator_id = currentUser.id; // Stocker l'ID de l'utilisateur.
      this.userService.retrieveUser(currentUser.id)
        .subscribe(
          data => {
            this.user = data; // Mettre à jour les infos utilisateur.
            this.creator_id = this.user.username; // Associer le nom d'utilisateur en tant que créateur.
            this.updator_id = this.user.username; // Associer le nom d'utilisateur en tant que modificateur.
          },
          error => console.log(error) // Gérer les erreurs.
        );
    }
  }

  saveChart(): void {
        const errorMessages = [];

  
      if (this.chart.title.length === 0) {
        errorMessages.push({ inputId: 'title', message: "title cannot be empty" });
      }  if (this.chart.x_axis.length === 0) {
        errorMessages.push({ inputId: 'x_axis', message: "x_axis cannot be empty" });
      }
      if (this.chart.y_axis.length === 0) {
        errorMessages.push({ inputId: 'y_axis', message: "y_axis cannot be empty" });
      }
      if (this.chart.index.length === 0) {
        errorMessages.push({ inputId: 'index', message: "index cannot be empty" });
      }
   
  
  
  
  // Si des erreurs sont présentes, les afficher toutes
  if (errorMessages.length > 0) {
    errorMessages.forEach(error => {
      this.showErrorMessage(error.inputId, error.message);
    });
    return; // Arrêtez le processus de sauvegarde si des erreurs existent
  }    const data = {
      title: this.chart.title,
      type: this.chart.type,
      x_axis: this.chart.x_axis,
      y_axis: this.chart.y_axis,
      aggreg: this.chart.aggreg,
      index: this.chart.index,
      creator_id: this.creator_id,
      updator_id: this.creator_id
    };

    this.chartService.createChart(data,this.idDatasource)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
        },
        error: (e) => {
          console.error(e);
        }
      });
      this.submitted = true;
  }

  showErrorMessage(inputId: string, message: string): void {
    const inputElement = document.getElementById(inputId);
    const errorDiv = inputElement.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('text-danger')) {
      errorDiv.textContent = message;
    } else {
      const div = document.createElement('div');
      div.textContent = message;
      div.classList.add('text-danger');
      inputElement.insertAdjacentElement('afterend', div);
    }
  }  
  showInfoMessage(message: string): void {
    const infoDiv = document.getElementById('info-message');
    if (infoDiv) {
      infoDiv.textContent = message;
      infoDiv.classList.add('text-info');
    } else {
      const div = document.createElement('div');
      div.textContent = message;
      div.classList.add('text-info');
      div.id = 'info-message';
      document.querySelector('.submit-form').insertAdjacentElement('beforebegin', div);
    }
  }
  

  newChart(): void {
    this.submitted = false;
    this.chart = {
      title: '',
      type: charttype.Line,
      x_axis: '',
      y_axis: '',
      aggreg: '',
      index: '',
    };
  }

  gotoList() {
    this.router.navigate(['/getAllCharts']);
  }
}
