import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { uuid } from 'uuidv4';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepository = {
    register: jest.fn().mockImplementation((dto) => dto),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((user) =>
      Promise.resolve({
        id: uuid(),
        email: user.email,
        name: user.name,
      }),
    ),
    findOne: jest.fn().mockImplementation((user) => Promise.resolve(null)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user record and return that', async () => {
    const dto = {
      name: 'Giovanna',
      email: 'giovanna@email.com',
      password: '12345678',
    };
    expect(await service.register(dto)).toEqual({
      id: expect.any(String),
      name: 'Giovanna',
      email: 'giovanna@email.com',
    });
  });
});
