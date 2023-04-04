import { Response, Request, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const forgetPasswordValidate = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be a string")
    .isEmail()
    .withMessage("Invalid email format"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(403).json({ ok: false, error: errors.array() });
    }
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    return next();
  },
];
