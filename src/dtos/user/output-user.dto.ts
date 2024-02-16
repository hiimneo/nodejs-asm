import { Expose } from "class-transformer";

export class OutputUserDto {
    @Expose()
    id: string;
    @Expose()
    login: string;
    @Expose()
    version: number;
}