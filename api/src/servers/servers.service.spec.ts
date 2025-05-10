import { Test, TestingModule } from '@nestjs/testing';
import { ServersService } from './servers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from './servers.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ServersService', () => {
  let service: ServersService;
  let serverRepository: Repository<Server>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [Server],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Server]),
      ],
      providers: [ServersService],
    }).compile();

    service = module.get<ServersService>(ServersService);
    serverRepository = module.get<Repository<Server>>(getRepositoryToken(Server));
  }, 30000);

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a server', async () => {
      const newServer = {
        serverId: '123456789',
        name: 'Test Server',
      };

      const result = await service.create(newServer.name, newServer.serverId);
      expect(result).toEqual(expect.objectContaining(newServer));
    });
  });

  describe('findAll', () => {
    it('should return an array of servers', async () => {
      const server = {
        serverId: '123456789',
        name: 'Test Server',
      };

      await service.create(server.name, server.serverId);
      const result = await service.findAll();
      expect(result).toEqual(expect.arrayContaining([expect.objectContaining(server)]));
    });
  });

  describe('findOne', () => {
    it('should return a server', async () => {
      const server = {
        serverId: '123456789',
        name: 'Test Server',
      };

      await service.create(server.name, server.serverId);
      const result = await service.findOne(server.serverId);
      expect(result).toEqual(expect.objectContaining(server));
    });

    it('should return null when server not found', async () => {
      const result = await service.findOne('nonexistent');
      expect(result).toBeNull();
    });
  });
});
