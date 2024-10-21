import { Component } from '@angular/core';
import { DatabaseService } from './service/database.service';
import { Platform } from '@ionic/angular';
import { AdMob, BannerAdSize, BannerAdPosition, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import { environment } from "../environments/environment";

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
      AdMob.initialize();
      this.showBannerAd();
      this.showInterstitialAd();
    });
  }


  async showBannerAd() {
    try {
      const srtBannerId: string = environment.adMobConfig.bannerAdId
      // Mostrar el banner
      await AdMob.showBanner({
        adId: srtBannerId,
        adSize: BannerAdSize.BANNER, 
        position: BannerAdPosition.BOTTOM_CENTER,
      });
    } catch (err) {
      console.error('Error mostrando el banner', err);
    }
  }


  async showInterstitialAd() {
    try {
      // Preparar el anuncio intersticial
      await AdMob.prepareInterstitial({
        adId: environment.adMobConfig.interstitialAdId, // ID de prueba para interstitial
        // Puedes agregar otras opciones aquí, como cargar el anuncio solo bajo ciertas condiciones
      });
  
      // Mostrar el anuncio intersticial cuando esté cargado
      await AdMob.showInterstitial();
  
      // Escuchar eventos de cierre del anuncio, si es necesario
      AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
        console.log('El anuncio intersticial ha sido cerrado');
        // Aquí puedes agregar lógica si quieres ejecutar algo al cerrar el anuncio
      });
    } catch (err) {
      console.error('Error mostrando el anuncio intersticial', err);
    }
  }
}
