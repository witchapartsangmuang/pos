import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, User } from 'entity/entity';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forFeature([User,Product]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
              secret: configService.get<string>('JWT_SECRET_KEY'),
              signOptions: {
                expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
              },
            }),
            inject: [ConfigService],
          }),
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule { }
