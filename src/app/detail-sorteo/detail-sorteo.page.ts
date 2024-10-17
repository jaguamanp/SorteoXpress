import { Component,inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from "../service/database.service";
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-detail-sorteo',
  templateUrl: './detail-sorteo.page.html',
  styleUrls: ['./detail-sorteo.page.scss'],
})
export class DetailSorteoPage implements OnInit {

  public title = "";
  arrayDatos: any = {};

  constructor(
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
        this.getSorteoDetail(parseInt(id, 10));      
    } else {
      console.error('El ID del sorteo es nulo');
    }
  }


  async getSorteoDetail(id: number) {
    try {
      // Obtener los sorteos almacenados en SQLite
      const sorteos = await this.databaseService.getdetailSorteos(id);
      
      // Asegúrate de que siempre se asigna un array, incluso si es vacío
      this.arrayDatos = sorteos || [];

      this.title =  this.arrayDatos.nombre;
    } catch (error) {
      console.error('Error al obtener los sorteos desde SQLite', error);
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
      this.navCtrl.back();
    }

}
