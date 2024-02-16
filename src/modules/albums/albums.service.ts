import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { isValidUUIDv4 } from 'src/common/validate-uuid';
import { CreateAlbumDto } from 'src/dtos/album/create-album.dto';
import { UpdateAlbumDto } from 'src/dtos/album/update-album.dto';
import { Album } from 'src/entities/album.entity';
import { Track } from 'src/entities/track.entity';
import { Repository } from 'typeorm';
import { ArtistsService } from '../artists/artists.service';

@Injectable()
export class AlbumsService {
    constructor(
        @InjectRepository(Album)
        private albumsRepository: Repository<Album>,
        @InjectRepository(Track)
        private tracksRepository: Repository<Track>,
        private readonly artistsService: ArtistsService,
    ) { }

    async findAll(): Promise<Album[]> {
        return await this.albumsRepository.find()
    }

    async findById(id: string): Promise<Album> {
        if (!await isValidUUIDv4(id)) {
            throw new BadRequestException('Id must be a valid UUID')
        }
        const track = await this.albumsRepository.findOne({ where: { id: id } })
        if (!track) {
            throw new NotFoundException('Album not exist')
        } else {
            return track;
        }
    }

    async createAlbum(createAlbumDto: CreateAlbumDto): Promise<Album> {
        const album = plainToClass(Album, createAlbumDto)
        if (createAlbumDto.artistId) {
            const artist = await this.artistsService.findById(createAlbumDto.artistId)
            album.artist = artist;
        }
        try {
            return await this.albumsRepository.save(album)
        } catch (e) {
            throw e
        }
    }

    async updateAlbum(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
        if (!await isValidUUIDv4(id)) {
            throw new BadRequestException('Id must be a valid UUID')
        }
        const album = await this.findById(id)
        if (updateAlbumDto.name) {
            album.name = updateAlbumDto.name
        }
        if (updateAlbumDto.year) {
            album.year = updateAlbumDto.year
        }
        if (updateAlbumDto.favorites !== undefined) {
            album.favorites = updateAlbumDto.favorites
        }
        if (updateAlbumDto.artistId) {
            const artist = await this.artistsService.findById(updateAlbumDto.artistId)
            album.artist = artist;
        }
        try {
            await this.albumsRepository.save(album)
            return album
        } catch (e) {
            throw e
        }
    }

    async deleteAlbum(id: string): Promise<boolean> {
        if (!await isValidUUIDv4(id)) {
            throw new BadRequestException('Id must be a valid UUID')
        }
        const album = await this.findById(id)
        if (!album) {
            throw new NotFoundException('Album not exist')
        }

        const track = await this.tracksRepository
            .createQueryBuilder('track')
            .leftJoinAndSelect('track.album', 'album')
            .where('album.id = :albumId', { albumId: album.id })
            .getOne();

        if (track) {
            track.album = null;
            await this.tracksRepository.save(track);
        }

        try {
            await this.albumsRepository.remove(album)
            return true
        } catch (e) {
            throw e;
        }
    }

    async getAlbumsByFavoriteId(id: string): Promise<Album[]> {
        return await this.albumsRepository
            .createQueryBuilder('album')
            .where('album.favoritesId = :id', { id })
            .getMany();
    }
}
