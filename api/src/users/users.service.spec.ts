import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Role } from '../roles/roles.entity';
import { UserRole } from './entities/user-role.entity';
import { RolesService } from '../roles/roles.service';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  let userRoleRepository: Repository<UserRole>;

  const mockUser = {
    discordId: '123456789',
    username: 'testuser',
  };

  const mockRole = {
    roleId: 'role123',
    name: 'Test Role',
  };

  const mockUserRole = {
    discordId: '123456789',
    roleId: 'role123',
    assignedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Role),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserRole),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: RolesService,
          useValue: {
            getAllParents: jest.fn().mockResolvedValue([]),
            getAllChildren: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    userRoleRepository = module.get<Repository<UserRole>>(getRepositoryToken(UserRole));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addRoleToUser', () => {
    it('should add role to user successfully', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(mockRole as Role);
      jest.spyOn(userRoleRepository, 'save').mockResolvedValue(mockUserRole as UserRole);

      const result = await service.addRoleToUser('123456789', 'role123');

      expect(result).toEqual([mockUserRole]);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { discordId: '123456789' } });
      expect(roleRepository.findOne).toHaveBeenCalledWith({ where: { roleId: 'role123' } });
      expect(userRoleRepository.save).toHaveBeenCalled();
    });

    it('should throw error when user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.addRoleToUser('123456789', 'role123')).rejects.toThrow('User or Role not found');
    });

    it('should throw error when role not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(null);

      await expect(service.addRoleToUser('123456789', 'role123')).rejects.toThrow('User or Role not found');
    });
  });

  describe('removeRoleFromUser', () => {
    it('should remove role from user successfully', async () => {
      jest.spyOn(userRoleRepository, 'findOne').mockResolvedValue(mockUserRole as UserRole);
      jest.spyOn(userRoleRepository, 'remove').mockResolvedValue(mockUserRole as UserRole);

      await service.removeRoleFromUser('123456789', 'role123');

      expect(userRoleRepository.findOne).toHaveBeenCalledWith({
        where: { discordId: '123456789', roleId: 'role123' }
      });
      expect(userRoleRepository.remove).toHaveBeenCalled();
    });

    it('should throw error when user role not found', async () => {
      jest.spyOn(userRoleRepository, 'findOne').mockResolvedValue(null);

      await expect(service.removeRoleFromUser('123456789', 'role123')).rejects.toThrow('User role not found');
    });
  });
}); 