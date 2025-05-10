import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ServersModule } from '../src/servers/servers.module';
import { createTestingApp, clearDatabase, testServer } from './test-utils';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from '../src/servers/entities/server.entity';

describe('ServersController (e2e)', () => {
  let app: INestApplication;
  let serverRepository: Repository<Server>;

  beforeAll(async () => {
    app = await createTestingApp();
    const moduleRef = app.select(ServersModule);
    serverRepository = moduleRef.get<Repository<Server>>(getRepositoryToken(Server));
  });

  beforeEach(async () => {
    await clearDatabase(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/servers (POST)', () => {
    it('should create a server', () => {
      return request(app.getHttpServer())
        .post('/servers')
        .send(testServer)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('serverId', testServer.serverId);
          expect(res.body).toHaveProperty('name', testServer.name);
        });
    });

    it('should return 400 when serverId is missing', () => {
      const invalidServer = {
        name: 'Test Server',
      };

      return request(app.getHttpServer())
        .post('/servers')
        .send(invalidServer)
        .expect(400);
    });
  });

  describe('/servers (GET)', () => {
    it('should return an array of servers', async () => {
      // テストデータの作成
      await serverRepository.save(testServer);

      return request(app.getHttpServer())
        .get('/servers')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(1);
          expect(res.body[0]).toHaveProperty('serverId', testServer.serverId);
          expect(res.body[0]).toHaveProperty('name', testServer.name);
        });
    });
  });

  describe('/servers/:serverId (GET)', () => {
    it('should return a server', async () => {
      // テストデータの作成
      await serverRepository.save(testServer);

      return request(app.getHttpServer())
        .get(`/servers/${testServer.serverId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('serverId', testServer.serverId);
          expect(res.body).toHaveProperty('name', testServer.name);
        });
    });

    it('should return 404 when server not found', () => {
      return request(app.getHttpServer())
        .get('/servers/nonexistent')
        .expect(404);
    });
  });
}); 