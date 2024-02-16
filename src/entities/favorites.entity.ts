import { Entity, OneToMany, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Artist } from './artist.entity';
import { Album } from './album.entity';
import { Track } from './track.entity';
import { User } from './user.entity';

@Entity()
export class Favorites {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, { cascade: true })
    @JoinColumn()
    user: User;

    @OneToMany((type) => Artist, (artist) => artist.favorites, { cascade: true, nullable: true })
    @JoinColumn()
    artists: Artist[];

    @OneToMany((type) => Album, (album) => album.favorites, { cascade: true, nullable: true })
    @JoinColumn()
    albums: Album[];

    @OneToMany((type) => Track, (track) => track.favorites, { cascade: true, nullable: true })
    @JoinColumn()
    tracks: Track[];
}