import { Component } from '@angular/core';
import { DatabaseService } from './service/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Mis sorteos', url: '/sorteo', icon: 'mail' },
    { title: 'Cuenta', url: '/folder/cuenta', icon: 'paper-plane' }
  ];
  public labels = [];
  

  constructor(private databaseService: DatabaseService) {
    this.initializeApp();
  }

  initializeApp() {
    this.databaseService.createDatabase();
  }
}
