import { Test, TestingModule } from '@nestjs/testing';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from './servers.entity';

describe('ServersController', () => {
  let controller: ServersController;
  let service: ServersService;

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
      controllers: [ServersController],
      providers: [ServersService],
    }).compile();

    controller = module.get<ServersController>(ServersController);
    service = module.get<ServersService>(ServersService);
  }, 30000);

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createServer', () => {
    it('should create a server', async () => {
      const newServer = {
        serverId: '123456789',
        name: 'Test Server',
      };

      jest.spyOn(service, 'create').mockResolvedValue(newServer as Server);

      const result = await controller.createServer(newServer);
      expect(result).toEqual(newServer);
    });
  });

  describe('findAll', () => {
    it('should return an array of servers', async () => {
      const servers = [
        {
          serverId: '123456789',
          name: 'Test Server',
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(servers as Server[]);

      const result = await controller.findAll();
      expect(result).toEqual(servers);
    });
  });

  describe('findOne', () => {
    it('should return a server', async () => {
      const server = {
        serverId: '123456789',
        name: 'Test Server',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(server as Server);

      const result = await controller.findOne('123456789');
      expect(result).toEqual(server);
    });
  });
});
