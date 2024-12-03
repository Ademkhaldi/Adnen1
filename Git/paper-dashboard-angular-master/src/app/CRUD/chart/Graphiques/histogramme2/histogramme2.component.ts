import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core'; // Importation des modules nécessaires d'Angular
import { Chart, ChartConfiguration } from 'chart.js'; // Importation des classes de Chart.js pour créer des graphiques
import { ActivatedRoute, Router } from '@angular/router'; // Importation des classes pour gérer les routes
import { DatasourceService } from 'app/CRUD/datasource/service/datasource.service'; // Importation du service pour les sources de données
import { ChartService } from '../../service/chart.service'; // Importation du service pour gérer les graphiques
import { ColorService } from 'app/services/color.service'; // Importation du service pour gérer les couleurs

@Component({
  selector: 'app-histogramme2', // Sélecteur du composant
  templateUrl: './histogramme2.component.html', // Fichier de template HTML
  styleUrls: ['./histogramme2.component.scss'] // Fichier de style SCSS
})
export class Histogramme2Component implements OnInit {
  @ViewChild('histogrammeCanvas') canvasRef!: ElementRef<HTMLCanvasElement>; // Référence à l'élément canvas pour dessiner le graphique

  public chart: Chart<'bar', number[], string> | undefined; // Instance du graphique
  public histogrammeData: any = {}; // Données du graphique
  @Input() chartId: string = ''; // Identifiant du graphique, passé en entrée
  public chartTitle: string = ''; // Titre du graphique
  @Input() showButton: boolean = true; // Propriété pour afficher/masquer un bouton

  // Constructeur du composant
  constructor(
    private chartService: ChartService, // Injection du service de graphique
    private route: ActivatedRoute, 
    private router: Router, // Injection du service de routeur
    private colorService: ColorService // Injection du service de couleur
  ) { }

  // Méthode exécutée lors de l'initialisation du composant
  ngOnInit(): void {
    // Vérifie si chartId n'est pas défini, récupère l'ID à partir des paramètres de l'URL
    if (!this.chartId) {
      this.route.paramMap.subscribe(params => {
        this.chartId = params.get('id') || ''; // Récupération de l'ID du graphique
        this.fetchChartTitle(this.chartId); // Appel de la méthode pour récupérer le titre du graphique
      });
    } else {
      this.fetchChartTitle(this.chartId); // Appel direct pour récupérer le titre si chartId est défini
    }
    this.fetchData(this.chartId); // Appel de la méthode pour récupérer les données du graphique
  }
/*ngOnInit():

Vérifie si chartId est défini. Si non, récupère l'ID depuis les paramètres de l'URL et appelle fetchChartTitle. Sinon, appelle directement fetchChartTitle et fetchData.
*/
  // Méthode pour récupérer le titre du graphique
  fetchChartTitle(chartId: string) {
    this.chartService.retrieveChart(chartId) // Appel du service pour récupérer le graphique
      .subscribe(chart => {
        this.chartTitle = chart.title || 'Title Not Found'; // Mise à jour du titre, si trouvé
      });
  }

  // Méthode pour récupérer les données du graphique
  fetchData(chartId: string) {
    this.chartService.getHistogramme2(chartId) // Appel du service pour récupérer les données de l'histogramme
      .subscribe(data => {
        console.log('Fetched Data:', data); // Affichage des données récupérées dans la console
        this.histogrammeData = data; // Mise à jour des données de l'histogramme
        setTimeout(() => {
          this.createChart(); // Création du graphique après un léger délai
        }, 0);
      }, error => {
        console.error('Error fetching histogram data:', error); // Gestion des erreurs lors de la récupération des données
      });
  }
/*fetchData(chartId: string):

Récupère les données de l'histogramme via getHistogramme2. Si les données sont récupérées, elles sont stockées dans histogrammeData, puis createChart est appelée.





*/
/*createChart():

Crée un graphique à barres en utilisant les données d'histogramme. Récupère les labels et les valeurs, crée une configuration pour le graphique, puis crée ou met à jour le graphique.
*/
  // Méthode pour créer le graphique
  createChart() {
    if (!this.canvasRef) { // Vérifie si la référence du canvas existe
      console.error('Canvas reference not found!'); // Affiche une erreur si la référence est introuvable
      return;
    }

    const ctx = this.canvasRef.nativeElement.getContext('2d'); // Obtient le contexte 2D du canvas
    if (!ctx) { // Vérifie si le contexte est valide
      console.error('Failed to get 2D context from canvas!'); // Affiche une erreur si le contexte échoue
      return;
    }

    if (!this.histogrammeData || Object.keys(this.histogrammeData).length === 0) { // Vérifie si les données sont disponibles
      return; // Si aucune donnée, ne crée pas le graphique
    }

    console.log('Creating Chart...'); // Affiche un message de création du graphique
    const Labels: Set<string> = new Set(); // Utilise un ensemble pour stocker les labels uniques
    const datasets: { label: string, backgroundColor: string, borderWidth: number, data: number[] }[] = []; // Crée un tableau pour les datasets

    for (const aggreg in this.histogrammeData) { // Parcourt les données d'histogramme
      if (this.histogrammeData.hasOwnProperty(aggreg)) {
        const Values: number[] = []; // Crée un tableau pour les valeurs
        this.histogrammeData[aggreg].forEach((stat: any) => {
          Labels.add(stat.label); // Ajoute le label à l'ensemble des labels
          Values.push(stat.value); // Ajoute la valeur au tableau des valeurs
        });

        const capitalizedAggreg = this.capitalizeFirstLetter(aggreg); // Met en majuscule la première lettre de l'agrégation

        datasets.push({ // Ajoute un nouvel ensemble de données au tableau
          label: capitalizedAggreg,
          backgroundColor: this.colorService.getColorForLabel(capitalizedAggreg), // Récupère une couleur pour le label
          borderWidth: 1,
          data: Values // Ajoute les valeurs
        });
      }
    }

    // Configuration du graphique
    const chartConfig: ChartConfiguration<'bar', number[], string> = {
      type: 'bar', // Type de graphique
      data: {
        labels: Array.from(Labels), // Convertit l'ensemble des labels en tableau
        datasets: datasets // Utilise le tableau des datasets
      },
      options: {
        responsive: true, // Rendre le graphique responsive
        scales: {
          x: {
            beginAtZero: true // Commence l'axe des x à zéro
          },
          y: {
            beginAtZero: true // Commence l'axe des y à zéro
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) { // Callback pour personnaliser l'étiquette du tooltip
                let label = context.dataset.label || ''; // Récupère le label du dataset
                if (label) {
                  label += ': '; // Ajoute deux-points si un label existe
                }
                if (context.raw !== null) {
                  label += context.raw; // Ajoute la valeur brute
                }
                return label; // Retourne l'étiquette personnalisée
              }
            }
          },
          legend: {
            position: 'bottom', // Position de la légende
            align: 'center', // Alignement de la légende
            labels: {
              usePointStyle: true, // Utilise le style de point
              boxWidth: 10 // Largeur de la boîte de la légende
            }
          }
        }
      }
    };

    if (this.chart) { // Vérifie si un graphique existe déjà
      this.chart.destroy(); // Détruit l'ancien graphique pour en créer un nouveau
    }

    this.chart = new Chart(ctx, chartConfig); // Crée un nouveau graphique avec la configuration
  }

  // Méthode pour mettre en majuscule la première lettre d'une chaîne
  /*capitalizeFirstLetter(string: string):

Met en majuscule la première lettre d'une chaîne donnée.*/
  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase(); // Met la première lettre en majuscule
  }

  // Méthode pour vérifier si des données sont disponibles
  /*hasData():

Vérifie si des données sont présentes dans histogrammeData.*/
  hasData(): boolean {
    return Object.keys(this.histogrammeData).length > 0; // Retourne vrai si des données sont présentes
  }

  // Méthode pour retourner à la liste des graphiques
  return() {
    this.gotoList(); // Appelle la méthode pour naviguer vers la liste des graphiques
  }

  // Méthode pour naviguer vers la liste des graphiques
  gotoList() {
    this.router.navigate(['/getAllCharts']); // Redirige vers la route des graphiques
  }
}
