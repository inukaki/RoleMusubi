import { Body, Controller, Delete, Param, Post, Get } from '@nestjs/common';
import { ServersService } from './servers.service';
import { Server } from './servers.entity';

@Controller('servers')
export class ServersController {
    constructor(
        private readonly serversService: ServersService,
    ) {}
    @Post()
    async createServer(@Body() body: { name: string, serverId: string }) {
        const server = await this.serversService.create(body.name, body.serverId);
        return server;
    }
    @Delete(':serverId')
    async deleteServer(@Param('serverId') serverId: string) {
        const server = await this.serversService.delete(serverId);
        return server;
    }
    @Get()
    findAll() {
        return this.serversService.findAll();
    }
    @Get(':serverId')
    findOne(@Param('serverId') serverId: string) {
        return this.serversService.findOne(serverId);
    }
}
