import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { RolesModule } from '../src/roles/roles.module';
import { createTestingApp, clearDatabase, testUser, testRole } from './test-utils';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { Role } from '../src/roles/roles.entity';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;

  beforeAll(async () => {
    app = await createTestingApp();
    const moduleRef = app.select(UsersModule);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    roleRepository = moduleRef.get<Repository<Role>>(getRepositoryToken(Role));
  });

  beforeEach(async () => {
    await clearDatabase(app);
    // テストデータの作成
    await userRepository.save(testUser);
    await roleRepository.save(testRole);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users/:discordId/roles/:roleId (POST)', () => {
    it('should add role to user', () => {
      return request(app.getHttpServer())
        .post(`/users/${testUser.discordId}/roles/${testRole.roleId}`)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('discordId', testUser.discordId);
          expect(res.body).toHaveProperty('roleId', testRole.roleId);
          expect(res.body).toHaveProperty('assignedAt');
        });
    });

    it('should return 404 when user not found', () => {
      return request(app.getHttpServer())
        .post('/users/nonexistent/roles/role123')
        .expect(404);
    });

    it('should return 404 when role not found', () => {
      return request(app.getHttpServer())
        .post(`/users/${testUser.discordId}/roles/nonexistent`)
        .expect(404);
    });
  });

  describe('/users/:discordId/roles/:roleId (DELETE)', () => {
    it('should remove role from user', async () => {
      // まずロールを追加
      await request(app.getHttpServer())
        .post(`/users/${testUser.discordId}/roles/${testRole.roleId}`)
        .expect(201);

      // ロールを削除
      return request(app.getHttpServer())
        .delete(`/users/${testUser.discordId}/roles/${testRole.roleId}`)
        .expect(200);
    });

    it('should return 404 when user role not found', () => {
      return request(app.getHttpServer())
        .delete(`/users/${testUser.discordId}/roles/nonexistent`)
        .expect(404);
    });
  });
}); 