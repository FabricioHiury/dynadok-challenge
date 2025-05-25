import { Response } from 'express';

export function errorHandler(error: Error, res: Response) {
  console.error('Erro não capturado:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
}