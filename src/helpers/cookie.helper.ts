import { Response } from 'express';

export class CookieHelper {
  static setCookie({
    name,
    value,
    res,
  }: {
    name: string;
    value: string;
    res: Response;
  }) {
    return res.cookie(name, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hours
    });
  }

  static clearCookie({ name, res }: { name: string; res: Response }) {
    return res.clearCookie(name, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
  }
}
