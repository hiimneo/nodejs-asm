import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { Favorites } from "src/entities/favorites.entity";

export class UpdateAlbumDto {
    @IsOptional()
    @IsString()
    name?: string;
    @IsOptional()
    @IsNumber()
    year?: number;
    @IsOptional()
    favorites?: Favorites
    @IsUUID()
    @IsOptional()
    artistId?: string;
}