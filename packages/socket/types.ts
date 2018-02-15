import * as WebSocket from 'ws';

export interface WebSocketEvent {
  data: WebSocket.Data;
  type: string;
  target: WebSocket;
}

export interface WebSocketMessage {
  type: string;
  data: GeoJSON.FeatureCollection<GeoJSON.Polygon>;
}
