import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { ConversationsService } from '../conversations/conversations.service';
import { AuthenticatedUser } from '../common/interfaces';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly conversationsService: ConversationsService,
  ) {}

  async getMessages(
    user: AuthenticatedUser,
    conversationId: string,
    limit = 50,
    before?: Date,
  ) {
    // Check access to conversation
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    this.conversationsService.checkAccess(user, conversation);

    const where: any = {
      conversationId,
    };

    if (before) {
      where.createdAt = {
        lt: before,
      };
    }

    const messages = await this.prisma.message.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
            patientProfile: {
              select: {
                fullName: true,
              },
            },
            doctorProfile: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });

    // Format messages with sender info
    return messages
      .map((msg) => ({
        id: msg.id,
        content: msg.content,
        attachmentUrl: msg.attachmentUrl,
        attachmentName: msg.attachmentName,
        createdAt: msg.createdAt,
        readAt: msg.readAt,
        sender: {
          id: msg.sender.id,
          email: msg.sender.email,
          role: msg.sender.role,
          fullName:
            msg.sender.patientProfile?.fullName ||
            msg.sender.doctorProfile?.fullName ||
            'Unknown',
        },
        isOwnMessage: msg.senderId === user.id,
      }))
      .reverse(); // Return in chronological order
  }

  async createMessage(
    user: AuthenticatedUser,
    conversationId: string,
    dto: CreateMessageDto,
    attachment?: { url: string; name: string },
  ) {
    // Check access to conversation
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    this.conversationsService.checkAccess(user, conversation);

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId: user.id,
        content: dto.content,
        attachmentUrl: attachment?.url,
        attachmentName: attachment?.name,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
            patientProfile: {
              select: {
                fullName: true,
              },
            },
            doctorProfile: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });

    // Update conversation's updatedAt
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Log the message
    await this.auditService.log({
      userId: user.id,
      action: 'SEND_MESSAGE',
      entityType: 'Message',
      entityId: message.id,
      details: `Sent message in conversation ${conversationId}`,
    });

    return {
      id: message.id,
      content: message.content,
      attachmentUrl: message.attachmentUrl,
      attachmentName: message.attachmentName,
      createdAt: message.createdAt,
      readAt: message.readAt,
      sender: {
        id: message.sender.id,
        email: message.sender.email,
        role: message.sender.role,
        fullName:
          message.sender.patientProfile?.fullName ||
          message.sender.doctorProfile?.fullName ||
          'Unknown',
      },
      isOwnMessage: true,
    };
  }

  async markAsRead(user: AuthenticatedUser, messageId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        conversation: true,
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    this.conversationsService.checkAccess(user, message.conversation);

    // Only mark as read if the user is not the sender
    if (message.senderId === user.id) {
      return message;
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: { readAt: new Date() },
    });
  }

  async markConversationAsRead(
    user: AuthenticatedUser,
    conversationId: string,
  ) {
    // Check access to conversation
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    this.conversationsService.checkAccess(user, conversation);

    // Mark all messages from the other participant as read
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: user.id },
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    return { success: true };
  }
}
