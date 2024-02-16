import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateTrackDto {
    @IsString()
    name: string;
    @IsNumber()
    duration: number;
    @IsOptional()
    @IsUUID()
    albumId?: string;
    @IsOptional()
    @IsUUID()
    artistId?: string;
}