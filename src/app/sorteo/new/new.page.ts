import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { DatabaseService } from '../../service/database.service';
import { ActivatedRoute } from '@angular/router'; // Importar ActivatedRoute
import { SorteoRequest } from "../../request/sorteoRequest";
@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewModalSorteoPage implements OnInit {

  @Input() idSorteo: number = 0;

  sorteo: SorteoRequest= {
    idSorteo: 0,
    nombre: '',
    fecha_sorteo: '',
    cantidad_numeros_vendidos: 0, // Inicia con 0
    cantidad_numeros_faltantes: 0, // Calculado en base a total - vendidos
    total_numeros: 0, // Total de números disponibles
    precio_numero: 0, // Precio por número
    id_motivo: 0, // Motivo seleccionado
    estado: 'Activo' // Estado por defecto
  };

  motivos: any[] = []; // Para almacenar los motivos cargados

  constructor(
    private modalController: ModalController, 
    private alertController: AlertController,
    private databaseService: DatabaseService,
    private route: ActivatedRoute,) {}

  ngOnInit() {
    this.loadMotivos();
    if (this.idSorteo) {
      this.loadSorteo(this.idSorteo);
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }




  async loadMotivos() {
    try {
      const motivos = await this.databaseService.getMotivos(); // Cargar motivos desde la base de datos
      this.motivos = motivos || []; 
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudieron cargar los motivos.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async submitForm() {

    // Validación de campos vacíos
    if (!this.sorteo.nombre || !this.sorteo.fecha_sorteo || !this.sorteo.total_numeros || !this.sorteo.precio_numero || !this.sorteo.id_motivo) {
      const alert = await this.alertController.create({
        header: 'Campos incompletos',
        message: 'Por favor, complete todos los campos antes de enviar.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Validación de la fecha
    if (!this.validateDate()) {
      const alert = await this.alertController.create({
        header: 'Fecha inválida',
        message: 'La fecha del sorteo no puede ser anterior a la fecha actual.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Asignar la cantidad faltante en base a total y vendidos
    this.sorteo.cantidad_numeros_faltantes = this.sorteo.total_numeros - this.sorteo.cantidad_numeros_vendidos;

    try {

      let message = "";
      if (this.sorteo.idSorteo != 0) 
      {
        message = "actualizado";
        await this.databaseService.updateSorteo(this.sorteo);
      }else
      {
        message = "creado";
        await this.databaseService.addSorteo(this.sorteo);

      }
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: `Sorteo ${message} correctamente.`,
        buttons: ['OK']
      });
      await alert.present();
      this.modalController.dismiss(this.sorteo);
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un problema al crear el sorteo. Inténtelo nuevamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  validateDate(): boolean {
    const selectedDate = new Date(this.sorteo.fecha_sorteo);
    const currentDate = new Date();
    return selectedDate >= currentDate;
  }



  // editar 
  async loadSorteo(id: number) 
  {
    try {
      const sorteoData = await this.databaseService.getdetailSorteos(id); // Método para obtener el sorteo por ID
      if (sorteoData) {
        this.sorteo = { ...sorteoData };
      }
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un problema al cargar los datos del sorteo.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}


