import { body, param } from "express-validator";
import { errorHandler } from "./errorHandler.validator";

export const createRoleV = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),
    errorHandler
];

export const updateRoleV = [
    param("id")
        .notEmpty()
        .withMessage("Id is required")
        .isNumeric()
        .withMessage("Id must be a number"),
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),
    errorHandler
];

export const deleteRoleV = [
    param("id")
        .notEmpty()
        .withMessage("Id is required")
        .isNumeric()
        .withMessage("Id must be a number"),
    errorHandler
];