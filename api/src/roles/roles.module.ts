import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './roles.entity';
import { RoleRelation } from './role-relation.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Role, RoleRelation])],
    controllers: [RolesController],
    providers: [RolesService],
})
export class RolesModule {}
