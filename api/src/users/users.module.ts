import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Role } from '../roles/roles.entity';
import { UsersController } from './users.controller';
import { UserRole } from './entities/user-role.entity';
import { RolesService } from '../roles/roles.service';
import { RoleRelation } from '../roles/role-relation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserRole, RoleRelation])],
  controllers: [UsersController],
  providers: [UsersService, RolesService],
  exports: [UsersService],
})
export class UsersModule {} 