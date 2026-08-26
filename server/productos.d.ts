import type { ServerResponse } from 'node:http';
import type { Connect } from 'vite';
export declare function middlewareProductos(solicitud: Connect.IncomingMessage, respuesta: ServerResponse, siguiente: Connect.NextFunction): void;
