import { HttpStatus } from "../utils/enum/http.status";
import { ErrorBase } from "./ErrorBase";

type ReplyErrorName =
    | "REPLY_NOT_FOUND"
    | "NO_REPLIES_FOUND"




export class ReplyError extends ErrorBase<ReplyErrorName> {

    name: ReplyErrorName;
    message: string;
    status: number; 
    cause: any;

    constructor(name: ReplyErrorName, message: string, cause?: any | Error) {
        super({ name, message, cause });
        this.name = name;
        this.status = this.handleErrorCode(name);
        this.message = message;
        this.cause = cause;
    }

    private handleErrorCode(name: ReplyErrorName): number {
        switch(name) {
            case "REPLY_NOT_FOUND":
                return HttpStatus.NOT_FOUND;
            case "NO_REPLIES_FOUND":
                return HttpStatus.NOT_FOUND;
            default:
                return HttpStatus.INTERNAL_SERVER_ERROR;
        }

    }

}

