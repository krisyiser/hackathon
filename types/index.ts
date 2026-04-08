export type IncidentType = 'seguridad' | 'emergencia' | 'obstruccion' | 'saturacion' | 'entorno' | 'manifestacion';

export interface Report {
  id: string;
  created_at: string;
  type: IncidentType;
  linea: string;
  intensidad: number;
  lat: number;
  lng: number;
  expires_at: string;
}

export interface VoiceReportData {
  incidente: IncidentType;
  gravedad: number;
  ubicacion_relativa: string;
}
