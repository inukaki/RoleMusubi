import { Controller, Post, Param, Delete, Body, Get } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
    constructor(
        private readonly rolesService: RolesService,
    ) {}
    @Post()
    async createRole(@Body() body: { name: string, roleId: string }) {
        const role = await this.rolesService.create(body.name, body.roleId);
        return role;
    }
    @Delete(':roleId')
    async deleteRole(@Param('roleId') roleId: string) {
        const role = await this.rolesService.delete(roleId);
        return role;
    }
    @Post(':parentId/children/:childId')
    async linkChildToParent(
        @Param('parentId') parentId: string, 
        @Param('childId') childId: string
    ) {
        await this.rolesService.linkChildToParent(parentId, childId);
    }
    @Delete(':parentId/children/:childId')
    async unlinkChildFromParent(
        @Param('parentId') parentId: string,
        @Param('childId') childId: string
    ) {
        await this.rolesService.unlinkChildFromParent(parentId, childId);
    }
    @Get(':roleId/parents')
    async getParents(@Param('roleId') roleId: string) {
        return await this.rolesService.getParents(roleId);
    }
    @Get(':roleId/children')
    async getChildren(@Param('roleId') roleId: string) {
        return await this.rolesService.getChildren(roleId);
    }
}
