import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRole } from './entities/user-role.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUserRole = {
    discordId: '123456789',
    roleId: 'role123',
    assignedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            addRoleToUser: jest.fn(),
            removeRoleFromUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addRoleToUser', () => {
    it('should add role to user', async () => {
      jest.spyOn(service, 'addRoleToUser').mockResolvedValue(mockUserRole as UserRole);

      const result = await controller.addRoleToUser('123456789', 'role123');

      expect(result).toEqual(mockUserRole);
      expect(service.addRoleToUser).toHaveBeenCalledWith('123456789', 'role123');
    });
  });

  describe('removeRoleFromUser', () => {
    it('should remove role from user', async () => {
      jest.spyOn(service, 'removeRoleFromUser').mockResolvedValue();

      await controller.removeRoleFromUser('123456789', 'role123');

      expect(service.removeRoleFromUser).toHaveBeenCalledWith('123456789', 'role123');
    });
  });
}); 