export type IncidentType = 'seguridad' | 'emergencia' | 'obstruccion' | 'saturacion' | 'entorno';

export interface Report {
  id: string;
  created_at: string;
  type: IncidentType;
  linea: string;
  description?: string;
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
