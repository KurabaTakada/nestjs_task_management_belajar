import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './model/jwt-payload.model';
import { JwtAccessToken } from './model/jwt-access-token.model';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    async signupUser(authCredentialDto: AuthCredentialDto): Promise<void> {
        return this.userRepository.signupUser(authCredentialDto);
    }

    async signIn(authCredentialDto: AuthCredentialDto): Promise<JwtAccessToken> {
        const username = await this.userRepository.validateUser(authCredentialDto);

        if (!username) {
            throw new UnauthorizedException();
        }

        const payload: JwtPayload = {username};
        const jwtAccessToken: JwtAccessToken = {
            accessToken: this.jwtService.sign(payload),
        };
        return jwtAccessToken;
    }
}
