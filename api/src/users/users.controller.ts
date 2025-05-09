import { Controller, Post, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':discordId/roles/:roleId')
  async addRoleToUser(
    @Param('discordId') discordId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.usersService.addRoleToUser(discordId, roleId);
  }

  @Delete(':discordId/roles/:roleId')
  async removeRoleFromUser(
    @Param('discordId') discordId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.usersService.removeRoleFromUser(discordId, roleId);
  }
} 