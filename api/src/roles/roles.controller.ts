import { Controller, Post, Param, Delete, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
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
        try {
            await this.rolesService.unlinkChildFromParent(parentId, childId);
            return { message: 'Role relation successfully unlinked' };
        } catch (error) {
            if (error.message.includes('No relation exists')) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
            }
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }
    @Get(':roleId/parents')
    async getParents(@Param('roleId') roleId: string) {
        return await this.rolesService.getAllParents(roleId);
    }
    @Get(':roleId/children')
    async getChildren(@Param('roleId') roleId: string) {
        return await this.rolesService.getAllChildren(roleId);
    }
    @Get(':roleId/direct-parents')
    async getDirectParents(@Param('roleId') roleId: string) {
        return await this.rolesService.getDirectParents(roleId);
    }
    @Get(':roleId/direct-children')
    async getDirectChildren(@Param('roleId') roleId: string) {
        return await this.rolesService.getDirectChildren(roleId);
    }
    @Delete(':roleId/children')
    async deleteAllChildren(@Param('roleId') roleId: string) {
        await this.rolesService.deleteAllChildren(roleId);
        return { message: 'All child roles have been unlinked' };
    }
}
