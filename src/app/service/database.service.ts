import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;

  motivos = [
    'Benéfico',
    'Escolar',
    'Navidad',
    'Aniversario',
    'Fundaciones',
    'Fin de año',
    'Deportivo',
    'Comunitario',
    'Caridad',
    'Viaje',
    'Gastos médicos',
    'Inauguración',
    'Ayuda social',
    'Construcción',
    'Educativo',
    'Hospital',
    'Lotería',
    'Becas',
    'Deportivo',
    'Corporativo'
  ];
  

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }



  async createDatabase() {
    try {
      if (Capacitor.getPlatform() === 'web') {
        throw new Error('No soportado en web');
      }

      // Crear conexión a la base de datos
      const db: SQLiteDBConnection = await this.sqlite.createConnection(
        'sorteos.db',  // Nombre de la base de datos
        false,         // No está encriptada
        'no-encryption', // Modo de encriptación (aquí sin encriptación)
        1,             // Versión de la base de datos
        false          // No es de solo lectura
      );

      this.db = db; // Asignar la conexión a la variable db

      // Abrir la base de datos
      await this.db.open();

      // Crear las tablas si no existen
      const querySorteos = `
      CREATE TABLE IF NOT EXISTS sorteos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        fecha_sorteo TEXT NOT NULL,
        cantidad_numeros_vendidos INTEGER NOT NULL,
        cantidad_numeros_faltantes INTEGER NOT NULL,
        total_numeros INTEGER NOT NULL,
        precio_numero REAL NOT NULL,
        estado TEXT NOT NULL,
        id_motivo INTEGER,
        FOREIGN KEY (id_motivo) REFERENCES motivo(id)
      );`;

      const queryMotivos = `
        CREATE TABLE IF NOT EXISTS motivo (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          descripcion TEXT NOT NULL,
          estado TEXT NOT NULL
        );`;

      // Ejecutar las consultas
      await this.db.execute(queryMotivos);
      await this.db.execute(querySorteos);

      console.log('Tablas de sorteos y motivos creadas correctamente.');

      // Verificar e insertar motivos si no existen
      const res = await this.db.query('SELECT COUNT(*) AS count FROM motivo;');
      if (res && res.values && res.values.length > 0 && res.values[0].count === 0) {
        for (let motivo of this.motivos) {
          const query = `
            INSERT INTO motivo (descripcion, estado) 
            VALUES (?, 'Activo');
          `;
          await this.db.run(query, [motivo]);
        }
        console.log('Motivos iniciales insertados.');
      } else {
        console.log('Motivos ya existen o no se pudo acceder a los resultados.');
      }

    } catch (error) {
      console.error('Error al crear la base de datos:', error);
    }
  }

  async addSorteo(sorteo: any) {
    try {
      if (this.db) {
        const query = `
          INSERT INTO sorteos (
            nombre, 
            fecha_sorteo, 
            cantidad_numeros_vendidos, 
            cantidad_numeros_faltantes, 
            total_numeros, 
            precio_numero, 
            id_motivo, 
            estado
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const values = [
          sorteo.nombre, 
          sorteo.fecha_sorteo, 
          0, 
          sorteo.total_numeros, 
          sorteo.total_numeros, 
          sorteo.precio_numero, 
          sorteo.id_motivo, 
          sorteo.estado
        ];
        await this.db.run(query, values);
        console.log('Sorteo guardado en la base de datos');
      } else {
        console.error('Base de datos no inicializada.');
      }
    } catch (error) {
      console.error('Error al guardar el sorteo:', error);
    }
}


  async deleteSorteo(id: number) {
    try {
      if (this.db) {
        const query = 'DELETE FROM sorteos WHERE id = ?';
        await this.db.run(query, [id]);
        console.log(`Sorteo con id ${id} eliminado de la base de datos`);
      } else {
        console.error('Base de datos no inicializada.');
      }
    } catch (error) {
      console.error('Error al eliminar el sorteo', error);
    }
  }

  async getSorteos(): Promise<any[]> {
    try {
      if (this.db) {
        // Consulta que une las tablas de 'sorteos' y 'motivo' para obtener la descripción del motivo
        const query = `
          SELECT 
            s.id, 
            s.nombre, 
            s.fecha_sorteo, 
            s.total_numeros, 
            s.cantidad_numeros_vendidos, 
            s.cantidad_numeros_faltantes, 
            s.precio_numero, 
            s.estado, 
            m.descripcion AS descripcion_motivo
          FROM sorteos s
          LEFT JOIN motivo m ON s.id_motivo = m.id
          ORDER BY s.fecha_sorteo DESC;
        `;
        const res = await this.db.query(query);
        
        // Retornar los resultados si existen
        return res.values ? res.values : [];
      } else {
        console.error('Base de datos no inicializada.');
        return [];
      }
    } catch (error) {
      console.error('Error al obtener los sorteos:', error);
      return [];
    }
  }
  

  async getMotivos() {
    try {
      if (this.db) {
        const query = 'SELECT * FROM motivo WHERE estado = "Activo";';
        const res = await this.db.query(query);
        return res.values;
      } else {
        console.error('Base de datos no inicializada.');
        return [];
      }
    } catch (error) {
      console.error('Error al obtener los motivos:', error);
      return [];
    }
  }
}
