import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Favorites } from "./favorites.entity";
import { Album } from "./album.entity";
import { Track } from "./track.entity";

@Entity()
export class Artist {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'name',
        type: 'varchar',
        length: 120,
    })
    name: string;

    @Column({
        name: 'grammy',
        type: 'boolean'
    })
    grammy: boolean;

    @CreateDateColumn({
        name: 'created_at',
    })
    created_at: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        nullable: true,
    })
    updated_at?: Date;

    @OneToOne(() => Album, (album) => album.artist)
    album: Album;

    @OneToOne(() => Track, (track) => track.artist)
    track: Track;

    @ManyToOne(() => Favorites, (favorites) => favorites.artists)
    favorites: Favorites
}