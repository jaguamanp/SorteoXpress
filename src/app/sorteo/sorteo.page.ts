import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { DatabaseService } from '../service/database.service'; // Importa el servicio de SQLite
import { NewModalSorteoPage } from '../sorteo/new/new.page'; // Importa el modal
import { ActionSheetController } from '@ionic/angular';
import { Share } from '@capacitor/share'; // Importa el plugin Share de Capacitor
import { Router } from '@angular/router'; // Importa Router para la navegación
import { TutorialPopoverComponent } from '../tutorial-popover/tutorial-popover.component';
import { PopoverController } from '@ionic/angular';
import { PublicidadService } from "../service/publicidad.service";
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-sorteo',
  templateUrl: './sorteo.page.html',
  styleUrls: ['./sorteo.page.scss']
})
export class SorteoPage implements OnInit {

  public folder: string = "Mis Sorteos";

  @ViewChild('fabTrigger', { static: false }) fabTrigger: ElementRef | undefined;


  arrayListSorteo: any[] = [];

  listadoNumeros: string = '';

  boolvalideBienvenida: boolean= false;

  currentStep = 0;

  constructor(
    private modalController: ModalController,
    private databaseService: DatabaseService, // Inyecta el servicio de la base de datos
    private alertController: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private router: Router,
    private popoverController: PopoverController,
    private publicidadService: PublicidadService
  ) {
    
  }
  // Método para cargar los sorteos desde SQLite
  async listDatos() {
    try {
      this.arrayListSorteo = [];
      // Obtener los sorteos almacenados en SQLite
      const sorteos = await this.databaseService.getSorteos();
      
      // Asegúrate de que siempre se asigna un array, incluso si es vacío
      this.arrayListSorteo = sorteos || [];
    } catch (error) {
      console.error('Error al obtener los sorteos desde SQLite', error);
      // Si ocurre un error, asegúrate de que la lista se inicialice como un array vacío
      this.arrayListSorteo = [];
    }
  }

  async openModal(idSorteo?: number) {
    const modal = await this.modalController.create({
      component: NewModalSorteoPage,
      componentProps: {
        idSorteo: idSorteo || null // Si no se pasa el id, se manda null (modo crear)
      }
    });

    // Recibe los datos del modal cuando se cierre
    modal.onDidDismiss().then(async (modalData) => {
      await this.listDatos();
    });

    return await modal.present();
  }


  isActionSheetOpen = false;

  async openListAction(idSorteo: number) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Acciones',
      cssClass: 'custom-action-sheet',
      buttons: [
        {
          text: 'Duplicar',
          icon: 'copy-outline',
          handler: () => {
            this.duplicarSorteo(idSorteo);
          }
        },
        {
          text: 'Editar',
          icon: 'pencil-outline',
          handler: () => {
            this.editSorteo(idSorteo);
          }
        },
        {
          text: 'Compartir',
          icon: 'arrow-undo-outline',
          handler: () => {
            this.compartirSorteo(idSorteo);
          }
        },
        {
          text: 'Generar ganador',
          icon: 'sync-outline',
          handler: () => {

            this.publicidadService.showInterstitialAd().then(() => {
              this.router.navigate(['/sorteo-generador', idSorteo]);
            });
          }
        },
        
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.deleteSorteo(idSorteo);
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          handler: () => {
            
          }
        },
        {
          text: '', // Este es el espacio en blanco
          handler: () => {
            // Puedes dejar este handler vacío
          }
        }
      ]
    });
    await actionSheet.present();
  }

  closeActionSheet() {
    this.isActionSheetOpen = false;
  }

  ionViewWillEnter(){
    this.listDatos();
  }

  async compartirSorteo(id: number){
    try {

      //
        const sorteoData = await this.databaseService.getdetailSorteos(id);
        const totalNumeros = sorteoData.total_numeros;
        let nombre = sorteoData.nombre;
        let fecha = sorteoData.fecha_sorteo;

        //const fechaFormateada = this.datePipe.transform(fecha, 'dd/MM/yyyy');
        let listado = `Nombre del sorteo: ${nombre} \n`;
        listado += `Fecha: ${fecha} \n`;
        // Recorrer la lista de números del sorteo
        for (let i = 1; i <= totalNumeros; i++) {
          const compradorInfo = sorteoData.numeros.find((num: any) => num.numero === i);
          const comprador = compradorInfo?.nombre_comprador || '';
          listado += `${i}) ${comprador}\n`;
        }
  
        // Guardar el texto formateado para compartir
        this.listadoNumeros = listado;
      //
      await Share.share({
        title: 'Listado de números',
        text: this.listadoNumeros,
        dialogTitle: 'Compartir el listado',
      });
      console.log('Listado compartido con éxito');
    } catch (error) {
      console.error('Error al compartir el listado:', error);
    }
  }

  editSorteo(id: number){
    this.openModal(id);
  }

  async duplicarSorteo(idSorteo: number) {
    try {
      const sorteoOriginal = await this.databaseService.getdetailSorteos(idSorteo);
      const nuevoSorteo = {
        ...sorteoOriginal,
        idSorteo: null, // Asegúrate de que el nuevo sorteo no tenga el mismo ID
        nombre: `${sorteoOriginal.nombre} (Duplicado)`, // Cambiar el nombre del sorteo duplicado
        fecha_sorteo: sorteoOriginal.fecha_sorteo
      };
      await this.databaseService.addSorteo(nuevoSorteo); // Guardar el nuevo sorteo duplicado
      await this.listDatos(); // Actualizar la lista de sorteos
      console.log('Sorteo duplicado con éxito');
    } catch (error) {
      console.error('Error al duplicar el sorteo:', error);
    }
  }

  // Método para eliminar un sorteo
  async deleteSorteo(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este sorteo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              // Eliminar el sorteo de SQLite
              await this.databaseService.deleteSorteo(id);
      
              // Actualizar la lista de sorteos localmente
              this.listDatos();
            } catch (error) {
              console.error('Error al eliminar el sorteo', error);
            }
          }
        }
      ]
    });
  
    await alert.present();
  }

  // Método que se ejecuta al inicializar la página
  ngOnInit() {

    //const hasSeenTutorial = localStorage.getItem('valideBienvenida');
    setTimeout(() => {
      this.listDatos();
    }, 1000);
  }


  //eliminar
  async showPopover() {
    // Verifica si `fabTrigger` está definido
    if (this.fabTrigger && this.fabTrigger.nativeElement) {
      const rect = this.fabTrigger.nativeElement.getBoundingClientRect();

      const popover = await this.popoverController.create({
        component: TutorialPopoverComponent,
        componentProps: { message: 'Crea tu primer sorteo' },
        translucent: true,
        cssClass: 'custom-popover',
        event: {
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2,
        } as MouseEvent,
      });
      await popover.present();
    } else {
      console.error('fabTrigger no está disponible en el DOM.');
    }
  }


  detailContentSorteo(id: number){
    this.publicidadService.showInterstitialAd().then(() => {
      // Redirige a la página deseada después de cerrar el anuncio
      this.router.navigate(['/detail-sorteo/'+id]);
    });
  }

  async openPrivacyPolicy() {
    await Browser.open({ url: 'https://www.termsfeed.com/live/6c9c0004-793a-471a-b690-58a8184ffec3' });
  }

}


