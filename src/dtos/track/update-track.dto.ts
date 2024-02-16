import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { Favorites } from "src/entities/favorites.entity";

export class UpdateTrackDto {
    @IsOptional()
    @IsString()
    name?: string;
    @IsOptional()
    @IsNumber()
    duration?: number;
    @IsOptional()
    favorites?: Favorites;
    @IsOptional()
    @IsUUID()
    albumId?: string;
    @IsOptional()
    @IsUUID()
    artistId?: string;
}