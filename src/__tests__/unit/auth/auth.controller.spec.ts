import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../modules/auth/auth.controller';
import { AuthService } from '../../../modules/auth/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<Partial<AuthService>>;

  beforeEach(async () => {
    authService = {
      signup: jest.fn(),
      login: jest.fn(),
      refresh: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('signup', () => {
    it('should call authService.signup with dto and return result', async () => {
      const signupDto = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
      };

      const mockResult = {
        user: { id: '1', email: signupDto.email, firstName: 'Test', lastName: 'User' },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      (authService.signup as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.signup(signupDto as never);

      expect(authService.signup).toHaveBeenCalledWith(signupDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('login', () => {
    it('should call authService.login with dto and return tokens', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const mockResult = {
        user: { id: '1', email: loginDto.email },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      (authService.login as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('refresh', () => {
    it('should call authService.refresh with refreshToken and return new tokens', async () => {
      const refreshDto = { refreshToken: 'valid-refresh-token' };
      const mockResult = { accessToken: 'new-access', refreshToken: 'new-refresh' };

      (authService.refresh as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.refresh(refreshDto);

      expect(authService.refresh).toHaveBeenCalledWith(refreshDto.refreshToken);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getMe', () => {
    it('should return the current user without passwordHash', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        passwordHash: 'should-be-removed',
      };

      const result = controller.getMe(user);

      expect(result).not.toHaveProperty('passwordHash');
      expect(result).toHaveProperty('id', '1');
      expect(result).toHaveProperty('email', 'test@example.com');
    });
  });

  describe('logout', () => {
    it('should return a success message', () => {
      const result = controller.logout();
      expect(result).toHaveProperty('message');
    });
  });
});
