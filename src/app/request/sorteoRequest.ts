

export interface SorteoRequest {
    idSorteo?: number,
    nombre: string,
    fecha_sorteo: string,
    cantidad_numeros_vendidos: number, // Inicia con 0
    cantidad_numeros_faltantes: number, // Calculado en base a total - vendidos
    total_numeros: number, // Total de números disponibles
    precio_numero: string, // Precio por número
    id_motivo: number, // Motivo seleccionado
    estado: string // Estado por defecto
  }