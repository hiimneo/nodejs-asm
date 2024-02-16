import { Entity, Column, UpdateDateColumn, CreateDateColumn, OneToOne, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Artist } from './artist.entity';
import { Album } from './album.entity';
import { Favorites } from './favorites.entity';

@Entity()
export class Track {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'name',
        type: 'varchar',
        length: 120,
    })
    name: string;

    @Column({
        name: 'duration',
        type: 'float',
    })
    duration: number;

    @CreateDateColumn({
        name: 'created_at',
    })
    created_at: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        nullable: true,
    })
    updated_at?: Date;


    @OneToOne(() => Artist, (artist) => artist.track, { cascade: true })
    @JoinColumn()
    artist?: Artist;

    @OneToOne(() => Album, { cascade: true })
    @JoinColumn()
    album?: Album;

    @ManyToOne(() => Favorites, (favorites) => favorites.tracks)
    favorites: Favorites
}