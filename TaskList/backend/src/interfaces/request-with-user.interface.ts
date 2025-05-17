import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: number;
    // Puedes agregar otros campos del usuario si lo deseas, por ejemplo:
    email?: string;
    // ...
  };
}