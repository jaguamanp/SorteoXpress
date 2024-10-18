import { Component } from '@angular/core';
import { DatabaseService } from './service/database.service';
import { Platform } from '@ionic/angular';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

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
  

  constructor(
    private databaseService: DatabaseService,
    private platform: Platform
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.databaseService.createDatabase();

    this.platform.ready().then(() => {
      this.showBannerAd();
    });
  }


  async showBannerAd() {
    try {
      // Inicializar AdMob
      await AdMob.initialize();

      // Mostrar el banner
      await AdMob.showBanner({
        adId: 'ca-app-pub-3940256099942544/6300978111', // ID de prueba
        adSize: BannerAdSize.BANNER, 
        position: BannerAdPosition.BOTTOM_CENTER,
      });
    } catch (err) {
      console.error('Error mostrando el banner', err);
    }
  }
}
