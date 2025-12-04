import { Module } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { GruposController } from './grupos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grupo } from './grupo-entities/grupo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grupo])],
  controllers: [GruposController],
  providers: [GruposService],
})
export class GruposModule {}
