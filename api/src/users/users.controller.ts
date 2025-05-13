import { Controller, Post, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from './entities/user-role.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':discordId/roles/:roleId')
  async addRoleToUser(
    @Param('discordId') discordId: string,
    @Param('roleId') roleId: string,
  ): Promise<UserRole[]> {
    return this.usersService.addRoleToUser(discordId, roleId);
  }

  @Delete(':discordId/roles/:roleId')
  async removeRoleFromUser(
    @Param('discordId') discordId: string,
    @Param('roleId') roleId: string,
  ): Promise<{ removedRoles: string[] }> {
    return await this.usersService.removeRoleFromUser(discordId, roleId);
  }
}