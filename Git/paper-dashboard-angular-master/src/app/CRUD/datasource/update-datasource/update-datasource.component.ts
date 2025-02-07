import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatasourceService } from '../service/datasource.service';
import { Datasource } from '../datasource.model';
import { User } from 'app/USERALLL/USERALL/user/user.model';
import { UserService } from 'app/USERALLL/USERALL/_services/user.service';
import { AuthService } from 'app/USERALLL/USERALL/_services/auth.service';

@Component({
  selector: 'app-update-datasource',
  templateUrl: './update-datasource.component.html',
  styleUrls: ['./update-datasource.component.scss']
})
export class UpdateDatasourceComponent implements OnInit {

  id: string = '';
  datasource: Datasource = new Datasource();
  public users: User[] = [];
  user: User = new User();
  currentUser: User | null = null; // Déclarez la variable currentUser de type User ou null
  updator_id: string = ''; // Nouveau champ creator_id
  passwordFieldType: string = 'password'; // Field type for password input
  passwordMaxLength: number = 8;
  errorMessages: { inputId: string, message: string }[] = []; // Ajouter errorMessages pour stocker les erreurs

  constructor(private route: ActivatedRoute, private router: Router,
    private authService: AuthService, private userService: UserService, private datasourceService: DatasourceService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.datasourceService.retrieveDatasource(this.id)
      .subscribe(data => {
        console.log(data);
        this.datasource = data;
      }, error => console.log(error));
    
    this.reloadData2(); 
  } 

  updateDatasource() {
    // Réinitialiser les messages d'erreur
    this.errorMessages = [];
  
    // Vérification des données du formulaire
    if (this.datasource.type.length === 0) {
      this.errorMessages.push({ inputId: 'type', message: "Type cannot be empty" });
    }
  
    if (this.datasource.connection_port.toString().length > 4) {
      this.errorMessages.push({ inputId: 'connection_port', message: "Connection port cannot exceed 4 characters" });
    }
  
    if (this.datasource.connection_port === 0) {
      this.errorMessages.push({ inputId: 'connection_port', message: "Connection port cannot be equal to 0" });
    }
  
    if (!this.datasource.url.trim()) {
      this.errorMessages.push({ inputId: 'url', message: "URL cannot be empty." });
    }
  
    if (this.datasource.user.length === 0) {
      this.errorMessages.push({ inputId: 'user', message: "User cannot be empty" });
    }
  
    if (this.datasource.password.length === 0) {
      this.errorMessages.push({ inputId: 'password', message: "password cannot be empty" });
    }
  
    // Si des erreurs sont présentes, les afficher toutes
    if (this.errorMessages.length > 0) {
      this.errorMessages.forEach(error => {
        this.showErrorMessage(error.inputId, error.message);
      });
      return; // Arrêtez le processus de sauvegarde si des erreurs existent
    }
  
    // Validation Elasticsearch
    this.datasourceService.getElasticsearchUser().subscribe((elasticUser: string) => {
      if (this.datasource.user.trim() != elasticUser.trim()) {
        this.errorMessages.push({ inputId: 'user', message: "Invalid Elasticsearch user" });
      }
  
      // Valider le port
      this.datasourceService.getElasticsearchPort().subscribe((elasticPort: number) => {
        if (this.datasource.connection_port != elasticPort) {
          this.errorMessages.push({ inputId: 'connection_port', message: "Invalid Elasticsearch connection_port" });
        }
  
        // Vérifier le mot de passe
        this.datasourceService.verifyPassword(this.datasource.password).subscribe((isPasswordValid: boolean) => {
          if (!isPasswordValid) {
            this.errorMessages.push({ inputId: 'password', message: "Invalid Elasticsearch password" });
          }
  
          // Vérifier l'URL
          this.datasourceService.getUrl().subscribe((configUrl: string) => {
            if (this.datasource.url.trim() != configUrl.trim()) {
              this.errorMessages.push({ inputId: 'url', message: "Invalid Elasticsearch URL" });
            }
  
            // Si des erreurs sont présentes, les afficher toutes
            if (this.errorMessages.length > 0) {
              this.errorMessages.forEach(error => {
                this.showErrorMessage(error.inputId, error.message);
              });
              return; // Arrêtez le processus de sauvegarde si des erreurs existent
            }
  
            // Si aucune erreur, procéder à la mise à jour
            const updateData = {
              ...this.datasource, // Copier toutes les autres propriétés du tableau de bord
              updator_id: this.updator_id // Ajouter l'updator_id
            };
  
            this.datasourceService.updateDatasource(this.id, updateData).subscribe(
              (data) => {
                console.log(data);
                this.gotoList();
              },
              (error) => {
                console.log(error);
                this.gotoList();
              }
            );
          });
        });
      });
    });
  }
  

  showErrorMessage(inputId: string, message: string): void {
    const inputElement = document.getElementById(inputId);
    const errorDiv = inputElement?.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('text-danger')) {
      errorDiv.textContent = message;
    } else {
      const div = document.createElement('div');
      div.textContent = message;
      div.classList.add('text-danger');
      inputElement?.insertAdjacentElement('afterend', div);
    }
  }

  onSubmit() {
    this.updateDatasource();
  }

  gotoList() {
    this.router.navigate(['/getAllDatasources']);
  }

  togglePasswordVisibility(): void {
    // Toggle password field type between 'password' and 'text'
    this.passwordFieldType = (this.passwordFieldType === 'password') ? 'text' : 'password';
  }

  reloadData2() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.updator_id = currentUser.id;
      this.userService.retrieveUser(currentUser.id)
        .subscribe(
          data => {
            console.log(data);
            this.user = data;
            this.updator_id = this.user.username; // Update creator_id with the retrieved username
          },
          error => console.log(error)
        );
    }
  }

  cancelUpdate() {
    this.gotoList(); // Naviguer vers la liste des tableaux de bord
  }
}
