import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { Role } from '@prisma/client';

describe('ConversationsService', () => {
  let service: ConversationsService;

  const mockPrismaService = {
    conversation: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockAuditService = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    service = module.get<ConversationsService>(ConversationsService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkAccess', () => {
    it('should allow doctor access to their conversation', () => {
      const user = {
        id: 'doctor-1',
        email: 'doctor@test.com',
        role: Role.DOCTOR,
      };
      const conversation = { doctorId: 'doctor-1', patientId: 'patient-1' };

      expect(() => service.checkAccess(user, conversation)).not.toThrow();
    });

    it('should allow patient access to their conversation', () => {
      const user = {
        id: 'patient-1',
        email: 'patient@test.com',
        role: Role.PATIENT,
      };
      const conversation = { doctorId: 'doctor-1', patientId: 'patient-1' };

      expect(() => service.checkAccess(user, conversation)).not.toThrow();
    });

    it('should allow admin access to any conversation', () => {
      const user = { id: 'admin-1', email: 'admin@test.com', role: Role.ADMIN };
      const conversation = { doctorId: 'doctor-1', patientId: 'patient-1' };

      expect(() => service.checkAccess(user, conversation)).not.toThrow();
    });

    it('should deny access to users not in the conversation', () => {
      const user = {
        id: 'other-1',
        email: 'other@test.com',
        role: Role.PATIENT,
      };
      const conversation = { doctorId: 'doctor-1', patientId: 'patient-1' };

      expect(() => service.checkAccess(user, conversation)).toThrow(
        ForbiddenException,
      );
    });

    it('should deny doctor access to other conversations', () => {
      const user = {
        id: 'doctor-2',
        email: 'doctor2@test.com',
        role: Role.DOCTOR,
      };
      const conversation = { doctorId: 'doctor-1', patientId: 'patient-1' };

      expect(() => service.checkAccess(user, conversation)).toThrow(
        ForbiddenException,
      );
    });
  });
});
