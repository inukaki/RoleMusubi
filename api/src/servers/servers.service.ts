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
    async findAll(): Promise<Server[]> {
        return this.serverRepository.find();
    }
    async findOne(serverId: string): Promise<Server | null> {
        return this.serverRepository.findOne({ where: { serverId } });
    }
    async delete(serverId: string): Promise<void> {
        await this.serverRepository.delete({ serverId });
    }
}
