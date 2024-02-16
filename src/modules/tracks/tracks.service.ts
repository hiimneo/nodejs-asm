import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { isValidUUIDv4 } from 'src/common/validate-uuid';
import { CreateTrackDto } from 'src/dtos/track/create-track.dto';
import { UpdateTrackDto } from 'src/dtos/track/update-track.dto';
import { Track } from 'src/entities/track.entity';
import { Repository } from 'typeorm';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';

@Injectable()
export class TracksService {
    constructor(
        @InjectRepository(Track)
        private tracksRepository: Repository<Track>,
        private readonly artistsService: ArtistsService,
        private readonly albumsService: AlbumsService
    ) { }

    async findAll(): Promise<Track[]> {
        return await this.tracksRepository.find()
    }

    async findById(id: string): Promise<Track> {
        if (!await isValidUUIDv4(id)) {
            throw new BadRequestException('Id must be a valid UUID')
        }
        const track = await this.tracksRepository.findOne({ where: { id: id } })
        if (!track) {
            throw new NotFoundException('Track not exist')
        } else {
            return track;
        }
    }

    async createTrack(createTrackDto: CreateTrackDto): Promise<Track> {
        const track = plainToClass(Track, createTrackDto)
        if (createTrackDto.artistId) {
            const artist = await this.artistsService.findById(createTrackDto.artistId)
            track.artist = artist
        }
        if (createTrackDto.albumId) {
            const album = await this.albumsService.findById(createTrackDto.albumId)
            track.album = album
        }
        try {
            return await this.tracksRepository.save(track)
        } catch (e) {
            throw e
        }
    }

    async updateTrack(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
        if (!await isValidUUIDv4(id)) {
            throw new BadRequestException('Id must be a valid UUID')
        }
        const track = await this.findById(id)
        if (updateTrackDto.duration) {
            track.duration = updateTrackDto.duration
        }
        if (updateTrackDto.name) {
            track.name = updateTrackDto.name
        }
        if (updateTrackDto.favorites !== undefined) {
            track.favorites = updateTrackDto.favorites
        }
        if (updateTrackDto.artistId) {
            const artist = await this.artistsService.findById(updateTrackDto.artistId)
            track.artist = artist
        }
        if (updateTrackDto.albumId) {
            const album = await this.albumsService.findById(updateTrackDto.albumId)
            track.album = album
        }
        try {
            await this.tracksRepository.save(track)
            return track;
        } catch (e) {
            throw e
        }
    }

    async deleteTrack(id: string): Promise<boolean> {
        if (!await isValidUUIDv4(id)) {
            throw new BadRequestException('Id must be a valid UUID')
        }
        await this.findById(id)
        try {
            await this.tracksRepository.delete(id)
            return true
        } catch (e) {
            throw e
        }
    }

    async getTracksByFavoriteId(id: string): Promise<Track[]> {
        return await this.tracksRepository
            .createQueryBuilder('track')
            .where('track.favoritesId = :id', { id })
            .getMany();
    }
}
