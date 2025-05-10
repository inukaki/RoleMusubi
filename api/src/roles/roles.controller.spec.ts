import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './roles.entity';
import { RoleRelation } from './role-relation.entity';
import { UserRole } from '../users/entities/user-role.entity';
import { User } from '../users/entities/user.entity';

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;

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
      controllers: [RolesController],
      providers: [RolesService],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  }, 30000);

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
