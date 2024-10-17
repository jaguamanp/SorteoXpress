import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { DatabaseService } from '../service/database.service'; // Importa el servicio de SQLite
import { NewModalSorteoPage } from '../sorteo/new/new.page'; // Importa el modal

@Component({
  selector: 'app-sorteo',
  templateUrl: './sorteo.page.html',
  styleUrls: ['./sorteo.page.scss'],
})
export class SorteoPage implements OnInit {

  public folder: string = "Mis Sorteos";

  arrayListSorteo: any[] = [];

  constructor(
    private modalController: ModalController,
    private databaseService: DatabaseService, // Inyecta el servicio de la base de datos
    private alertController: AlertController
  ) {}

  // Método para cargar los sorteos desde SQLite
  async listDatos() {
    try {
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

  async openModal() {
    const modal = await this.modalController.create({
      component: NewModalSorteoPage
    });

    // Recibe los datos del modal cuando se cierre
    modal.onDidDismiss().then(async (modalData) => {
      if (modalData !== null && modalData.data) {
        await this.listDatos();
      }
    });

    return await modal.present();
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
              this.arrayListSorteo = this.arrayListSorteo.filter(sorteo => sorteo.id !== id);
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
    setTimeout(() => {
      this.listDatos();
    }, 1000);
  }
}


