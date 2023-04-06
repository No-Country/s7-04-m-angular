import { HttpStatus } from "../utils/enum/http.status";

type UserErrorName =
    | "USER_NOT_FOUND"
    | "USERS_NOT_FOUND"
    | "USER_ALREADY_EXISTS"
    | "USER_PASSWORD_INCORRECT"
    | "USER_NOT_AUTHENTICATED"
    | "USER_NOT_AUTHORIZED"
    | "USER_NOT_ACTIVATED"
    | "USER_ALREADY_ACTIVATED"
    | "USER_NOT_VERIFIED";



export class UserError extends Error {

    name: UserErrorName;
    message: string;
    status: number; 
    cause: any;

    constructor(name: UserErrorName, message: string, cause?: any | Error) {
        super(message);
        this.name = name;
        this.status = this.handleErrorCode(name);
        this.message = message;
        this.cause = cause;
    }

    private handleErrorCode(name: UserErrorName): number {
        switch(name) {
            case "USER_NOT_FOUND":
                return HttpStatus.NOT_FOUND;
            case "USER_ALREADY_EXISTS":
                return HttpStatus.CONFLICT;
            case "USER_NOT_AUTHENTICATED":
                return HttpStatus.UNAUTHORIZED;
            case "USER_NOT_AUTHORIZED":
                return HttpStatus.FORBIDDEN;
            case "USER_NOT_ACTIVATED":
                return HttpStatus.UNAUTHORIZED;
            case "USER_ALREADY_ACTIVATED":
                return HttpStatus.CONFLICT;
            case "USER_NOT_VERIFIED":
                return HttpStatus.UNAUTHORIZED;
            case "USERS_NOT_FOUND":
                return HttpStatus.NOT_FOUND;
            case "USER_PASSWORD_INCORRECT":
                return HttpStatus.UNAUTHORIZED;
            default:
                return HttpStatus.INTERNAL_SERVER_ERROR;
        }

    }

}

