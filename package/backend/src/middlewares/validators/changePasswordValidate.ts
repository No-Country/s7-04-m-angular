import { Response, Request, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const changePasswordValidate = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string")
    .isStrongPassword()
    .withMessage("Password must have at least 8 characters, at least one uppercase, one number and one special character"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(403).json({ ok: false, error: errors.array() });
    }
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    return next();
  },
];
