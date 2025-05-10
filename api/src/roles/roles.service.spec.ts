import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './roles.entity';
import { RoleRelation } from './role-relation.entity';
import { UserRole } from '../users/entities/user-role.entity';
import { User } from '../users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('RolesService', () => {
  let service: RolesService;
  let roleRepository: Repository<Role>;
  let roleRelationRepository: Repository<RoleRelation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [Role, RoleRelation, UserRole, User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Role, RoleRelation, UserRole, User]),
      ],
      providers: [RolesService],
    }).compile();

    service = module.get<RolesService>(RolesService);
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    roleRelationRepository = module.get<Repository<RoleRelation>>(getRepositoryToken(RoleRelation));
  }, 30000);

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a role', async () => {
      const newRole = {
        roleId: 'role123',
        name: 'Test Role',
      };

      const result = await service.create(newRole.name, newRole.roleId);
      expect(result).toEqual(expect.objectContaining(newRole));
    });
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const role = {
        roleId: 'role123',
        name: 'Test Role',
      };

      await service.create(role.name, role.roleId);
      const result = await service.findAll();
      expect(result).toEqual(expect.arrayContaining([expect.objectContaining(role)]));
    });
  });

  describe('findOne', () => {
    it('should return a role', async () => {
      const role = {
        roleId: 'role123',
        name: 'Test Role',
      };

      await service.create(role.name, role.roleId);
      const result = await service.findOne(role.roleId);
      expect(result).toEqual(expect.objectContaining(role));
    });

    it('should return null when role not found', async () => {
      const result = await service.findOne('nonexistent');
      expect(result).toBeNull();
    });
  });
});
