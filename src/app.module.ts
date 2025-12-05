import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './modulos/usuarios/usuarios.module';
import { GruposModule } from './modulos/grupos/grupos.module';
import * as dotenv from 'dotenv';
import { AuthModule } from './modulos/usuarios/auth.module';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      logging: false,
      dropSchema: true,
    }),
    AuthModule,
    UsuariosModule,
    GruposModule,
  ],
})
export class AppModule {}
