import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { Comprador } from "../request/compradorRequest";
import { NumeroComprado } from "../request/numCompradoRequest";


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
    'Corporativo',
    'Otros'
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

      ///await this.db.execute('DROP TABLE IF EXISTS sorteos');  // descomentar si se necesita borrar la tabla sorteo
      
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
        
        // Crear tablas si no existen
        const queryComprador = `
        CREATE TABLE IF NOT EXISTS comprador (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre_comprador TEXT NOT NULL,
          pago BOOLEAN NOT NULL,
          abono REAL DEFAULT 0,
          id_sorteo INTEGER,
          FOREIGN KEY (id_sorteo) REFERENCES sorteos(id)
        );`;
      
        const queryNumerosComprados = `
        CREATE TABLE IF NOT EXISTS numeros_comprados (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          id_comprador INTEGER,
          numero_comprado INTEGER NOT NULL,
          FOREIGN KEY (id_comprador) REFERENCES comprador(id)
        );`;
      
      await this.db.execute(queryComprador);
      await this.db.execute(queryNumerosComprados);

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


async updateSorteo(sorteo: any) {
  try {
    if (this.db) {
      const query = `
        UPDATE sorteos SET
          nombre = ?, 
          fecha_sorteo = ?, 
          id_motivo = ?
        WHERE id = ?;
      `;
      const values = [
        sorteo.nombre, 
        sorteo.fecha_sorteo, 
        sorteo.id_motivo,
        sorteo.idSorteo
      ];
      await this.db.run(query, values);
      console.log('Sorteo actualizado en la base de datos');
    } else {
      console.error('Base de datos no inicializada.');
    }
  } catch (error) {
    console.error('Error al actualizar el sorteo:', error);
  }
}


async updateSorteoComprador(sorteo: any) {
  try {
    if (this.db) {
      const query = `
        UPDATE sorteos SET
        cantidad_numeros_vendidos = (cantidad_numeros_vendidos + ?),
        cantidad_numeros_faltantes = ?
        WHERE id = ?;
      `;
      const values = [
        sorteo.cantidad_numeros_vendidos, 
        sorteo.cantidad_numeros_faltantes,
        sorteo.idSorteo
      ];
      await this.db.run(query, values);
      console.log(values);
      console.log('Sorteo comprador actualizado en la base de datos');
    } else {
      console.error('Base de datos no inicializada.');
    }
  } catch (error) {
    console.error('Error en el método updateSorteoComprador:', error);
  }
}


  async deleteSorteo(id: number) {
    try {
      if (this.db) {
        const query =  `
        UPDATE sorteos SET
         estado = 'Inactivo'  
         WHERE id = ?`;
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
            s.id AS idSorteo, 
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
          where s.estado = 'Activo'
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


  async getdetailSorteos(id: number): Promise<any> {
    try {
      if (this.db) {
        // Obtener los detalles del sorteo, incluyendo los números comprados y sus compradores
        const query = `
          SELECT 
            s.id AS idSorteo, 
            s.nombre, 
            s.fecha_sorteo, 
            s.total_numeros, 
            s.cantidad_numeros_vendidos, 
            s.cantidad_numeros_faltantes, 
            s.precio_numero, 
            s.estado,
            s.id_motivo,
            m.descripcion AS descripcion_motivo,
            nc.numero_comprado,
            c.nombre_comprador,
            c.id as id_comprador
          FROM sorteos s
          LEFT JOIN motivo m ON s.id_motivo = m.id
          LEFT JOIN comprador c ON s.id = c.id_sorteo
          LEFT JOIN numeros_comprados nc ON c.id = nc.id_comprador
          WHERE s.id = ? AND
          s.estado = 'Activo';
        `;
        
        const res = await this.db.query(query, [id]);
  
        // Verificar si res.values está definido
        if (!res.values || res.values.length === 0) {
          console.error('No se encontraron resultados para el sorteo.');
          return null;
        }
  
        // Obtener los detalles del sorteo
        const sorteo = res.values[0];
  
        // Crear una lista de todos los números del sorteo
        const totalNumeros = sorteo.total_numeros;
        const numeros = [];
  
        // Marcar los números que ya fueron comprados
        for (let i = 1; i <= totalNumeros; i++) {
          const comprador = res.values.find((row: any) => row.numero_comprado === i);
          numeros.push({
            numero: i,
            comprado: comprador ? true : false,
            nombre_comprador: comprador ? comprador.nombre_comprador : null,
            id_comprador: comprador ? comprador.nombre_comprador : null
          });
        }
  
        // Retornar la información del sorteo junto con todos los números y su estado de compra
        return {
          idSorteo: sorteo.idSorteo,
          nombre: sorteo.nombre,
          fecha_sorteo: sorteo.fecha_sorteo,
          total_numeros: sorteo.total_numeros,
          cantidad_numeros_vendidos: sorteo.cantidad_numeros_vendidos,
          cantidad_numeros_faltantes: sorteo.cantidad_numeros_faltantes,
          precio_numero: sorteo.precio_numero,
          estado: sorteo.estado,
          id_motivo: sorteo.id_motivo,
          descripcion_motivo: sorteo.descripcion_motivo,
          numeros: numeros // Lista de números con el estado de compra
        };
      } else {
        console.error('Base de datos no inicializada.');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener los detalles del sorteo:', error);
      return null;
    }
  }
  
  
  async getInfoDatosComprador(idDetalleSorteo: number)
  {
    try {

      if (this.db) {

        const query = `SELECT 
          c.id,
          c.nombre_comprador,
          c.pago,
          c.abono,
          (SUM(s.precio_numero) - c.abono) AS valor_a_pagar,
          SUM(s.precio_numero) AS total_pagar, 
          COUNT(nc.id) AS cantidad_numeros_comprados,
          GROUP_CONCAT(nc.numero_comprado) AS numeros_comprados
        FROM 
          sorteos s
        JOIN
          comprador c
          ON c.id_sorteo = s.id 
        JOIN 
          numeros_comprados nc 
          ON nc.id_comprador = c.id
        WHERE 
          c.id_sorteo = ? 
          AND
          s.estado = 'Activo'
        GROUP BY 
          c.id,
          c.nombre_comprador,
          c.pago,
          c.abono;`;

          const res = await this.db.query(query, [idDetalleSorteo]);
        
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


    // Método para guardar comprador
    async guardarComprador(comprador: { nombre_comprador: string, pago: boolean, abono: number, id_sorteo: number }) {
      try {
        if (this.db) {
          const query = `
            INSERT INTO comprador (
              nombre_comprador, 
              pago, 
              abono, 
              id_sorteo
            ) VALUES (?, ?, ?, ?);
          `;
          const values = [
            comprador.nombre_comprador,
            comprador.pago ? 1 : 0,  // SQLite no tiene booleanos, 1 para true y 0 para false
            comprador.abono,
            comprador.id_sorteo
          ];
          const res = await this.db.run(query, values);
          console.log('Comprador guardado correctamente.');
          return res.changes?.lastId; // Retorna el ID del comprador recién insertado
        } else {
          console.error('Base de datos no inicializada.');
          return null;
        }
      } catch (error) {
        console.error('Error al guardar el comprador:', error);
        return null;
      }
    }


  
    // Método para guardar números comprados
    async guardarNumeroComprado(numeroComprado: NumeroComprado) {
      try {
        if (this.db) {
          const query = `
            INSERT INTO numeros_comprados (
              id_comprador, 
              numero_comprado
            ) VALUES (?, ?);
          `;
          const values = [numeroComprado.id_comprador, numeroComprado.numero_comprado];
          await this.db.run(query, values);
          console.log(`Número ${numeroComprado.numero_comprado} guardado correctamente para el comprador ${numeroComprado.id_comprador}.`);
        } else {
          console.error('Base de datos no inicializada.');
        }
      } catch (error) {
        console.error('Error al guardar el número comprado:', error);
      }
    }


    async editarComprador(comprador: { id: number, pago: boolean, abono: number }) {
      try {
        if (this.db) {
          const query = `
            UPDATE comprador SET 
              pago = ?, 
              abono = (abono + ?)
            WHERE id = ?;
          `;
          const values = [
            comprador.pago ? 1 : 0,  // 1 para true y 0 para false
            comprador.abono,
            comprador.id
          ];
          await this.db.run(query, values);
          console.log(`Comprador con id ${comprador.id} actualizado correctamente.`);
        } else {
          console.error('Base de datos no inicializada.');
        }
      } catch (error) {
        console.error('Error al editar el comprador:', error);
      }
    }
    
}
