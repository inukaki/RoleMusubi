import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/roles.entity';
import { UserRole } from './entities/user-role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  async addRoleToUser(discordId: string, roleId: string): Promise<UserRole> {
    const user = await this.usersRepository.findOne({ where: { discordId } });
    const role = await this.rolesRepository.findOne({ where: { roleId } });

    if (!user || !role) {
      throw new Error('User or Role not found');
    }

    const userRole = new UserRole();
    userRole.discordId = discordId;
    userRole.roleId = roleId;

    return this.userRoleRepository.save(userRole);
  }

  async removeRoleFromUser(discordId: string, roleId: string): Promise<void> {
    const userRole = await this.userRoleRepository.findOne({
      where: { discordId, roleId }
    });

    if (!userRole) {
      throw new Error('User role not found');
    }

    await this.userRoleRepository.remove(userRole);
  }
} 