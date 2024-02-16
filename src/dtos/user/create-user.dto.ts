import { IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @IsString()
    login: string;

    @IsStrongPassword()
    password: string;
}