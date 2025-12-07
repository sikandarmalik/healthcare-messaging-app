import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetMessagesDto } from './dto/get-messages.dto';
import { CurrentUser } from '../common/decorators';
import { AuthenticatedUser } from '../common/interfaces';
import { RolesGuard } from '../common/guards';

// Allowed file extensions and MIME types
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Upload directory path from environment or default
const UPLOADS_DIR =
  process.env.UPLOADS_DIR || join(__dirname, '..', '..', 'uploads');

@Controller('conversations/:conversationId/messages')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getMessages(
    @CurrentUser() user: AuthenticatedUser,
    @Param('conversationId') conversationId: string,
    @Query() query: GetMessagesDto,
  ) {
    const before = query.before ? new Date(query.before) : undefined;
    return this.messagesService.getMessages(
      user,
      conversationId,
      query.limit || 50,
      before,
    );
  }

  @Post()
  async createMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Param('conversationId') conversationId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messagesService.createMessage(
      user,
      conversationId,
      createMessageDto,
    );
  }

  @Post('with-attachment')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOADS_DIR,
        filename: (_req, file, cb) => {
          const uniqueSuffix = uuidv4();
          const ext = extname(file.originalname).toLowerCase();
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
      fileFilter: (_req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        // Validate both extension and MIME type for security
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          return cb(
            new BadRequestException(
              `File extension not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`,
            ),
            false,
          );
        }
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              `File MIME type not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async createMessageWithAttachment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('conversationId') conversationId: string,
    @Body() createMessageDto: CreateMessageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let attachment: { url: string; name: string } | undefined;

    if (file) {
      attachment = {
        url: `/uploads/${file.filename}`,
        name: file.originalname,
      };
    }

    return this.messagesService.createMessage(
      user,
      conversationId,
      createMessageDto,
      attachment,
    );
  }

  @Patch(':messageId/read')
  async markAsRead(
    @CurrentUser() user: AuthenticatedUser,
    @Param('messageId') messageId: string,
  ) {
    return this.messagesService.markAsRead(user, messageId);
  }

  @Post('mark-read')
  async markConversationAsRead(
    @CurrentUser() user: AuthenticatedUser,
    @Param('conversationId') conversationId: string,
  ) {
    return this.messagesService.markConversationAsRead(user, conversationId);
  }
}
