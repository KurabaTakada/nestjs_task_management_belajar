import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ErrorMessages } from '../resource/string.resource';

export class AuthCredentialDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(16)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: ErrorMessages.PASSWORD_PATTERN_NOT_MATCH },
    )
    password: string;
}
