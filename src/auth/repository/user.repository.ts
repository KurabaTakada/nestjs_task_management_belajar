import { Repository, EntityRepository } from 'typeorm';
import { User } from '../entity/user.entity';
import { AuthCredentialDto } from '../dto/auth-credential.dto';
import { ErrorCodes } from '../resource/error-code.resource';
import { ConflictException, InternalServerErrorException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { ErrorMessages } from '../resource/string.resource';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signupUser(authCredentialDto: AuthCredentialDto): Promise<void> {
        const { username, password } = authCredentialDto;

        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, user.salt);

        try {
            await user.save();
        } catch (error) {
            switch (error.code) {
                case ErrorCodes.DUPLICATE : {
                    throw new ConflictException(ErrorMessages.USER_ALREADY_EXISTS);
                }
                default : {
                    throw new InternalServerErrorException();
                }
            }
        }

    }

    async validateUser(authCredentialDto: AuthCredentialDto): Promise<string> {
        const { username, password } = authCredentialDto;

        const user = await this.findOne({ username });
        const inputHash = await bcrypt.hash(password, user.salt);

        if (inputHash !== user.password) {
            return null;
        }

        return user.username;
    }

}
