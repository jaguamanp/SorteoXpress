import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatabaseService } from "../service/database.service";
import { ActivatedRoute } from '@angular/router'; // Para obtener el ID de la ruta
import { NavController } from '@ionic/angular';
import { PublicidadService } from "../service/publicidad.service";
@Component({
  selector: 'app-sorteo-generador',
  templateUrl: './sorteo-generador.page.html',
  styleUrls: ['./sorteo-generador.page.scss'],
})
export class SorteoGeneradorPage implements OnInit {


    idSorteo: number = 0;
    numeroGenerado: number | null = null;
    numeroGanador: number | null = null;
    contador: number = 0;
    intervalo: any;
    metodoGeneracion: string | null = null; // Valor seleccionado en el select
    nombreGanador: string | null = null;

    @ViewChild('gifElement', { static: false }) gifElement: ElementRef<HTMLImageElement> | undefined;


    ngOnInit(): void {

      
      this.idSorteo = +this.route.snapshot.paramMap.get('id')!;
        
    }


  
    constructor(
      private publicidadService: PublicidadService,
      private databaseService: DatabaseService,
      private route: ActivatedRoute,
      private navController: NavController
    ) {
      this.publicidadService.showInterstitialAd();
    }
  
    // Método que decide qué función ejecutar según la opción seleccionada
    generarNumero() {
      if (!this.metodoGeneracion) {
        alert('Por favor selecciona un método de generación.');
        return;
      }

      if (this.gifElement && this.gifElement.nativeElement) {
        const gif = this.gifElement.nativeElement;
        gif.src = ''; // Resetea el src para que se reinicie
        setTimeout(() => {
          gif.src = 'assets/gif/ganador.gif'; // Vuelve a asignar el src
        }, 50); // Da un pequeño margen de tiempo para asegurarse de que el navegador lo recargue
      }
      this.generarNumeroGanador();
    }
  
    comprados: any[] = [];

    async generarNumeroGanador() {

      this.nombreGanador = "";
      this.numeroGenerado = 0;
      const numIdSorteo = this.idSorteo === 0 ? 0 : this.idSorteo;
      console.error("idSorteo: " + this.idSorteo);

      // Obtiene el sorteo desde el servicio
      const sorteo = await this.databaseService.getdetailSorteos(numIdSorteo);

      if (!sorteo) {
        console.error('No se pudo obtener el sorteo.');
        return;
      }

      let arrayNumeros: any = sorteo.numeros || [];
      const totalNumeros = sorteo.total_numeros;

      // Si el método de generación está vacío, generamos un número entre todos los números posibles
      if (this.metodoGeneracion === 'todos') {
        if (totalNumeros > 0) {
          // Genera un número aleatorio entre todos los números disponibles
          this.numeroGenerado = Math.floor(Math.random() * totalNumeros) + 1;
          this.iniciarContador();
        } else {
          alert('No hay números disponibles.');
        }
      } else {
        // Si hay un método de generación, genera un número solo entre los números comprados
        let arrayDatos: any[] = arrayNumeros;
        
        // Filtra los números que han sido comprados
        this.comprados = arrayDatos.filter(arrayNum => arrayNum.comprado === true);

        if (this.comprados.length > 0) {
          // Elige un número aleatorio entre los comprados y accede directamente al número
          const numeroSeleccionado = this.comprados[Math.floor(Math.random() * this.comprados.length)];
          this.numeroGenerado = numeroSeleccionado.numero; // Accede a la propiedad 'numero'
          this.nombreGanador = numeroSeleccionado.nombre_comprador || null;  // Si tiene comprador, se muestra el nombre
          this.iniciarContador();
        } else {
          alert('No hay números comprados para este sorteo.');
        }
      }
    }

    // Inicia el contador de 5 segundos
    iniciarContador() {
      this.contador = 5;
      this.intervalo = setInterval(() => {
        this.contador--;
        if (this.contador === 0) {
          clearInterval(this.intervalo);
          this.numeroGanador = this.numeroGenerado; // Asegúrate de que 'numeroGanador' almacene un número
        }
      }, 1000); // Cuenta regresiva de 1 segundo
    }

    // Función para volver a la página anterior
    goBack() {
      this.navController.back();
    }

}
  