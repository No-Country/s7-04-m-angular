import { HttpStatus } from "../utils/enum/http.status";
import { ErrorBase } from "./ErrorBase";

type TagErrorName =
    | "TAG_NOT_FOUND"
    | "TAG_ALREADY_EXISTS"
    | "NO_TAGS_FOUND"
    | "TAG_NAME_ERROR"


export class TagError extends ErrorBase<TagErrorName> {

    name: TagErrorName;
    message: string;
    status: number; 
    cause: any;

    constructor(name: TagErrorName, message: string, cause?: any | Error) {
        super({ name, message, cause });
        this.name = name;
        this.status = this.handleErrorCode(name);
        this.message = message;
        this.cause = cause;
    }

    private handleErrorCode(name: TagErrorName): number {
        switch(name) {
            case "TAG_NOT_FOUND":
                return HttpStatus.NOT_FOUND;
            case "TAG_NAME_ERROR":
                return HttpStatus.BAD_REQUEST;
            case "TAG_ALREADY_EXISTS":
                return HttpStatus.CONFLICT;
            case "NO_TAGS_FOUND":
                return HttpStatus.NOT_FOUND;
            default:
                return HttpStatus.INTERNAL_SERVER_ERROR;
        }

    }

}

