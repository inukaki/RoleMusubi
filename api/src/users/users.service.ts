import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/roles.entity';
import { UserRole } from './entities/user-role.entity';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    private rolesService: RolesService,
  ) {}

  private async addRoleToUserInternal(discordId: string, roleId: string, addedRoles: Set<string> = new Set()): Promise<UserRole[]> {
    if (addedRoles.has(roleId)) {
      return []; // 既に追加済みのロールはスキップ
    }
    addedRoles.add(roleId);

    const user = await this.usersRepository.findOne({ where: { discordId } });
    const role = await this.rolesRepository.findOne({ where: { roleId } });

    if (!user || !role) {
      throw new Error('User or Role not found');
    }

    const result: UserRole[] = [];

    // 親ロールを取得して再帰的に追加
    const parentRoles = await this.rolesService.getAllParents(roleId);
    for (const parentRole of parentRoles) {
      const parentResults = await this.addRoleToUserInternal(discordId, parentRole.roleId, addedRoles);
      result.push(...parentResults);
    }

    // 子ロールを取得して再帰的に追加
    const childRoles = await this.rolesService.getAllChildren(roleId);
    for (const childRole of childRoles) {
      const childResults = await this.addRoleToUserInternal(discordId, childRole.roleId, addedRoles);
      result.push(...childResults);
    }

    // 現在のロールを追加
    const userRole = new UserRole();
    userRole.discordId = discordId;
    userRole.roleId = roleId;
    userRole.assignedAt = new Date();
    result.push(await this.userRoleRepository.save(userRole));

    return result;
  }

  async addRoleToUser(discordId: string, roleId: string): Promise<UserRole[]> {
    return this.addRoleToUserInternal(discordId, roleId);
  }

  async removeRoleFromUser(discordId: string, roleId: string): Promise<void> {
    // 削除対象のロールを取得
    const userRole = await this.userRoleRepository.findOne({
      where: { discordId, roleId }
    });

    if (!userRole) {
      throw new Error('User role not found');
    }

    // 親ロールを取得
    const parentRoles = await this.rolesService.getAllParents(roleId);

    // 子ロールを削除
    await this.userRoleRepository.remove(userRole);

    // 各親ロールについて、他の子ロールとの紐付けを確認
    for (const parentRole of parentRoles) {
      // このユーザーが持っている、この親ロールに紐づく子ロールを取得
      const childRoles = await this.rolesService.getAllChildren(parentRole.roleId);
      
      // このユーザーが持っている、この親ロールに紐づく子ロールの数を確認
      const userChildRoles = await this.userRoleRepository.find({
        where: {
          discordId,
          roleId: In(childRoles.map(role => role.roleId))
        }
      });

      // この親ロールに紐づく子ロールが他にない場合、親ロールも削除
      if (userChildRoles.length === 0) {
        const parentUserRole = await this.userRoleRepository.findOne({
          where: { discordId, roleId: parentRole.roleId }
        });
        if (parentUserRole) {
          await this.userRoleRepository.remove(parentUserRole);
        }
      }
    }
  }
} 