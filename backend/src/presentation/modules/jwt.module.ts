import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/domains/user-management/strategies/jwt.strategy';
import { OptionalAuthGuard } from 'src/domains/user-management/guards/optional-auth.guard';
import { DatabaseModule } from './database.module';
import { User } from 'src/infrastructure/models/user.entity';
import { OptionalJwtStrategy } from 'src/domains/user-management/strategies/optional-jwt.strategy';

import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV}` });

import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: '30m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, OptionalJwtStrategy, OptionalAuthGuard],
  exports: [PassportModule, JwtModule],
})
export class JwtAuthModule {}
