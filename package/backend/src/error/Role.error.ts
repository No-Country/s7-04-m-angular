import { HttpStatus } from "../utils/enum/http.status";
import { ErrorBase } from "./ErrorBase";

type RoleErrorName =
    | "ROLE_NOT_FOUND"
    | "ROLE_ALREADY_EXISTS"
    | "NO_ROLES_FOUND"




export class RoleError extends ErrorBase<RoleErrorName> {

    name: RoleErrorName;
    message: string;
    status: number; 
    cause: any;

    constructor(name: RoleErrorName, message: string, cause?: any | Error) {
        super({ name, message, cause });
        this.name = name;
        this.status = this.handleErrorCode(name);
        this.message = message;
        this.cause = cause;
    }

    private handleErrorCode(name: RoleErrorName): number {
        switch(name) {
            case "ROLE_NOT_FOUND":
                return HttpStatus.NOT_FOUND;
            case "ROLE_ALREADY_EXISTS":
                return HttpStatus.CONFLICT;
            case "NO_ROLES_FOUND":
                return HttpStatus.NOT_FOUND;
            default:
                return HttpStatus.INTERNAL_SERVER_ERROR;
        }

    }

}

