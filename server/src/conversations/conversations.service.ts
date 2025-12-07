import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { AuthenticatedUser } from '../common/interfaces';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Role, ConversationStatus } from '@prisma/client';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(user: AuthenticatedUser, dto: CreateConversationDto) {
    let doctorId: string;
    let patientId: string;

    if (user.role === Role.DOCTOR) {
      doctorId = user.id;
      patientId = dto.participantId;

      // Verify patient exists and has correct role
      const patient = await this.prisma.user.findUnique({
        where: { id: patientId },
      });
      if (!patient || patient.role !== Role.PATIENT) {
        throw new BadRequestException('Invalid patient ID');
      }
    } else if (user.role === Role.PATIENT) {
      patientId = user.id;
      doctorId = dto.participantId;

      // Verify doctor exists and has correct role
      const doctor = await this.prisma.user.findUnique({
        where: { id: doctorId },
      });
      if (!doctor || doctor.role !== Role.DOCTOR) {
        throw new BadRequestException('Invalid doctor ID');
      }
    } else {
      throw new ForbiddenException(
        'Only doctors and patients can create conversations',
      );
    }

    // Check if conversation already exists
    const existingConversation = await this.prisma.conversation.findFirst({
      where: {
        doctorId,
        patientId,
      },
    });

    if (existingConversation) {
      // Return existing conversation instead of creating a new one
      return this.getById(user, existingConversation.id);
    }

    const conversation = await this.prisma.conversation.create({
      data: {
        doctorId,
        patientId,
      },
      include: {
        doctor: {
          include: {
            doctorProfile: true,
          },
        },
        patient: {
          include: {
            patientProfile: true,
          },
        },
      },
    });

    await this.auditService.log({
      userId: user.id,
      action: 'CREATE_CONVERSATION',
      entityType: 'Conversation',
      entityId: conversation.id,
      details: `Created conversation with ${user.role === Role.DOCTOR ? 'patient' : 'doctor'}`,
    });

    return this.formatConversation(conversation, user);
  }

  async findAll(user: AuthenticatedUser) {
    let where = {};

    if (user.role === Role.DOCTOR) {
      where = { doctorId: user.id };
    } else if (user.role === Role.PATIENT) {
      where = { patientId: user.id };
    } else if (user.role === Role.ADMIN) {
      // Admin can see all conversations
      where = {};
    } else {
      throw new ForbiddenException('Access denied');
    }

    const conversations = await this.prisma.conversation.findMany({
      where,
      include: {
        doctor: {
          include: {
            doctorProfile: true,
          },
        },
        patient: {
          include: {
            patientProfile: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return conversations.map((conv) => this.formatConversation(conv, user));
  }

  async getById(user: AuthenticatedUser, id: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        doctor: {
          include: {
            doctorProfile: true,
          },
        },
        patient: {
          include: {
            patientProfile: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Check if user is authorized to view this conversation
    this.checkAccess(user, conversation);

    await this.auditService.log({
      userId: user.id,
      action: 'READ_CONVERSATION',
      entityType: 'Conversation',
      entityId: conversation.id,
    });

    return this.formatConversation(conversation, user);
  }

  async updateStatus(
    user: AuthenticatedUser,
    id: string,
    status: ConversationStatus,
  ) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    this.checkAccess(user, conversation);

    const updated = await this.prisma.conversation.update({
      where: { id },
      data: { status },
      include: {
        doctor: {
          include: {
            doctorProfile: true,
          },
        },
        patient: {
          include: {
            patientProfile: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    await this.auditService.log({
      userId: user.id,
      action: 'UPDATE_CONVERSATION_STATUS',
      entityType: 'Conversation',
      entityId: id,
      details: `Status changed to ${status}`,
    });

    return this.formatConversation(updated, user);
  }

  checkAccess(
    user: AuthenticatedUser,
    conversation: { doctorId: string; patientId: string },
  ) {
    if (user.role === Role.ADMIN) {
      return; // Admin has access to all conversations
    }

    if (
      conversation.doctorId !== user.id &&
      conversation.patientId !== user.id
    ) {
      throw new ForbiddenException(
        'You are not authorized to access this conversation',
      );
    }
  }

  private formatConversation(conversation: any, user: AuthenticatedUser) {
    const otherParticipant =
      user.role === Role.DOCTOR
        ? {
            id: conversation.patient.id,
            email: conversation.patient.email,
            role: conversation.patient.role,
            profile: conversation.patient.patientProfile,
          }
        : {
            id: conversation.doctor.id,
            email: conversation.doctor.email,
            role: conversation.doctor.role,
            profile: conversation.doctor.doctorProfile,
          };

    return {
      id: conversation.id,
      status: conversation.status,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      otherParticipant,
      lastMessage: conversation.messages?.[0] || null,
    };
  }
}
