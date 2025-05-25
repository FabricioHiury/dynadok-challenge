import { Request, Response, NextFunction } from 'express'

export function validateCreateClient(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { name, email, phone } = req.body

  if (!name || !email || !phone) {
    res.status(400).json({
      error: 'Missing required fields: name, email, phone',
    })
    return
  }

  if (!email.includes('@')) {
    res.status(400).json({
      error: 'Invalid email format',
    })
    return
  }

  next()
}

export function validateUpdateClient(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { email } = req.body

  if (email && !email.includes('@')) {
    res.status(400).json({ error: 'Invalid email format' })
    return
  }

  next()
}

export function validateId(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { id } = req.params

  if (!id || id.length !== 24) {
    res.status(400).json({ error: 'Invalid ID format' })
    return
  }

  next()
}
