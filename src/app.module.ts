import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessControlModule } from 'nest-access-control';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as Db from './config/constants';
import { roles } from './app.roles';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>(Db.DATABASE_HOST),
        port: config.get<number>(Db.DATABASE_PORT),
        username: config.get<string>(Db.DATABASE_USERNAME),
        password: config.get<string>(Db.DATABASE_PASSWORD),
        database: config.get<string>(Db.DATABASE_NAME),
        entities: [__dirname + './**/**/*entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        logger: 'file',
      })
    }),
    AccessControlModule.forRoles(roles),
    PostModule,
    UserModule,
    AuthModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}
