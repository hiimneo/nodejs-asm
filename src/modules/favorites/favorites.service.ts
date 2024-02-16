import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isValidUUIDv4 } from 'src/common/validate-uuid';
import { Favorites } from 'src/entities/favorites.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(Favorites)
        private favoritesRepository: Repository<Favorites>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly tracksService: TracksService,
        private readonly albumsService: AlbumsService,
        private readonly artistsService: ArtistsService

    ) { }

    async getFavorites(userId: string) {
        const favorites = await this.favoritesRepository
            .createQueryBuilder('favorites')
            .leftJoinAndSelect('favorites.user', 'user')
            .where('user.id = :userId', { userId })
            .select(['favorites.id'])
            .getOne();
        const tracks = await this.tracksService.getTracksByFavoriteId(favorites.id)
        const albums = await this.albumsService.getAlbumsByFavoriteId(favorites.id)
        const artists = await this.artistsService.getArtistsByFavoriteId(favorites.id)
        return { tracks: tracks, albums: albums, artists: artists }
    }

    async addTrack(userId: string, trackId: string) {
        if (!await isValidUUIDv4(trackId)) {
            throw new BadRequestException('Id must be a valid UUID')
        }
        const track = await this.tracksService.findById(trackId)
        if (!track) {
            throw new UnprocessableEntityException('Track not exists')
        }
        const favorites = await this.favoritesRepository
            .createQueryBuilder('favorites')
            .leftJoinAndSelect('favorites.user', 'user')
            .where('user.id = :userId', { userId })
            .getOne();
        if (!favorites) {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            let favoritesInsert = new Favorites();
            favoritesInsert.user = user;
            favoritesInsert.tracks = [track];
            await this.favoritesRepository.save(favoritesInsert)
        } else {
            track.favorites = favorites;
            await this.tracksService.updateTrack(track.id, track)
        }
    }

    async removeTrack(trackId: string) {
        if (!await isValidUUIDv4(trackId)) {
            throw new BadRequestException('Id must be a valid UUID')
        }
        const track = await this.tracksService.findById(trackId)
        if (!track) {
            throw new NotFoundException('Track not exists')
        }
        track.favorites = null;
        try {
            await this.tracksService.updateTrack(track.id, track)
        } catch (e) {
            throw e
        }
    }

    async addAlbum(userId: string, albumId: string) {
        if (!await isValidUUIDv4(albumId)) {
            throw new BadRequestException('Id must be a valid UUID')
        }
        const album = await this.albumsService.findById(albumId)
        if (!album) {
            throw new UnprocessableEntityException('Album not exists')
        }
        const favorites = await this.favoritesRepository
            .createQueryBuilder('favorites')
            .leftJoinAndSelect('favorites.user', 'user')
            .where('user.id = :userId', { userId })
            .getOne();
        try {
            if (!favorites) {
                const user = await this.userRepository.findOne({ where: { id: userId } });
                let favoritesInsert = new Favorites();
                favoritesInsert.user = user;
                favoritesInsert.albums = [album];
                await this.favoritesRepository.save(favoritesInsert)
            } else {
                album.favorites = favorites;
                await this.albumsService.updateAlbum(album.id, album)
            }
        } catch (e) {
            throw e
        }
    }

    async removeAlbum(albumId: string) {
        if (!await isValidUUIDv4(albumId)) {
            throw new BadRequestException('Id must be a valid UUID')
        }
        const album = await this.albumsService.findById(albumId)
        if (!album) {
            throw new NotFoundException('Album not exists')
        }
        album.favorites = null;
        try {
            await this.albumsService.updateAlbum(album.id, album)
        } catch (e) {
            throw e
        }
    }

    async addArtist(userId: string, artistId: string) {
        if (!await isValidUUIDv4(artistId)) {
            throw new BadRequestException('Id must be a valid UUID')
        }
        const artist = await this.artistsService.findById(artistId)
        if (!artist) {
            throw new UnprocessableEntityException('Artist not exists')
        }
        const favorites = await this.favoritesRepository
            .createQueryBuilder('favorites')
            .leftJoinAndSelect('favorites.user', 'user')
            .where('user.id = :userId', { userId })
            .getOne();
        try {
            if (!favorites) {
                const user = await this.userRepository.findOne({ where: { id: userId } });
                let favoritesInsert = new Favorites();
                favoritesInsert.user = user;
                favoritesInsert.artists = [artist];
                await this.favoritesRepository.save(favoritesInsert)
            } else {
                artist.favorites = favorites;
                await this.artistsService.updateArtist(artist.id, artist)
            }
        } catch (e) {
            throw e
        }
    }

    async removeArtist(artistId: string) {
        if (!await isValidUUIDv4(artistId)) {
            throw new BadRequestException('Id must be a valid UUID')
        }
        const artist = await this.artistsService.findById(artistId)
        if (!artist) {
            throw new NotFoundException('Artist not exists')
        }
        artist.favorites = null;
        try {
            await this.artistsService.updateArtist(artist.id, artist)
        } catch (e) {
            throw e
        }
    }
}
