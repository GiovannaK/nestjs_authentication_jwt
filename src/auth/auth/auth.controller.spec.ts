import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { uuid } from 'uuidv4';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn((dto) => {
      return {
        id: uuid(),
        ...dto,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', () => {
    const dto = {
      name: 'User 1',
      password: '12345678',
      email: 'user1@email.com',
    };
    expect(controller.register(dto)).toEqual({
      id: expect.any(String),
      name: 'User 1',
      password: '12345678',
      email: 'user1@email.com',
    });

    expect(mockAuthService.register).toHaveBeenCalledWith(dto);
  });
});
