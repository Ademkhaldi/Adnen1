import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DatasourceService } from '../../../datasource/service/datasource.service'; // Importer le service pour les sources de données (non utilisé ici).
import { ActivatedRoute, Router } from '@angular/router'; // Pour gérer les routes et récupérer les paramètres de l'URL.
import { ChartService } from '../../service/chart.service'; // Service pour interagir avec les API liées aux graphiques.
import { ColorService } from 'app/services/color.service'; // Service pour générer des couleurs pour le graphique.

@Component({
  selector: 'app-Camambert2', // Nom du sélecteur utilisé pour ce composant dans le template.
  templateUrl: './Camambert2.component.html', // Lien vers le template HTML de ce composant.
  styleUrls: ['./Camambert2.component.scss'] // Lien vers le fichier de style SCSS du composant.
})
export class Camambert2Component implements OnInit { // Déclaration du composant Angular, qui implémente l'interface OnInit.

  public chart: Chart<'pie', number[], string> | undefined; // Référence au graphique de type 'pie'.
  public camabertData: any[] = []; // Tableau qui contiendra les données pour le graphique.
  public chartTitle: string = ''; // Titre du graphique.
  
  @Input() chartId: string = ''; // ID du graphique, récupéré via l'input ou l'URL.
  @Input() showButton: boolean = true; // Propriété pour afficher ou masquer un bouton.

  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>; 
  // ViewChild pour capturer une référence au canvas HTML dans lequel le graphique sera rendu.

  constructor(
    private chartService: ChartService, // Injection du service pour les opérations liées aux graphiques.
    private route: ActivatedRoute, // Injection pour accéder aux paramètres de l'URL.
    private router: Router, // Injection pour rediriger les utilisateurs.
    private colorService: ColorService // Injection du service pour générer des couleurs pour les graphiques.
  ) { 
    Chart.register(...registerables); // Enregistrer les composants nécessaires pour Chart.js.
  }

  ngOnInit(): void { // Fonction appelée à l'initialisation du composant.
    if (!this.chartId) { // Si l'ID du graphique n'est pas déjà défini via l'input...
      this.route.paramMap.subscribe(params => { // Abonnement pour récupérer l'ID du graphique depuis l'URL.
        this.chartId = params.get('id') || ''; // Récupérer l'ID depuis l'URL ou définir une chaîne vide si absent.
        this.fetchChartTitle(this.chartId); // Appeler la méthode pour récupérer le titre du graphique.
      });
    } else { // Si l'ID est déjà défini...
      this.fetchChartTitle(this.chartId); // Récupérer le titre du graphique directement.
    }
    this.fetchData(this.chartId); // Appeler la méthode pour récupérer les données du graphique.
  }

  // Récupérer le titre du graphique depuis le backend.
  fetchChartTitle(chartId: string) {
    this.chartService.retrieveChart(chartId)
      .subscribe(chart => {
        this.chartTitle = chart.title || 'Title Not Found'; // Mettre à jour le titre ou afficher un message par défaut.
      });
  }

  // Récupérer les données pour le graphique.
  fetchData(chartId: string) {
    this.chartService.getCamambertData(chartId)
      .subscribe(data => {
        console.log('Fetched Data:', data); // Afficher les données récupérées dans la console.
        this.camabertData = data; // Stocker les données dans une propriété du composant.
        this.createChart(); // Appeler la méthode pour créer et afficher le graphique.
      });
  }

  // Créer le graphique à partir des données récupérées.
  createChart() {
    const canvas = this.chartCanvas.nativeElement; // Récupérer l'élément canvas où le graphique sera rendu.
    const ctx = canvas.getContext('2d'); // Obtenir le contexte 2D pour dessiner le graphique.
    if (!ctx) {
      console.error('Failed to get 2D context from canvas!'); // Afficher un message d'erreur si le contexte 2D n'est pas disponible.
      return;
    }

    if (!this.camabertData || this.camabertData.length === 0) {
      return; // Ne rien faire si les données sont vides.
    }

    console.log('Creating Chart...'); // Message de débogage pour indiquer que le graphique est en cours de création.
    const labels = this.camabertData.map((stat: any) => stat.label); // Extraire les labels depuis les données.
    const values = this.camabertData.map((stat: any) => stat.value); // Extraire les valeurs depuis les données.

    // Générer les couleurs pour chaque label à partir du service ColorService.
    const backgroundColors = labels.map(label => this.colorService.getColorForLabel(label));

    const chartConfig: ChartConfiguration<'pie', number[], string> = { // Configuration du graphique.
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: 'Data', // Légende du jeu de données.
          backgroundColor: backgroundColors, // Couleurs de fond pour chaque portion.
          borderWidth: 0, // Largeur de la bordure des portions.
          data: values as number[] // Données numériques pour chaque portion du camembert.
        }]
      },
      options: { // Options de configuration du graphique.
        responsive: true, // Le graphique s'adapte à la taille de l'écran.
        plugins: {
          tooltip: { // Configuration des tooltips (infobulles).
            callbacks: {
              label: function (context) { // Format personnalisé pour les labels dans les infobulles.
                let label = context.label || ''; 
                if (label) {
                  label += ': ';
                }
                if (context.raw !== null) {
                  label += context.raw; // Afficher la valeur brute des données.
                }
                return label;
              }
            }
          },
          legend: { // Configuration de la légende.
            position: 'bottom', // Positionner la légende en bas.
            align: 'center', // Aligner la légende au centre.
            labels: {
              usePointStyle: true, // Utiliser des points dans la légende.
              boxWidth: 10 // Largeur des boîtes dans la légende.
            }
          }
        }
      }
    };

    if (this.chart) { // Si un graphique existe déjà, le détruire avant d'en créer un nouveau.
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, chartConfig); // Créer le graphique avec les données et la configuration.
  }

  // Retourner à la liste des graphiques.
  return() {
    this.gotoList(); // Appeler la méthode pour naviguer vers la liste.
  }

  // Méthode pour naviguer vers la liste des graphiques.
  gotoList() {
    this.router.navigate(['/getAllCharts']); // Rediriger vers la route affichant tous les graphiques.
  }
}
/*label: 'Data' : Ici, le texte 'Data' est une chaîne de caractères qui sert de nom pour le jeu de données que l'on va représenter dans le graphique.
La légende est utilisée dans certaines sections du graphique, comme dans la légende du graphique ou dans les infobulles qui apparaissent au survol des différentes sections du graphique.*/
/*'Data' est simplement une chaîne de texte arbitraire définie dans le code. Ce n'est pas une valeur dynamique provenant du backend ou d'une autre source, mais une étiquette statique que l'auteur du code a choisie pour représenter ce jeu de données.*/