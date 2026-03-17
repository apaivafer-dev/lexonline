import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id?: string;
  userId?: string;
  email: string;
  plan?: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const token =
    req.cookies?.__session ||
    req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');
    const payload = jwt.verify(token, secret) as JwtPayload;
    
    // Normaliza o payload (aceita id ou userId)
    if (payload.userId && !payload.id) {
      payload.id = payload.userId;
    }

    req.user = payload as any;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
