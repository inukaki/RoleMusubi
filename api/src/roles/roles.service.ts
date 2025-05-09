import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './roles.entity';
import { RoleRelation } from './role-relation.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(RoleRelation)
        private readonly roleRelationRepository: Repository<RoleRelation>,
    ) {}

    async create(name: string, roleId: string): Promise<Role> {
        const role = this.roleRepository.create({ name, roleId });
        return this.roleRepository.save(role);
    }

    async delete(roleId: string): Promise<void> {
        await this.roleRepository.delete({ roleId });
    }

    async linkChildToParent(parentId: string, childId: string): Promise<void> {
        const parent = await this.roleRepository.findOne({ 
            where: { roleId: parentId }
        });
        const child = await this.roleRepository.findOne({ 
            where: { roleId: childId }
        });
 
        if (!parent || !child) {
            throw new Error('Parent or child role not found');
        }

        // 既存の関係を確認
        const existingRelation = await this.roleRelationRepository.findOne({
            where: {
                parent: { roleId: parent.roleId },
                child: { roleId: child.roleId }
            }
        });

        if (existingRelation) {
            return; // 既に関係が存在する場合は何もしない
        }

        // 新しい親子関係を作成
        const relation = this.roleRelationRepository.create({
            parent,
            child
        });

        await this.roleRelationRepository.save(relation);
    }

    async unlinkChildFromParent(parentId: string, childId: string): Promise<void> {
        const parent = await this.roleRepository.findOne({ 
            where: { roleId: parentId }
        });
        const child = await this.roleRepository.findOne({ 
            where: { roleId: childId }
        });
 
        if (!parent || !child) {
            throw new Error('Parent or child role not found');
        }

        // 親子関係を削除
        await this.roleRelationRepository.delete({
            parent: { roleId: parent.roleId },
            child: { roleId: child.roleId }
        });
    }

    async getParents(roleId: string): Promise<Role[]> {
        const role = await this.roleRepository.findOne({
            where: { roleId },
            relations: ['childRelations', 'childRelations.parent']
        });

        if (!role) {
            throw new Error('Role not found');
        }

        return role.childRelations.map(relation => relation.parent);
    }

    async getChildren(roleId: string): Promise<Role[]> {
        const role = await this.roleRepository.findOne({
            where: { roleId },
            relations: ['parentRelations', 'parentRelations.child']
        });

        if (!role) {
            throw new Error('Role not found');
        }

        return role.parentRelations.map(relation => relation.child);
    }

    async findAll(): Promise<Role[]> {
        return this.roleRepository.find();
    }

    async findOne(roleId: string): Promise<Role | null> {
        return this.roleRepository.findOne({ where: { roleId } });
    }
}
