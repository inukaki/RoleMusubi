import { Module } from '@nestjs/common';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from './servers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Server])],
  controllers: [ServersController],
  providers: [ServersService]
})
export class ServersModule {}
