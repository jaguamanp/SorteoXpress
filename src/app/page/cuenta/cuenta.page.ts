import { Component, OnInit } from '@angular/core';
import { getAuth,signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {


  private auth = getAuth();  // Instancia de Auth de Firebase

  constructor(private navCtrl: NavController,) { 
    // Inicializa Firebase solo una vez en toda la aplicación
    initializeApp(environment.firebaseConfig);

  }

  ngOnInit() {
  }

      // Función para volver a la página anterior
      goBack() {
        this.navCtrl.back();
      }

  async loginWithGoogle() {
    try {
      // Inicializa el flujo de Google Sign-In
      const googleUser = await GoogleAuth.signIn();
      const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
      
      // Inicia sesión en Firebase con las credenciales de Google
      const userCredential = await signInWithCredential(this.auth, credential);
      console.log('Usuario autenticado:', userCredential.user);
    } catch (error) {
      console.error('Error en el inicio de sesión con Google:', error);
    }
  }

}
