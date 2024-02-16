import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { isValidUUIDv4 } from 'src/common/validate-uuid';
import { CreateArtistDto } from 'src/dtos/artist/create-artist.dto';
import { UpdateArtistDto } from 'src/dtos/artist/update-artist.dto';
import { Album } from 'src/entities/album.entity';
import { Artist } from 'src/entities/artist.entity';
import { Track } from 'src/entities/track.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistsService {
    constructor(
        @InjectRepository(Artist)
        private artistsRepository: Repository<Artist>,
        @InjectRepository(Album)
        private albumsRepository: Repository<Album>,
        @InjectRepository(Track)
        private tracksRepository: Repository<Track>,
    ) { }

    async findAll(): Promise<Artist[]> {
        return await this.artistsRepository.find()
    }

    async findById(id: string): Promise<Artist> {
        if (!await isValidUUIDv4(id)) {
            throw new BadRequestException('Id must be a valid UUID')
        }
        const artist = await this.artistsRepository.findOne({ where: { id: id } })
        if (!artist) {
            throw new NotFoundException('Artist not exist')
        } else {
            return artist;
        }
    }

    async createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
        const artist = plainToClass(Artist, createArtistDto)
        try {
            return await this.artistsRepository.save(artist)
        } catch (e) {
            throw e;
        }
    }

    async updateArtist(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
        if (!await isValidUUIDv4(id)) {
            throw new BadRequestException('Id must be a valid UUID')
        }
        const artist = await this.findById(id)
        if (updateArtistDto.name) {
            artist.name = updateArtistDto.name
        }
        if (updateArtistDto.grammy) {
            artist.grammy = updateArtistDto.grammy
        }
        if (updateArtistDto.favorites !== undefined) {
            artist.favorites = updateArtistDto.favorites
        }
        try {
            await this.artistsRepository.save(artist)
            return artist
        } catch (e) {
            throw e
        }
    }

    async deleteArtist(id: string): Promise<boolean> {
        if (!await isValidUUIDv4(id)) {
            throw new BadRequestException('Id must be a valid UUID')
        }
        const artist = await this.artistsRepository.findOne({ where: { id: id }, relations: ['album'] })
        if (!artist) {
            throw new NotFoundException('Artist not exist')
        }

        const album = await this.albumsRepository
            .createQueryBuilder('album')
            .leftJoinAndSelect('album.artist', 'artist')
            .where('artist.id = :artistId', { artistId: artist.id })
            .getOne();
        if (album) {
            album.artist = null;
            await this.albumsRepository.save(album);
        }

        const track = await this.tracksRepository
            .createQueryBuilder('track')
            .leftJoinAndSelect('track.artist', 'artist')
            .where('artist.id = :artistId', { artistId: artist.id })
            .getOne();
        if (track) {
            track.artist = null;
            await this.tracksRepository.save(track);
        }

        try {
            await this.artistsRepository.remove(artist)
            return true;
        } catch (e) {
            throw e
        }
    }

    async getArtistsByFavoriteId(id: string): Promise<Artist[]> {
        return await this.artistsRepository
            .createQueryBuilder('artist')
            .where('artist.favoritesId = :id', { id })
            .getMany();
    }
}
