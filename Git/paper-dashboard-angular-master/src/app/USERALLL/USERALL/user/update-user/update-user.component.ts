import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../_services/user.service';
import { User } from '../user.model';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  id: string = '';
  user: User = new User();
  profileImgSrc: string = 'assets/images/avatar.png'; // Image de profil par défaut
  updator_id: string = 'updator'; // Nouveau champ updator_id

  constructor(private route: ActivatedRoute, private router: Router,
              private userService: UserService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.userService.retrieveUser(this.id)
      .subscribe(data => {
        console.log(data);
        this.user = data;
        this.profileImgSrc = localStorage.getItem(`profileImg_${this.user.username}`) || 'assets/images/avatar.png'; // Charger l'image de profil
      }, error => console.log(error));
  } 

  updateUser() {
    const updateData = {
      ...this.user, // Copier toutes les autres propriétés de l'utilisateur
      updator_id: this.updator_id // Inclure updator_id dans les données mises à jour
    };
  
    this.userService.updateUser(this.id, updateData).subscribe(
      (data) => {
        console.log(data);
        this.gotoList();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSubmit() {
    this.updateUser();
  }

  gotoList() {
    this.router.navigate(['/user-list']);
  }

  cancelUpdateUser() {
    this.gotoList();  // Naviguer vers la liste des utilisateurs
  }

  onProfileImgClick(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImgSrc = e.target.result;
        // Sauvegarder l'image de profil dans le stockage local avec un nom basé sur le nom d'utilisateur
        localStorage.setItem(`profileImg_${this.user.username}`, this.profileImgSrc);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
