import { Component, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { DatabaseService } from "../../service/database.service";
import { NumeroComprado } from "../../request/numCompradoRequest";
@Component({
  selector: 'app-modal-register',
  templateUrl: './modal-register.page.html',
  styleUrls: ['./modal-register.page.scss'],
})
export class ModalRegisterPage {

  @Input() selectedNumbers: number[] = [];
  @Input() totalAPagar: number = 0;
  @Input() idSorteo: number = 0;
  @Input() cantidadNumeroFaltante: number = 0;


  // editar 
  @Input() isEditing: boolean = false;
  @Input() compradorId: number = 0;

  @Input() nombreComprador: string = '';
  abono: number = 0; // Aquí controlamos el abono como texto para validarlo
  pagoCompleto: boolean = false;

  constructor(
    private modalController: ModalController,
    private databaseService: DatabaseService,
    private alertController: AlertController) {}

  dismiss() {
    this.modalController.dismiss();
  }

  async guardar() {

    try {

      let mensaje = '';

        if (this.nombreComprador.trim() == "") 
        {
          throw new Error("El nombre del comprador es requerido.");
        }
  
        if (this.abono > this.totalAPagar ) 
        {
          throw new Error("El campo abono no puede ser mayor al valor a pagar.");
        }
  
        if (this.abono == this.totalAPagar) {
          this.pagoCompleto = true;
        }

        if (this.pagoCompleto) {
          this.abono = this.totalAPagar;
        }

      if (this.isEditing) {
        // Validar y actualizar comprador existente
        await this.databaseService.editarComprador({
          id: this.compradorId,
          pago: this.pagoCompleto,
          abono: this.abono
        });
        console.log('Comprador actualizado correctamente.');

        mensaje = `Comprador ${this.nombreComprador} actualizado correctamente.`;
      }else{
          const compradorData = {
            nombre_comprador: this.nombreComprador,
            pago: this.pagoCompleto,
            abono: this.abono,
            id_sorteo: this.idSorteo
          };


              // Guardar la información del comprador
      this.databaseService.guardarComprador(compradorData).then(compradorId => {

          if (compradorId) 
          {
            let countNumeros = 0;
            // Luego guardamos los números comprados
            for (let num of this.selectedNumbers) {
              countNumeros++;
              let entityNumComprado: NumeroComprado = {
              id_comprador: compradorId, 
              numero_comprado: num 
              };
              this.databaseService.guardarNumeroComprado(entityNumComprado);
            }

            let restCantidadSorteo = this.cantidadNumeroFaltante - countNumeros;
            let datosEditSorteo = {
              cantidad_numeros_vendidos: countNumeros,
              cantidad_numeros_faltantes: restCantidadSorteo,
              idSorteo: this.idSorteo
            };
        
            this.databaseService.updateSorteoComprador(datosEditSorteo);
          }
          
        });

        mensaje = `${this.nombreComprador} ha comprado los siguientes números: ${this.selectedNumbers.join(', ')} correctamente`;
      }

      const alert = await this.alertController.create({
        header: 'Éxito',
        message: mensaje,
        buttons: ['OK']
      });

      await alert.present();

      this.modalController.dismiss();
    }catch (error) {

      // Manejo de errores, asegurándonos de que el error tiene un mensaje
      let errorMessage = 'Ocurrió un error inesperado, por favor intentelo más tarde.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: errorMessage,
        buttons: ['OK']
      });

      await alert.present();
      
    }
  }

  // Lógica para validar el abono en tiempo real
  onAbonoInput(event: any) {
    let value = event.target.value;
    
    // Permitir solo números y puntos
    value = value.replace(/[^0-9.]/g, '');

    // Asegurarse de que solo haya un punto decimal
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts[1];
    }

    this.abono = value; // Actualizamos el valor del abono con el formato correcto
  }

   // Método que se llama cuando cambia el estado del checkbox de pago completo
   onPagoCompletoChange(event: any) {
    if (this.pagoCompleto) {
      this.abono = this.totalAPagar; // Si es pago completo, abono es igual al total
    } else {
      this.abono = 0; // Si no es pago completo, el campo de abono está disponible para ingresar un valor
    }
  }

  ngOnInit() {
  }

}
