import { CryptoService } from '@libs/util/crypto';
import { User } from '../user/entities/user.entity';
import { UserRepository } from '../user/entities/user.repository';
import { AuthService } from './auth.service';
import { JwtService } from '@libs/util/jwt';
import { Test } from '@nestjs/testing';
import { CreateUserDto, UserDto } from '@libs/dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let fakeUserRepo: Partial<UserRepository>;
    let fakeCryptoService: Partial<CryptoService>;
    let fakeJwtService: Partial<JwtService>;

    beforeEach(async () => {
        const users: User[] = [];
        fakeUserRepo = {
            create: (createUserDto: CreateUserDto) => {
                const user = {
                    id: 'qwer-asdf-xzcv',
                    email: createUserDto.email,
                    password: createUserDto.password,
                    username: createUserDto.username,
                } as User;
                users.push(user);
                return Promise.resolve(user);
            },
            findByEmail: (email: string) => {
                const filteredUsers = users.filter(
                    (user) => user.email === email,
                );
                return Promise.resolve(filteredUsers);
            },
            findOneByEmail: (email: string) => {
                const filteredUsers = users.filter(
                    (user) => user.email === email,
                );
                console.log('filteredUsers[0]', filteredUsers[0]);
                return Promise.resolve(filteredUsers[0]);
            },
        };
        fakeCryptoService = {
            hash: (text: string) => {
                return Promise.resolve(text + 'hashed');
            },
            compare: (plainText: string, hashedText: string) => {
                if (plainText + 'hashed' !== hashedText)
                    return Promise.resolve(false);
                return Promise.resolve(true);
            },
        };
        fakeJwtService = {
            create: (userDto: UserDto, expiration: string) => {
                return userDto.id + 'token' + expiration;
            },
        };

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UserRepository, useValue: fakeUserRepo },
                { provide: CryptoService, useValue: fakeCryptoService },
                { provide: JwtService, useValue: fakeJwtService },
            ],
        }).compile();

        service = module.get(AuthService);
    });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('creates a new user and generates tokens', async () => {
        const signUpResult = await service.signup({
            email: 'test@test.com',
            password: 'mypassword',
            username: 'test-user',
        });
        expect(signUpResult.atk).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () => {
        await service.signup({
            email: 'asdf@test.com',
            password: 'mypassword',
            username: 'test-user',
        });

        await expect(
            service.signup({
                email: 'asdf@test.com',
                password: 'mypassword',
                username: 'test-user',
            }),
        ).rejects.toThrow(BadRequestException);
    });

    it('throws an error if user sign in with an unused email', async () => {
        await expect(
            service.signin({ email: 'aa@gmail.com', password: 'mypassword' }),
        ).rejects.toThrow(NotFoundException);
    });

    it('throws an error if user sign in with an invalid password', async () => {
        await service.signup({
            email: 'test@test.com',
            password: 'mypassword',
            username: 'test-user',
        });
        await expect(
            service.signin({ email: 'test@test.com', password: 'qwer' }),
        ).rejects.toThrow(BadRequestException);
    });

    it('returns a user if correct password is provided', async () => {
        await service.signup({
            email: 'test@test.com',
            password: 'mypassword',
            username: 'test-user',
        });

        const user = await service.signin({
            email: 'test@test.com',
            password: 'mypassword',
        });
        expect(user).toBeDefined();
    });
});
