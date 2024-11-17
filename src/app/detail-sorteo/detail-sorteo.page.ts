import { Component,inject, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from "../service/database.service";
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { ModalRegisterPage } from "./modal-register/modal-register.page";
import { PublicidadService } from "../service/publicidad.service";
import { GestureController } from '@ionic/angular';

@Component({
  selector: 'app-detail-sorteo',
  templateUrl: './detail-sorteo.page.html',
  styleUrls: ['./detail-sorteo.page.scss'],
})
export class DetailSorteoPage implements OnInit, AfterViewInit{

  public title = "";
  arrayDatos: any = {};
  arrayDatosNumero: any[] = [];
  selectedNumbers: number[] = [];
  totalAPagar: number = 0; // Total calculado basado en los números seleccionados
  precioNumero: number = 0; 
  private idSorteo: number = 0;
  selectedSegment: string = 'disponibles';
  totalNumeroSorteo: number = 0;
  cantidadNumeroFaltante: number = 0;


  comprados: any[] = [];
  noComprados: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private modalController: ModalController,
    private publicidadService: PublicidadService,
    private gestureCtrl: GestureController
  ) {
  }


  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
        this.idSorteo = parseInt(id, 10);
        this.getSorteoDetail(this.idSorteo);   
        this.getObtenerInfoComprador(this.idSorteo);  
    } else {
      console.error('El ID del sorteo es nulo');
    }
  }


  compradores: any[] = [];

  async getObtenerInfoComprador(id: number)
  {
    try {
      // Obtener los sorteos almacenados en SQLite
      const sorteos = await this.databaseService.getInfoDatosComprador(id);
      
      // Asegúrate de que siempre se asigna un array, incluso si es vacío
      this.compradores = sorteos || [];
      
    } catch (error) {
      console.error('Error al obtener los sorteos, por favor intentelo más tarde.', error);
      this.compradores = [];
    }
  }


  async getSorteoDetail(id: number) {
    try {
      // Obtener los sorteos almacenados en SQLite
      const sorteos = await this.databaseService.getdetailSorteos(id);
      
      // Asegúrate de que siempre se asigna un array, incluso si es vacío
      this.arrayDatos = sorteos || [];

      this.title =  this.arrayDatos.nombre;
      this.precioNumero = this.arrayDatos.precio_numero || 0;

      this.arrayDatosNumero = this.arrayDatos.numeros;

      this.totalNumeroSorteo = this.arrayDatos.total_numeros;

      this.cantidadNumeroFaltante = this.arrayDatos.cantidad_numeros_faltantes;

      // Crear array de números comprados
      this.comprados = this.arrayDatosNumero.filter(numero => numero.comprado === true);

      // Crear array de números no comprados
      this.noComprados = this.arrayDatosNumero.filter(numero => numero.comprado === false);

    } catch (error) {
      console.error('Error al obtener los sorteos, por favor intentelo más tarde.', error);
      // Si ocurre un error, asegúrate de que la lista se inicialice como un array vacío
      this.arrayDatos = [];
    }
  }


    // Función que devuelve un array desde 1 hasta el número pasado como parámetro
    getArrayFromNumber(num: number): number[] {
      return Array.from({ length: num }, (_, index) => index + 1);
    }
  
    // Función que se ejecuta cuando se presiona un botón de número
    onNumeroClick(num: number) {
      console.log(`Número ${num} clickeado`);
      // Puedes agregar lógica adicional aquí
    }

    // Función para volver a la página anterior
    goBack() {
      this.publicidadService.showInterstitialAd().then(() =>{
        this.navCtrl.back();
      });
      
    }


  
    // Verificar si un número está seleccionado
    isSelected(num: number): boolean {
      return this.selectedNumbers.includes(num);
    }

    // Al hacer click en un número
    onNumeroSelected(num: number) {
      if (this.selectedNumbers.includes(num)) {
        // Si el número ya está seleccionado, lo eliminamos
        this.selectedNumbers = this.selectedNumbers.filter(n => n !== num);
      } else {
        // Si no está seleccionado, lo agregamos
        this.selectedNumbers.push(num);
        // Ordenar los números seleccionados
        this.selectedNumbers.sort((a, b) => a - b);
      }

      // Calcular el total a pagar
      this.calculateTotal();
    }

        // Función para calcular el total a pagar basado en los números seleccionados
    calculateTotal() {
      this.totalAPagar = parseFloat((this.selectedNumbers.length * this.precioNumero).toFixed(2));
    }


  // Mostrar formulario cuando se presione el botón flotante
  async onShowForm() {
    const modal = await this.modalController.create({
      component: ModalRegisterPage, // Debes crear este componente
      componentProps: {
        selectedNumbers: this.selectedNumbers,
        totalAPagar: this.totalAPagar,
        idSorteo: this.idSorteo,
        totalNumeroSorteo: this.totalNumeroSorteo,
        cantidadNumeroFaltante: this.cantidadNumeroFaltante
      }
    });
    
    await modal.present();

    modal.onDidDismiss().then(async (modalData) => {
      this.getSorteoDetail(this.idSorteo);  
      this.getObtenerInfoComprador(this.idSorteo);

      this.selectedNumbers = [];
    });
  }



  async mostrarNumerosComprador(comprador: any) {

    if (comprador.pago == 1) {
      const alert = await this.alertController.create({
        header: 'Números comprados',
        message: `Números: ${comprador.numeros_comprados}`,
        buttons: ['OK']
      });
      await alert.present();
    } else 
    {
      let arr = comprador.numeros_comprados.split(",").map(Number);

      const modal = await this.modalController.create({
        component: ModalRegisterPage, // Debes crear este componente
        componentProps: {
          selectedNumbers: arr,
          totalAPagar: comprador.valor_a_pagar,//comprador.total_pagar,
          //valorAPagar: comprador.valor_a_pagar,
          idSorteo: this.idSorteo,
          totalNumeroSorteo: this.totalNumeroSorteo,
          nombreComprador: comprador.nombre_comprador,
          compradorId: comprador.id,
          isEditing: true,

        }
      });
      
      await modal.present();
  
      modal.onDidDismiss().then(async (modalData) => {
        this.getSorteoDetail(this.idSorteo);  
        this.getObtenerInfoComprador(this.idSorteo);
  
        this.selectedNumbers = [];
      });
      
    }
  }


  /***
   * desplizar el dedo a la derecha o izquierda
   */

  ngAfterViewInit() {
    const gesture = this.gestureCtrl.create({
      el: document.querySelector('ion-content') as HTMLElement,
      gestureName: 'swipe',
      onMove: (event) => this.onSwipe(event)
    });
    gesture.enable();
  }

  onSwipe(event: any) {
    if (event.deltaX > 50) {
      // Deslizar hacia la derecha
      this.previousSegment();
    } else if (event.deltaX < -50) {
      // Deslizar hacia la izquierda
      this.nextSegment();
    }
  }

  nextSegment() {
    if (this.selectedSegment === 'disponibles') {
      this.selectedSegment = 'vendidas';
    } else if (this.selectedSegment === 'vendidas') {
      this.selectedSegment = 'listComprador';
    }
  }

  previousSegment() {
    if (this.selectedSegment === 'listComprador') {
      this.selectedSegment = 'vendidas';
    } else if (this.selectedSegment === 'vendidas') {
      this.selectedSegment = 'disponibles';
    }
  }
}
