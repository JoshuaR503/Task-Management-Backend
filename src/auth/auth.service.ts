import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserRepository)
        private useRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    async signUp(authCredentialsDTO: AuthCredentialsDTO) {
        return await this.useRepository.sign(authCredentialsDTO);
    }

    async signIn(authCredentialsDTO: AuthCredentialsDTO): Promise<{accessToken: string}> {
        const username = await this.useRepository.validateUserPassword(authCredentialsDTO);

        if (!username) {
            throw new UnauthorizedException('Invalid credentials');
        } 

        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken };
    }

}
