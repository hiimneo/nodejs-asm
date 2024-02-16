import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async signIn(
        username: string,
        pass: string,
    ): Promise<{ access_token: string }> {
        const user = await this.usersRepository.findOne({ where: { login: username } });
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }
        const payload = { id: user.id, login: user.login };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}