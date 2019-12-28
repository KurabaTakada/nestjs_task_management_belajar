import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';
import { JwtAccessToken } from './model/jwt-access-token.model';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/signup')
    signup(
        @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
    ): Promise<void> {
        return this.authService.signupUser(authCredentialDto);
    }

    @Post('/signin')
    signin(
        @Body() authCredentialDto: AuthCredentialDto,
    ): Promise<JwtAccessToken> {
        return this.authService.signIn(authCredentialDto);
    }

}
