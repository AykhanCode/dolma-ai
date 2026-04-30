import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../../modules/auth/auth.module';
import { UsersModule } from '../../modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('Auth E2E', () => {
  let app: INestApplication;
  let userRepository: { findOne: jest.Mock; create: jest.Mock; save: jest.Mock; softRemove: jest.Mock };

  const testUser = {
    id: '1',
    email: 'e2etest@example.com',
    passwordHash: '',
    firstName: 'E2E',
    lastName: 'Test',
    role: 'business_owner',
    status: 'active',
    emailVerified: false,
    subscriptionTier: 'free',
  };

  beforeAll(async () => {
    testUser.passwordHash = await bcrypt.hash('Password123!', 10);

    userRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      softRemove: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({ global: true, secret: 'test-secret', signOptions: { expiresIn: '1h' } }),
        AuthModule,
        UsersModule,
      ],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(userRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/signup', () => {
    it('should create a new user and return tokens', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue({ ...testUser, email: 'newuser@example.com' });
      userRepository.save.mockResolvedValue({ ...testUser, email: 'newuser@example.com' });

      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send({
          email: 'newuser@example.com',
          password: 'Password123!',
          firstName: 'New',
          lastName: 'User',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).not.toHaveProperty('passwordHash');
    });

    it('should return 400 for invalid email', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send({
          email: 'invalid-email',
          password: 'Password123!',
        });

      expect(res.status).toBe(400);
    });

    it('should return 409 when email is already registered', async () => {
      userRepository.findOne.mockResolvedValue(testUser);

      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send({
          email: testUser.email,
          password: 'Password123!',
        });

      expect(res.status).toBe(409);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login and return tokens for valid credentials', async () => {
      userRepository.findOne.mockResolvedValue(testUser);

      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'Password123!',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });

    it('should return 401 for invalid credentials', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword',
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    let accessToken: string;

    beforeAll(async () => {
      userRepository.findOne.mockResolvedValue(testUser);

      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: testUser.email, password: 'Password123!' });

      accessToken = res.body.accessToken;
    });

    it('should return the current user when authenticated', async () => {
      userRepository.findOne.mockResolvedValue(testUser);

      const res = await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email');
      expect(res.body).not.toHaveProperty('passwordHash');
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/auth/me');

      expect(res.status).toBe(401);
    });
  });
});
