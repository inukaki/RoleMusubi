import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from './servers.entity';

@Injectable()
export class ServersService {
    constructor(
        @InjectRepository(Server)
        private readonly serverRepository: Repository<Server>,
    ){}
    async create(name: string, serverId: string): Promise<Server> {
        const server = this.serverRepository.create({ name, serverId });
        return this.serverRepository.save(server);
    }
    async delete(serverId: string): Promise<void> {
        console.log('Deleting server with ID:あああ', serverId);
        await this.serverRepository.delete({ serverId });
    }
}
