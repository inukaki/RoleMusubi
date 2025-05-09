import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Role } from '../src/roles/roles.entity';
import { UserRole } from '../src/users/entities/user-role.entity';
import { Server } from '../src/servers/servers.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export async function createTestingApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'better-sqlite3',
        database: ':memory:',
        entities: [User, Role, UserRole, Server],
        synchronize: true,
      }),
    ],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
}

export async function clearDatabase(app: INestApplication): Promise<void> {
  const userRoleRepo = app.get<Repository<UserRole>>(getRepositoryToken(UserRole));
  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));
  const roleRepo = app.get<Repository<Role>>(getRepositoryToken(Role));
  const serverRepo = app.get<Repository<Server>>(getRepositoryToken(Server));

  await userRoleRepo.clear();
  await userRepo.clear();
  await roleRepo.clear();
  await serverRepo.clear();
}

export const testUser = {
  discordId: '123456789',
  username: 'testuser',
};

export const testRole = {
  roleId: 'role123',
  name: 'Test Role',
};

export const testServer = {
  serverId: '123456789',
  name: 'Test Server',
}; 