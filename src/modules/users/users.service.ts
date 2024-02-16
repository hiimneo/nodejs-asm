import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePasswordDto } from 'src/dtos/user/update-password.dto';
import { plainToClass } from 'class-transformer';
import { isValidUUIDv4 } from 'src/common/validate-uuid';
import { OutputUserDto } from 'src/dtos/user/output-user.dto';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findAll(): Promise<OutputUserDto[]> {
        const users = await this.usersRepository.find()
        return users.map(user => plainToClass(OutputUserDto, user, { excludeExtraneousValues: true }))
    }

    async findOne(login: string): Promise<OutputUserDto> {
        const user = await this.usersRepository.findOne({ where: { login: login } })
        return plainToClass(OutputUserDto, user, { excludeExtraneousValues: true });
    }

    async findById(id: string): Promise<OutputUserDto> {
        if (!await isValidUUIDv4(id)) {
            throw new BadRequestException('Id must be a valid UUID')
        }
        const user = await this.usersRepository.findOne({ where: { id: id } })
        if (!user) {
            throw new NotFoundException('User not exist')
        } else {
            return plainToClass(OutputUserDto, user, { excludeExtraneousValues: true });
        }
    }


    async createUser(createUserDto: CreateUserDto): Promise<OutputUserDto> {
        const user = plainToClass(User, createUserDto);
        try {
            const userOuput = await this.usersRepository.save(user)
            return plainToClass(OutputUserDto, userOuput, { excludeExtraneousValues: true });
        } catch (e) {
            throw e
        }

    }

    async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<OutputUserDto> {
        if (!await isValidUUIDv4(id)) {
            throw new BadRequestException('Id must be a valid UUID')
        }
        let user = await this.usersRepository.findOne({ where: { id: id } })
        if (user.password !== updatePasswordDto.oldPassword) {
            throw new ForbiddenException(
                'Password must be different old password',
            );
        } else {
            user.password = updatePasswordDto.newPassword
            try {
                await this.usersRepository.update(id, user)
                return plainToClass(OutputUserDto, user, { excludeExtraneousValues: true });
            } catch (e) {
                throw e
            }
        }
    }

    async deleteUser(id: string): Promise<boolean> {
        if (!await isValidUUIDv4(id)) {
            throw new BadRequestException('Id must be a valid UUID')
        }
        await this.findById(id)
        try {
            await this.usersRepository.delete(id);
            return true;
        } catch (e) {
            throw e
        }
    }
}
