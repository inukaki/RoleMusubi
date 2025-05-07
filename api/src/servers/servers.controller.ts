import { Body, Controller, Post } from '@nestjs/common';
import { ServersService } from './servers.service';

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
}
