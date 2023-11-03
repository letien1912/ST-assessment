import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './users.repository';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [PrismaClient, UserRepository, UsersService],
})
export class UsersModule {}
