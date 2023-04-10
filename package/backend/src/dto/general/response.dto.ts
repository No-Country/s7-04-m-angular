import { Expose } from "class-transformer";

export class ResponseDTO {
        @Expose()
        readonly message: string;
   
        constructor(message: string) {
            this.message = message;
        }
}