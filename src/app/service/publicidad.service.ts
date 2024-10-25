import { Injectable } from '@angular/core';
import { AdMob, BannerAdSize, BannerAdPosition, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PublicidadService {

  constructor() {
    
   }




  async showBannerAd() {
    try {
      AdMob.initialize();
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
      AdMob.initialize();
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
