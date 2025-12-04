import { Module } from '@nestjs/common';
import { AportesService } from './aportes.service';
import { AportesController } from './aportes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aporte } from './entities/aporte.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aporte])],
  controllers: [AportesController],
  providers: [AportesService],
})
export class AportesModule {}
