import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import {Strategy, ExtractJwt} from 'passport-jwt';
import { JwtPayload } from "./jwt-payload.interface";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'secret51'
        });
    }

    async validate(payload: JwtPayload): Promise<User> {

        console.log('Hello')

        const {username} = payload;

        console.log(username)

        const user = await this.userRepository.findOne({username});

        console.log(user);

        if (!user) {
            throw new UnauthorizedException();
        }
        
        return user;
    }
}