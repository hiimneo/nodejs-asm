import { Exclude } from 'class-transformer';
import { Entity, Column, UpdateDateColumn, CreateDateColumn, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'login',
        type: 'varchar',
        length: 120,
    })
    login: string;

    @Column({
        name: 'password',
        type: 'varchar',
        length: 120,
    })
    password: string;

    @Column({
        name: 'version',
        type: 'float',
        default: 0
    })
    version: number = 0;

    @CreateDateColumn({
        name: 'created_at',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        nullable: true,
    })
    updatedAt?: Date;

    @BeforeUpdate()
    incrementVersion() {
        this.version += 1;
    }
}
