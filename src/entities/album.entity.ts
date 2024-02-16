import { Entity, Column, PrimaryColumn, UpdateDateColumn, CreateDateColumn, OneToOne, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Artist } from './artist.entity';
import { Favorites } from './favorites.entity';
import { Track } from './track.entity';

@Entity()
export class Album {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'name',
        type: 'varchar',
        length: 120,
    })
    name: string;

    @Column({
        name: 'year',
        type: 'float',
    })
    year: number;

    @CreateDateColumn({
        name: 'created_at',
    })
    created_at: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        nullable: true,
    })
    updated_at?: Date;

    @OneToOne(() => Artist, (artist) => artist.album, { cascade: true })
    @JoinColumn()
    artist?: Artist;

    @OneToOne(() => Track, (track) => track.album)
    track: Track;

    @ManyToOne(() => Favorites, (favorites) => favorites.albums)
    favorites: Favorites
}