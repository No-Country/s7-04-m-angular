export interface IValidateErrorJSON {
    message: "Validation failed";
    details: { [name: string]: unknown };
  }