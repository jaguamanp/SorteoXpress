import { Component } from '@angular/core';
import { DatabaseService } from './service/database.service';
import { Platform } from '@ionic/angular';
import { AdMob, BannerAdSize, BannerAdPosition, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import { environment } from "../environments/environment";
import { PublicidadService } from './service/publicidad.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Mis sorteos', url: '/sorteo', icon: 'home' }
  ];
  public labels = [];
  

  constructor(
    private databaseService: DatabaseService,
    private platform: Platform,
    private publicidadService: PublicidadService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.databaseService.createDatabase();

    this.platform.ready().then(() => {
      this.publicidadService.showBannerAd();
      this.publicidadService.showInterstitialAd();
    });
  }

}
