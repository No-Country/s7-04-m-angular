import { NextFunction, Request, Response } from "express";

export const compareIds = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    if (id !== req.id) {
      return res.status(400).json({ ok: false, msg: "ID param and ID token are different" });
    }

    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    return next();
  } catch (error) {}
};
