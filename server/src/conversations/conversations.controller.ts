import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationStatusDto } from './dto/update-conversation-status.dto';
import { CurrentUser } from '../common/decorators';
import { AuthenticatedUser } from '../common/interfaces';
import { RolesGuard } from '../common/guards';

@Controller('conversations')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createConversationDto: CreateConversationDto,
  ) {
    return this.conversationsService.create(user, createConversationDto);
  }

  @Get()
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.conversationsService.findAll(user);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.conversationsService.getById(user, id);
  }

  @Patch(':id/status')
  async updateStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateConversationStatusDto,
  ) {
    return this.conversationsService.updateStatus(
      user,
      id,
      updateStatusDto.status,
    );
  }
}
