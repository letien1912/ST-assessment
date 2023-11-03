import {
  BadRequestException,
  Controller,
  Get, Logger,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { diskStorage } from 'multer';
import { join } from 'path';
import { DEFAULT_SKIP, DEFAULT_TAKE } from './users.utils';
import { IUserPagination } from './users.interface';

const UPLOAD_DIRECTORY = join(__dirname, '..', 'uploads');

@Controller('/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getUsers(
    @Query('search') search: string = '',
    @Query('skip') skip: string = DEFAULT_SKIP,
    @Query('take') take: string = DEFAULT_TAKE,
  ): Promise<IUserPagination> {
    if (skip && isNaN(Number(skip))) {
      throw new BadRequestException('skip must be a number');
    }

    if (take && isNaN(Number(take))) {
      throw new BadRequestException('take must be a number');
    }

    return this.userService.find(search, Number(skip), Number(take));
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOAD_DIRECTORY,
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file) {
    if (!file) {
      throw new BadRequestException('file is not provided');
    }
    if (file.mimetype !== 'text/csv') {
      throw new BadRequestException('Not CSV file');
    }
    await this.userService.processCsvFile(file.path);
    return { path: file.path };
  }
}
