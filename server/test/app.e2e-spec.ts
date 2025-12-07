import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let doctorToken: string;
  let patientToken: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let doctorId: string;
  let patientId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prisma = app.get(PrismaService);

    // Clean database and create test users
    await cleanDatabase();
    await createTestUsers();
  });

  afterAll(async () => {
    await cleanDatabase();
    await app.close();
  });

  async function cleanDatabase() {
    await prisma.auditLog.deleteMany();
    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.patientProfile.deleteMany();
    await prisma.doctorProfile.deleteMany();
    await prisma.user.deleteMany();
  }

  async function createTestUsers() {
    const passwordHash = await bcrypt.hash('password123', 10);

    // Create doctor
    const doctor = await prisma.user.create({
      data: {
        email: 'e2e-doctor@test.com',
        passwordHash,
        role: Role.DOCTOR,
        doctorProfile: {
          create: {
            fullName: 'Test Doctor',
            specialty: 'General',
          },
        },
      },
    });
    doctorId = doctor.id;

    // Create patient
    const patient = await prisma.user.create({
      data: {
        email: 'e2e-patient@test.com',
        passwordHash,
        role: Role.PATIENT,
        patientProfile: {
          create: {
            fullName: 'Test Patient',
          },
        },
      },
    });
    patientId = patient.id;
  }

  describe('Auth', () => {
    it('/api/auth/login (POST) - should login doctor', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'e2e-doctor@test.com', password: 'password123' })
        .expect(201);

      expect(response.body.accessToken).toBeDefined();
      expect(response.body.user.role).toBe(Role.DOCTOR);
      doctorToken = response.body.accessToken;
    });

    it('/api/auth/login (POST) - should login patient', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'e2e-patient@test.com', password: 'password123' })
        .expect(201);

      expect(response.body.accessToken).toBeDefined();
      expect(response.body.user.role).toBe(Role.PATIENT);
      patientToken = response.body.accessToken;
    });

    it('/api/auth/login (POST) - should fail with wrong password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'e2e-doctor@test.com', password: 'wrongpassword' })
        .expect(401);
    });

    it('/api/auth/me (GET) - should return current user', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${doctorToken}`)
        .expect(200);

      expect(response.body.email).toBe('e2e-doctor@test.com');
      expect(response.body.role).toBe(Role.DOCTOR);
    });

    it('/api/auth/me (GET) - should fail without token', async () => {
      await request(app.getHttpServer()).get('/api/auth/me').expect(401);
    });
  });

  describe('Conversations', () => {
    let conversationId: string;

    it('/api/conversations (POST) - doctor creates conversation with patient', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/conversations')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({ participantId: patientId })
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.otherParticipant.id).toBe(patientId);
      conversationId = response.body.id;
    });

    it('/api/conversations (GET) - doctor gets their conversations', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/conversations')
        .set('Authorization', `Bearer ${doctorToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('/api/conversations (GET) - patient gets their conversations', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/conversations')
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('/api/conversations/:id (GET) - should get conversation details', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/conversations/${conversationId}`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .expect(200);

      expect(response.body.id).toBe(conversationId);
    });

    describe('Messages', () => {
      it('should send a message as doctor', async () => {
        const response = await request(app.getHttpServer())
          .post(`/api/conversations/${conversationId}/messages`)
          .set('Authorization', `Bearer ${doctorToken}`)
          .send({ content: 'Hello patient!' })
          .expect(201);

        expect(response.body.content).toBe('Hello patient!');
        expect(response.body.isOwnMessage).toBe(true);
      });

      it('should send a message as patient', async () => {
        const response = await request(app.getHttpServer())
          .post(`/api/conversations/${conversationId}/messages`)
          .set('Authorization', `Bearer ${patientToken}`)
          .send({ content: 'Hello doctor!' })
          .expect(201);

        expect(response.body.content).toBe('Hello doctor!');
        expect(response.body.isOwnMessage).toBe(true);
      });

      it('should get messages for conversation', async () => {
        const response = await request(app.getHttpServer())
          .get(`/api/conversations/${conversationId}/messages`)
          .set('Authorization', `Bearer ${doctorToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
      });
    });
  });
});
