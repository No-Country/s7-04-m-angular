import { HttpStatus } from "../utils/enum/http.status";
import { ErrorBase } from "./ErrorBase";

type CategoryErrorName =
    | "CATEGORY_NOT_FOUND"
    | "CATEGORY_ALREADY_EXISTS"
    | "NO_CATEGORIES_FOUND"




export class CategoryError extends ErrorBase<CategoryErrorName> {

    name: CategoryErrorName;
    message: string;
    status: number; 
    cause: any;

    constructor(name: CategoryErrorName, message: string, cause?: any | Error) {
        super({ name, message, cause });
        this.name = name;
        this.status = this.handleErrorCode(name);
        this.message = message;
        this.cause = cause;
    }

    private handleErrorCode(name: CategoryErrorName): number {
        switch(name) {
            case "CATEGORY_NOT_FOUND":
                return HttpStatus.NOT_FOUND;
            case "CATEGORY_ALREADY_EXISTS":
                return HttpStatus.CONFLICT;
            case "NO_CATEGORIES_FOUND":
                return HttpStatus.NOT_FOUND;
            default:
                return HttpStatus.INTERNAL_SERVER_ERROR;
        }

    }

}

