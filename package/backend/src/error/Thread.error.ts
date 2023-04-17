import { HttpStatus } from "../utils/enum/http.status";
import { ErrorBase } from "./ErrorBase";

type ThreadErrorName =
    | "THREAD_NOT_FOUND"
    | "THREAD_ALREADY_EXISTS"
    | "NO_THREADS_FOUND"
    | "THREAD_NOT_OWNER";




export class ThreadError extends ErrorBase<ThreadErrorName> {

    name: ThreadErrorName;
    message: string;
    status: number; 
    cause: any;

    constructor(name: ThreadErrorName, message: string, cause?: any | Error) {
        super({ name, message, cause });
        this.name = name;
        this.status = this.handleErrorCode(name);
        this.message = message;
        this.cause = cause;
    }

    private handleErrorCode(name: ThreadErrorName): number {
        switch(name) {
            case "THREAD_NOT_FOUND":
                return HttpStatus.NOT_FOUND;
            case "THREAD_ALREADY_EXISTS":
                return HttpStatus.CONFLICT;
            case "THREAD_NOT_OWNER":
                return HttpStatus.FORBIDDEN;
            case "NO_THREADS_FOUND":
                return HttpStatus.NOT_FOUND;
            default:
                return HttpStatus.INTERNAL_SERVER_ERROR;
        }

    }

}

