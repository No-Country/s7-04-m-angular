//Crear clase de error que extienda de Error y herede sus propiedades a UserError

export class ErrorBase<T extends string> extends Error {
    name: T;
    message: string;
    cause?: any | Error;
    status: number;

    constructor({ name, message, cause }: { name: T; message: string; cause?: any | Error }) {
        super(message);
        this.name = name;
        this.message = message;
        this.cause = cause;
    }

}