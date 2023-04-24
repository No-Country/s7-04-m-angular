import { Expose } from 'class-transformer';

export class LoginResponseDTO {
    @Expose()
    id: number;
    @Expose()
    token: string;

    constructor(id: number, token: string) {
        this.id = id;
        this.token = token;
    }
}