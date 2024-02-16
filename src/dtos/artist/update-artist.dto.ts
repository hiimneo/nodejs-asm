import { IsBoolean, IsOptional, IsString } from "class-validator";
import { Favorites } from "src/entities/favorites.entity";

export class UpdateArtistDto {
    @IsOptional()
    @IsString()
    name?: string;
    @IsOptional()
    @IsBoolean()
    grammy?: boolean;
    @IsOptional()
    favorites?: Favorites
}