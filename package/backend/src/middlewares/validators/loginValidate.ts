import { body } from "express-validator";
import { errorHandler } from "./errorHandler.validator";

export const loginValidate = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be a string")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string")
    .isStrongPassword()
    .withMessage("Password must have at least 8 characters, at least one uppercase, one number and one special character"),
  errorHandler
];
