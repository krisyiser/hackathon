import { IncidentType } from './index';

export type TabType = 'mapa' | 'incidentes' | 'reporte' | 'comunidad' | 'configuracion';

export interface Comment {
  id: string;
  user: string;
  content: string;
  created_at: string;
  likes: number;
}
