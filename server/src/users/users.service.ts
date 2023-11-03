import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { parse } from 'csv-parse';
import { UserRepository } from './users.repository';
import { Users } from '@prisma/client';
import { IUserPagination } from './users.interface';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}

  async processCsvFile(filePath: string): Promise<void> {
    try {
      const stream = fs.createReadStream(filePath).pipe(
        parse({
          columns: true,
          skip_empty_lines: true,
          trim: true,
          bom: true,
        }),
      );
      for await (const record of stream) {
        const user: Users = {
          ...record,
          id: parseInt(record.id),
          postId: parseInt(record.postId),
        };
        await this.usersRepository.create(user);
      }
    } catch (e) {
    } finally {
      fs.unlinkSync(filePath);
    }
  }

  async find(
    search: string,
    skip: number,
    take: number,
  ): Promise<IUserPagination> {
    const [count, data] = await this.usersRepository.search(search, skip, take);
    return {
      count,
      data,
    };
  }
}
