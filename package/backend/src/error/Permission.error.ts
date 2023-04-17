import { HttpStatus } from "../utils/enum/http.status";
import { ErrorBase } from "./ErrorBase";

type PermissionErrorName =
    | "INSUFFICIENT_PERMISSIONS"
    | "ONLY_OWNER_OR_ADMIN"




export class PermissionError extends ErrorBase<PermissionErrorName> {

    name: PermissionErrorName;
    message: string;
    status: number; 
    cause: any;

    constructor(name: PermissionErrorName, message: string, cause?: any | Error) {
        super({ name, message, cause });
        this.name = name;
        this.status = this.handleErrorCode(name);
        this.message = message;
        this.cause = cause;
    }

    private handleErrorCode(name: PermissionErrorName): number {
        switch(name) {
            case "INSUFFICIENT_PERMISSIONS":
                return HttpStatus.FORBIDDEN;
            case "ONLY_OWNER_OR_ADMIN":
                return HttpStatus.FORBIDDEN;
            default:
                return HttpStatus.INTERNAL_SERVER_ERROR;
        }

    }

}

